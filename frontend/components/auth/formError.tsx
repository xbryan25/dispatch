import { Icon } from '@iconify/react';
import { ReactNode } from 'react';

export default function FormError({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="mt-1 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs text-rose-700"
    >
      <Icon
        icon="lucide:circle-alert"
        className="size-4 shrink-0 text-rose-600"
        aria-hidden="true"
      />
      <span>{children}</span>
    </div>
  );
}
