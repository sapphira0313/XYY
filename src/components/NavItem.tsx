import type { DragEvent } from 'react';

import type { Website } from '../types/navigation';
import { useIcon } from '../hooks/useIcon';

interface NavItemProps {
  groupId: string;
  index: number;
  site: Website;
  isDragOver?: boolean;
  onDragStart: (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => void;
  onDragEnd?: () => void;
  onDragOver: (event: DragEvent<HTMLAnchorElement>) => void;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  onDrop: (event: DragEvent<HTMLAnchorElement>, groupId: string, index: number) => void;
  onEdit: (site: Website) => void;
}

export function NavItem({
  groupId,
  index,
  site,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onEdit,
}: NavItemProps) {
  const { src: cachedIcon, fallbackSrc } = useIcon(site.icon);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(site);
  };

  return (
    <a
      href={site.url}
      className={`nav-item${isDragOver ? ' drag-over' : ''}`}
      target="_blank"
      rel="noopener noreferrer"
      data-group-id={groupId}
      data-index={index}
      draggable
      aria-label={`${site.name}, 导航到 ${site.url}`}
      aria-posinset={index + 1}
      onDragStart={(event) => onDragStart(event, groupId, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(event) => onDrop(event, groupId, index)}
      onContextMenu={handleContextMenu}
    >
      <div className="nav-icon-wrapper">
        <img
          src={cachedIcon}
          alt={site.name}
          className="nav-icon"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = fallbackSrc;
          }}
        />
      </div>
      <div className="nav-name">{site.name}</div>
    </a>
  );
}
