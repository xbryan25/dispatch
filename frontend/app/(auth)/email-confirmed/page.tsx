'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authMainClass, authPageClass, authSubmitClass } from '@/components/auth/authClasses';
import GuestHeader from '@/components/shared/guestHeader';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { supabase } from '@/lib/supabase/client';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const errorCode = hashParams.get('error_code');

      if (errorCode === 'otp_expired' || errorCode === 'access_denied') {
        window.history.replaceState(null, '', window.location.pathname);
        router.replace('/resend-confirmation-email');
        return;
      }

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (error || !user?.email_confirmed_at) {
          router.replace('/login');
          return;
        }

        setIsConfirmed(true);
      } catch {
        if (!cancelled) router.replace('/login');
      }
    };

    void checkConfirmation();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className={authPageClass}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <GuestHeader />
        <main className={authMainClass}>
          {isConfirmed ? (
            <section aria-labelledby="confirmed-heading" className="w-full max-w-sm">
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <Icon icon="lucide:circle-check" className="size-4" aria-hidden="true" />
                Email confirmed
              </p>
              <h1
                id="confirmed-heading"
                className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
              >
                You’re all set
              </h1>
              <p className="mt-3 text-pretty leading-7 text-muted-foreground">
                Your account is ready. Add a friend to start your first conversation.
              </p>

              <Button asChild className={`mt-9 ${authSubmitClass}`}>
                <Link href="/friends">Find your friends</Link>
              </Button>
            </section>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-3 self-start text-sm font-medium text-muted-foreground"
            >
              <Spinner className="size-5 text-indigo-600 dark:text-indigo-400" />
              <p>Checking your confirmation link…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
