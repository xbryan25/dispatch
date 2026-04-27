import { SortState } from '@/types/global';
import { ReadState, ReadStateForSelect } from '@/types/notifications';

import { supabase } from '@/lib/supabase/client';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function getUserNotifications(
  readState: ReadStateForSelect,
  sortState: SortState,
  page: number,
  limit: number
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(
    `${fastapiServerUrl}/api/notifications?read_state=${readState}&sort_state=${sortState}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/notifications/read-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ notificationIds, readState }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when trying to update the read status.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function bulkDeleteNotifications(notificationIds: string[]) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) return null;

  const res = await fetch(`${fastapiServerUrl}/api/notifications/bulk`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ notificationIds }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = new Error(
      'Something went wrong when trying to delete multiple notifications.'
    ) as Error & {
      status: number;
    };
    error.status = res.status;
    throw error;
  }

  return res.json();
}
