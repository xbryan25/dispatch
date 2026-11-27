import { Initial } from '@/components/landing/initial';

import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';

const defaultTheme = themes[0];
const roseTheme = themes.find((theme) => theme.id === 'rose') ?? defaultTheme;

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

export function FactsList() {
  return (
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
  );
}
