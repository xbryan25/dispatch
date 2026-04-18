import { useState } from 'react';
import { useChatStore } from '@/store/useChatStore';

import {
  sendMessage,
  getPastMessagesFromConversation,
  getOtherParticipantFromConversation,
  createDirectMessage,
  updateConversationTheme,
  getConversationTheme,
  markConversationAsRead,
} from '@/lib/api/messages';

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
