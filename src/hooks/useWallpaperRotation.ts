import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_WALLPAPERS, STORAGE_KEYS } from '../data/navigation';
import { cacheManager } from '../utils/cacheManager';

const MANUAL_OVERRIDE_KEY = 'wallpaper_manual_override';

function getWallpaperIndexByDate(): number {
  if (DEFAULT_WALLPAPERS.length === 0) {
    return 0;
  }
  
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return dayOfYear % DEFAULT_WALLPAPERS.length;
}

function getInitialWallpaperIndex(): number {
  const manualOverride = localStorage.getItem(MANUAL_OVERRIDE_KEY);
  if (manualOverride) {
    const parsed = parseInt(manualOverride, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < DEFAULT_WALLPAPERS.length) {
      return parsed;
    }
  }
  return getWallpaperIndexByDate();
}

function applyWallpaper(index: number): void {
  if (DEFAULT_WALLPAPERS.length === 0) {
    return;
  }

  const normalizedIndex = ((index % DEFAULT_WALLPAPERS.length) + DEFAULT_WALLPAPERS.length) % DEFAULT_WALLPAPERS.length;
  const wallpaper = DEFAULT_WALLPAPERS[normalizedIndex];

  try {
    // 不等待初始化，直接尝试获取缓存
    const cachedUrl = cacheManager.getCachedWallpaper(wallpaper.url);
    document.body.style.backgroundImage = `url('${cachedUrl || wallpaper.url}')`;
  } catch {
    document.body.style.backgroundImage = `url('${wallpaper.url}')`;
  }
  
  localStorage.setItem(STORAGE_KEYS.backgroundIndex, normalizedIndex.toString());
}

export function useWallpaperRotation() {
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(() => getInitialWallpaperIndex());

  const previewNextWallpaper = useCallback(() => {
    setCurrentWallpaperIndex((previousIndex) => {
      const nextIndex = (previousIndex + 1) % DEFAULT_WALLPAPERS.length;
      applyWallpaper(nextIndex);
      localStorage.setItem(MANUAL_OVERRIDE_KEY, nextIndex.toString());
      return nextIndex;
    });
  }, []);

  const setWallpaperIndex = useCallback((index: number) => {
    const normalizedIndex = ((index % DEFAULT_WALLPAPERS.length) + DEFAULT_WALLPAPERS.length) % DEFAULT_WALLPAPERS.length;
    setCurrentWallpaperIndex(normalizedIndex);
    applyWallpaper(normalizedIndex);
    localStorage.setItem(MANUAL_OVERRIDE_KEY, normalizedIndex.toString());
  }, []);

  useEffect(() => {
    applyWallpaper(currentWallpaperIndex);
  }, [currentWallpaperIndex]);

  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const msUntilMidnight = endOfDay.getTime() - now.getTime();

    const timerId = setTimeout(() => {
      localStorage.removeItem(MANUAL_OVERRIDE_KEY);
      const newIndex = getWallpaperIndexByDate();
      if (newIndex !== currentWallpaperIndex) {
        setCurrentWallpaperIndex(newIndex);
      }
    }, msUntilMidnight);

    return () => clearTimeout(timerId);
  }, [currentWallpaperIndex]);

  // 注释掉预加载，避免影响页面加载
  // useEffect(() => {
  //   const preloadNextWallpaper = async () => {
  //     const nextIndex = (currentWallpaperIndex + 1) % DEFAULT_WALLPAPERS.length;
  //     const nextWallpaper = DEFAULT_WALLPAPERS[nextIndex];
  //     try {
  //       await cacheManager.initialize();
  //       await cacheManager.cacheWallpaper(nextWallpaper.url);
  //     } catch {
  //       // Silent fail for preloading
  //     }
  //   };
  //
  //   preloadNextWallpaper();
  // }, [currentWallpaperIndex]);

  return {
    currentWallpaperIndex,
    previewNextWallpaper,
    setWallpaperIndex,
  };
}
