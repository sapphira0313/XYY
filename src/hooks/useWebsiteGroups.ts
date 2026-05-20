import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react';

import { STORAGE_KEYS, loadStoredWebsiteGroups } from '../data/navigation';
import type { WebsiteGroup } from '../types/navigation';
import { reorderWebsiteGroups } from '../utils/navigation';

export function useWebsiteGroups() {
  const [websiteGroups, setWebsiteGroups] = useState<WebsiteGroup[]>(() => loadStoredWebsiteGroups());
  const [activeGroupId, setActiveGroupId] = useState(() => loadStoredWebsiteGroups()[0]?.id ?? '');

  const activeGroup = useMemo(
    () => websiteGroups.find((group) => group.id === activeGroupId) ?? websiteGroups[0],
    [activeGroupId, websiteGroups],
  );

  const handleDragStart = useCallback((event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ groupId, index }));
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLAnchorElement>, targetGroupId: string, targetIndex: number) => {
    event.preventDefault();
    const dragData = event.dataTransfer.getData('text/plain');

    if (!dragData) {
      return;
    }

    try {
      const { groupId: sourceGroupId, index: sourceIndex } = JSON.parse(dragData) as {
        groupId: string;
        index: number;
      };

      setWebsiteGroups((previousGroups) =>
        reorderWebsiteGroups(previousGroups, sourceGroupId, sourceIndex, targetGroupId, targetIndex),
      );
    } catch (error) {
      console.error('Failed to process drag data:', error);
    }
  }, []);

  useEffect(() => {
    if (websiteGroups.length === 0) {
      return;
    }

    if (!websiteGroups.some((group) => group.id === activeGroupId)) {
      setActiveGroupId(websiteGroups[0].id);
    }
  }, [activeGroupId, websiteGroups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.websiteGroups, JSON.stringify(websiteGroups));
  }, [websiteGroups]);

  return {
    websiteGroups,
    activeGroup,
    activeGroupId,
    setActiveGroupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
