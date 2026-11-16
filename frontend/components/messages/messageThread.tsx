'use client';

import { Hand } from 'lucide-react';
import { useEffect, useRef, useMemo } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';

import UserMessage from '@/components/messages/userMessage';
import { Spinner } from '@/components/ui/spinner';

import { DateFormatters } from '@/types/chat';

import { themes } from '@/lib/themes';

export default function MessageThread() {
  const messages = useChatStore((state) => state.messages);
  const sendingMessages = useChatStore((state) => state.sendingMessages);
  const failedMessages = useChatStore((state) => state.failedMessages);

  const hasMorePastMessages = useChatStore((state) => state.hasMorePastMessages);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isInitialLoad = useChatStore((state) => state.isInitialLoad);
  const getPastMessagesLoading = useChatStore((state) => state.getPastMessagesLoading);

  const activeConversationThemeId = useChatStore((state) => state.conversationTheme);
  const activeConversationTheme =
    themes.find((theme) => theme.id == activeConversationThemeId) ?? themes[0];

  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const { getPastMessages } = useChatStore();

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const pendingMessages = useMemo(() => {
    return [...sendingMessages, ...failedMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [sendingMessages, failedMessages]);

  const topSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const previousHeightRef = useRef(0);

  // Created once so components depending on it don't re-run their effects every render.
  const dateFormatters: Record<DateFormatters, Intl.DateTimeFormat> = useMemo(
    () => ({
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
    }),
    []
  );

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
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 px-8 py-10 text-center dark:border-stone-700">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <Hand className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            No messages yet
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Say hello! 👋</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
      {!hasMorePastMessages && messages.length > 0 && (
        <div className="flex justify-center pb-4">
          <p className="rounded-full bg-stone-100 px-3 py-1 text-center text-xs font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            Your conversation with {otherParticipantDetails?.username} started here (
            {formatDate(messages[0].createdAt)}).
          </p>
        </div>
      )}

      {getPastMessagesLoading && (
        <div className="flex justify-center py-2 text-stone-400">
          <Spinner />
        </div>
      )}

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
