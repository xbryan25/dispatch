'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function GuestHeader() {
  const pathname = usePathname();
  const action =
    pathname === '/login'
      ? { label: 'Create account', href: '/register' }
      : { label: 'Log in', href: '/login' };

  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between border-b border-border">
      <Link
        href="/"
        aria-label="Dispatch home"
        className="rounded-lg text-2xl font-bold leading-none tracking-[-0.04em] transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:text-[1.7rem] dark:hover:text-indigo-400"
      >
        dispatch<span className="text-indigo-600 dark:text-indigo-400">.</span>
      </Link>
      <nav aria-label="Guest navigation">
        <Button
          asChild
          variant="ghost"
          className="h-10 rounded-xl px-4 font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-indigo-500"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      </nav>
    </header>
  );
}
