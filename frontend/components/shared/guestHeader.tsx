'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function GuestHeader() {
  const pathname = usePathname();
  const action =
    pathname === '/login'
      ? { label: 'Register', href: '/register' }
      : { label: 'Login', href: '/login' };

  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between border-b border-slate-200/70 font-sans sm:h-22">
      <Link
        href="/"
        aria-label="Dispatch home"
        className="rounded-lg text-2xl font-bold leading-none tracking-[-0.05em] text-slate-950 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 sm:text-[1.7rem]"
      >
        dispatch<span className="text-indigo-600">.</span>
      </Link>

      <nav aria-label="Guest navigation" className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className="h-10 w-24 cursor-pointer rounded-xl px-4 font-semibold text-slate-600 hover:bg-white hover:text-indigo-700"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      </nav>
    </header>
  );
}
