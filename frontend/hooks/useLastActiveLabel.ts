'use client';

import { useEffect, useState } from 'react';

import { useChatStore } from '@/store/useChatStore';

const units = [
  { label: 'y', seconds: 31536000 },
  { label: 'mo', seconds: 2592000 },
  { label: 'w', seconds: 604800 },
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
];

const formatRelativeTime = (date: Date, now: number): string => {
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  const unit = units.find((u) => diffInSeconds >= u.seconds);

  // Under a minute (or a slightly stale `now`) reads as "1m".
  return unit ? `${Math.floor(diffInSeconds / unit.seconds)}${unit.label}` : '1m';
};

// Online status label for the other participant in the active conversation,
// re-computed every minute so "Last active 5m ago" stays current.
export function useLastActiveLabel(): { isOnline: boolean; label: string } {
  const isOnline = useChatStore((state) => state.otherParticipantIsOnline);
  const lastOnline = useChatStore((state) => state.otherParticipantLastOnline);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);

    return () => clearInterval(interval);
  }, []);

  if (isOnline) return { isOnline, label: 'Active now' };

  if (lastOnline == null) return { isOnline, label: 'Offline' };

  return { isOnline, label: `Last active ${formatRelativeTime(lastOnline, now)} ago` };
}
