'use client';

import { useRouter } from 'next/navigation';

import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Icon } from '@iconify/react';

export default function CancelFriendshipRequestDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
          <Icon icon="material-symbols:close" className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to cancel friendship request?</DialogTitle>
          <DialogDescription>
            You can send another request later if you change your mind.
          </DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button className="flex-1 cursor-pointer text-md">Accept friendship</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
