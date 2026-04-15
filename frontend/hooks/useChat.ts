import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';

import { toast } from 'sonner';

import { themes } from '@/lib/themes';

import {
  sendMessage,
  getPastMessagesFromConversation,
  getOtherParticipantFromConversation,
  createDirectMessage,
  updateConversationTheme,
  getConversationTheme,
  markConversationAsRead,
} from '@/lib/api/messages';
import { useNotificationsStore } from '@/store/useNotificationsStore';

const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRateLimited, setIsRateLimited] = useState(false);

  const activeConversationId = useChatStore((state) => state.activeConversationId);

  const send = async (content: string, tempMessageId: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendMessage(content, tempMessageId, activeConversationId);
      return { error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimited(true);

        setTimeout(() => setIsRateLimited(false), 60000);

        return { error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error, isRateLimited };
}

export function useGetPastMessagesFromConversation() {
  const [localIsInitialLoad, setLocalIsInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setIsGetting, setIsInitialLoad, prependPastMessages } = useChatStore();

  const getPastMessages = async (conversationId: string) => {
    // put this here??
    const { messages, isInitialLoad } = useChatStore.getState();

    setIsGetting(true);

    setLoading(true);
    setError(null);
    try {
      const query = `${conversationId}${messages[0]?.createdAt ? `?beforeDatetime=${messages[0].createdAt}` : ''}`;

      const data = await getPastMessagesFromConversation(query);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }

      prependPastMessages(data.pastMessages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsGetting(false);
      setLoading(false);

      if (!localIsInitialLoad) {
        setLocalIsInitialLoad(true);
      }
    }
  };

  return { getPastMessages, localIsInitialLoad, loading, error };
}

export function useGetOtherParticipantFromConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsGettingOtherParticipant = useChatStore((state) => state.setIsGettingOtherParticipant);

  const setOtherParticipantDetails = useChatStore((state) => state.setOtherParticipantDetails);

  const getOtherParticipant = async (conversationId: string) => {
    // put this here??
    setIsGettingOtherParticipant(true);

    setLoading(true);
    setError(null);

    try {
      if (conversationId) {
        const data = await getOtherParticipantFromConversation(conversationId);

        setOtherParticipantDetails(data);
      } else {
        throw Error('No conversation ID');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsGettingOtherParticipant(false);
      setLoading(false);
    }
  };

  return { getOtherParticipant, loading, error };
}

export function useCreateDirectMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewDirectMessage = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data: { conversationId: string; conversationIdType: 'existing' | 'new' } =
        await createDirectMessage(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { createNewDirectMessage, loading, error };
}

export function useGetConversationTheme() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setConversationTheme = useChatStore((state) => state.setConversationTheme);
  const setConversationThemeChangedAt = useChatStore(
    (state) => state.setConversationThemeChangedAt
  );
  const setConversationThemeChangedBy = useChatStore(
    (state) => state.setConversationThemeChangedBy
  );

  const getActiveConversationTheme = async (conversationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data: { theme: string; changedBy: string; changedAt: Date } =
        await getConversationTheme(conversationId);

      setConversationTheme(data.theme);
      setConversationThemeChangedAt(new Date(data.changedAt));
      setConversationThemeChangedBy(data.changedBy);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { getActiveConversationTheme, loading, error };
}

export function useUpdateConversationTheme() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRateLimited, setIsRateLimited] = useState(false);

  const setConversationTheme = useChatStore((state) => state.setConversationTheme);
  const setConversationThemeChangedAt = useChatStore(
    (state) => state.setConversationThemeChangedAt
  );
  const setConversationThemeChangedBy = useChatStore(
    (state) => state.setConversationThemeChangedBy
  );

  const changeConversationTheme = async (conversationId: string, theme: string) => {
    setLoading(true);
    setError(null);

    try {
      const data: { theme: string; changedBy: string; changedAt: Date } =
        await updateConversationTheme(conversationId, theme);

      setConversationTheme(data.theme);
      setConversationThemeChangedAt(new Date(data.changedAt));
      setConversationThemeChangedBy(data.changedBy);
      return { error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimited(true);

        setTimeout(() => setIsRateLimited(false), 60000);

        return { error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { changeConversationTheme, loading, error, isRateLimited };
}

export function useMarkConversationAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (conversationId: string) => {
    setLoading(true);
    setError(null);

    try {
      await markConversationAsRead(conversationId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { markAsRead, loading, error };
}

export const useInitializeWebsocket = () => {
  const clearChat = useChatStore((state) => state.clearChat);

  const addMessage = useChatStore((state) => state.addMessage);

  const setSocket = useChatStore((state) => state.setSocket);

  const setOtherParticipantFriendshipStatus = useChatStore(
    (state) => state.setOtherParticipantFriendshipStatus
  );

  const setConversationTheme = useChatStore((state) => state.setConversationTheme);

  const setConversationThemeChangedBy = useChatStore(
    (state) => state.setConversationThemeChangedBy
  );

  const setConversationThemeChangedAt = useChatStore(
    (state) => state.setConversationThemeChangedAt
  );

  const setOtherParticipantIsOnline = useChatStore((state) => state.setOtherParticipantIsOnline);

  const setOtherParticipantLastOnline = useChatStore(
    (state) => state.setOtherParticipantLastOnline
  );

  const setOtherParticipantLastReadMessageId = useChatStore(
    (state) => state.setOtherParticipantLastReadMessageId
  );

  const setOtherParticipantLastReadMessageAt = useChatStore(
    (state) => state.setOtherParticipantLastReadMessageAt
  );

  const removeSendingMessage = useChatStore((state) => state.removeSendingMessage);

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const upsertSnippet = useSidebarStore((state) => state.upsertSnippet);

  const updateHasSeenLatestMessage = useSidebarStore((state) => state.updateHasSeenLatestMessage);

  const getNotifications = useNotificationsStore((state) => state.getNotifications);

  const { markAsRead } = useMarkConversationAsRead();

  useEffect(() => {
    if (!currentUserId) return;

    // Start new connection
    const ws = new WebSocket(`${fastapiWebsocketUrl}/api/websocket/ws`);

    ws.onopen = () => {
      console.log('Connected to:', currentUserId);
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);

      // getState() is used because onmessage is a callback function
      const latestActiveConversationId = useChatStore.getState().activeConversationId;

      if (eventData.type === 'NEW_MESSAGE') {
        if (eventData.data.conversationId === latestActiveConversationId) {
          addMessage(eventData.data);

          if (eventData.data.senderId === currentUserId) {
            removeSendingMessage(eventData.data.tempMessageId);
          } else if (latestActiveConversationId) {
            markAsRead(latestActiveConversationId);
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
  ]);
};
