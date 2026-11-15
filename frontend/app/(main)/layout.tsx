import WebsocketProvider from '@/components/shared/websocketProvider';
import GlobalSidebar from '@/components/sidebar/globalSidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50 font-sans dark:bg-stone-950 lg:flex-row">
      <GlobalSidebar />
      <WebsocketProvider />
      <main className="min-h-screen min-w-0 flex-1 bg-stone-50 dark:bg-stone-950">{children}</main>
    </div>
  );
}
