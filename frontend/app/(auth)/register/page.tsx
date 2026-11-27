import type { Metadata } from 'next';

import { authPageClass } from '@/components/auth/authClasses';
import RegisterForm from '@/components/auth/registerForm';
import GuestHeader from '@/components/shared/guestHeader';

export const metadata: Metadata = { title: 'Create your account' };

export default function RegisterPage() {
  return (
    <div className={authPageClass}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <GuestHeader />
        <RegisterForm />
      </div>
    </div>
  );
}
