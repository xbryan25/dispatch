'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { useChatStore } from '@/store/useChatStore';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import ConversationArea from '@/components/messages/conversationArea';
import ConversationDetails from '@/components/messages/conversationDetails';
import ConversationLoadingSkeleton from '@/components/messages/conversationLoadingSkeleton';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

export default function SpecificConversationPage() {
  const params = useParams();
  const conversationId: string = params.conversationId as string;

  const {
    resetConversation,
    getPastMessages,
    getOtherParticipant,
    getActiveConversationTheme,
    markAsRead,
  } = useChatStore();

  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const [showConversationDetails, setShowConversationDetails] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const fetchedIdRef = useRef<string | null>(null);

  // Details sit inline as a third column on wide screens and slide over as a sheet otherwise.
  const isWideScreen = useMediaQuery('(min-width: 1280px)');

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
            isDetailsOpen={showConversationDetails}
            onToggle={(newVal?: boolean) => {
              setShowConversationDetails(newVal ?? !showConversationDetails);
            }}
          />
          {isWideScreen ? (
            showConversationDetails && (
              <ConversationDetails
                onToggle={(newVal?: boolean) => {
                  setShowConversationDetails(newVal ?? !showConversationDetails);
                }}
              />
            )
          ) : (
            <Sheet open={showConversationDetails} onOpenChange={setShowConversationDetails}>
              <SheetContent
                side="right"
                className="w-full gap-0 border-stone-200 bg-white p-0 sm:max-w-sm dark:border-stone-800 dark:bg-stone-900"
              >
                <SheetTitle className="sr-only">Conversation details</SheetTitle>
                <SheetDescription className="sr-only">
                  Profile and settings for this conversation.
                </SheetDescription>
                <ConversationDetails
                  className="max-w-none rounded-none border-0 pt-12 shadow-none"
                  onToggle={(newVal?: boolean) => {
                    setShowConversationDetails(newVal ?? !showConversationDetails);
                  }}
                />
              </SheetContent>
            </Sheet>
          )}
        </>
      ) : (
        <ConversationLoadingSkeleton />
      )}
    </>
  );
}
