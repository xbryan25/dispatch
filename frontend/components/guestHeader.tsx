'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

export default function GuestHeader() {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center w-full">
      <Link href="/" className="font-bold text-3xl ">
        Dispatch
      </Link>

      <div className="flex gap-2">
        {pathname === '/' && (
          <Button onClick={() => router.push('/login')} className="text-lg cursor-pointer">
            Login
          </Button>
        )}

        <ThemeToggleButton />
      </div>
    </div>
  );
}
