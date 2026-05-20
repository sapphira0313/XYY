import { type KeyboardEvent, type RefObject } from 'react';

import type { SearchEngine } from '../types/navigation';
import type { Website } from '../types/navigation';

interface SearchBarProps {
  containerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  dropdownVisible: boolean;
  currentSearchEngine: string;
  engines: Record<string, SearchEngine>;
  searchQuery: string;
  suggestions: Website[];
  onToggleDropdown: () => void;
  onSelectEngine: (engineKey: string) => void;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onSelectSuggestion: (website: Website) => void;
}

export function SearchBar({
  containerRef,
  inputRef,
  dropdownVisible,
  currentSearchEngine,
  engines,
  searchQuery,
  suggestions,
  onToggleDropdown,
  onSelectEngine,
  onSearchQueryChange,
  onSearch,
  onSelectSuggestion,
}: SearchBarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const currentEngine = engines[currentSearchEngine];

  // 判断是否显示搜索建议（下拉框）
  const showSuggestions = suggestions.length > 0 && searchQuery.length > 0 && !dropdownVisible;

  return (
    <div ref={containerRef} className="search-container max-w-xl mx-auto mb-6 relative flex items-center">
      <button
        type="button"
        className="search-engine-icon absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer z-10"
        onClick={onToggleDropdown}
        aria-label={`切换搜索引擎，当前为 ${currentEngine.name}`}
      >
        <img src={currentEngine.favicon} alt={currentEngine.name} className="engine-icon-img w-full h-full rounded-sm" />
      </button>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="搜索或输入网址..."
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" className="search-btn" onClick={onSearch} aria-label="执行搜索">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      
      {/* 搜索引擎下拉框 */}
      {dropdownVisible ? (
        <div className="engine-dropdown absolute top-full left-0 w-full bg-white/90 backdrop-blur-md rounded-lg p-3 shadow-lg z-50 table table-fixed">
          {Object.entries(engines).map(([key, engine]) => (
            <button
              key={key}
              type="button"
              className="engine-option table-cell p-3 rounded-md transition-colors duration-200 text-center align-middle w-1/4"
              onClick={() => onSelectEngine(key)}
            >
              <img src={engine.favicon} alt={engine.name} className="w-5 h-5 mx-auto mb-2 block rounded-sm" />
              <span className="text-sm block">{engine.name}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* 搜索建议下拉框 */}
      {showSuggestions && (
        <div className="suggestions-dropdown absolute top-full left-0 w-full bg-gray-900/70 backdrop-blur-xl rounded-lg shadow-2xl z-50 mt-1 max-h-64 overflow-y-auto border border-white/10">
          {suggestions.slice(0, 8).map((site, index) => (
            <a
              key={`${site.id}-${index}`}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="suggestion-item flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors duration-150"
              onClick={() => onSelectSuggestion(site)}
            >
              <img src={site.icon} alt={site.name} className="w-7 h-7 rounded-md bg-gray-700 flex-shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-white text-sm font-medium truncate">{site.name}</div>
                <div className="text-gray-400 text-xs truncate">{site.url}</div>
              </div>
              <span className="text-xs text-gray-400 bg-white/20 px-2 py-1 rounded flex-shrink-0">{site.type}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
