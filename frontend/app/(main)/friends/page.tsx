import FriendsPageTabGroup from '@/components/friends/friendsPageTabGroup';
import FriendsPaginationWrapper from '@/components/friends/friendsPaginationWrapper';

export default function FriendsPage() {
  return (
    <div className="flex min-h-screen gap-6 bg-zinc-200 dark:bg-stone-800 font-sans p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 min-h-screen min-w-0">
        <div className="flex justify-between w-full">
          <h2 className="font-bold text-2xl">My Friends</h2>
        </div>

        <FriendsPageTabGroup />

        <FriendsPaginationWrapper />
      </div>
    </div>
  );
}
