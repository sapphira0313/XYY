const CACHE_KEY_PREFIX = 'wallpaper_cache_';
const CACHE_EXPIRE_KEY = 'wallpaper_cache_expire_';
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; 

export async function downloadWallpaper(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function cacheWallpaper(url: string): Promise<string | null> {
  const cacheKey = CACHE_KEY_PREFIX + url;
  const expireKey = CACHE_EXPIRE_KEY + url;

  const cached = localStorage.getItem(cacheKey);
  const expireTime = localStorage.getItem(expireKey);

  if (cached && expireTime) {
    const now = Date.now();
    if (now < parseInt(expireTime, 10)) {
      return cached;
    }
  }

  const dataUrl = await downloadWallpaper(url);
  if (dataUrl) {
    localStorage.setItem(cacheKey, dataUrl);
    localStorage.setItem(expireKey, String(Date.now() + CACHE_DURATION));
    return dataUrl;
  }

  return null;
}

export function getCachedWallpaper(url: string): string | null {
  const cacheKey = CACHE_KEY_PREFIX + url;
  const expireKey = CACHE_EXPIRE_KEY + url;

  const cached = localStorage.getItem(cacheKey);
  const expireTime = localStorage.getItem(expireKey);

  if (cached && expireTime) {
    const now = Date.now();
    if (now < parseInt(expireTime, 10)) {
      return cached;
    }
  }

  return null;
}

export async function preloadAllWallpapers(wallpapers: Array<{ url: string }>): Promise<void> {
  const uniqueUrls = [...new Set(wallpapers.map(w => w.url))];

  const promises = uniqueUrls.map(async (url) => {
    if (!getCachedWallpaper(url)) {
      await cacheWallpaper(url);
    }
  });

  await Promise.all(promises);
}

export async function refreshMissingWallpapers(wallpapers: Array<{ url: string }>): Promise<void> {
  const uniqueUrls = [...new Set(wallpapers.map(w => w.url))];
  const missingUrls = uniqueUrls.filter(url => !getCachedWallpaper(url));

  const promises = missingUrls.map(async (url) => {
    await cacheWallpaper(url);
  });

  await Promise.all(promises);
}

export function clearExpiredWallpapers(): void {
  const now = Date.now();

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_EXPIRE_KEY)) {
      const expireTime = localStorage.getItem(key);
      if (expireTime && now >= parseInt(expireTime, 10)) {
        const wallpaperKey = key.replace(CACHE_EXPIRE_KEY, CACHE_KEY_PREFIX);
        localStorage.removeItem(key);
        localStorage.removeItem(wallpaperKey);
      }
    }
  });
}

export function getCachedWallpapersCount(): number {
  return Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY_PREFIX) && !key.startsWith(CACHE_EXPIRE_KEY)).length;
}