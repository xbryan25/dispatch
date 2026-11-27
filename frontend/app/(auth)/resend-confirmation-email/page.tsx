'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  authInputClass,
  authLabelClass,
  authMainClass,
  authPageClass,
  authSubmitClass,
  authTextLinkClass,
} from '@/components/auth/authClasses';
import FormError, { FormSuccess } from '@/components/auth/formError';
import GuestHeader from '@/components/shared/guestHeader';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { resendConfirmationEmail } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';

export default function ResendConfirmationEmailPage() {
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailTouched, setEmailTouched] = useState(false);
  // The address the last link went to; kept on screen so people can see where to look.
  const [sentTo, setSentTo] = useState<string | null>(null);

  const isEmailValid = validateEmail(email);
  const showEmailError = emailTouched && !isEmailValid && email !== '';

  const resendEmail = async () => {
    setIsLoading(true);

    try {
      await resendConfirmationEmail(email);
      setSentTo(email);
    } catch {
      toast.error('Failed to resend confirmation email.');
    }

    setIsLoading(false);
  };

  return (
    <div className={authPageClass}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <GuestHeader />
        <main className={authMainClass}>
          <section aria-labelledby="resend-heading" className="w-full max-w-sm">
            <h1
              id="resend-heading"
              className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            >
              Get a new link
            </h1>
            <p className="mt-3 text-pretty leading-7 text-muted-foreground">
              Confirmation links expire after a while. Enter the email you signed up with and we’ll
              send a new link if the account still needs confirming.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void resendEmail();
              }}
              className="mt-9 flex flex-col gap-7"
            >
              <Field>
                <FieldLabel htmlFor="email" className={authLabelClass}>
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSentTo(null);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  disabled={isLoading}
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? 'email-error' : undefined}
                  className={authInputClass}
                />
                {showEmailError && (
                  <FormError id="email-error">
                    Enter a valid email address, such as name@example.com.
                  </FormError>
                )}
                {sentTo && (
                  <FormSuccess>
                    If <span className="font-semibold wrap-anywhere">{sentTo}</span> is waiting to
                    be confirmed, a new link is on its way.
                  </FormSuccess>
                )}
              </Field>
              <Button
                type="submit"
                className={authSubmitClass}
                disabled={isLoading || !isEmailValid}
              >
                {isLoading && <Spinner />}
                {isLoading ? 'Sending link…' : 'Send a new link'}
              </Button>
            </form>

            <p className="mt-8 text-sm text-muted-foreground">
              Already confirmed?{' '}
              <Link href="/login" className={authTextLinkClass}>
                Log in
              </Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
