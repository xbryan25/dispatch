'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function ConversationTab() {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center gap-2 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md p-2 w-full cursor-pointer py-2">
      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full ">
        <Image
          src="/testdp.jpg"
          alt="User avatar"
          fill
          sizes="96px" // Helps Next.js optimize the download size
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <h3 className="font-semibold">Bryan Agan</h3>
          <p className="">1:25 PM</p>
        </div>
        <div className="flex justify-between items-center">
          <p>You: Yo? What did you say to me? {"Don't"}...</p>
          <Icon icon="ri:check-double-fill" className="size-5" />
        </div>
      </div>
    </div>
  );
}
