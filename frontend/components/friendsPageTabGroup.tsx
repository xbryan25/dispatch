import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { Icon } from '@iconify/react';
import { Search } from 'lucide-react';

import { useFriendsStore } from '@/store/useFriendsStore';

import { useState, useEffect } from 'react';

import FriendsPageTab from './friendsPageTab';

export default function FriendsPageTabGroup() {
  const [sortState, setSortState] = useState<'ascending' | 'descending'>('ascending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

  type UserType = 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';
  const userTypes: UserType[] = ['friends', 'pending', 'requests', 'formerFriends', 'addFriend'];

  const hasUsers = useFriendsStore((state) => state.users.length > 0);
  const loading = useFriendsStore((state) => state.loading);

  const changeSort = () => {
    setSortState((prev) => (prev === 'ascending' ? 'descending' : 'ascending'));
  };

  const formatUserType = (text: string): string => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Debounce after 500 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <Tabs defaultValue="friends" className="flex-1 w-full">
      <div className="flex gap-5 justify-between">
        <TabsList>
          {userTypes.map((userType: UserType) => (
            <TabsTrigger key={userType} value={userType} className="cursor-pointer">
              {formatUserType(userType)}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex gap-2">
          <InputGroup className="max-w-xl">
            <InputGroupInput
              placeholder="Search username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading || !hasUsers}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <Button
            className="cursor-pointer min-w-35"
            onClick={changeSort}
            disabled={loading || !hasUsers}
          >
            <div className="flex items-center">
              <Icon
                icon="material-symbols:keyboard-arrow-up"
                className={`size-6 transition-transform duration-200 ${
                  sortState === 'descending' ? 'rotate-180' : 'rotate-0'
                }`}
              />
              <span className="capitalize">{sortState}</span>
            </div>
          </Button>
        </div>
      </div>

      {userTypes.map((userType: UserType) => (
        <TabsContent key={userType} value={userType}>
          <FriendsPageTab
            userType={userType}
            sortState={sortState}
            searchQuery={debouncedSearchQuery}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
