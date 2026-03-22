'use client';

import { Button } from './ui/button';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import MessageThread from './messageThread';

import { useChatStore } from '@/store/useChatStore';

import { useState, useEffect } from 'react';
import MessageInput from './messageInput';

interface ConversationAreaProps {
  onToggle: (newVal?: boolean) => void; // This is a function prop
}

export default function ConversationArea({ onToggle }: ConversationAreaProps) {
  const [formattedLastOnline, setFormattedLastOnline] = useState<string>('');

  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const otherParticipantFriendshipStatus = useChatStore(
    (state) => state.otherParticipantFriendshipStatus
  );

  const otherParticipantIsOnline = useChatStore((state) => state.otherParticipantIsOnline);
  const otherParticipantLastOnline = useChatStore((state) => state.otherParticipantLastOnline);

  useEffect(() => {
    if (otherParticipantFriendshipStatus !== 'accepted') {
      onToggle(false);
    }
  }, [otherParticipantFriendshipStatus, onToggle]);

  const formatRelativeTime = (date: Date) => {
    const start = date.getTime();
    const now = Date.now();
    const diffInSeconds = Math.floor((now - start) / 1000);

    if (diffInSeconds < 60) return '1m';

    const units = [
      { label: 'm', seconds: 60 },
      { label: 'h', seconds: 3600 },
      { label: 'd', seconds: 86400 },
      { label: 'w', seconds: 604800 },
      { label: 'mo', seconds: 2592000 },
      { label: 'y', seconds: 31536000 },
    ];

    for (let i = units.length - 1; i >= 0; i--) {
      if (diffInSeconds >= units[i].seconds) {
        return `${Math.floor(diffInSeconds / units[i].seconds)}${units[i].label}`;
      }
    }
    return '1m';
  };

  useEffect(() => {
    const update = () => {
      let timeStr: string = '';

      if (otherParticipantLastOnline != null) {
        timeStr = formatRelativeTime(otherParticipantLastOnline);
      }
      setFormattedLastOnline(timeStr || '');
    };

    update();

    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, [otherParticipantLastOnline]);

  return (
    <div className="flex-3 flex flex-col justify-start gap-2 bg-white dark:bg-stone-900 rounded-xl">
      <div className="flex justify-between p-2 gap-3">
        <div className="flex gap-3">
          <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full ">
            <Image
              src={
                otherParticipantDetails?.profileImageUrl
                  ? otherParticipantDetails.profileImageUrl
                  : '/blank_picture.png'
              }
              alt="User avatar"
              fill
              sizes="96px" // Helps Next.js optimize the download size
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold">{otherParticipantDetails?.username}</h3>
            {otherParticipantIsOnline ? (
              <div className="flex gap-1 items-center">
                <div className="bg-green-400 size-2 rounded-full"></div>
                <p className="">Active now</p>
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <p className="">Last active {formattedLastOnline} ago</p>
              </div>
            )}
          </div>
        </div>

        {otherParticipantFriendshipStatus === 'accepted' && (
          <Button className="cursor-pointer" onClick={() => onToggle()}>
            <Icon icon="bi:three-dots" />
          </Button>
        )}
      </div>

      <MessageThread />

      <MessageInput
        otherParticipantFriendshipStatus={otherParticipantFriendshipStatus}
        otherParticipantDetails={otherParticipantDetails}
      />
    </div>
  );
}
