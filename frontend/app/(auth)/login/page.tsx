import type { Metadata } from 'next';

import { authPageClass } from '@/components/auth/authClasses';
import LoginForm from '@/components/auth/loginForm';
import GuestHeader from '@/components/shared/guestHeader';

export const metadata: Metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <div className={authPageClass}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <GuestHeader />
        <LoginForm />
      </div>
    </div>
  );
}
