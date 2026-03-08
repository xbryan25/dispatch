'use client';

import { useParams } from 'next/navigation';

import ChatSidebar from '@/components/chatSidebar';
import ConversationArea from '@/components/conversationArea';
import ConversationAreaPlaceholder from '@/components/conversationAreaPlaceholder';
import ConversationDetails from '@/components/conversationDetails';
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useState, useRef } from 'react';
import LoadingSpinner from '@/components/loadingSpinner';
import { useSidebarStore } from '@/store/useSidebarStore';

import type { ParamValue } from 'next/dist/server/request/params';

import { useGetOtherParticipantFromConversation } from '@/hooks/useChat';
import { useGetPastMessagesFromConversation } from '@/hooks/useChat';

export default function SpecificConversationPage() {
  const params = useParams();
  const conversationId: string = params.conversationId as string;

  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  const { getOtherParticipant } = useGetOtherParticipantFromConversation();

  const { getPastMessages } = useGetPastMessagesFromConversation();

  const [showConversationDetails, setShowConversationDetails] = useState<boolean>(false);

  const isInitialLoad = useChatStore((state) => state.isInitialLoad);

  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || fetchedIdRef.current === conversationId) return;

    fetchedIdRef.current = conversationId;

    setActiveConversationId(conversationId);

    getPastMessages();
    getOtherParticipant();
  }, [conversationId, setActiveConversationId, getPastMessages, getOtherParticipant]);

  return (
    <>
      {!isInitialLoad ? (
        <>
          <ConversationArea onToggle={() => setShowConversationDetails(!showConversationDetails)} />
          {showConversationDetails && <ConversationDetails />}
        </>
      ) : (
        <div className="flex-3 flex justify-center items-center bg-white dark:bg-stone-900 rounded-xl">
          {isInitialLoad && <LoadingSpinner />}
        </div>
      )}
    </>
  );
}
