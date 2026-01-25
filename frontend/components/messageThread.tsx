'use client';

import UserMessage from './userMessage';

export default function MessageThread() {
  return (
    <div className="flex-1 flex flex-col py-2 px-2 gap-3 overflow-y-auto">
      <UserMessage
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

      <UserMessage messageType="others" breakMessage content="Why are you repeating what I said?" />
    </div>
  );
}
