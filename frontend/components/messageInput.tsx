import { Button } from './ui/button';

import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';

import { useState } from 'react';

import { useSendMessage } from '@/hooks/useChat';
import { useChatStore } from '@/store/useChatStore';
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

  const { send } = useSendMessage();
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
    const tempMessageId: string = crypto.randomUUID();

    addSendingMessage({
      tempMessageId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      status: 'sending',
    });

    setNewMessage('');

    const error = await send(newMessage.trim(), tempMessageId);

    console.log(error !== null);

    if (error !== null) {
      addFailedMessage({
        tempMessageId,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
        status: 'failed',
      });

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
          placeholder={
            otherParticipantFriendshipStatus !== 'accepted'
              ? `You aren't friends with ${otherParticipantDetails?.username} anymore. This conversation is read-only.`
              : 'Type your message...'
          }
        />
      </InputGroup>
      <Button onClick={sendNewMessage}>Send</Button>
    </div>
  );
}
