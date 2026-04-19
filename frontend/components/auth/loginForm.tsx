'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

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

  const loginUser = useAuthStore((state) => state.loginUser);
  const loginLoading = useAuthStore((state) => state.loginLoading);
  const loginError = useAuthStore((state) => state.loginError);

  const initCurrentUserId = useAuthStore((state) => state.getCurrentId);
  const initCurrentUserIdError = useAuthStore((state) => state.getCurrentIdError);

  const isEmailValid = validateEmail(email);
  const isFormEmpty = !email || !password;

  const userLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsClickedLoginButton(true);

    await loginUser(email, password);

    if (loginError) {
      toast.error(`Login failed. ${loginError}.`);
    } else {
      await initCurrentUserId();

      if (initCurrentUserIdError) {
        toast.error(`Login successful but failed to load your account. Please refresh.`);
      } else {
        toast.success('Login successful. Welcome to Dispatch!');
        router.push('/messages');
      }
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-5">
      <h1 className="font-semibold text-4xl py-5">Login to Dispatch</h1>

      <div className="w-full max-w-md">
        <form onSubmit={(e) => userLogin(e)} className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="username">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <div className="flex flex-col gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Field>

            <Field orientation="horizontal">
              <Button
                type="submit"
                disabled={isClickedLoginButton || !isEmailValid || isFormEmpty}
                className="w-full cursor-pointer text-lg"
              >
                {loginLoading && <Spinner />}
                Login
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>

      <div className="flex text-md gap-2">
        <p>Not registered yet?</p>
        <Link href="/register" className="cursor-pointer font-semibold">
          Register
        </Link>
      </div>
    </div>
  );
}
