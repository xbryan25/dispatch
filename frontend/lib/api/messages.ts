const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

let controller: AbortController | null = null;

export async function getUserConversationsList() {
  const res = await fetch(`${fastapiServerUrl}/api/messages/conversations`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when retrieving conversations.');
  return res.json();
}

export async function sendMessage(content: string, activeConversationId: string | null) {
  const res = await fetch(`${fastapiServerUrl}/api/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, conversation_id: activeConversationId }),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when sending a message.');
  return res.json();
}

export async function getPastMessagesFromConversation(query: string) {
  if (controller) controller.abort();
  controller = new AbortController();

  try {
    const res = await fetch(`${fastapiServerUrl}/api/messages/${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Something went wrong when retrieving past messages.');
    return res.json();
  } catch (err: unknown) {
    if (err == 'AbortError') return; // Silently ignore cancellations
    throw err;
  }
}

export async function getOtherParticipantFromConversation(conversationId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/messages/${conversationId}/other-participant`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when retrieving past messages.');
  return res.json();
}
