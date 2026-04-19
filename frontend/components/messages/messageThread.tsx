'use client';

import { useEffect, useRef, useMemo } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';

import UserMessage from '@/components/messages/userMessage';
import LoadingSpinner from '@/components/shared/loadingSpinner';

import { DateFormatters } from '@/types/chat';

import { themes } from '@/lib/themes';

export default function MessageThread() {
  const messages = useChatStore((state) => state.messages);
  const sendingMessages = useChatStore((state) => state.sendingMessages);
  const failedMessages = useChatStore((state) => state.failedMessages);

  const pendingMessages = useMemo(() => {
    return [...sendingMessages, ...failedMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [sendingMessages, failedMessages]);

  useEffect(() => {
    console.log(failedMessages);
  }, [failedMessages]);

  const hasMorePastMessages = useChatStore((state) => state.hasMorePastMessages);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isInitialLoad = useChatStore((state) => state.isInitialLoad);
  const getPastMessagesLoading = useChatStore((state) => state.getPastMessagesLoading);

  const activeConversationThemeId = useChatStore((state) => state.conversationTheme);
  const activeConversationTheme =
    themes.find((theme) => theme.id == activeConversationThemeId) ?? themes[0];

  const getPastMessages = useChatStore((state) => state.getPastMessages);

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const topSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const previousHeightRef = useRef(0);

  const dateFormatters: Record<DateFormatters, Intl.DateTimeFormat> = {
    hour: new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    currentWeek: new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }),
    later: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateStr: string): string => {
    const startDate = new Date(dateStr).getTime();
    const formattedDate = dateFormatters['later'].format(startDate);

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
  }, [messages, sendingMessages, failedMessages, activeConversationId]);

  useEffect(() => {
    // This useEffect activates getPastMessagesFromConversation() when sentinel is shown in viewport
    const container = containerRef.current;

    if (!hasMorePastMessages || getPastMessagesLoading || !activeConversationId || !container)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          activeConversationId &&
          !isInitialLoad &&
          hasMorePastMessages &&
          container.scrollHeight > container.clientHeight
        ) {
          previousHeightRef.current = container.scrollHeight;
          getPastMessages(activeConversationId);
        }
      },
      { threshold: 0.5 }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [
    hasMorePastMessages,
    getPastMessagesLoading,
    activeConversationId,
    getPastMessages,
    isInitialLoad,
    messages,
  ]);

  useEffect(() => {
    // This useEffect readjusts the position of the container when old messages are added

    const container = containerRef.current;

    if (container && !getPastMessagesLoading && previousHeightRef.current > 0) {
      const newHeight = container.scrollHeight;
      const jump = newHeight - previousHeightRef.current;

      if (jump > 0) {
        container.scrollTop = jump;
      }

      previousHeightRef.current = 0;
    }
  }, [messages.length, getPastMessagesLoading]);

  if (messages.length == 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1 className="font-semibold text-2xl">No messages yet. Say hello! 👋</h1>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 flex flex-col py-2 px-2 gap-3 overflow-y-auto">
      {!hasMorePastMessages && messages.length > 0 && (
        <div className="flex justify-center py-2">
          <p className="font-medium">
            Your conversation with Bryan Agan started here ({formatDate(messages[0].createdAt)}).
          </p>
        </div>
      )}

      {getPastMessagesLoading && <LoadingSpinner />}

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
            messageId={message.messageId}
            messageType={isMe ? 'sender' : 'others'}
            messageState="sent"
            senderId={message.senderId}
            breakMessage={isLastInCluster ? true : false}
            content={message.content}
            createdAt={message.createdAt}
            dateFormatters={dateFormatters}
            username={message.username}
            activeConversationTheme={activeConversationTheme}
          />
        );
      })}

      {pendingMessages.map((tempMessage) => {
        return (
          <UserMessage
            key={tempMessage.tempMessageId}
            messageId={tempMessage.tempMessageId}
            messageType="sender"
            messageState={tempMessage.status}
            senderId=""
            breakMessage={false}
            content={tempMessage.content}
            createdAt={tempMessage.createdAt}
            dateFormatters={dateFormatters}
            username=""
            activeConversationTheme={activeConversationTheme}
          />
        );
      })}

      {/* Bottom sentinel */}
      <div ref={messagesEndRef} className="h-5" />
    </div>
  );
}
