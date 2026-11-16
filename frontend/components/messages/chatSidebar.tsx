'use client';

import { MessageSquare, Search } from 'lucide-react';

import { useSidebarStore } from '@/store/useSidebarStore';

import ChatList from '@/components/messages/chatList';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { cn } from '@/lib/utils';

export default function ChatSidebar({ className }: { className?: string }) {
  const conversationCount = useSidebarStore((state) => state.conversationSnippets.length);
  const isLoading = useSidebarStore((state) => state.isLoading);

  return (
    <aside
      className={cn(
        'flex h-full min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-5 md:max-w-xs lg:max-w-sm xl:max-w-125',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
          <MessageSquare className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Conversations
            </h1>
            {!isLoading && conversationCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
                {conversationCount}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Pick up where you left off.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 border-t border-stone-100 pt-5 dark:border-stone-800">
        <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          Search
        </span>
        <InputGroup className="h-10 w-full rounded-xl border-stone-200 bg-stone-50/70 shadow-none dark:border-stone-700 dark:bg-stone-950">
          <InputGroupInput placeholder="Search conversations..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <ChatList />
    </aside>
  );
}
