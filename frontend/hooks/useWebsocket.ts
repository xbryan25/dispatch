import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { themes } from '@/lib/themes';

const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export const useInitializeWebsocket = () => {
  const {
    clearChat,
    addMessage,
    setSocket,
    setOtherParticipantFriendshipStatus,
    setConversationTheme,
    setConversationThemeChangedBy,
    setConversationThemeChangedAt,
    setOtherParticipantIsOnline,
    setOtherParticipantLastOnline,
    setOtherParticipantLastReadMessageId,
    setOtherParticipantLastReadMessageAt,
    removeSendingMessage,
    markAsRead,
  } = useChatStore();

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const { upsertSnippet, updateHasSeenLatestMessage } = useSidebarStore();

  const getNotifications = useNotificationsStore((state) => state.getNotifications);

  useEffect(() => {
    if (!currentUserId) return;

    // Start new connection
    const ws = new WebSocket(`${fastapiWebsocketUrl}/api/websocket/ws`);

    ws.onopen = () => {
      console.log('Connected to:', currentUserId);
    };

    ws.onmessage = async (event) => {
      const eventData = JSON.parse(event.data);

      // getState() is used because onmessage is a callback function
      const latestActiveConversationId = useChatStore.getState().activeConversationId;

      if (eventData.type === 'NEW_MESSAGE') {
        if (eventData.data.conversationId === latestActiveConversationId) {
          addMessage(eventData.data);

          if (eventData.data.senderId === currentUserId) {
            removeSendingMessage(eventData.data.tempMessageId);
          } else if (latestActiveConversationId) {
            await markAsRead(latestActiveConversationId);
          }
        }
        upsertSnippet(eventData.data);
      } else if (eventData.type === 'UPDATE_CONVERSATION') {
        setOtherParticipantFriendshipStatus(eventData.data.friendshipStatus);

        const isViewingConversations = useChatStore.getState().activeConversationId != null;

        if (eventData.data.friendshipStatus === 'accepted') {
          toast.success(
            `You are now friends with ${eventData.data.otherParticipantUsername} again. ${isViewingConversations ? 'You can now send messages to each other.' : ''}`
          );
        } else {
          toast.info(
            `${eventData.data.otherParticipantUsername} has unfriended you. ${isViewingConversations ? 'Your conversation with them is set to read-only.' : ''}`
          );
        }
      } else if (eventData.type == 'NEW_THEME') {
        setConversationTheme(eventData.data.theme);
        setConversationThemeChangedBy(eventData.data.changedBy);
        setConversationThemeChangedAt(new Date(eventData.data.changedAt));

        const selectedTheme = themes.find((theme) => theme.id == eventData.data.theme);

        toast.success(
          `The theme for this conversation has recently been set to ${selectedTheme?.label} by ${eventData.data.changedBy}.`
        );
      } else if (eventData.type === 'USER_ONLINE') {
        setOtherParticipantIsOnline(eventData.data.isOnline);
      } else if (eventData.type === 'USER_OFFLINE') {
        setOtherParticipantIsOnline(eventData.data.isOnline);

        if (eventData.data.lastOnline) {
          const date = new Date(eventData.data.lastOnline);
          setOtherParticipantLastOnline(date);
        } else {
          setOtherParticipantLastOnline(null);
        }
      } else if (eventData.type === 'MESSAGE_SEEN') {
        updateHasSeenLatestMessage(
          eventData.data.conversationId,
          eventData.data.hasSeenLatestMessage,
          eventData.data.latestMessageSenderId
        );

        setOtherParticipantLastReadMessageId(eventData.data.lastReadMessageId);

        if (eventData.data.lastReadMessageAt) {
          const date = new Date(eventData.data.lastReadMessageAt);
          setOtherParticipantLastReadMessageAt(date);
        } else {
          setOtherParticipantLastReadMessageAt(null);
        }
      } else if (eventData.type === 'NEW_NOTIFICATION') {
        getNotifications(false, true);
      }
    };

    clearChat();

    setSocket(ws);

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000);

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        console.log('Cleaning up connection for:', currentUserId);
        ws.close();
      }

      clearInterval(interval);
    };
  }, [
    currentUserId,
    setSocket,
    addMessage,
    clearChat,
    upsertSnippet,
    setOtherParticipantFriendshipStatus,
    setConversationTheme,
    setConversationThemeChangedAt,
    setConversationThemeChangedBy,
    setOtherParticipantIsOnline,
    setOtherParticipantLastOnline,
    updateHasSeenLatestMessage,
    setOtherParticipantLastReadMessageAt,
    setOtherParticipantLastReadMessageId,
    removeSendingMessage,
  ]);
};
