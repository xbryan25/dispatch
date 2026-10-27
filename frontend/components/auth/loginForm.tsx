'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import FormError from '@/components/auth/formError';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { validateEmail } from '@/lib/validation';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isClickedLoginButton, setIsClickedLoginButton] = useState<boolean>(false);

  const loginLoading = useAuthStore((state) => state.loginLoading);
  const loginError = useAuthStore((state) => state.loginError);

  const initCurrentUserIdError = useAuthStore((state) => state.getCurrentIdError);

  const { loginUser, getCurrentId } = useAuthStore();

  const isEmailValid = validateEmail(email);
  const isFormEmpty = !email || !password;

  const userLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsClickedLoginButton(true);

    await loginUser(email, password);

    if (loginError) {
      toast.error(`Login failed. ${loginError}.`);
    } else {
      await getCurrentId();

      if (initCurrentUserIdError) {
        toast.error(`Login successful but failed to load your account. Please refresh.`);
      } else {
        toast.success('Login successful. Welcome to Dispatch!');
        router.push('/messages');
      }
    }
  };

  return (
    <main className="relative flex w-full flex-1 items-center justify-center py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(ellipse_at_15%_80%,rgba(56,189,248,0.09),transparent_40%)]"
      />
      <section className="w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_80px_-35px_rgba(57,65,120,0.35)] backdrop-blur-xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Icon icon="lucide:messages-square" className="size-6" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Login to Dispatch
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pick up where your conversations left off.
          </p>
        </div>

        <form onSubmit={(e) => userLogin(e)} className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-4">
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
                aria-invalid={!isEmailValid && email !== ''}
                aria-describedby={!isEmailValid && email !== '' ? 'email-error' : undefined}
                className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
              />

              {!validateEmail(email) && email !== '' && (
                <FormError>Enter a valid email address, such as name@example.com</FormError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="font-medium text-slate-700">
                Password
              </FieldLabel>

              <div className="flex flex-col gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-none placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
                />
              </div>
            </Field>

            <Field orientation="horizontal">
              <Button
                type="submit"
                disabled={isClickedLoginButton || !isEmailValid || isFormEmpty}
                className="h-12 w-full cursor-pointer rounded-xl bg-indigo-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:shadow-none"
              >
                {loginLoading && <Spinner />}
                Login
              </Button>
            </Field>
          </FieldGroup>
        </form>

        <div className="mt-7 flex justify-center gap-1.5 border-t border-slate-100 pt-6 text-sm text-slate-500">
          <p>New to Dispatch?</p>
          <Link
            href="/register"
            className="cursor-pointer font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}
