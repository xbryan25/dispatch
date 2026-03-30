'use client';

import ThemeToggleButton from './themeToggleButton';

import SidebarPopover from './sidebarPopover';
import { Button } from './ui/button';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function GlobalSidebar() {
  return (
    <div className="flex flex-col justify-between bg-whiterounded-xl pl-5 pt-5 pb-5 min-h-screen max-w-125 min-w-0">
      <div className="flex flex-col gap-2">
        <Link href="/messages">
          <Button className="cursor-pointer">
            <Icon icon="material-symbols:chat" className="w-4 h-4" />
          </Button>
        </Link>

        <Link href="/friends">
          <Button className="cursor-pointer">
            <Icon icon="material-symbols:supervised-user-circle" className="w-4 h-4" />
          </Button>
        </Link>

        <Link href="/notifications">
          <Button className="cursor-pointer">
            <Icon icon="material-symbols:notifications-rounded" className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <ThemeToggleButton />

        <SidebarPopover />
      </div>
    </div>
  );
}
