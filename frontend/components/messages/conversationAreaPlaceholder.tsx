'use client';

import { MessageCircle, MessageSquarePlus } from 'lucide-react';

import { useSidebarStore } from '@/store/useSidebarStore';

export default function ConversationAreaPlaceholder() {
  const hasChats = useSidebarStore((state) => state.conversationSnippets.length > 0);

  const Icon = hasChats ? MessageCircle : MessageSquarePlus;

  return (
    <section className="flex flex-3 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
        <Icon className="size-6" aria-hidden="true" />
      </div>

      <h1 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
        {hasChats
          ? 'Select a conversation and jump back in!'
          : 'Ready to break the ice? Start your first chat.'}
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
        {hasChats
          ? 'Choose someone from the list on the left to continue chatting.'
          : "You don't have any messages yet. Search for a friend to begin."}
      </p>
    </section>
  );
}
