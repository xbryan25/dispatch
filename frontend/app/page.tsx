import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { ConversationScene } from '@/components/landing/conversationScene';
import { FactsList } from '@/components/landing/facts';
import GuestHeader from '@/components/shared/guestHeader';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background px-5 text-foreground selection:bg-indigo-200 selection:text-indigo-950 sm:px-8 dark:selection:bg-indigo-500/40 dark:selection:text-white">
      <div className="mx-auto max-w-6xl">
        <GuestHeader />

        <main>
          <section className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
            <div>
              <h1 className="max-w-xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]">
                Messages for the people you’ve actually added.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg leading-8 text-muted-foreground">
                Dispatch is a friends-only messenger. Once someone accepts your request, you can
                chat in real time, see when they’re online, and know when they’ve read what you
                sent.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button
                  asChild
                  className="h-12 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.6)] hover:bg-indigo-700 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Link href="/register">
                    Get started
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Have an account?{' '}
                  <Link
                    href="/login"
                    className="rounded-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            <ConversationScene />
          </section>

          <section aria-labelledby="facts-heading" className="border-t border-border py-16 sm:py-24">
            <h2
              id="facts-heading"
              className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            >
              The small signals that make a conversation feel live.
            </h2>

            <FactsList />

            <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xl font-semibold tracking-tight">Add a friend and say hi.</p>
              <Button
                asChild
                className="h-12 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Link href="/register">
                  Create your account
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="flex flex-col items-start gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold tracking-tight text-foreground">
            dispatch<span className="text-indigo-600 dark:text-indigo-400">.</span>
          </span>
          <span>Real-time messaging between friends.</span>
          <a
            href="https://github.com/xbryan25/dispatch"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </footer>
      </div>
    </div>
  );
}
