import { cn } from '@/lib/utils';

export type SettingsRowTone = 'neutral' | 'danger';

// Row button used in the conversation details "Conversation settings" list.
export const settingsRowClass = (tone: SettingsRowTone = 'neutral', disabled = false) =>
  cn(
    'flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm font-medium transition-colors',
    disabled
      ? 'cursor-not-allowed opacity-50'
      : tone === 'danger'
        ? 'cursor-pointer hover:bg-red-50 dark:hover:bg-red-400/10'
        : 'cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800',
    tone === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-stone-700 dark:text-stone-200'
  );

export const settingsRowIconTileClass = (tone: SettingsRowTone = 'neutral') =>
  cn(
    'flex size-9 shrink-0 items-center justify-center rounded-xl',
    tone === 'danger'
      ? 'bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-400'
      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
  );
