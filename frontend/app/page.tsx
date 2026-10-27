import Link from 'next/link';

import { ConversationIcon } from '@/components/icons/conversationIcon';
import { MessagesIcon } from '@/components/icons/messagesIcon';
import { OrganizeIcon } from '@/components/icons/organizeIcon';
import GuestHeader from '@/components/shared/guestHeader';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: ConversationIcon,
    eyebrow: 'YOUR PEOPLE',
    title: 'A closer circle',
    description: 'Keep the people you care about close, and your conversations easy to find.',
  },
  {
    icon: MessagesIcon,
    eyebrow: 'IN THE MOMENT',
    title: 'Messages that flow',
    description: 'Pick up right where you left off with fast, real-time conversations.',
  },
  {
    icon: OrganizeIcon,
    eyebrow: 'LESS CLUTTER',
    title: 'Room to focus',
    description: 'A calm, organized space for the conversations that matter to you.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-180 bg-[radial-gradient(ellipse_at_75%_20%,rgba(99,102,241,0.15),transparent_42%),radial-gradient(ellipse_at_15%_30%,rgba(56,189,248,0.12),transparent_38%)] px-5 sm:px-8"
        />
        <div className="mx-auto max-w-7xl">
          <GuestHeader />

          <main>
            <section className="grid items-center gap-14 pb-20 pt-14 sm:pb-28 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-24">
              <div className="max-w-2xl">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-sm font-medium text-indigo-700 shadow-sm shadow-indigo-100/60">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-50" />
                    <span className="relative inline-flex size-2 rounded-full bg-indigo-500" />
                  </span>
                  A little more connection, a lot less noise
                </div>

                <h1 className="max-w-2xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  Conversations at the{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    speed of thought.
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                  A calmer place to catch up with your people. Find your conversations, share what’s
                  on your mind, and stay in the moment.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link href="/register">
                    <Button className="h-12 w-full rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:w-auto">
                      Get started{' '}
                      <span aria-hidden="true" className="ml-2">
                        →
                      </span>
                    </Button>
                  </Link>
                  <p className="text-sm text-slate-500">Your circle is just a conversation away.</p>
                </div>

                <div className="mt-11 flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex -space-x-2" aria-hidden="true">
                    <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8fc] bg-rose-100 text-xs font-semibold text-rose-700">
                      J
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8fc] bg-amber-100 text-xs font-semibold text-amber-700">
                      M
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8fc] bg-sky-100 text-xs font-semibold text-sky-700">
                      A
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#f7f8fc] bg-indigo-100 text-xs font-semibold text-indigo-700">
                      +
                    </span>
                  </div>
                  <span>Make space for the conversations that matter.</span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl lg:pl-5">
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-indigo-200/60 via-sky-100/50 to-violet-200/50 blur-2xl"
                />
                <div className="relative rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_100px_-35px_rgba(57,65,120,0.35)] backdrop-blur-xl sm:p-5">
                  <div className="overflow-hidden rounded-[1.45rem] border border-slate-100 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-semibold text-indigo-700">
                          SC
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Saturday crew</p>
                          <p className="text-xs text-slate-500">4 friends · active now</p>
                        </div>
                      </div>
                      <span
                        className="flex size-9 items-center justify-center rounded-full bg-slate-50 text-slate-500"
                        aria-hidden="true"
                      >
                        •••
                      </span>
                    </div>
                    <div className="space-y-5 bg-gradient-to-b from-white to-slate-50/80 px-5 py-6 sm:px-6 sm:py-8">
                      <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Today · 10:42 AM
                      </p>
                      <div className="flex items-end gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                          M
                        </span>
                        <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700">
                          Coffee and a catch-up this weekend? ☕
                        </div>
                      </div>
                      <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-3 text-sm leading-6 text-white shadow-md shadow-indigo-600/15">
                        I’m in! Saturday afternoon works perfectly.
                      </div>
                      <div className="flex items-end gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                          A
                        </span>
                        <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700">
                          Found a new place by the park. I’ll send it over!
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">
                        <span>Write a message</span>
                        <span
                          className="ml-8 flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-base text-white"
                          aria-hidden="true"
                        >
                          ↑
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-3 top-16 hidden items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-xl shadow-indigo-950/10 sm:flex lg:-left-8">
                  <span
                    className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    Right where you left off
                  </span>
                </div>
                <div className="absolute -bottom-5 right-5 hidden rounded-2xl border border-white bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-xl shadow-indigo-950/10 sm:block">
                  <span className="mr-2 text-amber-500" aria-hidden="true">
                    ✦
                  </span>
                  Only the good stuff
                </div>
              </div>
            </section>

            <section
              className="border-t border-slate-200/70 py-16 sm:py-20"
              aria-labelledby="features-heading"
            >
              <div className="mb-9 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Made for connection
                  </p>
                  <h2
                    id="features-heading"
                    className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl"
                  >
                    Your conversations, in good company.
                  </h2>
                </div>
                <p className="max-w-md text-base leading-7 text-slate-500">
                  Everything you need to stay close, with a little more room to breathe.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {features.map(({ icon: Icon, eyebrow, title, description }) => (
                  <article
                    key={title}
                    className="group rounded-2xl border border-slate-200/80 bg-white/75 p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-950/5 sm:p-7"
                  >
                    <div className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon className="size-7" />
                    </div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                      {eyebrow}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <footer className="flex flex-col gap-2 border-t border-slate-200/70 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold tracking-tight text-slate-700">
              dispatch<span className="text-indigo-600">.</span>
            </span>
            <span>A thoughtful space for everyday conversations.</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
