'use client';

import { useInitializeWebsocket } from '@/hooks/useChat';

export default function WebsocketProvider() {
  useInitializeWebsocket();
  return null;
}
