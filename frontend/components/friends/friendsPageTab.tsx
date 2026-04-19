import UserCard from './userCard';
import LoadingSpinner from '../shared/loadingSpinner';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

export default function FriendsPageTab() {
  const users = useFriendsStore((state) => state.users);
  const loading = useFriendsStore((state) => state.loading);
  const isRateLimited = useFriendsStore((state) => state.isRateLimited);
  const userType = useFriendsStore((state) => state.userType);
  const searchQuery = useFriendsStore((state) => state.searchQuery);

  const pageSize = 24;
  const emptySlots = pageSize - users.length;

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

  return (
    <div
      className={`h-full font-sans p-4 px-30 ${users.length === 0 || loading ? 'flex items-center justify-center' : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3'}`}
    >
      {loading && <LoadingSpinner />}

      {!loading && users.length === 0 && (
        <div className="text-center">
          <h2 className="text-2xl font-medium">
            {isRateLimited[userType]
              ? 'Too many requests. Please try again in a minute.'
              : getNoUsersPlaceholderMessage()}
          </h2>
        </div>
      )}

      {!loading &&
        !isRateLimited[userType] &&
        users.length > 0 &&
        users.map((userInfo) => <UserCard key={userInfo.userId} userInfo={userInfo} />)}

      {!loading &&
        !isRateLimited[userType] &&
        users.length > 0 &&
        Array.from({ length: emptySlots }).map((_, index) => (
          <div key={`placeholder-${index}`} className=" w-80 md:w-full h-27 opacity-50"></div>
        ))}
    </div>
  );
}
