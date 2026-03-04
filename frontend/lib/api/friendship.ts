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

export async function createNewFriendRequest(receiverId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId }),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when creating a new friend request.');
  return res.json();
}

export async function cancelFriendRequest(receiverId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request/${receiverId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when deleting the friend request.');
  return res.json();
}

export async function acceptFriendRequest(senderId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId }),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when accepting a new friend request.');
  return res.json();
}

export async function rejectFriendRequest(senderId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request/reject/${senderId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when rejecting a friend request.');
  return res.json();
}
