import { useState, useEffect, useCallback } from 'react';
import { cacheManager } from '../utils/cacheManager';

const FALLBACK_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>';

interface UseIconOptions {
  fallbackUrl?: string;
  useCache?: boolean;
}

interface UseIconReturn {
  src: string;
  isLoading: boolean;
  error: Error | null;
  fallbackSrc: string;
}

function getInitialIconUrl(url: string, useCache: boolean): string {
  if (!useCache) return url;
  
  try {
    cacheManager.initialize();
    const cached = cacheManager.getCachedIcon(url);
    return cached || url;
  } catch {
    return url;
  }
}

export function useIcon(
  url: string,
  options: UseIconOptions = {}
): UseIconReturn {
  const { fallbackUrl = FALLBACK_ICON, useCache = true } = options;
  const [src, setSrc] = useState<string>(() => getInitialIconUrl(url, useCache));
  const [isLoading, setIsLoading] = useState(useCache);
  const [error, setError] = useState<Error | null>(null);

  const loadIcon = useCallback(async (iconUrl: string) => {
    if (!iconUrl) {
      setError(new Error('No URL provided'));
      setSrc(fallbackUrl);
      setIsLoading(false);
      return;
    }

    if (!useCache) {
      setSrc(iconUrl);
      setIsLoading(false);
      return;
    }

    try {
      await cacheManager.initialize();
      
      const cached = cacheManager.getCachedIcon(iconUrl);
      if (cached) {
        setSrc(cached);
        setIsLoading(false);
        return;
      }

      const cachedUrl = await cacheManager.cacheIcon(iconUrl);
      setSrc(cachedUrl);
    } catch (err) {
      console.debug('Failed to load icon:', iconUrl, err);
      setError(err instanceof Error ? err : new Error('Failed to load icon'));
      if (src === url) {
        setSrc(fallbackUrl);
      }
    } finally {
      setIsLoading(false);
    }
  }, [useCache, fallbackUrl, src]);

  useEffect(() => {
    loadIcon(url);
  }, [url, loadIcon]);

  return {
    src,
    isLoading,
    error,
    fallbackSrc: fallbackUrl,
  };
}
