'use client';

import ChatSidebar from '@/components/chatSidebar';
import { useParams } from 'next/navigation';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const conversationId = params?.conversationId as string;

  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <ChatSidebar />

      {children}
    </div>
  );
}
