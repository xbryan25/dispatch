'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Input } from './ui/input';
import UserMessage from './userMessage';
import MessageThread from './messageThread';

interface ChatListProps {
  onToggle: () => void; // This is a function prop
}

export default function ConversationArea({ onToggle }: ChatListProps) {
  return (
    <div className="flex-3 flex flex-col items-teo justify-start gap-2 bg-white dark:bg-stone-900 rounded-xl">
      <div className="flex justify-between p-2 gap-3">
        <div className="flex gap-3">
          <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full ">
            <Image
              src="/testdp.jpg"
              alt="User avatar"
              fill
              sizes="96px" // Helps Next.js optimize the download size
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold">gwapo</h3>
            <div className="flex gap-1 items-center">
              <div className="bg-green-400 size-2 rounded-full"></div>
              <p className="">Active now</p>
            </div>
          </div>
        </div>

        <Button className="cursor-pointer" onClick={onToggle}>
          <Icon icon="bi:three-dots" />
        </Button>
      </div>

      <MessageThread />

      <div className="flex gap-2 px-2 my-2">
        <InputGroup className="flex-1 shrink-0">
          <InputGroupInput placeholder="Type your message..." />
        </InputGroup>

        <Button className="cursor-pointer">Send</Button>
      </div>
    </div>
  );
}
