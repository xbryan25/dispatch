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

  const send = useChatStore((state) => state.send);

  const sendError = useChatStore((state) => state.sendError);
  const sendRateLimited = useChatStore((state) => state.sendRateLimited);

  const addSendingMessage = useChatStore((state) => state.addSendingMessage);
  const removeSendingMessage = useChatStore((state) => state.removeSendingMessage);

  const addFailedMessage = useChatStore((state) => state.addFailedMessage);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() !== '') sendNewMessage();
    }
  };

  const sendNewMessage = async () => {
    if (newMessage === '') return;

    const tempMessageId: string = crypto.randomUUID();

    addSendingMessage({
      tempMessageId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      status: 'sending',
    });

    setNewMessage('');

    await send(newMessage.trim(), tempMessageId);

    if (sendError !== null) {
      toast.error(`Something went wrong when sending a message.`);
      addFailedMessage({
        tempMessageId,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        status: 'failed',
      });

      removeSendingMessage(tempMessageId);
    } else if (sendRateLimited) {
      toast.error('You have tried to send too many messages. Try again in 1 minute.');
      removeSendingMessage(tempMessageId);
    }
  };

  return (
    <div className="flex gap-2 px-2 my-2 items-end">
      <InputGroup className="flex-1 shrink-0 min-h-0!  ">
        <InputGroupTextarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-4! py-2!"
          disabled={sendRateLimited}
          placeholder={
            otherParticipantFriendshipStatus !== 'accepted'
              ? `You aren't friends with ${otherParticipantDetails?.username} anymore. This conversation is read-only.`
              : sendRateLimited
                ? 'You have tried to send too many messages. Try again in 1 minute.'
                : 'Type your message...'
          }
        />
      </InputGroup>
      <Button onClick={sendNewMessage} disabled={newMessage === '' || sendRateLimited}>
        Send
      </Button>
    </div>
  );
}
