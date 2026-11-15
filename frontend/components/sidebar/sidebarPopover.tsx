'use client';

import { Icon } from '@iconify/react';

import ChangeProfileImageDialog from '@/components/sidebar/changeProfileImageDialog';
import LogoutDialog from '@/components/sidebar/logoutDialog';
import UpdateProfileDialog from '@/components/sidebar/updateProfileDialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function SidebarPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 cursor-pointer rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          aria-label="Open settings"
          title="Settings"
        >
          <Icon icon="material-symbols:settings-rounded" className="size-5" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex flex-col gap-3 rounded-2xl border-stone-200 p-5 shadow-xl dark:border-stone-700">
        <PopoverHeader>
          <PopoverTitle className="text-lg font-semibold tracking-tight">Settings</PopoverTitle>
        </PopoverHeader>

        <ChangeProfileImageDialog />
        <UpdateProfileDialog />
        <LogoutDialog />
      </PopoverContent>
    </Popover>
  );
}
