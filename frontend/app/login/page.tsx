'use client';
import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();

  const router = useRouter();

  const searchParams = useSearchParams();

  const errorCode = searchParams.get('error_code');

  useEffect(() => {
    if (window.location.hash) {
      // remove the fragment without reloading
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log(data);
    });
  }, [router, errorCode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-md flex flex-col items-center gap-5 p-10">
        <h1 className="font-semibold text-4xl py-5">Login to Dispatch</h1>

        <div className="flex flex-col w-full gap-2">
          <h2 className="w-full text-md font-semibold tracking-tight text-black dark:text-zinc-50 text-left">
            Email Address
          </h2>
          <Input type="email" placeholder="Enter your email address" />
        </div>

        <div className="flex flex-col w-full gap-2">
          <h2 className="w-full text-md font-semibold tracking-tight text-black dark:text-zinc-50 text-left">
            Password
          </h2>
          <Input type="text" placeholder="Enter your password" />
        </div>

        <Button className="w-full cursor-pointer text-lg">Login</Button>

        <div className="flex text-md gap-2">
          <p>Not registered yet?</p>
          <Link href="/register" className="cursor-pointer font-semibold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
