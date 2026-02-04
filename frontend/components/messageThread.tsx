'use client';

import { useChat } from '@/hooks/useChat';
import UserMessage from './userMessage';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export default function MessageThread() {
  const { messages } = useChat('a9c6a2eb-872f-48da-a922-e4749092c75e');

  const { currentUserId } = useAuthStore();

  useEffect(() => {
    console.log('Messages updated in state:', messages);
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col py-2 px-2 gap-3 overflow-y-auto">
      {messages.map((message, index) => {
        const isLastInList = index === messages.length - 1;

        const nextMessage = messages[index + 1];
        const isLastInCluster = isLastInList || nextMessage.senderId !== message.senderId;

        const isMe = message.senderId === currentUserId;

        return (
          <UserMessage
            key={message.messageId}
            messageType={isMe ? 'sender' : 'others'}
            breakMessage={isLastInCluster ? true : false}
            content={message.content}
          />
        );
      })}
    </div>
  );
}
