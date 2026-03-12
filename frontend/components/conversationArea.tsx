'use client';

import { Button } from './ui/button';

import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import MessageThread from './messageThread';

import { useSendMessage } from '@/hooks/useChat';
import { useChatStore } from '@/store/useChatStore';

import { useState, useEffect } from 'react';

interface ChatListProps {
  onToggle: () => void; // This is a function prop
}

export default function ConversationArea({ onToggle }: ChatListProps) {
  const [newMessage, setNewMessage] = useState<string>('');

  const { send } = useSendMessage();
  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);
  const otherParticipantFriendshipStatus = useChatStore(
    (state) => state.otherParticipantFriendshipStatus
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (newMessage.trim() !== '') {
        send(newMessage.trim());
        setNewMessage('');
      }
    }
  };

  useEffect(
    () => console.log(otherParticipantFriendshipStatus),
    [otherParticipantFriendshipStatus]
  );

  return (
    <div className="flex-3 flex flex-col justify-start gap-2 bg-white dark:bg-stone-900 rounded-xl">
      <div className="flex justify-between p-2 gap-3">
        <div className="flex gap-3">
          <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full ">
            <Image
              src={
                otherParticipantDetails?.profileImageUrl
                  ? otherParticipantDetails.profileImageUrl
                  : '/blank_picture.png'
              }
              alt="User avatar"
              fill
              sizes="96px" // Helps Next.js optimize the download size
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold">{otherParticipantDetails?.username}</h3>
            <div className="flex gap-1 items-center">
              <div className="bg-green-400 size-2 rounded-full"></div>
              <p className="">Active now</p>
            </div>
          </div>
        </div>

        <Button className="cursor-pointer" onClick={onToggle}>
          <Icon icon="bi:three-dots" />
        </Button>
      </div>

      <MessageThread />

      <div className="flex gap-2 px-2 my-2 items-end">
        <InputGroup className="flex-1 shrink-0">
          <InputGroupTextarea
            placeholder={
              otherParticipantFriendshipStatus !== 'accepted'
                ? `You aren't friends with ${otherParticipantDetails?.username} anymore. This conversation is read-only.`
                : 'Type your message...'
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-8.5 max-h-40 overflow-y-auto py-2 px-3"
            disabled={otherParticipantFriendshipStatus !== 'accepted'}
          />
        </InputGroup>

        <Button
          className="cursor-pointer h-9.5"
          onClick={() => (send(newMessage.trim()), setNewMessage(''))}
          disabled={newMessage.trim() === '' || otherParticipantFriendshipStatus !== 'accepted'}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
