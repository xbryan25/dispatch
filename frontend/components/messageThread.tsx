'use client';
import UserMessage from './userMessage';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';

export default function MessageThread() {
  const { messages } = useChatStore();

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
