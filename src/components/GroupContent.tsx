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

function getSections(group: WebsiteGroup): WebsiteSectionDefinition[] {
  const indexedWebsites = group.websites.map((site, index) => ({ site, index }));

  return GROUP_SECTIONS.map((section) => ({
    key: section.id,
    title: section.name,
    className: 'mb-4',
    websites: indexedWebsites.filter(({ site }) => site.type === section.id),
  })).filter((section) => section.websites.length > 0);
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
  const sections = getSections(group);
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

  const filteredSections = activeSectionId
    ? sections.filter((section) => section.key === activeSectionId)
    : sections;

  return (
    <div className={`group-content ${animationClass}`}>
      {filteredSections.map((section) => (
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
