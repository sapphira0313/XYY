import { useCallback, useEffect, useState } from 'react';
import type { DragEvent } from 'react';

import type { Website, WebsiteGroup } from '../types/navigation';
import { GROUP_SECTIONS } from '../data/navigation';
import { NavItem } from './NavItem';

function getSectionDisplayName(sectionId: string, websiteGroup: WebsiteGroup): string {
  const section = GROUP_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return sectionId;
  
  const siteInSection = websiteGroup.websites.find((site) => site.type === sectionId);
  return siteInSection?.sectionName || section.name;
}

interface GroupContentProps {
  group: WebsiteGroup;
  activeSectionId: string | null;
  animationClass: 'fade-in' | 'fade-out';
  onDragStart: (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => void;
  onDragOver: (event: DragEvent<HTMLAnchorElement>) => void;
  onDrop: (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => void;
  onEdit: (site: Website) => void;
  onEditSection?: (sectionId: string, newName: string) => void;
  onAddGroup?: () => void;
}

interface WebsiteSectionDefinition {
  key: string;
  title?: string;
  websites: Array<{ site: Website; index: number }>;
  className?: string;
}

const NAVIGATION_GROUP_MAP: Record<string, string[]> = {
  main: ['home', 'translate', 'document', 'plugin', 'tool', 'email'],
  ai: ['foreign-ai', 'domestic-ai', 'video-ai', 'image-ai', 'music-ai', 'note-ai', 'design-ai'],
  design: ['design-image', 'design-video'],
  social: ['social'],
};

function getSectionGroup(sectionId: string): string | null {
  for (const [groupName, sections] of Object.entries(NAVIGATION_GROUP_MAP)) {
    if (sections.includes(sectionId)) {
      return groupName;
    }
  }
  return null;
}

function getSectionsForGroup(sectionId: string): string[] {
  for (const [, sections] of Object.entries(NAVIGATION_GROUP_MAP)) {
    if (sections.includes(sectionId)) {
      return sections;
    }
  }
  return [sectionId];
}

function getSections(group: WebsiteGroup, activeSectionId: string | null): WebsiteSectionDefinition[] {
  const indexedWebsites = group.websites.map((site, index) => ({ site, index }));

  const sections = GROUP_SECTIONS.map((section) => ({
    key: section.id,
    title: section.name,
    className: 'mb-4',
    websites: indexedWebsites.filter(({ site }) => site.type === section.id),
  })).filter((section) => section.websites.length > 0);

  if (!activeSectionId) {
    return sections;
  }

  const sectionGroup = getSectionGroup(activeSectionId);
  if (sectionGroup) {
    const groupSections = getSectionsForGroup(activeSectionId);
    return sections.filter((section) => groupSections.includes(section.key));
  }

  return sections.filter((section) => section.key === activeSectionId);
}

export function GroupContent({ 
  group, 
  activeSectionId, 
  animationClass, 
  onDragStart, 
  onDragOver, 
  onDrop,
  onEdit,
  onEditSection,
  onAddGroup,
}: GroupContentProps) {
  const sections = getSections(group, activeSectionId);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');

  const handleDoubleClickSection = (sectionId: string, currentName: string) => {
    if (onEditSection) {
      setEditingSectionId(sectionId);
      setEditingSectionName(currentName);
    }
  };

  const handleSectionNameSubmit = () => {
    if (editingSectionId && editingSectionName.trim() && onEditSection) {
      onEditSection(editingSectionId, editingSectionName.trim());
    }
    setEditingSectionId(null);
    setEditingSectionName('');
  };

  const handleSectionNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSectionNameSubmit();
    } else if (e.key === 'Escape') {
      setEditingSectionId(null);
      setEditingSectionName('');
    }
  };

  const handleDragStartWithState = useCallback(
    (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => {
      setIsDragging(true);
      setDragOverIndex(index);
      onDragStart(event, groupId, index);
    },
    [onDragStart],
  );

  const handleDragEndWithState = useCallback(() => {
    setIsDragging(false);
    setDragOverIndex(null);
  }, []);

  const handleDragEnterWithState = useCallback((index: number) => {
    setDragOverIndex(index);
  }, []);

  const handleDragLeaveWithState = useCallback((index: number) => {
    setDragOverIndex((current) => (current === index ? null : current));
  }, []);

  const handleDropWithState = useCallback(
    (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => {
      onDrop(event, groupId, index);
      setIsDragging(false);
      setDragOverIndex(null);
    },
    [onDrop],
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (activeSectionId) {
      scrollToSection(activeSectionId);
    }
  }, [activeSectionId]);

  return (
    <div className={`group-content ${animationClass}`}>
      {sections.map((section) => (
        <div key={section.key} id={`section-${section.key}`} className={section.className}>
          {editingSectionId === section.key ? (
            <input
              type="text"
              value={editingSectionName}
              onChange={(e) => setEditingSectionName(e.target.value)}
              onBlur={handleSectionNameSubmit}
              onKeyDown={handleSectionNameKeyDown}
              autoFocus
              className="text-lg font-medium text-white mb-3 text-shadow-md bg-transparent border-b-2 border-blue-400 outline-none px-1 w-full max-w-xs"
            />
          ) : (
            <h3
              onDoubleClick={() => handleDoubleClickSection(section.key, getSectionDisplayName(section.key, group))}
              className="text-lg font-medium text-white mb-3 text-shadow-md cursor-pointer hover:text-blue-300 transition-colors"
              title="双击编辑分类名称"
            >
              {getSectionDisplayName(section.key, group)}
            </h3>
          )}
          <div className={`nav-grid${isDragging ? ' is-dragging' : ''}`}>
            {section.websites.map(({ site, index }) => (
              <NavItem
                key={site.id}
                groupId={group.id}
                index={index}
                site={site}
                isDragOver={dragOverIndex === index}
                onDragStart={handleDragStartWithState}
                onDragEnd={handleDragEndWithState}
                onDragOver={onDragOver}
                onDragEnter={() => handleDragEnterWithState(index)}
                onDragLeave={() => handleDragLeaveWithState(index)}
                onDrop={handleDropWithState}
                onEdit={onEdit}
              />
            ))}
          </div>
          {section.key === 'social' && onAddGroup && (
            <div className="mt-4">
              <button
                onClick={onAddGroup}
                className="w-10 h-10 flex items-center justify-center text-white text-xl font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                title="添加分组"
              >
                +
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
