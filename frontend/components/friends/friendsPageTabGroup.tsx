'use client';

import { ArrowUp, History, Inbox, Search, Send, UserPlus, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

import FriendsPageTab from '@/components/friends/friendsPageTab';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { UserCategory } from '@/types/friends';

const userTypeIcons: Record<UserCategory, typeof Users> = {
  friends: Users,
  pending: Send,
  requests: Inbox,
  formerFriends: History,
  addFriend: UserPlus,
};

const userTypeDescriptions: Record<UserCategory, string> = {
  friends: 'People you are connected with. Start a chat or manage your connections.',
  pending: 'Friend requests you have sent that are still waiting for a response.',
  requests: 'People who want to connect with you. Accept or reject their requests.',
  formerFriends: 'People you used to be friends with. Reconnect whenever you like.',
  addFriend: 'Discover new people on Dispatch and send them a friend request.',
};

export default function FriendsPageTabGroup() {
  const sortState = useFriendsStore((state) => state.sortState);

  const searchQuery = useFriendsStore((state) => state.searchQuery);

  const isRateLimited = useFriendsStore((state) => state.isRateLimited);

  const retryTimeout = useFriendsStore((state) => state.retryTimeout);

  const userType = useFriendsStore((state) => state.userType);

  const totalUsers = useFriendsStore((state) => state.totalUsers);

  const { setSortState, setSearchQuery, setUserType, loadUsersData } = useFriendsStore();

  const [preDebouncedSearchQuery, setPreDebouncedSearchQuery] = useState<string>('');

  const userTypes: UserCategory[] = [
    'friends',
    'pending',
    'requests',
    'formerFriends',
    'addFriend',
  ];

  const hasUsers = useFriendsStore((state) => state.users.length > 0);
  const loading = useFriendsStore((state) => state.loading);

  const changeSort = () => {
    if (sortState === 'ascending') {
      setSortState('descending');
    } else {
      setSortState('ascending');
    }
  };

  const formatUserType = (text: string): string => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Debounce after 500 ms
  useEffect(() => {
    // Skip when the input already matches the applied query; otherwise updating
    // searchQuery re-runs this effect and fires a duplicate search.
    if (preDebouncedSearchQuery.trim() === searchQuery) return;

    const timer = setTimeout(() => {
      setSearchQuery(preDebouncedSearchQuery.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [preDebouncedSearchQuery, searchQuery, setSearchQuery]);

  useEffect(() => {
    loadUsersData();
  }, []);

  return (
    <Tabs defaultValue="friends" className="w-full flex-1 gap-6">
      <section className="w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              <Users className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  My Friends
                </h1>
                {!loading && totalUsers > 0 && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
                    {totalUsers} {totalUsers === 1 ? 'user' : 'users'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {userTypeDescriptions[userType]}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-stone-100 pt-5 dark:border-stone-800 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                Category
              </span>
              <div className="-mx-1 overflow-x-auto px-1 pb-1">
                <TabsList className="h-auto gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-950">
                  {userTypes.map((type: UserCategory) => {
                    const TypeIcon = userTypeIcons[type];
                    return (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="h-9 cursor-pointer rounded-lg px-3 text-stone-500 data-[state=active]:bg-white data-[state=active]:text-stone-900 dark:text-stone-400 dark:data-[state=active]:border-stone-700 dark:data-[state=active]:bg-stone-800 dark:data-[state=active]:text-stone-100"
                        onClick={() => {
                          if (retryTimeout) clearTimeout(retryTimeout);
                          // setIsRateLimited(currentUserType, false);
                          setUserType(type);
                          setPreDebouncedSearchQuery('');
                        }}
                        disabled={isRateLimited[type]}
                      >
                        <TypeIcon className="size-4" />
                        {formatUserType(type)}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            <div className="grid w-full grid-cols-[1fr_auto] gap-2 sm:flex sm:w-auto sm:items-end">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Search
                </span>
                <InputGroup className="h-10 w-full rounded-xl border-stone-200 bg-stone-50/70 shadow-none sm:w-64 dark:border-stone-700 dark:bg-stone-950">
                  <InputGroupInput
                    placeholder="Search username..."
                    value={preDebouncedSearchQuery}
                    onChange={(e) => setPreDebouncedSearchQuery(e.target.value)}
                    // Never disable mid-load or mid-search, or the input loses focus while typing
                    disabled={
                      !loading && !hasUsers && searchQuery === '' && preDebouncedSearchQuery === ''
                    }
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Sort
                </span>
                <Button
                  variant="outline"
                  className="h-10 min-w-36 cursor-pointer justify-start rounded-xl border-stone-200 bg-stone-50/70 font-normal shadow-none dark:border-stone-700 dark:bg-stone-950"
                  onClick={changeSort}
                  disabled={loading || !hasUsers}
                >
                  <ArrowUp
                    className={`size-4 text-stone-500 transition-transform duration-200 ${
                      sortState === 'descending' ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                  <span className="capitalize">{sortState}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {userTypes.map((type: UserCategory) => (
        <TabsContent key={type} value={type} className="flex flex-col">
          <FriendsPageTab />
        </TabsContent>
      ))}
    </Tabs>
  );
}
