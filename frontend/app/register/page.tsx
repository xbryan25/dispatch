'use client';

import GuestHeader from '@/components/guestHeader';
import RegisterForm from '@/components/registerForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans p-10">
      <GuestHeader />
      <RegisterForm />
    </div>
  );
}
