import type { WebsiteGroup, Wallpaper } from '../types/navigation';
import { DEFAULT_WALLPAPERS } from '../data/navigation';
import { logger } from './logger';

const CACHE_VERSION = '1.2.0';
const CACHE_PREFIX = 'zhiniao_cache_';
const CACHE_METADATA_KEY = `${CACHE_PREFIX}metadata`;
const ICON_CACHE_KEY = `${CACHE_PREFIX}icons`;
const WALLPAPER_CACHE_KEY = `${CACHE_PREFIX}wallpapers`;
const LAST_CHECK_KEY = `${CACHE_PREFIX}last_check`;
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24小时
const FETCH_TIMEOUT = 8000; // 8秒超时

const GOOGLE_FAVICON_REGEX = /^https?:\/\/www\.google\.com\/s2\/favicons/;

interface CacheMetadata {
  version: string;
  lastUpdated: string;
  iconCount: number;
  wallpaperCount: number;
  lastChecked: string;
}

interface IconCacheEntry {
  originalUrl: string;
  cachedBase64: string | null;
  timestamp: number;
  size: number;
  status: 'pending' | 'cached' | 'error';
  retryCount: number;
}

interface WallpaperCacheEntry {
  originalUrl: string;
  cachedBase64: string | null;
  timestamp: number;
  size: number;
  status: 'pending' | 'cached' | 'error';
  retryCount: number;
}

class CacheManager {
  private iconCache: Map<string, IconCacheEntry> = new Map();
  private wallpaperCache: Map<string, WallpaperCacheEntry> = new Map();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private integrityCheckPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._doInitialize();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  private async _doInitialize(): Promise<void> {
    await this.loadMetadata();
    await this.migrateOldData();
    await this.loadCacheIndex();
  }

  private async migrateOldData(): Promise<void> {
    try {
      const savedGroups = localStorage.getItem('websiteGroups');
      if (savedGroups) {
        try {
          const parsedGroups = JSON.parse(savedGroups);
          let needsSave = false;
          
          parsedGroups.forEach((group: any) => {
            if (group.websites) {
              group.websites.forEach((site: any) => {
                if (site.icon && GOOGLE_FAVICON_REGEX.test(site.icon)) {
                  const match = site.icon.match(/domain=([^&]+)/);
                  if (match) {
                    site.icon = `https://${match[1]}/favicon.ico`;
                    needsSave = true;
                  }
                }
              });
            }
          });
          
          if (needsSave) {
            localStorage.setItem('websiteGroups', JSON.stringify(parsedGroups));
            logger.info('Migrated old website groups data');
          }
        } catch {
          localStorage.removeItem('websiteGroups');
          logger.info('Removed corrupted website groups data');
        }
      }
    } catch (error) {
      logger.warn('Failed to migrate old data:', error);
    }
  }

  private getStorageKey(key: string): string {
    return key;
  }

  private async loadMetadata(): Promise<void> {
    try {
      const metadataStr = localStorage.getItem(this.getStorageKey(CACHE_METADATA_KEY));
      if (!metadataStr) return;

      const metadata: CacheMetadata = JSON.parse(metadataStr);
      if (metadata.version !== CACHE_VERSION) {
        logger.info('Cache version mismatch, clearing old cache');
        await this.clearAllCache();
      }
    } catch (error) {
      logger.warn('Failed to load cache metadata:', error);
    }
  }

  private async loadCacheIndex(): Promise<void> {
    try {
      const iconIndexStr = localStorage.getItem(this.getStorageKey(ICON_CACHE_KEY));
      const wallpaperIndexStr = localStorage.getItem(this.getStorageKey(WALLPAPER_CACHE_KEY));
      let needsSave = false;

      if (iconIndexStr) {
        const iconData = JSON.parse(iconIndexStr);
        Object.entries(iconData).forEach(([url, entry]) => {
          if (!GOOGLE_FAVICON_REGEX.test(url)) {
            this.iconCache.set(url, entry as IconCacheEntry);
          } else {
            needsSave = true;
          }
        });
      }

      if (wallpaperIndexStr) {
        const wallpaperData = JSON.parse(wallpaperIndexStr);
        Object.entries(wallpaperData).forEach(([url, entry]) => {
          if (!GOOGLE_FAVICON_REGEX.test(url)) {
            this.wallpaperCache.set(url, entry as WallpaperCacheEntry);
          } else {
            needsSave = true;
          }
        });
      }

      if (needsSave) {
        await this.saveCacheIndex();
      }
    } catch (error) {
      logger.warn('Failed to load cache index:', error);
    }
  }

  private async saveMetadata(): Promise<void> {
    const metadata: CacheMetadata = {
      version: CACHE_VERSION,
      lastUpdated: new Date().toISOString(),
      iconCount: this.iconCache.size,
      wallpaperCount: this.wallpaperCache.size,
      lastChecked: new Date().toISOString(),
    };
    localStorage.setItem(this.getStorageKey(CACHE_METADATA_KEY), JSON.stringify(metadata));
  }

  private async saveCacheIndex(): Promise<void> {
    const iconData: Record<string, IconCacheEntry> = {};
    const wallpaperData: Record<string, WallpaperCacheEntry> = {};

    this.iconCache.forEach((entry, url) => {
      iconData[url] = entry;
    });

    this.wallpaperCache.forEach((entry, url) => {
      wallpaperData[url] = entry;
    });

    try {
      localStorage.setItem(this.getStorageKey(ICON_CACHE_KEY), JSON.stringify(iconData));
      localStorage.setItem(this.getStorageKey(WALLPAPER_CACHE_KEY), JSON.stringify(wallpaperData));
    } catch (error) {
      logger.warn('Failed to save cache index:', error);
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async cacheIcon(originalUrl: string, forceRetry = false): Promise<string> {
    const cached = this.iconCache.get(originalUrl);
    
    if (!forceRetry && cached && cached.status === 'cached' && cached.cachedBase64) {
      return cached.cachedBase64;
    }

    if (!forceRetry && cached && cached.status === 'error' && cached.retryCount >= 3) {
      return originalUrl;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      
      let base64: string;
      
      if (this.isSvgUrl(originalUrl)) {
        const response = await fetch(originalUrl, { 
          mode: 'cors',
          cache: 'force-cache',
          credentials: 'omit',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        base64 = `data:image/svg+xml;base64,${btoa(text)}`;
      } else {
        const response = await fetch(originalUrl, { 
          mode: 'cors',
          cache: 'force-cache',
          credentials: 'omit',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        base64 = await this.blobToBase64(blob);
      }
      
      const entry: IconCacheEntry = {
        originalUrl,
        cachedBase64: base64,
        timestamp: Date.now(),
        size: base64.length,
        status: 'cached',
        retryCount: 0,
      };

      this.iconCache.set(originalUrl, entry);
      await this.saveCacheIndex();
      
      return base64;
    } catch (error) {
      const existingEntry = this.iconCache.get(originalUrl);
      const retryCount = (existingEntry?.retryCount || 0) + 1;
      
      const entry: IconCacheEntry = {
        originalUrl,
        cachedBase64: existingEntry?.cachedBase64 || null,
        timestamp: Date.now(),
        size: existingEntry?.size || 0,
        status: 'error',
        retryCount,
      };
      
      this.iconCache.set(originalUrl, entry);
      return originalUrl;
    }
  }

  private isSvgUrl(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.svg') || lowerUrl.includes('.svg?');
  }

  async cacheWallpaper(originalUrl: string, forceRetry = false): Promise<string> {
    const cached = this.wallpaperCache.get(originalUrl);
    
    if (!forceRetry && cached && cached.status === 'cached' && cached.cachedBase64) {
      return cached.cachedBase64;
    }

    if (!forceRetry && cached && cached.status === 'error' && cached.retryCount >= 3) {
      return originalUrl;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      
      const response = await fetch(originalUrl, {
        mode: 'cors',
        cache: 'force-cache',
        credentials: 'omit',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const base64 = await this.blobToBase64(blob);
      
      const entry: WallpaperCacheEntry = {
        originalUrl,
        cachedBase64: base64,
        timestamp: Date.now(),
        size: blob.size,
        status: 'cached',
        retryCount: 0,
      };

      this.wallpaperCache.set(originalUrl, entry);
      await this.saveCacheIndex();
      
      return base64;
    } catch (error) {
      const existingEntry = this.wallpaperCache.get(originalUrl);
      const retryCount = (existingEntry?.retryCount || 0) + 1;
      
      if (retryCount <= 1) {
        logger.debug('Failed to cache wallpaper (attempt', retryCount, '):', originalUrl);
      }
      
      const entry: WallpaperCacheEntry = {
        originalUrl,
        cachedBase64: existingEntry?.cachedBase64 || null,
        timestamp: Date.now(),
        size: existingEntry?.size || 0,
        status: 'error',
        retryCount,
      };
      
      this.wallpaperCache.set(originalUrl, entry);
      return originalUrl;
    }
  }

  async preloadAllIcons(websiteGroups: WebsiteGroup[]): Promise<void> {
    const allIconUrls = new Set<string>();
    
    websiteGroups.forEach(group => {
      group.websites.forEach(site => {
        if (site.icon) {
          allIconUrls.add(site.icon);
        }
      });
    });

    const batchSize = 5;
    const urls = Array.from(allIconUrls);
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const promises = batch.map(url => this.cacheIcon(url));
      await Promise.allSettled(promises);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    await this.saveMetadata();
  }

  async preloadAllWallpapers(wallpapers: Wallpaper[] = DEFAULT_WALLPAPERS): Promise<void> {
    const promises = wallpapers.map(wp => this.cacheWallpaper(wp.url));
    await Promise.allSettled(promises);
    await this.saveMetadata();
  }

  getCachedIcon(originalUrl: string): string | null {
    const cached = this.iconCache.get(originalUrl);
    if (cached && cached.status === 'cached' && cached.cachedBase64) {
      return cached.cachedBase64;
    }
    return null;
  }

  setCachedIcon(originalUrl: string, cachedBase64: string): void {
    const entry: IconCacheEntry = {
      originalUrl,
      cachedBase64,
      timestamp: Date.now(),
      size: cachedBase64.length,
      status: 'cached',
      retryCount: 0,
    };
    this.iconCache.set(originalUrl, entry);
  }

  getCachedWallpaper(originalUrl: string): string | null {
    const cached = this.wallpaperCache.get(originalUrl);
    if (cached && cached.status === 'cached' && cached.cachedBase64) {
      return cached.cachedBase64;
    }
    return null;
  }

  getCacheStats(): { icons: number; wallpapers: number; totalSize: number; cachedIcons: number; cachedWallpapers: number } {
    let totalSize = 0;
    let cachedIcons = 0;
    let cachedWallpapers = 0;
    
    this.iconCache.forEach(entry => {
      totalSize += entry.size;
      if (entry.status === 'cached') cachedIcons++;
    });
    
    this.wallpaperCache.forEach(entry => {
      totalSize += entry.size;
      if (entry.status === 'cached') cachedWallpapers++;
    });

    return {
      icons: this.iconCache.size,
      wallpapers: this.wallpaperCache.size,
      totalSize,
      cachedIcons,
      cachedWallpapers,
    };
  }

  private shouldCheckIntegrity(): boolean {
    try {
      const lastCheckStr = localStorage.getItem(this.getStorageKey(LAST_CHECK_KEY));
      if (!lastCheckStr) return true;
      
      const lastCheck = parseInt(lastCheckStr, 10);
      return Date.now() - lastCheck > CHECK_INTERVAL;
    } catch {
      return true;
    }
  }

  private updateLastCheckTime(): void {
    localStorage.setItem(this.getStorageKey(LAST_CHECK_KEY), Date.now().toString());
  }

  async checkAndRepairCache(websiteGroups: WebsiteGroup[]): Promise<void> {
    if (this.integrityCheckPromise) return this.integrityCheckPromise;
    
    if (!this.shouldCheckIntegrity()) {
      return;
    }

    this.integrityCheckPromise = this._doCheckAndRepair(websiteGroups);
    await this.integrityCheckPromise;
    this.integrityCheckPromise = null;
  }

  private async _doCheckAndRepair(websiteGroups: WebsiteGroup[]): Promise<void> {
    const { missing, needsRetry } = this.checkCacheIntegrity(websiteGroups);
    
    if (missing.length === 0 && needsRetry.length === 0) {
      this.updateLastCheckTime();
      await this.saveMetadata();
      return;
    }

    await this.repairCache([...missing, ...needsRetry]);
    this.updateLastCheckTime();
  }

  checkCacheIntegrity(websiteGroups: WebsiteGroup[]): { missing: string[]; needsRetry: string[]; errors: string[] } {
    const missing: string[] = [];
    const needsRetry: string[] = [];
    const errors: string[] = [];

    const allIconUrls = new Set<string>();
    websiteGroups.forEach(group => {
      group.websites.forEach(site => {
        if (site.icon) {
          allIconUrls.add(site.icon);
        }
      });
    });

    allIconUrls.forEach(url => {
      const cached = this.iconCache.get(url);
      if (!cached || cached.status !== 'cached') {
        if (cached && cached.status === 'error' && cached.retryCount < 3) {
          needsRetry.push(url);
        } else if (!cached || cached.status !== 'cached') {
          missing.push(url);
        }
      }
    });

    DEFAULT_WALLPAPERS.forEach(wp => {
      const cached = this.wallpaperCache.get(wp.url);
      if (!cached || cached.status !== 'cached') {
        if (cached && cached.status === 'error' && cached.retryCount < 3) {
          needsRetry.push(wp.url);
        } else if (!cached || cached.status !== 'cached') {
          missing.push(wp.url);
        }
      }
    });

    return { missing, needsRetry, errors };
  }

  async repairCache(urls: string[]): Promise<void> {
    const batchSize = 3;
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const promises: Promise<unknown>[] = [];

      batch.forEach(url => {
        if (DEFAULT_WALLPAPERS.some(wp => wp.url === url)) {
          promises.push(this.cacheWallpaper(url, true));
        } else {
          promises.push(this.cacheIcon(url, true));
        }
      });

      await Promise.allSettled(promises);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    await this.saveMetadata();
  }

  async clearAllCache(): Promise<void> {
    this.iconCache.clear();
    this.wallpaperCache.clear();

    localStorage.removeItem(this.getStorageKey(CACHE_METADATA_KEY));
    localStorage.removeItem(this.getStorageKey(ICON_CACHE_KEY));
    localStorage.removeItem(this.getStorageKey(WALLPAPER_CACHE_KEY));
    localStorage.removeItem(this.getStorageKey(LAST_CHECK_KEY));
  }

  async initializeAndCheck(websiteGroups: WebsiteGroup[]): Promise<void> {
    await this.initialize();
    await this.checkAndRepairCache(websiteGroups);
  }
}

export const cacheManager = new CacheManager();
