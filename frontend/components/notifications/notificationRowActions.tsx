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
  const updateNotificationsReadStatus = useNotificationsStore(
    (state) => state.updateNotificationsReadStatus
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex justify-end">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() =>
              updateNotificationsReadStatus(
                [notification.notificationId],
                notification.isReadByReceiver ? 'unread' : 'read'
              )
            }
            className="cursor-pointer"
          >
            <Icon icon="material-symbols:check" className="w-4 h-4" /> Mark as{' '}
            {notification.isReadByReceiver ? 'unread' : 'read'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
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
