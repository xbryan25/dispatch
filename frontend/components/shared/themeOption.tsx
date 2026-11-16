import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function ThemeOption({
  id,
  label,
  color,
  isSelected = false,
  onSelect,
}: {
  id: string;
  label: string;
  color: string;
  isSelected?: boolean;
  onSelect: (themeId: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition-colors',
        isSelected
          ? 'bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200'
          : 'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800'
      )}
      onClick={() => onSelect(id)}
    >
      <span
        className={cn(
          'size-5 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-stone-900',
          color,
          isSelected ? 'ring-amber-400' : 'ring-transparent'
        )}
      />
      <span className="flex-1 truncate">{label}</span>
      {isSelected && <Check className="size-4 shrink-0" aria-hidden="true" />}
    </button>
  );
}
