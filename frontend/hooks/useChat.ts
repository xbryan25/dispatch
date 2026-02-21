import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';

import {
  sendMessage,
  getPastMessagesFromConversation,
  getOtherParticipantFromConversation,
} from '@/lib/api/messages';

const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { activeConversationId } = useChatStore();

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setIsGetting, setIsInitialLoad, prependPastMessages } = useChatStore();

  const getPastMessages = async () => {
    // put this here??
    const { activeConversationId, messages, isInitialLoad } = useChatStore.getState();

    setIsGetting(true);

    setLoading(true);
    setError(null);
    try {
      const query = `${activeConversationId}${messages[0]?.createdAt ? `?beforeDatetime=${messages[0].createdAt}` : ''}`;

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
    }
  };

  return { getPastMessages, loading, error };
}

export function useGetOtherParticipantFromConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setIsGettingOtherParticipant, setOtherParticipantDetails } = useChatStore();

  const latestActiveConversationId = useChatStore.getState().activeConversationId;

  const getOtherParticipant = async () => {
    // put this here??
    setIsGettingOtherParticipant(true);

    setLoading(true);
    setError(null);
    try {
      if (latestActiveConversationId) {
        const data = await getOtherParticipantFromConversation(latestActiveConversationId);

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

export const useInitializeWebsocket = () => {
  const { setSocket, addMessage, clearChat } = useChatStore();

  const { currentUserId } = useAuthStore();

  const { upsertSnippet } = useSidebarStore();

  useEffect(() => {
    if (!currentUserId) return;

    // Start new connection
    const ws = new WebSocket(`${fastapiWebsocketUrl}/api/messages/ws`);

    ws.onopen = () => {
      console.log('Connected to:', currentUserId);
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);

      const latestActiveConversationId = useChatStore.getState().activeConversationId;

      if (eventData.type === 'NEW_MESSAGE') {
        if (eventData.data.conversationId === latestActiveConversationId) {
          addMessage(eventData.data);
        }
        upsertSnippet(eventData.data);
      }
    };

    clearChat();

    setSocket(ws);

    return () => {
      console.log('run onunmount');

      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        console.log('Cleaning up connection for:', currentUserId);
        ws.close();
      }
    };
  }, [currentUserId, setSocket, addMessage, clearChat, upsertSnippet]);
};
