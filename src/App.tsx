import { useState, useCallback, useMemo, useEffect } from 'react';
import { logger } from './utils/logger';

import { ClockDisplay } from './components/ClockDisplay';
import { GroupContent } from './components/GroupContent';
import { SearchBar } from './components/SearchBar';
import { TopNav } from './components/TopNav';
import { WallpaperPreview } from './components/WallpaperPreview';
import { WebsiteEditor } from './components/WebsiteEditor';
import { GroupEditor } from './components/GroupEditor';
import { SEARCH_ENGINES, GROUP_SECTIONS, STORAGE_KEYS } from './data/navigation';
import { useSearch } from './hooks/useSearch';
import { useWallpaperRotation } from './hooks/useWallpaperRotation';
import { useWebsiteGroups } from './hooks/useWebsiteGroups';
import type { Website } from './types/navigation';
import { loadWebsiteGroupsFromSupabase, syncAllToSupabase } from './utils/supabaseStore';
import { cacheManager } from './utils/cacheManager';

function App() {
  const {
    activeGroup,
    handleDragStart,
    handleDragOver,
    handleDrop,
    websiteGroups,
    setWebsiteGroups,
  } = useWebsiteGroups();
  const {
    searchContainerRef,
    searchInputRef,
    currentSearchEngine,
    searchQuery,
    engineDropdownVisible,
    setSearchQuery,
    performSearch,
    selectEngine,
    toggleDropdown,
  } = useSearch();
  const { setWallpaperIndex } = useWallpaperRotation();
  const [showWallpaperPreview, setShowWallpaperPreview] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  
  const [showWebsiteEditor, setShowWebsiteEditor] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [showGroupEditor, setShowGroupEditor] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  // 仅在本地缓存为空时从 Supabase 同步，避免覆盖用户已保存的修改
  useEffect(() => {
    const syncFromSupabase = async () => {
      try {
        const hasLocalData = localStorage.getItem(STORAGE_KEYS.websiteGroups);
        
        if (!hasLocalData) {
          const groups = await loadWebsiteGroupsFromSupabase();
          if (groups.length > 0) {
            setWebsiteGroups(groups);
          }
        }
      } catch (error) {
        logger.debug('Supabase sync failed, continuing with local cache');
      }
    };
    
    const syncTimer = setTimeout(syncFromSupabase, 3000);
    return () => clearTimeout(syncTimer);
  }, [setWebsiteGroups]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 1) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: Website[] = [];

    websiteGroups.forEach(group => {
      group.websites.forEach(site => {
        if (site.name.toLowerCase().includes(query) || site.url.toLowerCase().includes(query)) {
          suggestions.push(site);
        }
      });
    });

    return suggestions.slice(0, 10);
  }, [searchQuery, websiteGroups]);

  const handleSelectSuggestion = useCallback((website: Website) => {
    setSearchQuery('');
    window.open(website.url, '_blank', 'noopener,noreferrer');
  }, [setSearchQuery]);

  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setGlobalSearchQuery('');
  };

  const filteredWebsites = useCallback(() => {
    if (!globalSearchQuery.trim()) return [];
    
    const query = globalSearchQuery.toLowerCase();
    const results: { name: string; url: string; icon: string; type: string }[] = [];
    
    websiteGroups.forEach(group => {
      group.websites.forEach(site => {
        if (site.name.toLowerCase().includes(query) || 
            site.url.toLowerCase().includes(query)) {
          results.push({
            name: site.name,
            url: site.url,
            icon: site.icon,
            type: GROUP_SECTIONS.find(s => s.id === site.type)?.name || site.type || '未分类',
          });
        }
      });
    });
    
    return results.slice(0, 20);
  }, [globalSearchQuery, websiteGroups]);

  const handleGlobalSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowGlobalSearch(false);
      setGlobalSearchQuery('');
    }
  };

  const handleEditWebsite = (site: Website) => {
    setEditingWebsite(site);
    setShowWebsiteEditor(true);
  };

  const handleSaveWebsite = async () => {
    try {
      const groups = await loadWebsiteGroupsFromSupabase();
      setWebsiteGroups(groups);
    } catch (error) {
      logger.error('Failed to reload websites:', error);
    }
  };

  const handleSyncToSupabase = async () => {
    try {
      const success = await syncAllToSupabase(websiteGroups);
      if (success) {
        alert('同步成功！本地数据已上传至 Supabase');
      } else {
        alert('同步失败，请检查网络连接和 Supabase 配置');
      }
    } catch (error) {
      logger.error('Failed to sync to Supabase:', error);
      alert('同步失败，请检查网络连接');
    }
  };

  const handleClearIconCache = () => {
    if (confirm('确定要清除图标缓存吗？这将重新加载所有图标。')) {
      cacheManager.clearAllCache();
      alert('图标缓存已清除，刷新页面后将重新加载图标。');
    }
  };

  const handleAddWebsite = () => {
    setEditingWebsite(null);
    setShowWebsiteEditor(true);
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setShowGroupEditor(true);
  };

  const allResults = filteredWebsites();

  return (
    <div className="min-h-screen flex">
      <TopNav activeSectionId={activeSectionId} onSelectSection={handleSelectSection} />

      <div className="main-content-wrapper flex-1 ml-52 flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto" id="main-content">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <header className="text-center mb-8 relative">
              <button
                onClick={handleClearIconCache}
                className="absolute top-0 right-20 w-8 h-8 flex items-center justify-center text-white text-sm font-bold hover:bg-white/10 rounded-lg transition-colors"
                title="清除图标缓存"
              >
                ⟳
              </button>
              <button
                onClick={handleSyncToSupabase}
                className="absolute top-0 right-10 w-8 h-8 flex items-center justify-center text-white text-sm font-bold hover:bg-white/10 rounded-lg transition-colors"
                title="同步到 Supabase"
              >
                ↻
              </button>
              <button
                onClick={handleAddWebsite}
                className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-white text-xl font-bold hover:bg-white/10 rounded-lg transition-colors"
                title="添加网站"
              >
                +
              </button>
              <ClockDisplay />
              <SearchBar
                containerRef={searchContainerRef}
                inputRef={searchInputRef}
                dropdownVisible={engineDropdownVisible}
                currentSearchEngine={currentSearchEngine}
                engines={SEARCH_ENGINES}
                searchQuery={searchQuery}
                suggestions={searchSuggestions}
                onToggleDropdown={toggleDropdown}
                onSelectEngine={selectEngine}
                onSearchQueryChange={setSearchQuery}
                onSearch={performSearch}
                onSelectSuggestion={handleSelectSuggestion}
              />
            </header>

            <div className="main-content pb-20">
              {activeGroup ? (
                <GroupContent
                  group={activeGroup}
                  activeSectionId={activeSectionId}
                  animationClass="fade-in"
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onEdit={handleEditWebsite}
                  onAddGroup={handleAddGroup}
                />
              ) : null}
            </div>
          </div>
        </main>

      </div>

      {showGlobalSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm" onClick={() => setShowGlobalSearch(false)}>
          <div 
            className="w-full max-w-2xl mx-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyDown={handleGlobalSearchKeyDown}
                placeholder="搜索网站名称或网址..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
                autoFocus
              />
              <span className="text-xs text-gray-500">Esc 关闭</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {allResults.length > 0 ? (
                <div className="py-2">
                  {allResults.map((site, index) => (
                    <a
                      key={`${site.url}-${index}`}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors duration-150"
                    >
                      <img src={site.icon} alt={site.name} className="w-8 h-8 rounded-lg bg-gray-800" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">{site.name}</div>
                        <div className="text-xs text-gray-500 truncate">{site.url}</div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">{site.type}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  {globalSearchQuery ? '未找到匹配的网站' : '输入关键词搜索网站'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        <button
          onClick={() => {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
              mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-10 h-10 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          title="回到顶部"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        <button
          type="button"
          className="control-btn bg-white/30 border-2 border-white/50 text-white rounded-full p-3 w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/35"
          title="壁纸预览"
          onClick={() => setShowWallpaperPreview(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <script>
        {`document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.dispatchEvent(new CustomEvent('openGlobalSearch'));
          }
        });`}
      </script>

      <WallpaperPreview
        isOpen={showWallpaperPreview}
        onClose={() => setShowWallpaperPreview(false)}
        onSelect={(index) => {
          setWallpaperIndex(index);
          setShowWallpaperPreview(false);
        }}
      />

      <WebsiteEditor
        website={editingWebsite}
        isOpen={showWebsiteEditor}
        onClose={() => setShowWebsiteEditor(false)}
        onSave={handleSaveWebsite}
        groups={websiteGroups}
      />

      <GroupEditor
        group={editingGroup}
        isOpen={showGroupEditor}
        onClose={() => setShowGroupEditor(false)}
        onSave={handleSaveWebsite}
      />
    </div>
  );
}

export default App;
