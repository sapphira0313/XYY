const CACHE_KEY_PREFIX = 'icon_cache_';
const CACHE_EXPIRE_KEY = 'icon_cache_expire_';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; 

export async function downloadIcon(url: string): Promise<string | null> {
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

export async function cacheIcon(url: string): Promise<string | null> {
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

  const dataUrl = await downloadIcon(url);
  if (dataUrl) {
    localStorage.setItem(cacheKey, dataUrl);
    localStorage.setItem(expireKey, String(Date.now() + CACHE_DURATION));
    return dataUrl;
  }

  return null;
}

export function getCachedIcon(url: string): string | null {
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

export async function preloadAllIcons(websites: Array<{ icon: string }>): Promise<void> {
  const icons = websites.map(w => w.icon);
  const uniqueIcons = [...new Set(icons)];

  const promises = uniqueIcons.map(async (iconUrl) => {
    if (!getCachedIcon(iconUrl)) {
      await cacheIcon(iconUrl);
    }
  });

  await Promise.all(promises);
}

export async function refreshMissingIcons(websites: Array<{ icon: string }>): Promise<void> {
  const icons = websites.map(w => w.icon);
  const uniqueIcons = [...new Set(icons)];

  const missingIcons = uniqueIcons.filter(iconUrl => !getCachedIcon(iconUrl));

  const promises = missingIcons.map(async (iconUrl) => {
    await cacheIcon(iconUrl);
  });

  await Promise.all(promises);
}

export function clearExpiredIcons(): void {
  const now = Date.now();

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_EXPIRE_KEY)) {
      const expireTime = localStorage.getItem(key);
      if (expireTime && now >= parseInt(expireTime, 10)) {
        const iconKey = key.replace(CACHE_EXPIRE_KEY, CACHE_KEY_PREFIX);
        localStorage.removeItem(key);
        localStorage.removeItem(iconKey);
      }
    }
  });
}

export function getCachedIconsCount(): number {
  return Object.keys(localStorage).filter(key => key.startsWith(CACHE_KEY_PREFIX) && !key.startsWith(CACHE_EXPIRE_KEY)).length;
}