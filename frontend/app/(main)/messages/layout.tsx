'use client';

import { useParams } from 'next/navigation';

import ChatSidebar from '@/components/messages/chatSidebar';

import { cn } from '@/lib/utils';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const hasOpenConversation = typeof params.conversationId === 'string';

  return (
    // data-viewport-fill tells the main layout to give this page a fixed viewport height
    // (below the mobile top bar) instead of letting the window scroll.
    <div
      data-viewport-fill
      className="flex min-h-0 flex-1 items-stretch justify-center gap-6 overflow-hidden bg-stone-50 p-3 font-sans dark:bg-stone-950 sm:p-4 lg:p-6"
    >
      <ChatSidebar className={cn(hasOpenConversation && 'hidden md:flex')} />

      {children}
    </div>
  );
}
