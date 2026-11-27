import { Icon } from '@iconify/react';
import { ReactNode } from 'react';

export default function FormError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div
      id={id}
      role="status"
      className="mt-1 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
    >
      <Icon
        icon="lucide:circle-alert"
        className="size-4 shrink-0 text-rose-600 dark:text-rose-400"
        aria-hidden="true"
      />
      <span>{children}</span>
    </div>
  );
}

// The success counterpart, for confirmations that should stay on screen (unlike a toast).
export function FormSuccess({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="mt-1 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
    >
      <Icon icon="lucide:mail-check" className="size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
