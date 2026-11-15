'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SidebarPopover from '@/components/sidebar/sidebarPopover';
import ThemeToggleButton from '@/components/sidebar/themeToggleButton';

const navigationItems = [
  { href: '/messages', label: 'Messages', icon: 'material-symbols:chat-rounded' },
  { href: '/friends', label: 'Friends', icon: 'material-symbols:group-rounded' },
  {
    href: '/notifications',
    label: 'Notifications',
    icon: 'material-symbols:notifications-rounded',
  },
];

export default function GlobalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="z-20 flex w-full shrink-0 flex-col border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900 lg:min-h-screen lg:w-20 lg:border-b-0 lg:border-r lg:px-3 lg:py-6">
      <div className="flex items-center justify-between lg:block">
        <Link
          href="/messages"
          aria-label="Dispatch workspace"
          title="Dispatch"
          className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-500 lg:mx-auto lg:justify-center"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-900/10 transition-transform group-hover:scale-[1.03]">
            <Icon icon="material-symbols:forum-rounded" className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 lg:hidden">
            <span className="block text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Dispatch
            </span>
            <span className="block text-xs text-stone-500 dark:text-stone-400">
              Where conversations happen
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggleButton />
          <SidebarPopover />
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="mt-4 flex gap-1 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:items-center lg:overflow-visible lg:pb-0"
      >
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
              className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 lg:mx-auto lg:justify-center lg:px-2 ${
                isActive
                  ? 'bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-200'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
              }`}
            >
              <Icon
                icon={item.icon}
                className={`size-5 shrink-0 ${
                  isActive
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-stone-400 group-hover:text-stone-700 dark:text-stone-500 dark:group-hover:text-stone-200'
                }`}
                aria-hidden="true"
              />
              <span className="lg:sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-stone-100 pt-4 dark:border-stone-800 lg:block">
        <div className="flex flex-col items-center gap-2">
          <ThemeToggleButton />
          <SidebarPopover />
        </div>
      </div>
    </aside>
  );
}
