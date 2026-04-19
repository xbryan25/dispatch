import GlobalSidebar from '@/components/sidebar/globalSidebar';
import WebsocketProvider from '@/components/shared/websocketProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-stretch justify-center bg-zinc-200 dark:bg-stone-800 font-sans">
      <GlobalSidebar />
      <WebsocketProvider />
      <main className="flex-1 overflow-hidden bg-white dark:bg-stone-900">{children}</main>
    </div>
  );
}
