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
  const markAsReadSilently = useNotificationsStore((state) => state.markAsReadSilently);
  const setOpenDialogNotificationId = useNotificationsStore(
    (state) => state.setOpenDialogNotificationId
  );

  const openDialogNotificationId = useNotificationsStore((state) => state.openDialogNotificationId);

  const toTitleCase = (str: string) =>
    str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  // Each notification has a dialog in both its Type and Message cells.
  // Give each trigger its own key so opening one doesn't open both dialogs.
  const dialogId = `${notificationId}:${toShowInCell}`;
  const isOpen = openDialogNotificationId === dialogId;

  const wasOpened = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpened.current = true;
      markAsReadSilently(notificationId);
    }

    if (!isOpen && wasOpened.current) {
      wasOpened.current = false;
    }
  }, [isOpen, markAsReadSilently, notificationId]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setOpenDialogNotificationId(value ? dialogId : null);
      }}
    >
      <DialogTrigger asChild className="cursor-pointer">
        <p
          className={
            toShowInCell === 'type'
              ? 'inline-flex max-w-full items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700 transition-colors hover:bg-amber-100 hover:text-amber-900 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-amber-400/15 dark:hover:text-amber-200'
              : 'max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-stone-800 transition-colors hover:text-amber-800 dark:text-stone-200 dark:hover:text-amber-300'
          }
        >
          {toShowInCell === 'type' ? toTitleCase(type) : content}
        </p>
      </DialogTrigger>

      <DialogContent className="max-w-xl gap-0 overflow-hidden rounded-2xl border-stone-200 p-0 dark:border-stone-800">
        <DialogHeader className="bg-stone-50 px-6 py-5 text-left dark:bg-stone-900">
          <div className="mb-2 inline-flex w-fit items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">
            Notification
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight">{toTitleCase(type)}</DialogTitle>
        </DialogHeader>
        <Separator className="dark:bg-stone-800" />
        <div className="min-h-28 px-6 py-5 text-sm leading-7 text-stone-700 dark:text-stone-300">{content}</div>
        <Separator className="dark:bg-stone-800" />
        <DialogFooter className="bg-stone-50 px-6 py-4 dark:bg-stone-900">
          <div className="flex w-full items-center justify-between text-xs font-medium text-stone-500 dark:text-stone-400">
            <span>Received</span>
            <time>{dateStr}</time>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
