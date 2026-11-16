'use client';

import ChatSidebar from '@/components/messages/chatSidebar';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-stone-50 p-4 font-sans dark:bg-stone-950 sm:p-6">
      <ChatSidebar />

      {children}
    </main>
  );
}
