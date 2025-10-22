'use client';

import { useState, useEffect } from 'react';
import {
  isOnline,
  getCachedQuranAyahs,
  getCachedHadiths,
  cacheQuranAyahs,
  cacheHadiths,
  getBookmarks,
  saveBookmark,
  getSetting,
  saveSetting,
} from '@/lib/offline-storage';

/**
 * Hook to check online/offline status
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await isOnline();
      setOnline(status);
    };

    checkStatus();

    // Listen for online/offline events
    window.addEventListener('online', () => setOnline(true));
    window.addEventListener('offline', () => setOnline(false));

    return () => {
      window.removeEventListener('online', () => setOnline(true));
      window.removeEventListener('offline', () => setOnline(false));
    };
  }, []);

  return online;
}

/**
 * Hook to manage offline Quran data
 */
export function useOfflineQuran() {
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCachedAyahs();
  }, []);

  const loadCachedAyahs = async () => {
    try {
      setLoading(true);
      const cached = await getCachedQuranAyahs();
      setAyahs(cached);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const cacheAyahs = async (newAyahs: any[]) => {
    try {
      await cacheQuranAyahs(newAyahs);
      setAyahs(newAyahs);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { ayahs, loading, error, cacheAyahs, refresh: loadCachedAyahs };
}

/**
 * Hook to manage offline Hadith data
 */
export function useOfflineHadith() {
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCachedHadiths();
  }, []);

  const loadCachedHadiths = async () => {
    try {
      setLoading(true);
      const cached = await getCachedHadiths();
      setHadiths(cached);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const cacheNewHadiths = async (newHadiths: any[]) => {
    try {
      await cacheHadiths(newHadiths);
      setHadiths(newHadiths);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { hadiths, loading, error, cacheHadiths: cacheNewHadiths, refresh: loadCachedHadiths };
}

/**
 * Hook to manage bookmarks
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const saved = await getBookmarks();
      setBookmarks(saved);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (bookmark: {
    type: 'quran' | 'hadith';
    referenceId: string;
    note?: string;
  }) => {
    await saveBookmark(bookmark);
    await loadBookmarks();
  };

  return { bookmarks, loading, addBookmark, refresh: loadBookmarks };
}

/**
 * Hook to manage app settings
 */
export function useSettings<T = any>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSetting();
  }, [key]);

  const loadSetting = async () => {
    try {
      setLoading(true);
      const saved = await getSetting(key);
      if (saved !== null) {
        setValue(saved);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (newValue: T) => {
    await saveSetting(key, newValue);
    setValue(newValue);
  };

  return { value, loading, updateSetting };
}

/**
 * Hook to sync data when online
 */
export function useDataSync() {
  const online = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncData = async () => {
    if (!online || syncing) return;

    try {
      setSyncing(true);
      // TODO: Implement actual sync logic with your API
      // This is a placeholder for the sync implementation
      console.log('Syncing data...');

      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (online) {
      syncData();
    }
  }, [online]);

  return { syncing, lastSync, syncData, online };
}
