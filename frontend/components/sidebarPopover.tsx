'use client';

import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Icon } from '@iconify/react';

import LogoutDialog from './logoutDialog';
import UpdateProfileDialog from './updateProfileDialog';

export default function SidebarPopover() {
  return (
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

        <UpdateProfileDialog />
        <LogoutDialog />
      </PopoverContent>
    </Popover>
  );
}
