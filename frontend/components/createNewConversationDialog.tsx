'use client';

import { Spinner } from './ui/spinner';

import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { Icon } from '@iconify/react';

import { useAcceptFriendRequest } from '@/hooks/useFriendship';

import { toast } from 'sonner';

import { useFriendsStore } from '@/store/useFriendsStore';
import { useCreateDirectMessage } from '@/hooks/useChat';

import { useRouter } from 'next/navigation';

interface CreateNewConversationDialogProps {
  username: string;
  otherUserId: string;
}

export default function CreateNewConversationDialog({
  username,
  otherUserId,
}: CreateNewConversationDialogProps) {
  const { createNewDirectMessage, loading } = useCreateDirectMessage();

  const router = useRouter();

  const createDirectMessage = async () => {
    try {
      const result = await createNewDirectMessage(otherUserId);

      if (result.data) {
        const conversationId = result.data.conversationId;

        router.push(`/messages/${conversationId}`);
      } else {
        throw Error;
      }
    } catch {
      toast.error(`Something went wrong when creating a new conversation.`);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
              <Icon icon="material-symbols:chat-add-on" className="size-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">Start talking to {username}?</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message {username}?</DialogTitle>
          <DialogDescription>This will start a new conversation with {username}.</DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={createDirectMessage}
              disabled={loading}
            >
              {loading && <Spinner data-icon="inline-start" />}
              Start conversation
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
