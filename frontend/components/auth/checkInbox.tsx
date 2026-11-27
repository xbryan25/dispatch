'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { authSubmitClass, authTextLinkClass } from '@/components/auth/authClasses';
import { Initial } from '@/components/landing/initial';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { resendConfirmationEmail } from '@/lib/auth';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';

const receiver = themes[0].receiver;

// One-shot rise for each new bubble; reduced motion shows it in place.
const rise =
  'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 [animation-fill-mode:backwards] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)]';

// The post-signup hand-off, written as a message from Dispatch so it reads like the app itself.
export default function CheckInbox({
  email,
  onChangeEmail,
}: {
  email: string;
  onChangeEmail: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [resends, setResends] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const resend = async () => {
    setIsResending(true);
    try {
      await resendConfirmationEmail(email);
      setResends((count) => count + 1);
    } catch {
      toast.error('Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section aria-labelledby="inbox-heading" className="w-full max-w-sm">
      <h1
        ref={headingRef}
        id="inbox-heading"
        tabIndex={-1}
        className="text-balance text-3xl font-semibold tracking-[-0.03em] outline-none sm:text-4xl"
      >
        Check your inbox
      </h1>

      <div className="mt-8 flex items-end gap-2">
        <Initial
          letter="d"
          className="size-8 bg-indigo-600 text-sm text-white dark:bg-indigo-500"
        />
        <div aria-live="polite" className="flex min-w-0 flex-col gap-1">
          <p className="mb-0.5 text-xs text-muted-foreground">Dispatch · just now</p>
          <p
            className={cn(
              'w-fit rounded-2xl rounded-bl-md px-3.5 py-2 text-sm leading-relaxed text-foreground',
              receiver,
              rise
            )}
          >
            We sent a confirmation link to
            <span className="block font-semibold wrap-anywhere">{email}</span>
          </p>
          <p
            className={cn(
              'w-fit rounded-2xl px-3.5 py-2 text-sm leading-relaxed text-foreground',
              receiver,
              resends > 0 && 'rounded-bl-md',
              rise,
              '[animation-delay:450ms]'
            )}
          >
            Open it on any device, then log in here to find your friends.
          </p>
          {Array.from({ length: resends }, (_, index) => (
            <p
              key={index}
              className={cn(
                'w-fit rounded-2xl px-3.5 py-2 text-sm leading-relaxed text-foreground',
                receiver,
                index < resends - 1 && 'rounded-bl-md',
                rise
              )}
            >
              Sent a new link. It can take a minute to arrive.
            </p>
          ))}
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-3">
        <Button asChild className={authSubmitClass}>
          <Link href="/login">Go to log in</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resend}
          disabled={isResending}
          className="h-12 w-full cursor-pointer rounded-xl text-base font-semibold focus-visible:ring-indigo-500"
        >
          {isResending && <Spinner />}
          {isResending ? 'Sending link…' : 'Resend link'}
        </Button>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Wrong address?{' '}
        <button type="button" onClick={onChangeEmail} className={authTextLinkClass}>
          Use a different email
        </button>
      </p>
    </section>
  );
}
