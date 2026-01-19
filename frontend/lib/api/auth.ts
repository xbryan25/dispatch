const fastapiServerUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER_URL;

export async function checkIfUsernameIsTaken(username: string) {
  const res = await fetch(
    `${fastapiServerUrl}/api/auth/check-username?username=${encodeURIComponent(username)}`
  );

  if (!res.ok) throw new Error('Something went wrong when checking for username availability.');
  return res.json();
}
