/**
 * Offline Storage Service
 *
 * Handles offline data storage and synchronization for Islamic Nexus app.
 * Uses IndexedDB for web/PWA and SQLite for native Android app.
 */

import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';

// Database name and version
const DB_NAME = 'islamic-nexus-db';
const DB_VERSION = 1;

// Store names
const STORES = {
  QURAN: 'quran',
  HADITH: 'hadith',
  BOOKMARKS: 'bookmarks',
  NOTES: 'notes',
  SETTINGS: 'settings',
  SYNC_STATUS: 'sync_status',
};

/**
 * Initialize IndexedDB for offline storage
 */
export function initOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create Quran store
      if (!db.objectStoreNames.contains(STORES.QURAN)) {
        const quranStore = db.createObjectStore(STORES.QURAN, { keyPath: 'id' });
        quranStore.createIndex('surahNumber', 'surahNumber', { unique: false });
        quranStore.createIndex('ayahNumber', 'ayahNumber', { unique: false });
      }

      // Create Hadith store
      if (!db.objectStoreNames.contains(STORES.HADITH)) {
        const hadithStore = db.createObjectStore(STORES.HADITH, { keyPath: 'id' });
        hadithStore.createIndex('collection', 'collection', { unique: false });
        hadithStore.createIndex('bookNumber', 'bookNumber', { unique: false });
      }

      // Create Bookmarks store
      if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
        db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'id', autoIncrement: true });
      }

      // Create Notes store
      if (!db.objectStoreNames.contains(STORES.NOTES)) {
        db.createObjectStore(STORES.NOTES, { keyPath: 'id', autoIncrement: true });
      }

      // Create Settings store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }

      // Create Sync Status store
      if (!db.objectStoreNames.contains(STORES.SYNC_STATUS)) {
        db.createObjectStore(STORES.SYNC_STATUS, { keyPath: 'entity' });
      }
    };
  });
}

/**
 * Save data to offline storage
 */
export async function saveToOfflineStorage<T>(
  storeName: string,
  data: T | T[]
): Promise<void> {
  const db = await initOfflineDB();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);

  if (Array.isArray(data)) {
    for (const item of data) {
      store.put(item);
    }
  } else {
    store.put(data);
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get data from offline storage
 */
export async function getFromOfflineStorage<T>(
  storeName: string,
  key?: IDBValidKey
): Promise<T | T[] | null> {
  const db = await initOfflineDB();
  const transaction = db.transaction([storeName], 'readonly');
  const store = transaction.objectStore(storeName);

  if (key) {
    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } else {
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Delete data from offline storage
 */
export async function deleteFromOfflineStorage(
  storeName: string,
  key: IDBValidKey
): Promise<void> {
  const db = await initOfflineDB();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  store.delete(key);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Check if online
 */
export async function isOnline(): Promise<boolean> {
  try {
    const status = await Network.getStatus();
    return status.connected;
  } catch {
    return navigator.onLine;
  }
}

/**
 * Save sync status
 */
export async function saveSyncStatus(entity: string, lastSync: Date): Promise<void> {
  await saveToOfflineStorage(STORES.SYNC_STATUS, {
    entity,
    lastSync: lastSync.toISOString(),
  });
}

/**
 * Get sync status
 */
export async function getSyncStatus(entity: string): Promise<Date | null> {
  const status = await getFromOfflineStorage<{ entity: string; lastSync: string }>(
    STORES.SYNC_STATUS,
    entity
  );
  return status ? new Date(status.lastSync) : null;
}

/**
 * Cache Quran ayahs for offline access
 */
export async function cacheQuranAyahs(ayahs: any[]): Promise<void> {
  await saveToOfflineStorage(STORES.QURAN, ayahs);
  await saveSyncStatus('quran', new Date());
}

/**
 * Cache Hadith for offline access
 */
export async function cacheHadiths(hadiths: any[]): Promise<void> {
  await saveToOfflineStorage(STORES.HADITH, hadiths);
  await saveSyncStatus('hadith', new Date());
}

/**
 * Get cached Quran ayahs
 */
export async function getCachedQuranAyahs(): Promise<any[]> {
  const ayahs = await getFromOfflineStorage<any[]>(STORES.QURAN);
  return Array.isArray(ayahs) ? ayahs : [];
}

/**
 * Get cached Hadiths
 */
export async function getCachedHadiths(): Promise<any[]> {
  const hadiths = await getFromOfflineStorage<any[]>(STORES.HADITH);
  return Array.isArray(hadiths) ? hadiths : [];
}

/**
 * Save bookmark
 */
export async function saveBookmark(bookmark: {
  type: 'quran' | 'hadith';
  referenceId: string;
  note?: string;
}): Promise<void> {
  await saveToOfflineStorage(STORES.BOOKMARKS, {
    ...bookmark,
    createdAt: new Date().toISOString(),
  });
}

/**
 * Get all bookmarks
 */
export async function getBookmarks(): Promise<any[]> {
  const bookmarks = await getFromOfflineStorage<any[]>(STORES.BOOKMARKS);
  return Array.isArray(bookmarks) ? bookmarks : [];
}

/**
 * Save user settings
 */
export async function saveSetting(key: string, value: any): Promise<void> {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

/**
 * Get user setting
 */
export async function getSetting(key: string): Promise<any> {
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : null;
}

/**
 * Export all offline data (for debugging)
 */
export async function exportOfflineData(): Promise<Record<string, any>> {
  return {
    quran: await getCachedQuranAyahs(),
    hadith: await getCachedHadiths(),
    bookmarks: await getBookmarks(),
    syncStatus: {
      quran: await getSyncStatus('quran'),
      hadith: await getSyncStatus('hadith'),
    },
  };
}

// Export store names for use in components
export { STORES };
