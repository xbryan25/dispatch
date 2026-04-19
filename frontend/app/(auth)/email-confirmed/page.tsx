'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function EmailConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash; // includes everything after #

    if (hash.includes('error_code=otp_expired') || hash.includes('error_code=access_denied')) {
      // Redirect to resend page
      window.history.replaceState(null, '', window.location.pathname);

      router.replace('/resend-confirmation-email');
      return;
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-10 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="font-semibold text-4xl">Email confirmation successful</h1>

      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center">
          <p>Your email has been successfully confirmed. </p>
          <p>Welcome to Dispatch.</p>
        </div>
        <Link href="/login" className="cursor-pointer font-semibold hover:underline">
          Go to Login page
        </Link>
      </div>
    </div>
  );
}
