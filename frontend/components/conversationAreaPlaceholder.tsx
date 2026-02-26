import { useSidebarStore } from '@/store/useSidebarStore';

export default function ConversationAreaPlaceholder() {
  const hasChats = useSidebarStore((state) => state.conversationSnippets.length > 0);

  return (
    <div className="flex-3 flex flex-col justify-center items-center gap-2 bg-white dark:bg-stone-900 rounded-xl">
      <h1 className="font-semibold text-3xl tracking-tight">
        {hasChats
          ? 'Select a conversation and jump back in!'
          : 'Ready to break the ice? Start your first chat.'}
      </h1>

      {!hasChats && (
        <p className="text-muted-foreground">
          {"You don't have any messages yet. Search for a friend to begin."}
        </p>
      )}
    </div>
  );
}
