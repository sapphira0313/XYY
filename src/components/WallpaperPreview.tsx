import { useState, useEffect } from 'react';
import { DEFAULT_WALLPAPERS } from '../data/navigation';
import { cacheManager } from '../utils/cacheManager';

interface WallpaperPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}

export function WallpaperPreview({ isOpen, onClose, onSelect }: WallpaperPreviewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cachedUrls, setCachedUrls] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!isOpen) {
      setCachedUrls(new Map());
      return;
    }
    
    const loadCachedUrls = async () => {
      try {
        await cacheManager.initialize();
        const urls = new Map<number, string>();
        
        await Promise.all(DEFAULT_WALLPAPERS.map(async (wallpaper, index) => {
          const cached = cacheManager.getCachedWallpaper(wallpaper.url);
          if (cached) {
            urls.set(index, cached);
          } else {
            const newCached = await cacheManager.cacheWallpaper(wallpaper.url);
            urls.set(index, newCached || wallpaper.url);
          }
        }));
        
        setCachedUrls(urls);
      } catch {
        const urls = new Map<number, string>();
        DEFAULT_WALLPAPERS.forEach((wallpaper, index) => {
          urls.set(index, wallpaper.url);
        });
        setCachedUrls(urls);
      }
    };

    loadCachedUrls();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl mx-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">壁纸预览</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 max-h-[70vh] overflow-y-auto">
          {DEFAULT_WALLPAPERS.map((wallpaper, index) => (
            <div
              key={wallpaper.url}
              className="relative group aspect-video rounded-xl overflow-hidden cursor-pointer bg-gray-800"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={cachedUrls.get(index) || wallpaper.url}
                alt={wallpaper.copyright}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                  {wallpaper.copyright}
                </span>
              </div>

              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(index);
                  }}
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-gray-700 text-center text-sm text-gray-500">
          鼠标悬停在壁纸上，点击绿色对号按钮设置为当前壁纸
        </div>
      </div>
    </div>
  );
}
