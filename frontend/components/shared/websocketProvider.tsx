'use client';

import { useInitializeWebsocket } from '@/hooks/useWebsocket';

export default function WebsocketProvider() {
  useInitializeWebsocket();
  return null;
}
