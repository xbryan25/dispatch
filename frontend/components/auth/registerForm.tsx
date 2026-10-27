'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import { useUsernameCheck } from '@/hooks/useUsernameCheck';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { validatePassword, validateEmail } from '@/lib/validation';

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const registerLoading = useAuthStore((state) => state.registerLoading);
  const registerError = useAuthStore((state) => state.registerError);

  const { registerUser } = useAuthStore();

  const {
    isUsernameTaken,
    isLoading: isCheckingUsername,
    isRateLimited: isUsernameCheckRateLimited,
  } = useUsernameCheck(username);

  const passwordErrors = validatePassword(password);
  const isEmailValid = validateEmail(email);
  const passwordsMatch = password === confirmPassword && password !== '';
  const isFormEmpty = !username || !email || !password || !confirmPassword;
  const isUsernameProperLength = username.length >= 3;

  const userSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await registerUser(email, password, username);

    toast.success(
      'A confirmation link has been sent to your email. Please verify your account to log in.'
    );

    router.push('/login');
  };

  return (
    <main className="relative flex w-full flex-1 items-center justify-center py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(56,189,248,0.09),transparent_40%)]"
      />
      <section className="w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_-35px_rgba(57,65,120,0.35)] backdrop-blur-xl sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Icon icon="lucide:messages-square" className="size-6" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Join your circle
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            A thoughtful space for the conversations that matter.
          </p>
        </div>

        <form onSubmit={(e) => userSignup(e)} className="flex flex-col gap-4">
          <FieldGroup className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="username" className="font-medium text-slate-700">Username</FieldLabel>

              <div className="flex flex-col gap-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
                />

                {isCheckingUsername && !isUsernameCheckRateLimited && (
                  <div className="flex gap-1 items-center">
                    <Spinner />
                    <span className=" text-sm">Checking username availability...</span>
                  </div>
                )}

                {!isCheckingUsername && isUsernameTaken && (
                  <div className="flex gap-1 items-center">
                    <Icon
                      icon="material-symbols:cancel-outline-rounded"
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-red-500 text-sm">Username is taken.</span>
                  </div>
                )}

                {!isUsernameProperLength && username !== '' && (
                  <div className="flex gap-1 items-center">
                    <Icon
                      icon="material-symbols:cancel-outline-rounded"
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-red-500 text-sm">
                      Username should have 3 or more characters.
                    </span>
                  </div>
                )}

                {isUsernameCheckRateLimited && (
                  <div className="flex gap-1 items-center">
                    <Icon
                      icon="material-symbols:cancel-outline-rounded"
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-red-500 text-sm">
                      Too many attempts. Please wait a minute.
                    </span>
                  </div>
                )}
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="font-medium text-slate-700">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
              />

              {!validateEmail(email) && email !== '' && (
                <div className="flex gap-1 items-center">
                  <Icon
                    icon="material-symbols:cancel-outline-rounded"
                    className="w-4 h-4 text-red-500"
                  />
                  <span className="text-red-500 text-sm">Email not in proper format.</span>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="font-medium text-slate-700">Password</FieldLabel>

              <div className="flex flex-col gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
                />

                <ul>
                  {passwordErrors.map((error) => (
                    <li key={error} className="text-red-500 text-sm flex items-center gap-1">
                      <Icon
                        icon="material-symbols:cancel-outline-rounded"
                        className="w-4 h-4 text-red-500"
                      />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
              />
              {!(password === confirmPassword) && confirmPassword !== '' && (
                <div className="flex gap-1 items-center">
                  <Icon
                    icon="material-symbols:cancel-outline-rounded"
                    className="w-4 h-4 text-red-500"
                  />
                  <span className="text-red-500 text-sm">Both passwords are not identical.</span>
                </div>
              )}
            </Field>
          </FieldGroup>

          <Field className="flex flex-col" orientation="horizontal">
            <Button
              type="submit"
              disabled={
                registerLoading ||
                isCheckingUsername ||
                isUsernameTaken ||
                passwordErrors.length > 0 ||
                !passwordsMatch ||
                !isEmailValid ||
                isFormEmpty ||
                !isUsernameProperLength ||
                isUsernameCheckRateLimited
              }
              className="h-12 w-full cursor-pointer rounded-xl bg-indigo-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:shadow-none"
            >
              {registerLoading && <Spinner />}
              Register
            </Button>
            {registerError && <p className="text-xs text-red-400">{registerError}</p>}
          </Field>
        </form>
        <div className="mt-6 flex justify-center gap-1.5 border-t border-slate-100 pt-5 text-sm text-slate-500">
          <p>Already have an account?</p>
          <Link
            href="/login"
            className="cursor-pointer font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
