import { useState, useEffect, useCallback } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) {
      return false;
    }

    try {
      await fetch('https://cloudflare.com/cdn-cgi/trace', {
        method: 'HEAD',
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  return { isOnline, checkConnection };
}