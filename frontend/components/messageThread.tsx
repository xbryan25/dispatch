'use client';
import UserMessage from './userMessage';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useChat } from '@/hooks/useChat';
import LoadingSpinner from './loadingSpinner';

export default function MessageThread() {
  const { messages, hasMorePastMessages, activeConversationId } = useChatStore();
  const { getPastMessagesFromConversation, isGetting } = useChat();

  const { currentUserId } = useAuthStore();

  const topSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const previousHeightRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // This useEffect activates scrolls senders and receivers of messages to the bottom of a screen until a certain threshold
    if (!activeConversationId) return;

    const container = containerRef.current;

    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 350;

    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, activeConversationId]);

  useEffect(() => {
    // This useEffect activates getPastMessagesFromConversation() when sentinel is shown in viewport
    const container = containerRef.current;

    if (!hasMorePastMessages || isGetting || !activeConversationId || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && activeConversationId) {
          previousHeightRef.current = container.scrollHeight;
          getPastMessagesFromConversation();
        }
      },
      { threshold: 0.5 }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMorePastMessages, isGetting, activeConversationId, getPastMessagesFromConversation]);

  useEffect(() => {
    // This useEffect readjusts the position of the container when old messages are added

    const container = containerRef.current;

    if (container && !isGetting && previousHeightRef.current > 0) {
      const newHeight = container.scrollHeight;
      const jump = newHeight - previousHeightRef.current;

      if (jump > 0) {
        container.scrollTop = jump;
      }

      previousHeightRef.current = 0;
    }
  }, [messages.length, isGetting]);
  return (
    <div ref={containerRef} className="flex-1 flex flex-col py-2 px-2 gap-3 overflow-y-auto">
      {isGetting && <LoadingSpinner />}

      {/* Top sentinel */}
      {hasMorePastMessages && activeConversationId && (
        <div ref={topSentinelRef} className="loading-spinner h-2.5" />
      )}

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

      {/* Bottom sentinel */}
      <div ref={messagesEndRef} className="h-5" />
    </div>
  );
}
