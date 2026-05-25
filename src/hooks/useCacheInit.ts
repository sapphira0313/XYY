import { useEffect } from 'react';
import { cacheManager } from '../utils/cacheManager';
import { DEFAULT_WEBSITE_GROUPS } from '../data/navigation';
import { logger } from '../utils/logger';

export function useCacheInit(): void {
  useEffect(() => {
    // 先快速初始化（只加载已有的缓存）
    const initFast = async (): Promise<void> => {
      try {
        await cacheManager.initialize();
      } catch (error) {
        logger.warn('Fast cache init failed:', error);
      }
      
      // 后台缓慢检查和修复缓存，不阻塞页面显示
      setTimeout(async () => {
        try {
          await cacheManager.checkAndRepairCache(DEFAULT_WEBSITE_GROUPS);
        } catch (error) {
          logger.warn('Cache repair failed:', error);
        }
      }, 3000); // 延迟 3 秒后开始缓存检查
    };

    initFast();
  }, []);
}
