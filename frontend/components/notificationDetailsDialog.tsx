'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Separator } from '@/components/ui/separator';
import { useNotificationsStore } from '@/store/useNotificationsStore';

import { useEffect, useRef, useState } from 'react';

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
  const updateNotificationsReadStatus = useNotificationsStore(
    (state) => state.updateNotificationsReadStatus
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toTitleCase = (str: string) =>
    str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const wasOpened = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpened.current = true;
    }

    // TODO: Table should be updated when opening dialog, not when closing it
    if (!isOpen && wasOpened.current) {
      updateNotificationsReadStatus([notificationId], 'read');
      wasOpened.current = false;
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
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
