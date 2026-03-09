'use client';

import { useParams } from 'next/navigation';

import ConversationArea from '@/components/conversationArea';

import ConversationDetails from '@/components/conversationDetails';
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useState, useRef } from 'react';
import LoadingSpinner from '@/components/loadingSpinner';

import { useGetOtherParticipantFromConversation } from '@/hooks/useChat';
import { useGetPastMessagesFromConversation } from '@/hooks/useChat';

export default function SpecificConversationPage() {
  const params = useParams();
  const conversationId: string = params.conversationId as string;

  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const resetConversation = useChatStore((state) => state.resetConversation);

  const { getOtherParticipant } = useGetOtherParticipantFromConversation();

  const { getPastMessages } = useGetPastMessagesFromConversation();

  const [showConversationDetails, setShowConversationDetails] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || fetchedIdRef.current === conversationId) return;

    console.log(`conversationId: ${conversationId}`);

    fetchedIdRef.current = conversationId;

    async function fetchData() {
      resetConversation(conversationId);
      await getPastMessages();
      await getOtherParticipant();
      setIsReady(true);
    }
    fetchData();
  }, [
    conversationId,
    setActiveConversationId,
    getPastMessages,
    getOtherParticipant,
    resetConversation,
  ]);

  return (
    <>
      {isReady ? (
        <>
          <ConversationArea onToggle={() => setShowConversationDetails(!showConversationDetails)} />
          {showConversationDetails && <ConversationDetails />}
        </>
      ) : (
        <div className="flex-3 flex justify-center items-center bg-white dark:bg-stone-900 rounded-xl">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
