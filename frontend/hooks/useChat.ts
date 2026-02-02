import { useState, useEffect, useRef } from 'react';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;
const fastapiWebsocketUrl = process.env.NEXT_PUBLIC_FASTAPI_WEBSOCKET_URL;

export const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${fastapiWebsocketUrl}/messages/ws`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.conversation_id === conversationId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [conversationId]);

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
