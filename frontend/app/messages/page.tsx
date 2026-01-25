'use client';

import ChatSidebar from '@/components/chatSidebar';
import ConversationArea from '@/components/conversationArea';
import ConversationDetails from '@/components/conversationDetails';
import { useState } from 'react';

export default function MessagesPage() {
  const [showConversationDetails, setShowConversationDetails] = useState<boolean>(false);

  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <ChatSidebar />
      <ConversationArea onToggle={() => setShowConversationDetails(!showConversationDetails)} />

      {showConversationDetails && <ConversationDetails />}
    </div>
  );
}
