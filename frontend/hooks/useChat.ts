import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;
const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export const useChat = (conversationId: string) => {
  const { messages, setSocket, addMessage } = useChatStore();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    // Start new connection
    const ws = new WebSocket(`${fastapiWebsocketUrl}/api/messages/ws/${conversationId}`);

    ws.onopen = () => {
      console.log('Connected to:', conversationId);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addMessage(data);
    };

    setSocket(ws, conversationId);

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        console.log('Cleaning up connection for:', conversationId);
        ws.close();
      }
    };
  }, [conversationId, setSocket, addMessage]);

  const sendMessage = async (content: string) => {
    setIsSending(true);
    try {
      await fetch(`${fastapiServerUrl}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, conversation_id: conversationId }),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, isSending };
};
