'use client';

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

interface UnfriendDialogProps {
  username: string;
}

export default function UnfriendDialog({ username }: UnfriendDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
          <Icon icon="material-symbols:person-remove" className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to unfriend {username}?</DialogTitle>
          <DialogDescription>
            Your conversation with {username} will change to view-only.
          </DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button className="flex-1 cursor-pointer text-md">Confirm unfriend</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
