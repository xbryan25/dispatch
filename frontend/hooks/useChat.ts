import { useState, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;
const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export const useChat = (conversationId: string) => {
  const { messages, socket, activeId, setSocket, addMessage, clearChat } = useChatStore();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    // Don't do anything if already connected in this conversation
    if (socket && activeId === conversationId) return;

    // Close the connection of the old conversation if connected to a different conversation
    if (socket && activeId !== conversationId) {
      socket.close();
    }

    // Start new connection
    const ws = new WebSocket(`${fastapiWebsocketUrl}/messages/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addMessage(data);
    };

    setSocket(ws, conversationId);

    return () => {};
  }, [conversationId, socket, activeId, setSocket, addMessage]);

  const sendMessage = async (content: string) => {
    setIsSending(true);
    try {
      await fetch(`${fastapiServerUrl}/messages/send`, {
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
