import { SendHorizontal } from 'lucide-react';

import { Initial } from '@/components/landing/initial';

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

function Scene() {
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

export function ConversationScene() {
  return (
    <>
      <style>{sceneStyles}</style>
      {/* data-hold is set by the script below before hydration. */}
      <div className="dl-scene" suppressHydrationWarning>
        <Scene />
      </div>
      {/* Must come after .dl-scene so the scene is already parsed when this runs. */}
      <script dangerouslySetInnerHTML={{ __html: holdSceneScript }} />
    </>
  );
}
