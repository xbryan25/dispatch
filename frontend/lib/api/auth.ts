import { UserProfileUpdate } from '@/types/auth';

const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function checkIfUsernameIsTaken(username: string) {
  const res = await fetch(
    `${fastapiServerUrl}/api/auth/check-username?username=${encodeURIComponent(username)}`
  );

  if (!res.ok) throw new Error('Something went wrong when checking for username availability.');
  return res.json();
}

export async function getCurrentUserId() {
  const res = await fetch(`${fastapiServerUrl}/api/auth/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when getting userId.');
  return res.json();
}

export async function getCurrentUserDetails() {
  const res = await fetch(`${fastapiServerUrl}/api/auth/user-details`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when getting user details.');
  return res.json();
}

export async function updateUserDetails(payload: UserProfileUpdate) {
  const dataToSend = {
    ...payload,
    dateOfBirth:
      payload.dateOfBirth instanceof Date
        ? payload.dateOfBirth.toISOString().split('T')[0]
        : payload.dateOfBirth,
  };

  const body = Object.fromEntries(
    Object.entries(dataToSend).map(([k, v]) => [k, v === '' ? null : v])
  );

  const res = await fetch(`${fastapiServerUrl}/api/auth/user-details`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Something went wrong when getting user details.');
  return res.json();
}
