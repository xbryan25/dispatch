'use client';

import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-10 px-8 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full">
          <h2 className="flex-1 font-bold text-3xl ">Dispatch</h2>
          <Button onClick={() => router.push('/login')} className="text-lg cursor-pointer">
            Login
          </Button>
        </div>
        <div className="flex-1 flex flex-col gap-5 items-center justify-center w-full">
          <h1 className="font-bold text-6xl">Conversations at the speed of thought.</h1>
          <h3 className="font-medium text-md">
            A streamlined messaging experience designed for focus. No bloat, just your people and
            your words.
          </h3>
          <Button onClick={() => router.push('/register')} className="text-lg cursor-pointer">
            Get Started
          </Button>
        </div>
        <div className="flex-1 flex w-full ">
          <div className="flex-1 flex flex-col items-center justify-center">
            <Image
              src="/conversation.svg"
              width={128}
              height={128}
              alt="Picture of the author"
            ></Image>
            <h2 className="font-bold text-lg">Talk to your circle</h2>
            <h4 className="text-sm">Reach the people who matter most.</h4>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Image src="/messages.svg" width={128} height={128} alt="Picture of the author"></Image>
            <h2 className="font-bold text-lg">Messaging made fast</h2>
            <h4 className="text-sm">Instant delivery with zero lag time.</h4>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Image src="/organize.svg" width={128} height={128} alt="Picture of the author"></Image>
            <h2 className="font-bold text-lg">Organize your world</h2>
            <h4 className="text-sm">Keep every conversation perfectly in place.</h4>
          </div>
        </div>
      </main>
    </div>
  );
}
