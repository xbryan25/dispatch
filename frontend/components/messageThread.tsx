'use client';
import UserMessage from './userMessage';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useGetPastMessagesFromConversation } from '@/hooks/useChat';
import LoadingSpinner from './loadingSpinner';

export default function MessageThread() {
  const { messages, hasMorePastMessages, activeConversationId, isInitialLoad, isGetting } =
    useChatStore();

  const { getPastMessages } = useGetPastMessagesFromConversation();

  const { currentUserId } = useAuthStore();

  const topSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const previousHeightRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateStr: string): string => {
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    return formattedDate;
  };

  useEffect(() => {
    // This useEffect activates scrolls container div to the bottom whenever activeConversationId changes
    if (containerRef.current) {
      const container = containerRef.current;

      // Smooth scroll for a nice feel, or 'instant' for immediate jump
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });

      console.log('something happened!');
    }
  }, [activeConversationId]);

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
        console.log(`isInitialLoad: ${isInitialLoad}`);

        if (entries[0].isIntersecting && activeConversationId && !isInitialLoad) {
          previousHeightRef.current = container.scrollHeight;
          getPastMessages();
        }
      },
      { threshold: 0.5 }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMorePastMessages, isGetting, activeConversationId, getPastMessages, isInitialLoad]);

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

  useEffect(() => {
    console.log('UI RENDER - isGetting is:', isGetting);
  }, [isGetting]);
  return (
    <div ref={containerRef} className="flex-1 flex flex-col py-2 px-2 gap-3 overflow-y-auto">
      {!hasMorePastMessages && messages.length > 0 && (
        <div className="flex justify-center py-2">
          <p className="font-medium">
            Your conversation with Bryan Agan started here ({formatDate(messages[0].createdAt)}).
          </p>
        </div>
      )}

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
