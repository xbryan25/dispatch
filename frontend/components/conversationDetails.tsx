'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function ConversationDetails() {
  return (
    <div className="flex-1 flex flex-col items-teo justify-start gap-10 bg-white dark:bg-stone-900  rounded-xl p-5">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="relative w-20 h-20 shrink-0 overflow-hidden border-2 ring-3 ring-green-300 ring-offset-2 ring-offset-white dark:ring-offset-stone-900 rounded-full ">
          <Image src="/testdp.jpg" alt="User avatar" fill sizes="96px" className="object-cover" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="font-bold">Bryan Agan</h2>
          <p>Active now</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">Conversation Settings</h2>

        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="material-symbols:palette" className="size-7" />
          Change theme
        </button>

        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="ic:baseline-notifications-off" className="size-7" />
          Mute notifications
        </button>

        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="mdi:rename" className="size-7" />
          Set nicknames
        </button>

        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="solar:user-block-bold" className="size-7" />
          Unfriend Bryan?
        </button>
      </div>
    </div>
  );
}
