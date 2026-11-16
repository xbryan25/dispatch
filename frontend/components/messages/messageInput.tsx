import { Clock, Lock, SendHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useChatStore } from '@/store/useChatStore';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';

import { OtherParticipantDetails } from '@/types/chat';

interface MessageInputProps {
  otherParticipantFriendshipStatus: string | null;
  otherParticipantDetails: OtherParticipantDetails | null;
}

export default function MessageInput({
  otherParticipantFriendshipStatus,
  otherParticipantDetails,
}: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');

  const sendRateLimited = useChatStore((state) => state.sendRateLimited);

  const { send, addSendingMessage, removeSendingMessage, addFailedMessage } = useChatStore();

  const isReadOnly = otherParticipantFriendshipStatus !== 'accepted';

  // Whitespace-only drafts, read-only conversations and rate limits all block sending.
  const canSend = newMessage.trim() !== '' && !isReadOnly && !sendRateLimited;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) sendNewMessage();
    }
  };

  const sendNewMessage = async () => {
    if (!canSend) return;

    const content = newMessage.trim();
    const tempMessageId: string = crypto.randomUUID();

    addSendingMessage({
      tempMessageId,
      content,
      createdAt: new Date().toISOString(),
      status: 'sending',
    });

    setNewMessage('');

    await send(content, tempMessageId);

    // Read the store's current values; the ones captured at render time are stale after the await.
    const { sendError: latestSendError, sendRateLimited: latestSendRateLimited } =
      useChatStore.getState();

    // A 429 sets both flags, so check rate limiting first.
    if (latestSendRateLimited) {
      toast.error('You have tried to send too many messages. Try again in 1 minute.');
      removeSendingMessage(tempMessageId);
    } else if (latestSendError !== null) {
      toast.error(`Something went wrong when sending a message.`);
      addFailedMessage({
        tempMessageId,
        content,
        createdAt: new Date().toISOString(),
        status: 'failed',
      });

      removeSendingMessage(tempMessageId);
    }
  };

  const notice = isReadOnly
    ? {
        icon: Lock,
        text: `You aren't friends with ${otherParticipantDetails?.username} anymore. This conversation is read-only.`,
      }
    : sendRateLimited
      ? {
          icon: Clock,
          text: 'You have tried to send too many messages. Try again in 1 minute.',
        }
      : null;

  return (
    <div className="shrink-0 border-t border-stone-100 p-3 dark:border-stone-800 sm:p-4">
      {notice && (
        <div className="mb-2 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
          <notice.icon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <p>{notice.text}</p>
        </div>
      )}

      <div className="flex items-end gap-2">
        <InputGroup className="min-h-11! flex-1 rounded-2xl border-stone-200 bg-stone-50/70 shadow-none dark:border-stone-700 dark:bg-stone-950">
          <InputGroupTextarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="max-h-40 min-h-4! px-4! py-3! text-sm"
            disabled={isReadOnly || sendRateLimited}
            placeholder={
              isReadOnly
                ? 'This conversation is read-only'
                : sendRateLimited
                  ? 'Try again in a minute'
                  : 'Type your message...'
            }
          />
        </InputGroup>
        <Button
          size="icon"
          className="size-11 shrink-0 cursor-pointer rounded-2xl bg-amber-500 text-white shadow-none hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:opacity-100 dark:bg-amber-500 dark:hover:bg-amber-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-500"
          onClick={sendNewMessage}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
