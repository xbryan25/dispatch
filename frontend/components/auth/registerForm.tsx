'use client';

import { Icon } from '@iconify/react';
import { Check, Circle } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import { useUsernameCheck } from '@/hooks/useUsernameCheck';

import {
  authInputClass,
  authLabelClass,
  authMainClass,
  authSubmitClass,
  authTextLinkClass,
} from '@/components/auth/authClasses';
import CheckInbox from '@/components/auth/checkInbox';
import FormError from '@/components/auth/formError';
import PasswordInput from '@/components/auth/passwordInput';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { cn } from '@/lib/utils';
import { isPasswordValid, passwordRules, validateEmail } from '@/lib/validation';

export default function RegisterForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // Field errors wait until the person leaves the field, so nothing flags a half-typed value.
  const [emailTouched, setEmailTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const registerLoading = useAuthStore((state) => state.registerLoading);
  const registerError = useAuthStore((state) => state.registerError);

  const { registerUser } = useAuthStore();

  const { status: usernameStatus, retry: retryUsernameCheck } = useUsernameCheck(username);

  const isPasswordOk = isPasswordValid(password);
  const isEmailValid = validateEmail(email);
  const passwordsMatch = password === confirmPassword && password !== '';
  const isFormEmpty = !username || !email || !password || !confirmPassword;
  const isUsernameProperLength = username.length >= 3;

  const userSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await registerUser(email, password, username);

    const latestRegisterError = useAuthStore.getState().registerError;

    if (latestRegisterError) {
      toast.error(`Registration failed. ${improveRegisterError(latestRegisterError)}`);
      return;
    }

    setSentTo(email);
  };

  // Takes the error explicitly: after an await, the render's registerError is still the old value.
  const improveRegisterError = (error: string | null) => {
    if (error == 'email rate limit exceeded') {
      return 'Email rate limit exceeded. Wait for a few minutes.';
    } else if (error) {
      return error.charAt(0).toUpperCase() + error.slice(1);
    } else {
      return 'Something went wrong.';
    }
  };

  const showEmailError = emailTouched && !isEmailValid && email !== '';
  const showMismatch = confirmTouched && confirmPassword !== '' && password !== confirmPassword;

  if (sentTo) {
    return (
      <main className={authMainClass}>
        <CheckInbox email={sentTo} onChangeEmail={() => setSentTo(null)} />
      </main>
    );
  }

  return (
    <main className={authMainClass}>
      <section aria-labelledby="register-heading" className="w-full max-w-sm">
        <h1
          id="register-heading"
          className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
        >
          Create your account
        </h1>
        <p className="mt-3 text-pretty leading-7 text-muted-foreground">
          Pick a username your friends can find you by. We’ll email you a link to confirm your
          address.
        </p>

        <form onSubmit={(e) => userSignup(e)} className="mt-9">
          <FieldGroup className="flex flex-col gap-5">
            <Field>
              <FieldLabel htmlFor="username" className={authLabelClass}>
                Username
              </FieldLabel>

              <div className="flex flex-col gap-2">
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={
                    usernameStatus === 'taken' || (!isUsernameProperLength && username !== '')
                  }
                  aria-describedby="username-status"
                  className={authInputClass}
                />

                <div id="username-status" aria-live="polite">
                  {!isUsernameProperLength && username !== '' && (
                    <FormError>Username should have 3 or more characters.</FormError>
                  )}

                  {usernameStatus === 'checking' && (
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Spinner className="size-3.5 shrink-0" />
                      Checking if {username} is available…
                    </p>
                  )}

                  {usernameStatus === 'available' && (
                    <p className="mt-1 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      <Icon
                        icon="lucide:circle-check"
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="wrap-anywhere">{username} is available</span>
                    </p>
                  )}

                  {usernameStatus === 'taken' && <FormError>Username is taken.</FormError>}

                  {usernameStatus === 'rate-limited' && (
                    <FormError>Too many checks. We’ll try again in a minute.</FormError>
                  )}

                  {usernameStatus === 'error' && (
                    <FormError>
                      Couldn’t check if this username is available.{' '}
                      <button
                        type="button"
                        onClick={retryUsernameCheck}
                        className="cursor-pointer rounded-sm font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        Try again
                      </button>
                    </FormError>
                  )}
                </div>
              </div>
            </Field>

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
                onChange={(e) => setEmail(e.target.value)}
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

              <div className="flex flex-col gap-2">
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-rules"
                />

                {/* Requirements up front, ticking off as they're met, instead of errors after the fact. */}
                <ul id="password-rules" className="mt-1 grid gap-1.5 text-xs">
                  {passwordRules.map((rule) => {
                    const met = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className={cn(
                          'flex items-center gap-2 transition-colors',
                          met ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'
                        )}
                      >
                        {met ? (
                          <Check aria-hidden="true" className="size-3.5 shrink-0" />
                        ) : (
                          <Circle aria-hidden="true" className="size-3.5 shrink-0" />
                        )}
                        <span>
                          {rule.label}
                          <span className="sr-only">{met ? ' (done)' : ' (needed)'}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword" className={authLabelClass}>
                Confirm password
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                aria-invalid={showMismatch}
                aria-describedby={showMismatch ? 'confirm-error' : undefined}
              />
              {showMismatch && (
                <FormError id="confirm-error">
                  Passwords don’t match. Check both fields for typos.
                </FormError>
              )}
            </Field>

            <div className="mt-2 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={
                  registerLoading ||
                  usernameStatus !== 'available' ||
                  !isPasswordOk ||
                  !passwordsMatch ||
                  !isEmailValid ||
                  isFormEmpty
                }
                className={authSubmitClass}
              >
                {registerLoading && <Spinner />}
                Create account
              </Button>
              {registerError && <FormError>{improveRegisterError(registerError)}</FormError>}
            </div>
          </FieldGroup>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className={authTextLinkClass}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
