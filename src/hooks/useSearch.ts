import { useCallback, useEffect, useRef, useState } from 'react';

import { SEARCH_ENGINES } from '../data/navigation';
import { looksLikeUrl, toUrl, parseEngineOverride } from '../utils/search';

const DEFAULT_SEARCH_ENGINE = 'baidu';

export function useSearch() {
  const [currentSearchEngine, setCurrentSearchEngine] = useState(DEFAULT_SEARCH_ENGINE);
  const [searchQuery, setSearchQuery] = useState('');
  const [engineDropdownVisible, setEngineDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }

    const parsed = parseEngineOverride(trimmedQuery);
    if (!parsed.query) return;

    if (looksLikeUrl(parsed.query)) {
      window.open(toUrl(parsed.query), '_blank', 'noopener,noreferrer');
      return;
    }

    const engineKey = parsed.engineKey ?? currentSearchEngine;
    const engine = SEARCH_ENGINES[engineKey] ?? SEARCH_ENGINES[DEFAULT_SEARCH_ENGINE];
    window.open(engine.url + encodeURIComponent(parsed.query), '_blank', 'noopener,noreferrer');
  }, [currentSearchEngine, searchQuery]);

  const selectEngine = useCallback((engineKey: string) => {
    setCurrentSearchEngine(engineKey);
    setEngineDropdownVisible(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setEngineDropdownVisible((visible) => !visible);
  }, []);

  const closeDropdown = useCallback(() => {
    setEngineDropdownVisible(false);
  }, []);

  const focusSearchInput = useCallback(() => {
    const input = searchInputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const container = searchContainerRef.current;
      if (container && !container.contains(event.target as Node)) {
        setEngineDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return {
    searchContainerRef,
    searchInputRef,
    currentSearchEngine,
    searchQuery,
    engineDropdownVisible,
    setSearchQuery,
    performSearch,
    selectEngine,
    toggleDropdown,
    closeDropdown,
    focusSearchInput,
  };
}
