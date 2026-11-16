import FriendsPageTabGroup from '@/components/friends/friendsPageTabGroup';
import FriendsPaginationWrapper from '@/components/friends/friendsPaginationWrapper';

export default function FriendsPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 font-sans dark:bg-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-6">
        <FriendsPageTabGroup />

        <FriendsPaginationWrapper />
      </div>
    </main>
  );
}
