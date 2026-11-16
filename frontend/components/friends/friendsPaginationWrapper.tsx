'use client';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

import PaginationButtons from '@/components/friends/paginationButtons';

export default function FriendsPaginationWrapper() {
  const hasUsers = useFriendsStore((state) => state.users.length > 0);
  const totalPages = useFriendsStore((state) => state.totalPages);
  const currentPage = useFriendsStore((state) => state.currentPage);

  if (!hasUsers) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:flex-row">
      <span className="text-sm text-stone-500 dark:text-stone-400">
        Page <span className="font-semibold text-stone-800 dark:text-stone-200">{currentPage}</span>{' '}
        of {Math.max(totalPages, 1)}
      </span>
      <div>
        <PaginationButtons />
      </div>
    </div>
  );
}
