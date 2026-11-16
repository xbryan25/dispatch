import WebsocketProvider from '@/components/shared/websocketProvider';
import GlobalSidebar from '@/components/sidebar/globalSidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50 font-sans dark:bg-stone-950 lg:flex-row has-[[data-viewport-fill]]:h-dvh has-[[data-viewport-fill]]:min-h-0 has-[[data-viewport-fill]]:overflow-hidden">
      <GlobalSidebar />
      <WebsocketProvider />
      <main className="min-h-screen min-w-0 flex-1 bg-stone-50 dark:bg-stone-950 has-[[data-viewport-fill]]:flex has-[[data-viewport-fill]]:min-h-0 has-[[data-viewport-fill]]:flex-col">
        {children}
      </main>
    </div>
  );
}
