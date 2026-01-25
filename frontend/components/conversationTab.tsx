'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function ConversationTab() {
  return (
    <div className="flex items-center justify-center gap-2 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md p-2 w-full cursor-pointer min-w-0 ">
      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full ">
        <Image
          src="/testdp.jpg"
          alt="User avatar"
          fill
          sizes="96px" // Helps Next.js optimize the download size
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between">
          <h3 className="font-semibold">Bryan Agan</h3>
          <p className="shrink-0">1:25 PM</p>
        </div>
        <div className="flex justify-between items-center gap-4">
          <p className="truncate ">
            You: Yo? What did you say to me? {"Don't"}...aaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa
          </p>
          <Icon icon="ri:check-double-fill" className="size-5 shrink-0" />
        </div>
      </div>
    </div>
  );
}
