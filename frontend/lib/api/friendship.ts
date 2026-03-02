const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function getCurrentFriends() {
  const res = await fetch(`${fastapiServerUrl}/api/friends/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when retrieving your current friends.');
  return res.json();
}
