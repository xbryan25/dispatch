'use client';

import RegisterForm from '@/components/registerForm';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <RegisterForm />
    </div>
  );
}
