const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function getUserConversationsList() {
  const res = await fetch(`${fastapiServerUrl}/api/messages/conversations`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when retrieving conversations.');
  return res.json();
}
