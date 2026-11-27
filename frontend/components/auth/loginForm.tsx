'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import {
  authInputClass,
  authLabelClass,
  authMainClass,
  authSubmitClass,
  authTextLinkClass,
} from '@/components/auth/authClasses';
import FormError, { FormSuccess } from '@/components/auth/formError';
import PasswordInput from '@/components/auth/passwordInput';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { resendConfirmationEmail } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [isClickedLoginButton, setIsClickedLoginButton] = useState<boolean>(false);
  // The email that Supabase refused as unconfirmed; cleared as soon as the field changes.
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const { loginUser, getCurrentId } = useAuthStore();

  const isEmailValid = validateEmail(email);
  const isFormEmpty = !email || !password;

  const userLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsClickedLoginButton(true);

    await loginUser(email, password);

    const loginError = useAuthStore.getState().loginError;

    if (loginError && /email not confirmed/i.test(loginError)) {
      setUnconfirmedEmail(email);
      setResendState('idle');
      setIsClickedLoginButton(false);
      return;
    }

    if (loginError) {
      toast.error(`Login failed. ${loginError.replace(/\.$/, '')}.`);
      setIsClickedLoginButton(false);
      return;
    }

    await getCurrentId();

    const currentUserIdError = useAuthStore.getState().getCurrentIdError;

    if (currentUserIdError) {
      toast.warning('Login succeeded, but we couldn’t load your account. Page will be refreshed.');
      router.refresh();
    } else {
      toast.success('Logged in. Welcome back!');
      router.push('/messages');
    }
  };

  const resend = async () => {
    if (!unconfirmedEmail) return;
    setResendState('sending');
    try {
      await resendConfirmationEmail(unconfirmedEmail);
      setResendState('sent');
    } catch {
      toast.error('Failed to resend confirmation email.');
      setResendState('idle');
    }
  };

  const showEmailError = emailTouched && !isEmailValid && email !== '';

  return (
    <main className={authMainClass}>
      <section aria-labelledby="login-heading" className="w-full max-w-sm">
        <h1
          id="login-heading"
          className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
        >
          Log in to Dispatch
        </h1>
        <p className="mt-3 text-pretty leading-7 text-muted-foreground">
          Pick up where your conversations left off.
        </p>

        <form onSubmit={(e) => userLogin(e)} className="mt-9">
          <FieldGroup className="flex flex-col gap-5">
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
                  setUnconfirmedEmail(null);
                }}
                onBlur={() => setEmailTouched(true)}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? 'email-error' : undefined}
                className={authInputClass}
              />

              {showEmailError && (
                <FormError id="email-error">
                  Enter a valid email address, such as name@example.com.
                </FormError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className={authLabelClass}>
                Password
              </FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            {unconfirmedEmail && resendState === 'sent' && (
              <FormSuccess>
                New link sent to{' '}
                <span className="font-semibold wrap-anywhere">{unconfirmedEmail}</span>. Confirm it,
                then log in.
              </FormSuccess>
            )}

            {unconfirmedEmail && resendState !== 'sent' && (
              <FormError>
                This email isn’t confirmed yet.{' '}
                <button
                  type="button"
                  onClick={resend}
                  disabled={resendState === 'sending'}
                  className="cursor-pointer rounded-sm font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-default disabled:no-underline"
                >
                  {resendState === 'sending' ? 'Sending link…' : 'Resend the link'}
                </button>
              </FormError>
            )}

            <Button
              type="submit"
              disabled={isClickedLoginButton || !isEmailValid || isFormEmpty}
              className={`mt-2 ${authSubmitClass}`}
            >
              {/* Stays on through loading the account too, not just the sign-in request. */}
              {isClickedLoginButton && <Spinner />}
              Log in
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          New to Dispatch?{' '}
          <Link href="/register" className={authTextLinkClass}>
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
