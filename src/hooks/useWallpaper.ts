import { useState, useEffect, useCallback } from 'react';
import { cacheManager } from '../utils/cacheManager';
import { DEFAULT_WALLPAPERS } from '../data/navigation';

interface UseWallpaperOptions {
  useCache?: boolean;
}

interface UseWallpaperReturn {
  src: string;
  isLoading: boolean;
  error: Error | null;
}

export function useWallpaper(
  url: string,
  options: UseWallpaperOptions = {}
): UseWallpaperReturn {
  const { useCache = true } = options;
  const [src, setSrc] = useState<string>(url);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadWallpaper = useCallback(async (wallpaperUrl: string) => {
    setIsLoading(true);
    setError(null);

    if (useCache) {
      const cached = cacheManager.getCachedWallpaper(wallpaperUrl);
      if (cached) {
        setSrc(cached);
        setIsLoading(false);
        return;
      }
    }

    try {
      const cachedUrl = useCache ? await cacheManager.cacheWallpaper(wallpaperUrl) : wallpaperUrl;
      setSrc(cachedUrl);
    } catch (err) {
      console.warn('Failed to load wallpaper:', wallpaperUrl, err);
      setError(err instanceof Error ? err : new Error('Failed to load wallpaper'));
      setSrc(wallpaperUrl);
    } finally {
      setIsLoading(false);
    }
  }, [useCache]);

  useEffect(() => {
    loadWallpaper(url);
  }, [url, loadWallpaper]);

  return {
    src,
    isLoading,
    error,
  };
}

export function useWallpaperBackground(index: number) {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    const applyWallpaper = async () => {
      const wallpaper = DEFAULT_WALLPAPERS[index];
      if (!wallpaper) return;

      const cached = cacheManager.getCachedWallpaper(wallpaper.url);
      if (cached) {
        setBackgroundImage(`url('${cached}')`);
      } else {
        setBackgroundImage(`url('${wallpaper.url}')`);
        cacheManager.cacheWallpaper(wallpaper.url);
      }
    };

    applyWallpaper();
  }, [index]);

  return backgroundImage;
}
