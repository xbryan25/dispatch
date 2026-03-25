const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function getCurrentFriends(sortState: string, searchQuery: string, page: number) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends?sort_state=${sortState}&search_query=${searchQuery}&page=${page}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving your current friends.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getSentRequestsProfile(sortState: string, searchQuery: string, page: number) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends/sent?sort_state=${sortState}&search_query=${searchQuery}&page=${page}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving the profiles of sent requests.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getReceivedRequestsProfile(
  sortState: string,
  searchQuery: string,
  page: number
) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends/received?sort_state=${sortState}&search_query=${searchQuery}&page=${page}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving the profiles of received requests.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getFormerFriends(sortState: string, searchQuery: string, page: number) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends/former?sort_state=${sortState}&search_query=${searchQuery}&page=${page}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving the profiles of former friends.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function getFriendSuggestions(sortState: string, searchQuery: string, page: number) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends/suggestions?sort_state=${sortState}&search_query=${searchQuery}&page=${page}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when retrieving the profiles other users.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function createNewFriendRequest(targetUserId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong wrong when creating a new friend request.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function cancelFriendRequest(targetUserId: string) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends/friend-request/cancel?target_user_id=${targetUserId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong wrong when cancelling the friend request.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function acceptFriendRequest(targetUserId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request/accept`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong wrong when accepting a new friend request.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function rejectFriendRequest(targetUserId: string) {
  const res = await fetch(
    `${fastapiServerUrl}/api/friends/friend-request/reject?target_user_id=${targetUserId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error(
      'Something went wrong wrong when rejecting a friend request.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function unfriendUser(targetUserId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/unfriend`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error('Something went wrong wrong when unfriending a user.') as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function reconnectToUser(targetUserId: string) {
  const res = await fetch(`${fastapiServerUrl}/api/friends/friend-request/reconnect`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when attempting to resend a friend request to a user.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}
