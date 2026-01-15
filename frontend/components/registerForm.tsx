'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm() {
  const [isSamePassword, setIsSamePassword] = useState<boolean>(true);

  const { signUp, loading, error } = useAuth();

  return (
    <div className="w-md flex flex-col items-center gap-5 p-10">
      <h1 className="font-semibold text-4xl py-5">Register to Dispatch</h1>

      <div className="w-full max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const form = e.currentTarget;

            const username = (form.username as HTMLInputElement).value;
            const email = (form.email as HTMLInputElement).value;

            const password = (form.password as HTMLInputElement).value;
            const confirmPassword = (form.confirmPassword as HTMLInputElement).value;

            if (password !== confirmPassword) {
              setIsSamePassword(false);
            } else {
              signUp(email, password, username);
            }
          }}
          className="flex flex-col gap-5"
        >
          <FieldGroup className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" type="text" placeholder="Enter your username" />
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Email</FieldLabel>
              <Input id="email" type="email" placeholder="Enter your email" />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="Enter your password" />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
              {!isSamePassword && (
                <p className="text-xs text-red-400">Both passwords are not the identical</p>
              )}
            </Field>
          </FieldGroup>

          <Field className="flex flex-col" orientation="horizontal">
            <Button type="submit" disabled={loading} className="w-full cursor-pointer text-lg">
              Register
            </Button>
            {error && <p className="text-xs text-red-400">{error}</p>}
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
