import GlobalSidebar from '@/components/globalSidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full items-stretch justify-center  overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans">
      <GlobalSidebar />
      <main className="flex-1 overflow-hidden bg-white dark:bg-stone-900">{children}</main>
    </div>
  );
}
