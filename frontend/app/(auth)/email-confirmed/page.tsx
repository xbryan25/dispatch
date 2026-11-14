'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-[#f7f8fc] px-5 font-sans sm:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <GuestHeader />
        <main className="relative flex w-full flex-1 items-center justify-center py-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(56,189,248,0.09),transparent_40%)]"
          />
          {isConfirmed ? (
            <section className="w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white/85 p-6 text-center shadow-[0_24px_80px_-35px_rgba(57,65,120,0.35)] backdrop-blur-xl sm:p-9">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon icon="lucide:circle-check" className="size-6" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Email confirmed
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                You’re all set
              </h1>

              <div className="mt-3 flex flex-col ">
                <p className="text-sm leading-6 text-slate-500">Your email has been confirmed.</p>
                <p className="text-sm leading-6 text-slate-500">
                  Welcome to Dispatch, your conversations are waiting.
                </p>
              </div>

              <Button
                asChild
                className="mt-6 h-12 w-full cursor-pointer rounded-xl bg-indigo-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                <Link href="/messages">Start chatting</Link>
              </Button>
              <p className="mt-3 text-sm text-slate-500">
                Click the button to start using Dispatch.
              </p>
            </section>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-5 py-4 text-sm font-medium text-slate-600 shadow-[0_24px_80px_-35px_rgba(57,65,120,0.35)] backdrop-blur-xl "
            >
              <Spinner className="text-indigo-600 size-5 " />
              <p className="text-2xl">Loading...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
