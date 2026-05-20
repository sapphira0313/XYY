import { useEffect, useState } from 'react';
import { cacheManager } from '../utils/cacheManager';

export function CacheStatus() {
  const [cacheStats, setCacheStats] = useState<ReturnType<typeof cacheManager.getCacheStats> | null>(null);

  useEffect(() => {
    const getStats = async () => {
      await cacheManager.initialize();
      setCacheStats(cacheManager.getCacheStats());
    };
    getStats();
  }, []);

  if (!cacheStats) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-lg p-4 min-w-64 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <div className="text-white text-sm font-medium mb-2">缓存状态</div>
      <div className="space-y-1 text-xs text-gray-400">
        <div>图标: {cacheStats.cachedIcons}/{cacheStats.icons} 个</div>
        <div>壁纸: {cacheStats.cachedWallpapers}/{cacheStats.wallpapers} 个</div>
        <div>
          总大小:{' '}
          {cacheStats.totalSize > 1024 * 1024
            ? `${(cacheStats.totalSize / (1024 * 1024)).toFixed(2)} MB`
            : cacheStats.totalSize > 1024
            ? `${(cacheStats.totalSize / 1024).toFixed(2)} KB`
            : `${cacheStats.totalSize} B`}
        </div>
      </div>
    </div>
  );
}
