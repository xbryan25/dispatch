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
import { useFriendsStore } from '@/store/useFriendsStore';

interface FriendsPageTabProps {
  userType: 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';
  sortState: 'ascending' | 'descending';
  searchQuery: string;
}

export default function FriendsPageTab({ userType, sortState, searchQuery }: FriendsPageTabProps) {
  const users = useFriendsStore((state) => state.users);
  const loading = useFriendsStore((state) => state.loading);

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
    return searchQuery !== ''
      ? `We looked everywhere, but we couldn't find a user named '${searchQuery}'.`
      : messages[userType] || 'No users found.';
  };

  const loadData = useCallback(async () => {
    const apiMap: Record<string, () => Promise<void>> = {
      friends: () => getFriends(sortState, searchQuery),
      pending: () => getProfilesOfSentRequests(sortState, searchQuery),
      requests: () => getProfilesOfReceivedRequests(sortState, searchQuery),
      formerFriends: () => getProfilesOfFormerFriends(sortState, searchQuery),
      addFriend: () => getSuggestedProfiles(sortState, searchQuery),
    };

    const fetchFunc = apiMap[userType];
    if (!fetchFunc) return;

    try {
      await fetchFunc();
    } catch (err) {
      console.error('System error:', err);
    }
  }, [
    userType,
    sortState,
    searchQuery,
    getFriends,
    getProfilesOfSentRequests,
    getProfilesOfReceivedRequests,
    getProfilesOfFormerFriends,
    getSuggestedProfiles,
  ]);

  useEffect(() => {
    loadData();
  }, [sortState, loadData]);

  return (
    <div
      className={`h-full font-sans p-4 px-30 ${users.length === 0 || loading ? 'flex items-center justify-center' : 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] grid-rows-[repeat(auto-fill,minmax(110px,1fr))] gap-3'}`}
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
