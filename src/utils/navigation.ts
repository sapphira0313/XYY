import type { WebsiteGroup, Website } from '../types/navigation';
import { logger } from './logger';

function cloneGroups(groups: WebsiteGroup[]): WebsiteGroup[] {
  return groups.map(group => ({
    ...group,
    websites: [...group.websites]
  }));
}

function updatePositions(websites: Website[]): Website[] {
  return websites.map((site, index) => ({ ...site, position: index }));
}

export function reorderWebsiteGroups(
  groups: WebsiteGroup[],
  sourceGroupId: string,
  sourceIndex: number,
  targetGroupId: string,
  targetIndex: number
): WebsiteGroup[] {
  if (sourceGroupId === targetGroupId && sourceIndex === targetIndex) {
    return groups;
  }

  const clonedGroups = cloneGroups(groups);
  const sourceGroup = clonedGroups.find(g => g.id === sourceGroupId);
  const targetGroup = clonedGroups.find(g => g.id === targetGroupId);

  if (!sourceGroup || !targetGroup) {
    logger.warn('reorderWebsiteGroups: Group not found', { sourceGroupId, targetGroupId });
    return groups;
  }

  const [movedWebsite] = sourceGroup.websites.splice(sourceIndex, 1);
  
  if (!movedWebsite) {
    logger.warn('reorderWebsiteGroups: Website not found at index', { sourceGroupId, sourceIndex });
    return groups;
  }

  targetGroup.websites.splice(targetIndex, 0, movedWebsite);
  
  if (sourceGroupId === targetGroupId) {
    targetGroup.websites = updatePositions(targetGroup.websites);
  } else {
    sourceGroup.websites = updatePositions(sourceGroup.websites);
    targetGroup.websites = updatePositions(targetGroup.websites);
  }

  return clonedGroups;
}
