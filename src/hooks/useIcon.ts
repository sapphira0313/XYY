import { useState, useEffect, useCallback } from 'react';
import { cacheManager } from '../utils/cacheManager';

const FALLBACK_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></svg>';

function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

function normalizeIconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    return url;
  }
}

function getBackupIconUrls(domain: string): string[] {
  return [
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    `https://${domain}/apple-touch-icon.png`,
    `https://${domain}/apple-touch-icon-precomposed.png`,
    `https://${domain}/favicon-16x16.png`,
    `https://${domain}/favicon-32x32.png`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://favicon.bytedance.net/api/favicon?url=${domain}`,
    `https://favicon.im/favicon?url=${domain}`,
    `https://api.statvoo.com/favicon/?url=${domain}`,
    `https://www.getfavicon.app/?url=https://${domain}`,
  ];
}

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
  const normalizedUrl = normalizeIconUrl(url);
  const [src, setSrc] = useState<string>(() => getInitialIconUrl(normalizedUrl, useCache));
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

    const domain = extractDomain(iconUrl);
    const backupUrls = domain ? getBackupIconUrls(domain) : [];

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
      for (const backupUrl of backupUrls) {
        try {
          const cachedUrl = await cacheManager.cacheIcon(backupUrl);
          setSrc(cachedUrl);
          setError(null);
          setIsLoading(false);
          return;
        } catch {
        }
      }

      setError(err instanceof Error ? err : new Error('Failed to load icon'));
      if (src === iconUrl) {
        setSrc(fallbackUrl);
      }
    } finally {
      setIsLoading(false);
    }
  }, [useCache, fallbackUrl, src]);

  useEffect(() => {
    loadIcon(normalizedUrl);
  }, [normalizedUrl, loadIcon]);

  return {
    src,
    isLoading,
    error,
    fallbackSrc: fallbackUrl,
  };
}
