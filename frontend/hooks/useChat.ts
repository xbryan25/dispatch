import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Message } from '@/types/chat';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;
const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export const useChat = () => {
  const { messages, activeConversationId, setSocket, addMessage, prependPastMessages, clearChat } =
    useChatStore();
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

      let pastMessages: Message[] = [];

      const query = `${latestActiveConversationId}${messages[0] && messages[0].createdAt ? `?beforeDatetime=${messages[0].createdAt}` : ''}`;

      await fetch(`${fastapiServerUrl}/api/messages/${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then(async (data) => (pastMessages = (await data.json()).pastMessages));

      console.log(pastMessages);

      prependPastMessages(pastMessages);
    } catch (error) {
      console.error('Failed to retrieve messages:', error);
    } finally {
      setIsGetting(false);
    }
  };

  return { messages, sendMessage, getPastMessagesFromConversation, isSending, isGetting };
};
