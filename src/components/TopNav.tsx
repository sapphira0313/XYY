import { useState } from 'react';

import { GROUP_SECTIONS } from '../data/navigation';

interface TopNavProps {
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}

const NAVIGATION_GROUPS = [
  {
    id: 'main',
    name: '主页',
    items: ['home', 'translate', 'document', 'plugin', 'tool', 'email'],
    icon: 'home',
  },
  {
    id: 'ai',
    name: 'AI',
    items: ['foreign-ai', 'domestic-ai', 'video-ai', 'image-ai', 'music-ai', 'note-ai', 'design-ai'],
    icon: 'brain',
  },
  {
    id: 'design',
    name: '设计',
    items: ['design-image', 'design-video'],
    icon: 'palette',
  },
  {
    id: 'social',
    name: '社媒',
    items: ['social'],
    icon: 'users',
  },
] as const;

const iconMap: Record<string, string> = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  brain: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  palette: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  translate: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  plugin: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  tool: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'foreign-ai': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'domestic-ai': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'video-ai': 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
  'image-ai': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'music-ai': 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  'note-ai': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  'design-ai': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  'design-image': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  'design-video': 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
  social: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
};

export function TopNav({ activeSectionId, onSelectSection }: TopNavProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['main', 'ai', 'design', 'social']));

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getSectionById = (id: string) => GROUP_SECTIONS.find((s) => s.id === id);

  return (
    <nav className={`side-nav fixed left-0 top-0 bottom-0 z-50 bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 ease-in-out ${
      collapsed ? 'w-16' : 'w-52'
    }`}>
      <div className="flex flex-col h-full py-3">
        {collapsed ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-1">
            {NAVIGATION_GROUPS.map((group) => (
              <div
                key={group.id}
                className="flex flex-col items-center gap-1 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
                onClick={() => onSelectSection(group.items[0])}
                title={group.name}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[group.icon] || iconMap['home']} />
                </svg>
                <span className="text-xs font-medium">{group.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 space-y-1">
            {NAVIGATION_GROUPS.map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              return (
                <div key={group.id} className="mb-1">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                    onClick={() => toggleGroup(group.id)}
                    title={group.name}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="uppercase tracking-wider">{group.name}</span>
                  </button>

                  {isExpanded && (
                    <div className="ml-2 space-y-0.5">
                      {group.items.map((itemId) => {
                        const section = getSectionById(itemId);
                        if (!section) return null;
                        const isActive = activeSectionId === itemId;
                        return (
                          <button
                            key={itemId}
                            type="button"
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-200 rounded-lg ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                            }`}
                            onClick={() => onSelectSection(itemId)}
                            title={section.name}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconMap[itemId] || iconMap['home']} />
                            </svg>
                            <span className="text-sm font-medium truncate">{section.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="px-3 mt-2 pt-3 border-t border-gray-700/50">
          <button
            type="button"
            className="w-full flex items-center justify-center py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? '展开导航' : '收起导航'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}