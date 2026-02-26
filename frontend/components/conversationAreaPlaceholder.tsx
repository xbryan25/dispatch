import { useSidebarStore } from '@/store/useSidebarStore';
import LoadingSpinner from './loadingSpinner';

export default function ConversationAreaPlaceholder() {
  const { conversationSnippets, isLoading } = useSidebarStore();

  return (
    <div className="flex-3 flex justify-center items-center gap-2 bg-white dark:bg-stone-900 rounded-xl">
      {isLoading && (
        <div className="flex-1 flex w-full gap-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <h1 className="font-semibold text-3xl">
          {conversationSnippets.length == 0
            ? 'Ready to break the ice? Start your first chat.'
            : 'Select a conversation and jump back in!'}
        </h1>
      )}
    </div>
  );
}
