import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Message } from '@/types/chat';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;
const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export const useChat = () => {
  const {
    messages,
    activeConversationId,
    setIsInitialLoad,
    setSocket,
    addMessage,
    prependPastMessages,
    clearChat,
  } = useChatStore();
  const { currentUserId } = useAuthStore();

  const { upsertSnippet } = useSidebarStore();

  const [isSending, setIsSending] = useState(false);
  const [isGetting, setIsGetting] = useState(false);

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

  const sendMessage = async (content: string) => {
    setIsSending(true);
    try {
      await fetch(`${fastapiServerUrl}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, conversation_id: activeConversationId }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getPastMessagesFromConversation = async () => {
    setIsGetting(true);
    try {
      const latestActiveConversationId = useChatStore.getState().activeConversationId;
      const latestMessages = useChatStore.getState().messages;
      const latestIsInitialLoad = useChatStore.getState().isInitialLoad;

      let pastMessages: Message[] = [];

      console.log(latestMessages);

      const query = `${latestActiveConversationId}${latestMessages[0] && latestMessages[0].createdAt ? `?beforeDatetime=${messages[0].createdAt}` : ''}`;

      console.log(query);

      await fetch(`${fastapiServerUrl}/api/messages/${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then(async (data) => (pastMessages = (await data.json()).pastMessages));

      console.log(latestIsInitialLoad);

      if (latestIsInitialLoad) {
        console.log('reach here');
        setIsInitialLoad(false);
      }

      prependPastMessages(pastMessages);
    } catch (error) {
      console.error('Failed to retrieve messages:', error);
    } finally {
      setIsGetting(false);
    }
  };

  return { messages, sendMessage, getPastMessagesFromConversation, isSending, isGetting };
};
