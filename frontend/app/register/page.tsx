import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const a = [1, 2, 3];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-md flex flex-col items-center gap-5 p-10">
        <h1 className="font-semibold text-4xl py-5">Register to Dispatch</h1>

        <div className="flex flex-col w-full gap-2">
          <h2 className="w-full text-md font-semibold tracking-tight text-black dark:text-zinc-50 text-left">
            Username
          </h2>
          <Input type="text" placeholder="Enter your username" />
        </div>

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
          <Input type="password" placeholder="Enter your password" />
        </div>

        <div className="flex flex-col w-full gap-2">
          <h2 className="w-full text-md font-semibold tracking-tight text-black dark:text-zinc-50 text-left">
            Confirm Password
          </h2>
          <Input type="password" placeholder="Confirm your password" />
        </div>

        <Button className="w-full cursor-pointer text-lg">Register</Button>

        <div className="flex text-md gap-2">
          <p>Already have an account?</p>
          <Link href="/login" className="cursor-pointer font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
