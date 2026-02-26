'use client';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FriendsPage() {
  return (
    <div className="flex h-screen items-stretch justify-center gap-6 overflow-hidden bg-zinc-200 dark:bg-stone-800 font-sans  p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 h-full min-w-0">
        <div className="flex justify-between w-full">
          <h2 className="font-bold text-2xl">My Friends</h2>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <div className="flex gap-5 justify-between">
            <TabsList>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="removed">Removed</TabsTrigger>
              <TabsTrigger value="addFriend">Add Friend</TabsTrigger>
            </TabsList>
            <InputGroup className="max-w-md ">
              <InputGroupInput placeholder="Search username..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <TabsContent value="friends">Friends grid here</TabsContent>
          <TabsContent value="pending">Outgoing requests grid here</TabsContent>
          <TabsContent value="requests">Inbound requests grid here.</TabsContent>
          <TabsContent value="removed">Former friend grid here.</TabsContent>
          <TabsContent value="addFriend">Look for friend after debounce grid here</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
