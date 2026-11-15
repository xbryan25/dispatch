'use client';

import { Icon } from '@iconify/react';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import DeleteNotificationDialog from '@/components/notifications/deleteNotificationDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Notification } from '@/types/notifications';

interface NotificationRowActionsProps {
  notification: Notification;
}

export default function NotificationRowActions({ notification }: NotificationRowActionsProps) {
  const { updateNotificationsReadStatus } = useNotificationsStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-9 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44 rounded-xl border-stone-200 p-1.5 shadow-lg dark:border-stone-700">
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              updateNotificationsReadStatus(
                [notification.notificationId],
                notification.isReadByReceiver ? 'unread' : 'read'
              )
            }
            className="cursor-pointer rounded-lg py-2 text-sm"
          >
            <Icon icon="material-symbols:check" className="w-4 h-4" /> Mark as{' '}
            {notification.isReadByReceiver ? 'unread' : 'read'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg py-2 text-sm text-red-600 focus:text-red-700 dark:text-red-400"
            onSelect={(e) => {
              e.preventDefault();
              setDialogOpen(true);
            }}
          >
            <Icon icon="material-symbols:delete" className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteNotificationDialog
        isOpen={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setDropdownOpen(false);
        }}
        notificationIds={[notification.notificationId]}
      />
    </div>
  );
}
