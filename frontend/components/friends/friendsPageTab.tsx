import { AlertTriangle, SearchX, Users } from 'lucide-react';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

import UserCard from '@/components/friends/userCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FriendsPageTab() {
  const users = useFriendsStore((state) => state.users);
  const loading = useFriendsStore((state) => state.loading);
  const isRateLimited = useFriendsStore((state) => state.isRateLimited);
  const userType = useFriendsStore((state) => state.userType);
  const searchQuery = useFriendsStore((state) => state.searchQuery);

  const getNoUsersPlaceholderMessage = () => {
    const messages = {
      friends: 'Your friends list is empty. Time to find some people!',
      pending: 'No outgoing requests. Looking for someone specific?',
      requests: 'No new requests right now. Check back later!',
      formerFriends: 'No old friends to show.',
      addFriend: "You've reached out to everyone! Check again later for new members.",
    };

    // Fallback to a default message if the type isn't found
    return searchQuery !== ''
      ? `We looked everywhere, but we couldn't find a user named '${searchQuery}'.`
      : messages[userType] || 'No users found.';
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <Skeleton className="size-14 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="size-9 shrink-0 rounded-xl" />
          </div>
        ))}
        <span className="sr-only">Loading users...</span>
      </div>
    );
  }

  if (users.length === 0 || isRateLimited[userType]) {
    const rateLimited = isRateLimited[userType];
    const EmptyIcon = rateLimited ? AlertTriangle : searchQuery !== '' ? SearchX : Users;

    return (
      <div className="flex min-h-80 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 text-center dark:border-stone-700 dark:bg-stone-900">
        <div
          className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${
            rateLimited
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
              : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300'
          }`}
        >
          <EmptyIcon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          {rateLimited
            ? 'Slow down a little'
            : searchQuery !== ''
              ? 'No matches found'
              : 'Nothing here yet'}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
          {rateLimited
            ? 'Too many requests. Please try again in a minute.'
            : getNoUsersPlaceholderMessage()}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((userInfo) => (
        <UserCard key={userInfo.userId} userInfo={userInfo} />
      ))}
    </div>
  );
}
