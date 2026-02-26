'use client';

import LoginForm from '@/components/loginForm';
import GuestHeader from '@/components/guestHeader';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans p-10">
      <GuestHeader />
      <LoginForm />
    </div>
  );
}
