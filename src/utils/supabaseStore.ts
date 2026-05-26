import { supabase, type WebsiteData, type GroupData } from '../lib/supabase';
import type { WebsiteGroup } from '../types/navigation';
import { DEFAULT_WEBSITE_GROUPS, GROUP_SECTIONS } from '../data/navigation';
import { logger } from './logger';

const FETCH_TIMEOUT = 8000;

export async function fetchWebsites(): Promise<WebsiteData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('position', { ascending: true })
      .abortSignal(controller.signal as any);
    
    clearTimeout(timeoutId);
    
    if (error) {
      logger.warn('Failed to fetch websites:', error);
      return [];
    }
    
    return data || [];
  } catch (err: any) {
    logger.warn('Failed to fetch websites:', err?.message || err);
    return [];
  }
}

export async function fetchGroups(): Promise<GroupData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('position', { ascending: true })
      .abortSignal(controller.signal as any);
    
    clearTimeout(timeoutId);
    
    if (error) {
      logger.warn('Failed to fetch groups:', error);
      return [];
    }
    
    return data || [];
  } catch (err: any) {
    logger.warn('Failed to fetch groups:', err?.message || err);
    return [];
  }
}

export async function upsertWebsite(website: Omit<WebsiteData, 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    const sections = GROUP_SECTIONS.map(s => s.id);
    let groupId = website.group_id as typeof GROUP_SECTIONS[number]['id'];
    
    if (!sections.includes(groupId)) {
      const section = GROUP_SECTIONS.find(s => s.id === website.type);
      groupId = section?.id || 'home';
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const { error } = await supabase
      .from('websites')
      .upsert({ ...website, group_id: groupId }, { onConflict: 'id' })
      .abortSignal(controller.signal as any);
    
    clearTimeout(timeoutId);
    
    if (error) {
      logger.warn('Failed to upsert website:', error);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function deleteWebsite(id: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', id)
      .abortSignal(controller.signal as any);
    
    clearTimeout(timeoutId);
    
    if (error) {
      logger.warn('Failed to delete website:', error);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function upsertGroup(group: Omit<GroupData, 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const { error } = await supabase
      .from('groups')
      .upsert(group, { onConflict: 'id' })
      .abortSignal(controller.signal as any);
    
    clearTimeout(timeoutId);
    
    if (error) {
      logger.warn('Failed to upsert group:', error);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function deleteGroup(id: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id)
      .abortSignal(controller.signal as any);
    
    clearTimeout(timeoutId);
    
    if (error) {
      logger.warn('Failed to delete group:', error);
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function updateWebsitePositions(websites: { id: string; position: number }[]): Promise<boolean> {
  try {
    for (const website of websites) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      
      const { error } = await supabase
        .from('websites')
        .update({ position: website.position })
        .eq('id', website.id)
        .abortSignal(controller.signal as any);
      
      clearTimeout(timeoutId);
      
      if (error) {
        logger.warn('Failed to update website position:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.warn('Failed to update website positions:', error);
    return false;
  }
}

export async function syncAllToSupabase(groups: WebsiteGroup[]): Promise<boolean> {
  try {
    for (const group of groups) {
      const groupData: GroupData = {
        id: group.id,
        name: group.name,
        position: 0,
      };
      
      const groupSuccess = await upsertGroup(groupData);
      if (!groupSuccess) {
        logger.warn('Failed to upsert group:', group.id);
        return false;
      }
      
      for (const website of group.websites) {
        const websiteData: Omit<WebsiteData, 'created_at' | 'updated_at'> = {
          id: website.id,
          name: website.name,
          url: website.url,
          icon: website.icon,
          position: website.position || 0,
          type: website.type || 'home',
          group_id: group.id,
        };
        
        const websiteSuccess = await upsertWebsite(websiteData);
        if (!websiteSuccess) {
          logger.warn('Failed to upsert website:', website.id);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    logger.warn('Failed to sync all data to Supabase:', error);
    return false;
  }
}

export async function syncDefaultData(): Promise<void> {
  try {
    const existingGroups = await fetchGroups();
    
    if (existingGroups.length === 0) {
      for (let i = 0; i < GROUP_SECTIONS.length; i++) {
        const section = GROUP_SECTIONS[i];
        const success = await upsertGroup({
          id: section.id,
          name: section.name,
          position: i,
        });
        if (!success) {
          logger.warn('Failed to sync group, skipping remaining sync');
          return;
        }
      }
    }
    
    const existingWebsites = await fetchWebsites();
    const existingIds = new Set(existingWebsites.map(w => w.id));
    
    for (const group of DEFAULT_WEBSITE_GROUPS) {
      for (const website of group.websites) {
        if (!existingIds.has(website.id)) {
          const section = GROUP_SECTIONS.find(s => s.id === website.type);
          const groupId = section?.id || 'home';
          const success = await upsertWebsite({
            id: website.id,
            name: website.name,
            url: website.url,
            icon: website.icon,
            position: website.position || 0,
            type: website.type || 'home',
            group_id: groupId,
          });
          if (!success) {
            logger.warn('Failed to sync website, stopping sync');
            return;
          }
        }
      }
    }
  } catch (error) {
    logger.warn('Sync failed:', error);
  }
}

export function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

export async function updateAllIconsToGoogleFavicon(): Promise<number> {
  try {
    const websites = await fetchWebsites();
    let updatedCount = 0;
    
    for (const website of websites) {
      const domain = extractDomainFromUrl(website.url);
      if (domain) {
        const googleIconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
        
        const { error } = await supabase
          .from('websites')
          .update({ icon: googleIconUrl })
          .eq('id', website.id)
          .abortSignal(controller.signal as any);
        
        clearTimeout(timeoutId);
        
        if (!error) {
          updatedCount++;
        }
      }
    }
    
    return updatedCount;
  } catch (error) {
    logger.warn('Failed to update icons:', error);
    return 0;
  }
}

export function convertToWebsiteGroups(websites: WebsiteData[]): WebsiteGroup[] {
  const allWebsites = websites.map(website => ({
    id: website.id,
    name: website.name,
    url: website.url,
    icon: website.icon,
    position: website.position,
    type: (website.type || website.group_id || 'home') as typeof GROUP_SECTIONS[number]['id'],
  }));
  
  return [{
    id: 'all',
    name: '全部',
    websites: allWebsites,
  }];
}

export async function loadWebsiteGroupsFromSupabase(): Promise<WebsiteGroup[]> {
  try {
    const [websites, groups] = await Promise.all([fetchWebsites(), fetchGroups()]);
    
    if (websites.length === 0 || groups.length === 0) {
      try {
        await syncDefaultData();
        const [updatedWebsites] = await Promise.all([fetchWebsites(), fetchGroups()]);
        if (updatedWebsites.length > 0) {
          return convertToWebsiteGroups(updatedWebsites);
        }
      } catch (syncError) {
        logger.error('Failed to sync default data, falling back to local:', syncError);
      }
      return DEFAULT_WEBSITE_GROUPS;
    }
    
    return convertToWebsiteGroups(websites);
  } catch (error) {
    logger.error('Failed to load from Supabase, falling back to local:', error);
    return DEFAULT_WEBSITE_GROUPS;
  }
}
