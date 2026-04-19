'use client';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

import PaginationButtons from '@/components/friends/paginationButtons';

export default function FriendsPaginationWrapper() {
  const hasUsers = useFriendsStore((state) => state.users.length > 0);
  return (
    <div className="min-h-12.5 flex items-center justify-center">
      {hasUsers && <PaginationButtons />}
    </div>
  );
}
