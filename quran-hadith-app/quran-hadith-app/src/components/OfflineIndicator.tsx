'use client';

import { useOnlineStatus } from '@/hooks/useOfflineStorage';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * Component to display online/offline status
 */
export function OfflineIndicator() {
  const online = useOnlineStatus();

  if (online) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white shadow-lg">
      <WifiOff className="h-5 w-5" />
      <span className="text-sm font-medium">Offline Mode</span>
    </div>
  );
}

/**
 * Component to show sync status
 */
export function SyncStatus({ lastSync }: { lastSync: Date | null }) {
  if (!lastSync) return null;

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Wifi className="h-3 w-3" />
      <span>Last synced {timeSince(lastSync)}</span>
    </div>
  );
}
