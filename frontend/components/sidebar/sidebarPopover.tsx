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
        <Button className="cursor-pointer">
          <Icon icon="material-symbols:settings" className="size-4 cursor-pointer"></Icon>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle className="text-xl font-bold">Settings</PopoverTitle>
        </PopoverHeader>

        <ChangeProfileImageDialog />
        <UpdateProfileDialog />
        <LogoutDialog />
      </PopoverContent>
    </Popover>
  );
}
