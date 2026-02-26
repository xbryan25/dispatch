'use client';

import ChatSidebar from '@/components/chatSidebar';
import ConversationArea from '@/components/conversationArea';
import ConversationAreaPlaceholder from '@/components/conversationAreaPlaceholder';
import ConversationDetails from '@/components/conversationDetails';
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loadingSpinner';
import { useSidebarStore } from '@/store/useSidebarStore';

export default function MessagesPage() {
  const [showConversationDetails, setShowConversationDetails] = useState<boolean>(false);

  const { activeConversationId, isInitialLoad } = useChatStore();
  const { isLoading } = useSidebarStore();

  useEffect(() => {
    console.log(`current conversation id: ${activeConversationId}`);
  }, [activeConversationId]);

  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <ChatSidebar />

      {activeConversationId && !isInitialLoad ? (
        <>
          <ConversationArea onToggle={() => setShowConversationDetails(!showConversationDetails)} />
          {showConversationDetails && <ConversationDetails />}
        </>
      ) : (
        <div className="flex-3 flex justify-center items-center bg-white dark:bg-stone-900 rounded-xl">
          {isLoading || isInitialLoad ? <LoadingSpinner /> : <ConversationAreaPlaceholder />}
        </div>
      )}
    </div>
  );
}
