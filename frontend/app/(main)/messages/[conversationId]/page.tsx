'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { useChatStore } from '@/store/useChatStore';

import ConversationArea from '@/components/messages/conversationArea';
import ConversationDetails from '@/components/messages/conversationDetails';
import LoadingSpinner from '@/components/shared/loadingSpinner';

export default function SpecificConversationPage() {
  const params = useParams();
  const conversationId: string = params.conversationId as string;

  const resetConversation = useChatStore((state) => state.resetConversation);

  const getPastMessages = useChatStore((state) => state.getPastMessages);

  const getOtherParticipant = useChatStore((state) => state.getOtherParticipant);

  const getActiveConversationTheme = useChatStore((state) => state.getActiveConversationTheme);

  const markAsRead = useChatStore((state) => state.markAsRead);

  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const [showConversationDetails, setShowConversationDetails] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationId || fetchedIdRef.current === conversationId) return;

    fetchedIdRef.current = conversationId;

    async function fetchData() {
      resetConversation(conversationId);
      await getPastMessages(conversationId);
      await getOtherParticipant(conversationId);
      await getActiveConversationTheme(conversationId);
      setIsReady(true);

      await markAsRead(conversationId);
    }
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Clears store when user navigates away from this page
  useEffect(() => {
    return () => {
      fetchedIdRef.current = null;
    };
     
  }, []);

  return (
    <>
      {isReady && otherParticipantDetails ? (
        <>
          <ConversationArea
            onToggle={(newVal?: boolean) => {
              setShowConversationDetails(newVal ?? !showConversationDetails);
            }}
          />
          {showConversationDetails && (
            <ConversationDetails
              onToggle={(newVal?: boolean) => {
                setShowConversationDetails(newVal ?? !showConversationDetails);
              }}
            />
          )}
        </>
      ) : (
        <div className="flex-3 flex justify-center items-center bg-white dark:bg-stone-900 rounded-xl h-full">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
