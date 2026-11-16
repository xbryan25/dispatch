import { Skeleton } from '@/components/ui/skeleton';

// Bubble widths alternate sides to mimic a real thread while it loads.
const bubbles: { side: 'left' | 'right'; width: string }[] = [
  { side: 'left', width: 'w-48' },
  { side: 'left', width: 'w-64' },
  { side: 'right', width: 'w-40' },
  { side: 'right', width: 'w-56' },
  { side: 'left', width: 'w-36' },
  { side: 'right', width: 'w-72' },
];

export default function ConversationLoadingSkeleton() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="flex h-full flex-3 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 p-4 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="size-9 rounded-xl" />
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 p-4">
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${bubble.side === 'right' ? 'justify-end' : ''}`}
          >
            {bubble.side === 'left' && <Skeleton className="size-8 shrink-0 rounded-full" />}
            <Skeleton className={`h-9 max-w-[70%] rounded-2xl ${bubble.width}`} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-stone-100 p-4 dark:border-stone-800">
        <Skeleton className="h-11 flex-1 rounded-2xl" />
        <Skeleton className="size-11 rounded-2xl" />
      </div>

      <span className="sr-only">Loading conversation...</span>
    </section>
  );
}
