'use client';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { Icon } from '@iconify/react';

import FriendsPageTab from '@/components/friendsPageTab';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useState } from 'react';

export default function FriendsPage() {
  const [sortState, setSortState] = useState<'ascending' | 'descending'>('ascending');

  const changeSort = () => {
    setSortState((prev) => (prev === 'ascending' ? 'descending' : 'ascending'));
  };

  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 h-full min-w-0">
        <div className="flex justify-between w-full">
          <h2 className="font-bold text-2xl">My Friends</h2>
        </div>

        <Tabs defaultValue="friends" className="flex-1 w-full">
          <div className="flex gap-5 justify-between">
            <TabsList>
              <TabsTrigger value="friends" className="cursor-pointer">
                Friends
              </TabsTrigger>
              <TabsTrigger value="pending" className="cursor-pointer">
                Pending
              </TabsTrigger>
              <TabsTrigger value="requests" className="cursor-pointer">
                Requests
              </TabsTrigger>
              <TabsTrigger value="formerFriends" className="cursor-pointer">
                Former Friends
              </TabsTrigger>
              <TabsTrigger value="addFriend" className="cursor-pointer">
                Add Friend
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <InputGroup className="max-w-xl">
                <InputGroupInput placeholder="Search username..." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>

              <Button className="cursor-pointer min-w-35" onClick={changeSort}>
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

          <TabsContent value="friends">
            <FriendsPageTab userType="friends" sortState={sortState} />
          </TabsContent>
          <TabsContent value="pending">
            <FriendsPageTab userType="pending" sortState={sortState} />
          </TabsContent>
          <TabsContent value="requests">
            <FriendsPageTab userType="requests" sortState={sortState} />
          </TabsContent>
          <TabsContent value="formerFriends">
            <FriendsPageTab userType="formerFriends" sortState={sortState} />
          </TabsContent>
          <TabsContent value="addFriend">
            <FriendsPageTab userType="addFriend" sortState={sortState} />
          </TabsContent>
        </Tabs>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
