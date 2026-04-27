import { supabase } from '@/lib/supabase/client';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

let controller: AbortController | null = null;

export async function getUserConversationsList() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/messages/conversations`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('Something went wrong when retrieving conversations.') as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function sendMessage(
  content: string,
  tempMessageId: string,
  activeConversationId: string | null
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content, tempMessageId, conversationId: activeConversationId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('Something went wrong when sending a message.') as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getPastMessagesFromConversation(query: string) {
  if (controller) controller.abort();
  controller = new AbortController();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  try {
    const res = await fetch(`${fastapiServerUrl}/api/messages/${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      credentials: 'include',
    });

    if (!res.ok) {
      const error = new Error('Something went wrong when retrieving past messages.') as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (err: unknown) {
    if (err == 'AbortError') return; // Silently ignore cancellations
    throw err;
  }
}

export async function getOtherParticipantFromConversation(conversationId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/messages/${conversationId}/other-participant`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving the information of the other user.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function createDirectMessage(targetUserId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/messages/new-direct-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ targetUserId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when creating a direct message conversation.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getConversationTheme(conversationId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(
    `${fastapiServerUrl}/api/messages/theme?conversation_id=${conversationId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving the conversation theme.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function updateConversationTheme(conversationId: string, theme: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/messages/update-theme`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conversationId, theme }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when updating the conversation theme.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function markConversationAsRead(conversationId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/messages/mark-as-read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conversationId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when creating marking conversation as read.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}
