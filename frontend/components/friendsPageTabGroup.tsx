import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { Icon } from '@iconify/react';
import { Search } from 'lucide-react';

import { useFriendsStore } from '@/store/useFriendsStore';

import { useState, useEffect } from 'react';

import FriendsPageTab from './friendsPageTab';

import { UserCategory } from '@/types/friends';

export default function FriendsPageTabGroup() {
  const sortState = useFriendsStore((state) => state.sortState);
  const setSortState = useFriendsStore((state) => state.setSortState);
  const setSearchQuery = useFriendsStore((state) => state.setSearchQuery);
  const setUserType = useFriendsStore((state) => state.setUserType);

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
    const timer = setTimeout(() => {
      setSearchQuery(preDebouncedSearchQuery.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [preDebouncedSearchQuery, setSearchQuery]);

  return (
    <Tabs defaultValue="friends" className="flex-1 w-full">
      <div className="flex gap-5 justify-between">
        <TabsList>
          {userTypes.map((userType: UserCategory) => (
            <TabsTrigger
              key={userType}
              value={userType}
              className="cursor-pointer"
              onClick={() => setUserType(userType)}
            >
              {formatUserType(userType)}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex gap-2">
          <InputGroup className="max-w-xl">
            <InputGroupInput
              placeholder="Search username..."
              value={preDebouncedSearchQuery}
              onChange={(e) => setPreDebouncedSearchQuery(e.target.value)}
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

      {userTypes.map((userType: UserCategory) => (
        <TabsContent key={userType} value={userType}>
          <FriendsPageTab />
        </TabsContent>
      ))}
    </Tabs>
  );
}
