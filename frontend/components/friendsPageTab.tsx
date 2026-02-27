import UserCard from './userCard';

interface FriendsPageTabProps {
  userType: 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';
}

export default function FriendsPageTab({ userType }: FriendsPageTabProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-4 grid-rows-4 h-full gap-3 overflow-hidden font-sans p-4 px-30">
        {Array(16)
          .fill(0)
          .map((_, index) => (
            <UserCard key={index} userType={userType} />
          ))}
      </div>
    </div>
  );
}
