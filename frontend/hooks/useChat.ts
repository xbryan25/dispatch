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

const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversationId = useChatStore((state) => state.activeConversationId);

  const send = async (content: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendMessage(content, activeConversationId);
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

  return { send, loading, error };
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
        console.log(`here ${conversationId}`);
        const data = await getOtherParticipantFromConversation(conversationId);

        console.log(data);

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

  return { changeConversationTheme, loading, error };
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

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const upsertSnippet = useSidebarStore((state) => state.upsertSnippet);

  const { markAsRead } = useMarkConversationAsRead();

  useEffect(() => {
    if (!currentUserId) return;

    // Start new connection
    const ws = new WebSocket(`${fastapiWebsocketUrl}/api/messages/ws`);

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

          if (latestActiveConversationId) markAsRead(latestActiveConversationId);
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
        console.log(eventData);
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
  ]);
};
