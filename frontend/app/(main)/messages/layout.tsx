import ChatSidebar from '@/components/chatSidebar';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <ChatSidebar />

      {children}
    </div>
  );
}
