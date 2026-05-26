import { useCallback, useEffect, useState } from 'react';
import type { DragEvent } from 'react';

import type { Website, WebsiteGroup } from '../types/navigation';
import { GROUP_SECTIONS } from '../data/navigation';
import { NavItem } from './NavItem';

interface GroupContentProps {
  group: WebsiteGroup;
  activeSectionId: string | null;
  animationClass: 'fade-in' | 'fade-out';
  onDragStart: (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => void;
  onDragOver: (event: DragEvent<HTMLAnchorElement>) => void;
  onDrop: (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => void;
  onEdit: (site: Website) => void;
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
  onAddGroup,
}: GroupContentProps) {
  const sections = getSections(group, activeSectionId);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
          <h3 className="text-lg font-medium text-white mb-3 text-shadow-md">{section.title}</h3>
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
