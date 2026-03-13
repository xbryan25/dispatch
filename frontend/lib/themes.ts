export const themes = [
  {
    id: 'default',
    label: 'Default',
    sender: 'bg-blue-500 dark:bg-blue-600',
    receiver: 'bg-zinc-200 dark:bg-zinc-700',
  },
  {
    id: 'purple',
    label: 'Purple',
    sender: 'bg-purple-500 dark:bg-purple-600',
    receiver: 'bg-purple-100 dark:bg-purple-900',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    sender: 'bg-cyan-500 dark:bg-cyan-600',
    receiver: 'bg-cyan-100 dark:bg-cyan-900',
  },
  {
    id: 'rose',
    label: 'Rose',
    sender: 'bg-rose-500 dark:bg-rose-600',
    receiver: 'bg-rose-100 dark:bg-rose-900',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    sender: 'bg-emerald-500 dark:bg-emerald-600',
    receiver: 'bg-emerald-100 dark:bg-emerald-900',
  },
  {
    id: 'amber',
    label: 'Amber',
    sender: 'bg-amber-500 dark:bg-amber-600',
    receiver: 'bg-amber-100 dark:bg-amber-900',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    sender: 'bg-slate-700 dark:bg-slate-600',
    receiver: 'bg-slate-200 dark:bg-slate-800',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    sender: 'bg-orange-500 dark:bg-orange-600',
    receiver: 'bg-orange-100 dark:bg-orange-900',
  },
  {
    id: 'candy',
    label: 'Candy',
    sender: 'bg-pink-400 dark:bg-pink-500',
    receiver: 'bg-pink-100 dark:bg-pink-900',
  },
  {
    id: 'forest',
    label: 'Forest',
    sender: 'bg-green-600 dark:bg-green-700',
    receiver: 'bg-green-100 dark:bg-green-900',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    sender: 'bg-violet-400 dark:bg-violet-500',
    receiver: 'bg-violet-100 dark:bg-violet-900',
  },
  {
    id: 'coral',
    label: 'Coral',
    sender: 'bg-red-400 dark:bg-red-500',
    receiver: 'bg-red-100 dark:bg-red-900',
  },
  {
    id: 'sky',
    label: 'Sky',
    sender: 'bg-sky-500 dark:bg-sky-600',
    receiver: 'bg-sky-100 dark:bg-sky-900',
  },
  {
    id: 'mocha',
    label: 'Mocha',
    sender: 'bg-stone-600 dark:bg-stone-500',
    receiver: 'bg-stone-200 dark:bg-stone-700',
  },
  {
    id: 'arctic',
    label: 'Arctic',
    sender: 'bg-teal-500 dark:bg-teal-600',
    receiver: 'bg-teal-100 dark:bg-teal-900',
  },
  {
    id: 'grape',
    label: 'Grape',
    sender: 'bg-fuchsia-500 dark:bg-fuchsia-600',
    receiver: 'bg-fuchsia-100 dark:bg-fuchsia-900',
  },
  {
    id: 'gold',
    label: 'Gold',
    sender: 'bg-yellow-500 dark:bg-yellow-600',
    receiver: 'bg-yellow-100 dark:bg-yellow-900',
  },
  {
    id: 'charcoal',
    label: 'Charcoal',
    sender: 'bg-neutral-700 dark:bg-neutral-600',
    receiver: 'bg-neutral-200 dark:bg-neutral-800',
  },
];

export type Theme = (typeof themes)[0];
