import { SortState } from '@/types/global';
import { Notification, ReadState, ReadStateForSelect } from '@/types/notifications';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function getUserNotifications(
  readState: ReadStateForSelect,
  sortState: SortState,
  page: number,
  limit: number
) {
  const res = await fetch(
    `${fastapiServerUrl}/api/notifications?read_state=${readState}&sort_state=${sortState}&page=${page}&limit=${limit}`,
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

export async function updateNotificationReadStatus(
  notificationIds: string[],
  readState: ReadState
) {
  const res = await fetch(`${fastapiServerUrl}/api/notifications/read-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notificationIds, readState }),
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
