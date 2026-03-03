import { useCallback, useEffect, useState } from 'react';
import UserCard from './userCard';
import LoadingSpinner from './loadingSpinner';
import { UserInfo } from '@/types/auth';

import {
  useGetCurrentFriends,
  useGetSentRequestsProfiles,
  useGetReceivedRequestsProfiles,
  useGetFormerFriends,
  useGetFriendSuggestions,
} from '@/hooks/useFriendship';

interface FriendsPageTabProps {
  userType: 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';
}

export default function FriendsPageTab({ userType }: FriendsPageTabProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserInfo[]>([]);

  const { getFriends } = useGetCurrentFriends();
  const { getProfilesOfSentRequests } = useGetSentRequestsProfiles();
  const { getProfilesOfReceivedRequests } = useGetReceivedRequestsProfiles();
  const { getProfilesOfFormerFriends } = useGetFormerFriends();
  const { getSuggestedProfiles } = useGetFriendSuggestions();

  const getNoUsersPlaceholderMessage = () => {
    const messages = {
      friends: 'Your friends list is empty. Time to find some people!',
      pending: 'No outgoing requests. Looking for someone specific?',
      requests: 'No new requests right now. Check back later!',
      formerFriends: 'No old friends to show.',
      addFriend: "You've reached out to everyone! Check again later for new members.",
    };

    // Fallback to a default message if the type isn't found
    return messages[userType] || 'No users found.';
  };

  const loadData = useCallback(async () => {
    const apiMap: Record<
      string,
      () => Promise<{ data: UserInfo[]; error: null } | { data: null; error: unknown }>
    > = {
      friends: getFriends,
      pending: getProfilesOfSentRequests,
      requests: getProfilesOfReceivedRequests,
      formerFriends: getProfilesOfFormerFriends,
      addFriend: getSuggestedProfiles,
    };

    const fetchFunc = apiMap[userType];
    if (!fetchFunc) return;

    setLoading(true);
    try {
      setUsers([]);

      const result = await fetchFunc();

      if (result?.data) {
        setUsers(result.data);
      } else if (result?.error) {
        console.error('Fetch error:', result.error);
      }
    } catch (err) {
      console.error('System error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    userType,
    getFriends,
    getProfilesOfFormerFriends,
    getProfilesOfReceivedRequests,
    getProfilesOfSentRequests,
    getSuggestedProfiles,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div
      className={`h-full font-sans p-4 px-30 ${users.length === 0 ? 'flex items-center justify-center' : 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] grid-rows-[repeat(auto-fill,minmax(110px,1fr))] gap-3'}`}
    >
      {loading && <LoadingSpinner />}

      {!loading && users.length == 0 && (
        <div className="text-center">
          <h2 className="text-2xl font-medium">{getNoUsersPlaceholderMessage()}</h2>
        </div>
      )}

      {!loading &&
        users.length > 0 &&
        users.map((userInfo) => (
          <UserCard
            key={userInfo.userId}
            userInfo={userInfo}
            userType={userType}
            refreshList={loadData}
          />
        ))}
    </div>
  );
}
