const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function getUserNotifications(sortState: string, page: number, limit: number) {
  const res = await fetch(
    `${fastapiServerUrl}/api/notifications?sort_state=${sortState}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );

  if (!res.ok) {
    const error = new Error('Something went wrong when retrieving notifications.') as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}
