'use client';

import { useState, useEffect } from 'react';
import { getUserConversationsList } from '@/lib/api/messages';

import { useSidebarStore } from '@/store/useSidebarStore';

export function useConversationTabs() {
  const { conversationSnippets, isLoading, setSnippets, setLoading } = useSidebarStore();
  const [error, setError] = useState<string | null>(null);

  const getConversations = async () => {
    setLoading(true);
    try {
      const data = await getUserConversationsList();

      setSnippets(data.conversations);

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

  return { conversationSnippets, isLoading, error };
}
