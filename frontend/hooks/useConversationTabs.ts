'use client';

import { useState, useEffect } from 'react';
import { getUserConversationsList } from '@/lib/api/messages';

import { ConversationSnippet } from '@/types/chat';

export function useConversationTabs() {
  const [conversations, setConversations] = useState<ConversationSnippet[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConversations = async () => {
    setLoading(true);
    try {
      const data = await getUserConversationsList();

      console.log(data);

      setConversations(data.conversations);

      return { error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  return { conversations, loading, error };
}
