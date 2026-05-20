import { useEffect } from 'react';
import { cacheManager } from '../utils/cacheManager';
import { DEFAULT_WEBSITE_GROUPS } from '../data/navigation';

export function useCacheInit(): void {
  useEffect(() => {
    const initCache = async (): Promise<void> => {
      try {
        await cacheManager.initializeAndCheck(DEFAULT_WEBSITE_GROUPS);
      } catch (error) {
        console.warn('Cache initialization failed:', error);
      }
    };

    initCache();
  }, []);
}
