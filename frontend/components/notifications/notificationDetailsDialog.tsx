'use client';

import { useEffect, useRef } from 'react';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface NotificationDetailsDialogProps {
  notificationId: string;
  content: string;
  type: string;
  toShowInCell: 'content' | 'type';
  dateStr: string;
}

export default function NotificationDetailsDialog({
  notificationId,
  content,
  type,
  toShowInCell,
  dateStr,
}: NotificationDetailsDialogProps) {
  const { markAsReadSilently, setOpenDialogNotificationId } = useNotificationsStore();

  const openDialogNotificationId = useNotificationsStore((state) => state.openDialogNotificationId);

  const toTitleCase = (str: string) =>
    str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const isOpen = openDialogNotificationId === notificationId;

  const wasOpened = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpened.current = true;
      markAsReadSilently(notificationId);
    }

    if (!isOpen && wasOpened.current) {
      wasOpened.current = false;
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setOpenDialogNotificationId(value ? notificationId : null);
      }}
    >
      <DialogTrigger asChild className="cursor-pointer">
        <p>{toShowInCell === 'type' ? toTitleCase(type) : content}</p>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{toTitleCase(type)}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex w-full gap-2 pt-2">{content}</div>
        <Separator />
        <DialogFooter>
          <div className="flex w-full justify-start">{dateStr}</div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
