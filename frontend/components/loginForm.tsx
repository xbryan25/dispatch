'use client';

import { FormEvent, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from './ui/spinner';
import { toast } from 'sonner';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Icon } from '@iconify/react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLogin } from '@/hooks/useAuth';
import { validateEmail } from '@/lib/validation';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { loginUser, loading, error } = useLogin();
  const isEmailValid = validateEmail(email);
  const isFormEmpty = !email || !password;

  const userLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error: loginError } = await loginUser(email, password);

    console.log(loginError);

    if (loginError) {
      toast.error(`Login failed. ${loginError}.`);
    } else {
      toast.success('Login successful. Welcome to Dispatch!');
      router.push('/messages');
    }
  };

  return (
    <div className="w-md flex flex-col items-center gap-5 p-10">
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
                disabled={loading || !isEmailValid || isFormEmpty}
                className="w-full cursor-pointer text-lg"
              >
                {loading && <Spinner />}
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
