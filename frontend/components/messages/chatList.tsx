'use client';

import { MessagesSquare } from 'lucide-react';
import { useEffect } from 'react';

import { useSidebarStore } from '@/store/useSidebarStore';

import ConversationTab from '@/components/messages/conversationTab';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatList() {
  const conversationSnippets = useSidebarStore((state) => state.conversationSnippets);
  const isLoading = useSidebarStore((state) => state.isLoading);

  const { getConversations } = useSidebarStore();

  useEffect(() => {
    getConversations();
  }, []);

  if (conversationSnippets.length == 0 && !isLoading) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 px-6 text-center dark:border-stone-700">
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300">
          <MessagesSquare className="size-5" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          No conversations yet
        </h2>
        <p className="mt-1.5 max-w-xs text-sm leading-6 text-stone-500 dark:text-stone-400">
          Start messaging people so that they show up here!
        </p>
      </div>
    );
  } else if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="flex w-full flex-1 flex-col gap-1">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-xl p-2.5">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading conversations...</span>
      </div>
    );
  } else {
    return (
      <div className="-mx-2 flex h-0 min-w-0 flex-1 flex-col gap-1 overflow-y-auto px-2">
        {conversationSnippets.map((conversationSnippet) => {
          return (
            <ConversationTab
              key={conversationSnippet.conversationId}
              conversationSnippet={conversationSnippet}
            />
          );
        })}
      </div>
    );
  }
}
