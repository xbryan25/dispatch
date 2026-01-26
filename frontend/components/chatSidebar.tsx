'use client';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import ChatList from './chatList';

import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Icon } from '@iconify/react';

export default function ChatSidebar() {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 h-full max-w-125 min-w-0">
      <div className="flex justify-between w-full">
        <h2 className="font-bold text-2xl">Conversations</h2>

        <div className="flex gap-2">
          <ThemeToggleButton />

          <Popover>
            <PopoverTrigger asChild>
              <Button className="cursor-pointer">
                <Icon icon="material-symbols:settings" className="size-4 cursor-pointer"></Icon>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex flex-col gap-3">
              <PopoverHeader>
                <PopoverTitle className="text-xl font-bold">Settings</PopoverTitle>
              </PopoverHeader>

              <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
                <Icon icon="material-symbols:logout" className="size-4" />
                Logout?
              </button>
            </PopoverContent>
          </Popover>
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
