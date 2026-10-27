'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import GuestHeader from '@/components/shared/guestHeader';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { createClient } from '@/lib/supabase/client';

export default function ResendConfirmationEmailPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resendEmail = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });

    if (error) {
      toast.error('Failed to resend confirmation email.');
    } else {
      toast.success('If an account exists for this email, a new link has been sent.');
    }

    setIsLoading(false);

    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-5 font-sans sm:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col">
        <GuestHeader />
        <main className="relative flex w-full flex-1 items-center justify-center py-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(56,189,248,0.09),transparent_40%)]"
          />
          <section className="w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_-35px_rgba(57,65,120,0.35)] backdrop-blur-xl sm:p-9">
            <div className="mb-2 text-center">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon icon="lucide:mail-warning" className="size-6" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Email confirmation
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                Link expired
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your confirmation link has expired. Enter your email and we’ll send a fresh link if
                an account is waiting to be confirmed.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <Field>
                <FieldLabel htmlFor="email" className="font-medium text-slate-700">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
                />
              </Field>
              <Button
                onClick={resendEmail}
                className="h-12 w-full cursor-pointer rounded-xl bg-indigo-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:shadow-none"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                {isLoading ? 'Sending link…' : 'Resend confirmation email'}
              </Button>
            </div>

            <div className="mt-7 flex justify-center gap-1.5 border-t border-slate-100 pt-6 text-sm text-slate-500">
              <span>Already confirmed?</span>
              <Link
                href="/login"
                className="cursor-pointer font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Go to login
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
