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

import { useState } from 'react';

interface NotificationDetailsDialogProps {
  content: string;
  type: string;
  dateStr: string;
}

export default function NotificationDetailsDialog({
  content,
  type,
  dateStr,
}: NotificationDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogTrigger asChild className="cursor-pointer">
        <p>{content}</p>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type}</DialogTitle>
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
