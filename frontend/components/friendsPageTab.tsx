import { useEffect, useState } from 'react';
import UserCard from './userCard';
import LoadingSpinner from './loadingSpinner';

interface FriendsPageTabProps {
  userType: 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';
}

export default function FriendsPageTab({ userType }: FriendsPageTabProps) {
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   console.log(userType);
  // }, [userType]);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // 2. Use it in your useEffect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await sleep(2000); // Wait for 2 seconds

      setLoading(false);
    };

    loadData();
  }, [userType]);

  return (
    <div className="flex flex-col h-full justify-center">
      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-full gap-3 overflow-hidden font-sans p-4 px-30">
          {Array(25)
            .fill(0)
            .map((_, index) => (
              <UserCard key={index} userType={userType} />
            ))}
        </div>
      )}
    </div>
  );
}
