'use client';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import ChatList from './chatList';

import SidebarPopover from './sidebarPopover';

export default function ChatSidebar() {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 h-full max-w-125 min-w-0">
      <div className="flex justify-between w-full">
        <h2 className="font-bold text-2xl">Conversations</h2>

        <div className="flex gap-2">
          <ThemeToggleButton />

          <SidebarPopover />
        </div>
      </div>

      <InputGroup className="w-full shrink-0">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <ChatList />
    </div>
  );
}
