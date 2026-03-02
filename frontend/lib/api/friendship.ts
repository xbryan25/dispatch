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

export async function getSentRequestsProfile() {
  const res = await fetch(`${fastapiServerUrl}/api/friends/sent`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok)
    throw new Error('Something went wrong when retrieving the profiles of sent requests.');
  return res.json();
}

export async function getReceivedRequestsProfile() {
  const res = await fetch(`${fastapiServerUrl}/api/friends/received`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok)
    throw new Error('Something went wrong when retrieving the profiles of received requests.');
  return res.json();
}

export async function getFormerFriends() {
  const res = await fetch(`${fastapiServerUrl}/api/friends/former`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok)
    throw new Error('Something went wrong when retrieving the profiles of former friends.');
  return res.json();
}

export async function getFriendSuggestions() {
  const res = await fetch(`${fastapiServerUrl}/api/friends/suggestions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when retrieving the profiles other users.');
  return res.json();
}
