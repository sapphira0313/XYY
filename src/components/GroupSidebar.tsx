import type { WebsiteGroup } from '../types/navigation';

interface GroupSidebarProps {
  groups: WebsiteGroup[];
  activeGroupId: string;
  onSelectGroup: (groupId: string) => void;
}

export function GroupSidebar({ groups, activeGroupId, onSelectGroup }: GroupSidebarProps) {
  return (
    <div className="group-sidebar fixed left-0 top-0 h-full w-10 bg-black/30 backdrop-blur-md z-50 overflow-y-auto">
      <div className="flex flex-col items-center py-2 gap-2 mt-20">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`group-icon-item flex flex-col items-center justify-center p-1 rounded transition-all duration-300 ${
              activeGroupId === group.id ? 'bg-white/30 scale-110' : 'hover:bg-white/20'
            }`}
            onClick={() => onSelectGroup(group.id)}
            title={group.name}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[8px] text-white mt-0.5 text-center truncate w-full">{group.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
