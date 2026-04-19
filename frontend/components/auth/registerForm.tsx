'use client';

import { FormEvent, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Icon } from '@iconify/react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useUsernameCheck } from '@/hooks/useUsernameCheck';
import { validatePassword, validateEmail } from '@/lib/validation';

import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const registerUser = useAuthStore((state) => state.registerUser);

  const registerLoading = useAuthStore((state) => state.registerLoading);
  const registerError = useAuthStore((state) => state.registerError);

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
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-5">
      <h1 className="font-semibold text-4xl py-5">Register to Dispatch</h1>

      <div className="w-full max-w-md">
        <form onSubmit={(e) => userSignup(e)} className="flex flex-col gap-5">
          <FieldGroup className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>

              <div className="flex flex-col gap-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              className="w-full cursor-pointer text-lg"
            >
              {registerLoading && <Spinner />}
              Register
            </Button>
            {registerError && <p className="text-xs text-red-400">{registerError}</p>}
          </Field>
        </form>
      </div>

      <div className="flex text-md gap-2">
        <p>Already have an account?</p>
        <Link href="/login" className="cursor-pointer font-semibold">
          Login
        </Link>
      </div>
    </div>
  );
}
