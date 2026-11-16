'use client';

import { MessageCirclePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useChatStore } from '@/store/useChatStore';

import { dialogContentClass, userCardIconButtonClass } from '@/components/friends/userCardStyles';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CreateNewConversationDialogProps {
  username: string;
  otherUserId: string;
}

export default function CreateNewConversationDialog({
  username,
  otherUserId,
}: CreateNewConversationDialogProps) {
  const createNewDirectMessageLoading = useChatStore(
    (state) => state.createNewDirectMessageLoading
  );

  const { createNewDirectMessage } = useChatStore();

  const router = useRouter();

  const createDirectMessage = async () => {
    try {
      const result = await createNewDirectMessage(otherUserId);

      if (result) {
        const conversationId = result.conversationId;
        const conversationIdType = result.conversationIdType;

        if (conversationIdType === 'existing') {
          toast.info(`There is already an existing conversation between you and ${username}.`);
        }

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
            <Button
              variant="outline"
              size="icon"
              className={userCardIconButtonClass}
              aria-label={`Start talking to ${username}`}
            >
              <MessageCirclePlus className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">Start talking to {username}?</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="px-6 pb-5 pt-6 text-left">
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <MessageCirclePlus className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Message {username}?
          </DialogTitle>
          <DialogDescription className="pt-1 leading-6">
            This will start a new conversation with {username}.
          </DialogDescription>
          <div className="flex w-full gap-2 pt-4">
            <Button
              className="h-10 flex-1 cursor-pointer rounded-xl text-sm"
              onClick={createDirectMessage}
              disabled={createNewDirectMessageLoading}
            >
              {createNewDirectMessageLoading && <Spinner data-icon="inline-start" />}
              Start conversation
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
