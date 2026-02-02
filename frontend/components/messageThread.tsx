'use client';

import { useChat } from '@/hooks/useChat';
import UserMessage from './userMessage';

import { useEffect } from 'react';

export default function MessageThread() {
  const { messages } = useChat('a9c6a2eb-872f-48da-a922-e4749092c75e');

  useEffect(() => {
    console.log('Messages updated in state:', messages);
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col py-2 px-2 gap-3 overflow-y-auto">
      {messages.map((message) => (
        <UserMessage
          key={message.messageId}
          messageType="others"
          breakMessage
          content={message.content}
        />
      ))}

      {/* <UserMessage
        messageType="others"
        breakMessage
        content="The quick brown fox jumps over the lazy dog."
      />

      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />

      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="others" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage
        messageType="others"
        breakMessage
        content="The quick brown fox jumps over the lazy dog."
      />

      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />
      <UserMessage messageType="sender" content="The quick brown fox jumps over the lazy dog." />

      <UserMessage messageType="others" breakMessage content="Why are you repeating what I said?" /> */}
    </div>
  );
}
