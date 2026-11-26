import { ArrowRight, ArrowUpRight, SendHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';

const defaultTheme = themes[0];
const roseTheme = themes.find((theme) => theme.id === 'rose') ?? defaultTheme;

// One-shot hero scene. Elements rest in their final state; animations only run from a hidden start,
// so reduced motion (and any animation failure) shows the finished conversation.
const sceneStyles = `
@keyframes dl-rise { from { opacity: 0; transform: translateY(8px); } }
@keyframes dl-show { from { opacity: 0; } }
@keyframes dl-hide { from { opacity: 1; } to { opacity: 0; } }
.dl-rise { animation: dl-rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
.dl-show { animation: dl-show 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
.dl-hide { opacity: 0; animation: dl-hide 0.3s ease-out backwards; }
.dl-scene[data-hold] :is(.dl-rise, .dl-show, .dl-hide) { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .dl-rise, .dl-show, .dl-hide { animation: none; }
}
`;

// Runs while the HTML parses, before first paint: if the scene starts below 60% of the viewport,
// pause it on its first frame and release it once its top scrolls above that line. Without JS the
// scene plays on load as before.
// shortcut: React doesn't run inline scripts on client-side navigation, so arriving at / that way
// plays the scene on load; move this into a client component if that path matters.
const holdSceneScript = `(() => {
  const scene = document.querySelector('.dl-scene');
  if (!scene || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (scene.getBoundingClientRect().top <= innerHeight * 0.6) return;
  scene.setAttribute('data-hold', '');
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    scene.removeAttribute('data-hold');
    observer.disconnect();
  }, { rootMargin: '0px 0px -40% 0px' });
  observer.observe(scene);
})();`;

const at = (seconds: number) => ({ animationDelay: `${seconds}s` });

function Initial({
  letter,
  className,
  style,
}: {
  letter: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        className
      )}
    >
      {letter}
    </span>
  );
}

// Mirrors userMessage.tsx: only a non-final bubble in a run gets the tucked corner.
function ThemedBubble({
  side,
  delay,
  tucked = false,
  children,
}: {
  side: 'sender' | 'receiver';
  delay: number;
  tucked?: boolean;
  children: React.ReactNode;
}) {
  const isSender = side === 'sender';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
        isSender
          ? `text-foreground ${defaultTheme.sender} ${tucked ? 'rounded-br-md' : ''}`
          : `${defaultTheme.receiver} text-foreground ${tucked ? 'rounded-bl-md' : ''}`
      )}
    >
      <span
        aria-hidden="true"
        className={cn('dl-show absolute inset-0', isSender ? roseTheme.sender : roseTheme.receiver)}
        style={at(delay)}
      />
      <span className="relative">{children}</span>
    </div>
  );
}

const THEME_AT = 4.8;

function ConversationScene() {
  return (
    <figure className="mx-auto w-full max-w-md lg:mr-0">
      <div className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] dark:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="relative">
            <Initial
              letter="M"
              className="size-11 bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200"
            />
            <span
              aria-hidden="true"
              className="dl-show absolute bottom-0 right-0 size-3.5 rounded-full bg-emerald-500 ring-2 ring-card"
              style={at(0.9)}
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold">Maya</p>
            <p className="grid text-xs">
              <span
                aria-hidden="true"
                className="dl-hide col-start-1 row-start-1 text-muted-foreground"
                style={at(0.9)}
              >
                Last active 12m ago
              </span>
              <span
                className="dl-show col-start-1 row-start-1 font-medium text-emerald-700 dark:text-emerald-400"
                style={at(0.9)}
              >
                Active now
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-5 py-6">
          <p className="text-center text-xs text-muted-foreground">Today, 6:42 PM</p>

          <div className="dl-rise flex pl-10" style={at(1.7)}>
            <div className="max-w-[78%]">
              <ThemedBubble side="receiver" delay={THEME_AT} tucked>
                Still on for the 7pm showing?
              </ThemedBubble>
            </div>
          </div>

          <div className="dl-rise -mt-1.5 mb-2 flex items-end gap-2" style={at(2.3)}>
            <Initial
              letter="M"
              className="size-8 bg-rose-100 text-xs text-rose-700 dark:bg-rose-900/60 dark:text-rose-200"
            />
            <div className="max-w-[78%]">
              <ThemedBubble side="receiver" delay={THEME_AT}>
                I can grab seats if you’re running late.
              </ThemedBubble>
            </div>
          </div>

          <div className="dl-rise ml-auto flex max-w-[78%] flex-col items-end" style={at(3.2)}>
            <ThemedBubble side="sender" delay={THEME_AT}>
              Yes! Middle row if you can.
            </ThemedBubble>
            <Initial
              letter="M"
              className="dl-show mt-1 size-4 bg-rose-100 text-[8px] text-rose-700 ring-1 ring-card dark:bg-rose-900/60 dark:text-rose-200"
              style={at(4)}
            />
            <span className="sr-only">Seen by Maya</span>
          </div>
        </div>

        {/* Matches messageInput.tsx with an empty composer: send is disabled. */}
        <div aria-hidden="true" className="flex items-end gap-2 border-t border-border px-4 py-3">
          <span className="flex min-h-11 flex-1 items-center rounded-2xl border border-stone-200 bg-stone-50/70 px-4 text-sm text-muted-foreground dark:border-stone-700 dark:bg-stone-950">
            Type your message...
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-stone-200 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
            <SendHorizontal className="size-4" />
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-balance text-center text-xs text-muted-foreground lg:text-right">
        Sample conversation. Maya switched the theme to Rose for both of you.
      </figcaption>
    </figure>
  );
}

const facts = [
  {
    title: 'Only people you’ve added',
    body: 'Send a friend request first. Once it’s accepted, you can start a conversation. Nobody else can message you.',
    detail: (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <Initial
          letter="J"
          className="size-9 bg-sky-100 text-sm text-sky-700 dark:bg-sky-900/60 dark:text-sky-200"
        />
        <p className="min-w-0 flex-1 text-sm">
          <span className="font-semibold">jordan</span>{' '}
          <span className="text-muted-foreground">sent you a friend request</span>
        </p>
        <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
          Accept
        </span>
      </div>
    ),
  },
  {
    title: 'See who’s around',
    body: 'A friend’s status updates the moment they come online or leave, without a refresh.',
    detail: (
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3">
          <span className="relative">
            <Initial
              letter="M"
              className="size-9 bg-rose-100 text-sm text-rose-700 dark:bg-rose-900/60 dark:text-rose-200"
            />
            <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </span>
          <span className="font-semibold">Maya</span>
          <span className="font-medium text-emerald-700 dark:text-emerald-400">Active now</span>
        </li>
        <li className="flex items-center gap-3">
          <Initial
            letter="J"
            className="size-9 bg-sky-100 text-sm text-sky-700 dark:bg-sky-900/60 dark:text-sky-200"
          />
          <span className="font-semibold">jordan</span>
          <span className="text-muted-foreground">Last active 2h ago</span>
        </li>
      </ul>
    ),
  },
  {
    title: 'Know when it’s been read',
    body: 'When your friend reads your latest message, their picture appears under it.',
    detail: (
      <div className="flex flex-col items-end">
        <div
          className={cn(
            'rounded-2xl rounded-br-md px-3.5 py-2 text-sm text-foreground',
            defaultTheme.sender
          )}
        >
          See you at 7!
        </div>
        {/* The app shows this as the avatar's hover tooltip; drawn here in its open state. */}
        <div className="mt-1.5 flex items-center gap-2.5">
          <span className="relative rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background">
            Seen by Maya at 6:48 PM
            <span className="absolute -right-1 top-1/2 size-2.5 -translate-y-1/2 rotate-45 rounded-[2px] bg-foreground" />
          </span>
          <Initial
            letter="M"
            className="size-4 bg-rose-100 text-[8px] text-rose-700 dark:bg-rose-900/60 dark:text-rose-200"
          />
        </div>
      </div>
    ),
  },
  {
    title: 'A colour you both see',
    body: `Pick one of ${themes.length} conversation themes. When either of you changes it, it updates for both of you right away.`,
    detail: (
      <ul className="flex flex-wrap gap-2" aria-label="Conversation themes">
        {themes.map((theme) => (
          <li key={theme.id} title={theme.label}>
            <span
              className={cn(
                'block size-6 rounded-full',
                theme.sender,
                theme.id === roseTheme.id && 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
              )}
            />
            <span className="sr-only">{theme.label}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background px-5 text-foreground selection:bg-indigo-200 selection:text-indigo-950 sm:px-8 dark:selection:bg-indigo-500/40 dark:selection:text-white">
      <style>{sceneStyles}</style>

      <div className="mx-auto max-w-6xl">
        {/* Inlined instead of GuestHeader: the auth pages it serves are still light-only. */}
        <header className="flex h-20 items-center justify-between border-b border-border">
          <Link
            href="/"
            aria-label="Dispatch home"
            className="rounded-lg text-2xl font-bold leading-none tracking-[-0.04em] transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:text-[1.7rem] dark:hover:text-indigo-400"
          >
            dispatch<span className="text-indigo-600 dark:text-indigo-400">.</span>
          </Link>
          <nav aria-label="Guest navigation">
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-xl px-4 font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-indigo-500"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </nav>
        </header>

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

            {/* data-hold is set by the script below before hydration. */}
            <div className="dl-scene" suppressHydrationWarning>
              <ConversationScene />
            </div>
            {/* Must come after .dl-scene so the scene is already parsed when this runs. */}
            <script dangerouslySetInnerHTML={{ __html: holdSceneScript }} />
          </section>

          <section aria-labelledby="facts-heading" className="border-t border-border py-16 sm:py-24">
            <h2
              id="facts-heading"
              className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            >
              The small signals that make a conversation feel live.
            </h2>

            <ul className="mt-12 divide-y divide-border border-y border-border">
              {facts.map((fact) => (
                <li
                  key={fact.title}
                  className="grid gap-6 py-8 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center md:gap-12 md:py-10"
                >
                  <div className="max-w-md">
                    <h3 className="text-xl font-semibold tracking-tight">{fact.title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{fact.body}</p>
                  </div>
                  <div>{fact.detail}</div>
                </li>
              ))}
            </ul>

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
