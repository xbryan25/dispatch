'use client';

import Link from 'next/link';

import { Button } from './ui/button';

import { useRouter, usePathname } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';
import ConversationTab from './conversationTab';

export default function ChatList() {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 h-full">
      <div className="flex justify-between w-full">
        <h2 className="w-full font-bold text-2xl">Conversations</h2>
        <ThemeToggleButton />
      </div>

      <InputGroup className="w-full shrink-0">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex-1 flex flex-col w-full gap-1 overflow-y-auto h-0 pr-3">
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
        <ConversationTab />
      </div>
    </div>
  );
}
