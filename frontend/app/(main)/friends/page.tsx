'use client';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FriendsTab from '@/components/friendsTab';

export default function FriendsPage() {
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
              <TabsTrigger value="removed" className="cursor-pointer">
                Removed
              </TabsTrigger>
              <TabsTrigger value="addFriend" className="cursor-pointer">
                Add Friend
              </TabsTrigger>
            </TabsList>
            <InputGroup className="max-w-md ">
              <InputGroupInput placeholder="Search username..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <TabsContent value="friends">
            <FriendsTab />
          </TabsContent>
          <TabsContent value="pending">
            <FriendsTab />
          </TabsContent>
          <TabsContent value="requests">
            <FriendsTab />
          </TabsContent>
          <TabsContent value="removed">
            <FriendsTab />
          </TabsContent>
          <TabsContent value="addFriend">
            <FriendsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
