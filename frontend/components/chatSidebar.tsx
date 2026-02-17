'use client';

import { useRouter } from 'next/navigation';

import ThemeToggleButton from './themeToggleButton';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Input } from '@/components/ui/input';

import { Search } from 'lucide-react';

import ChatList from './chatList';

import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Icon } from '@iconify/react';

import { useLogout } from '@/hooks/useAuth';

import { useState } from 'react';

import { toast } from 'sonner';

export default function ChatSidebar() {
  const router = useRouter();

  const [isClickedLogoutButton, setIsClickedLogoutButton] = useState<boolean>(false);

  const { logoutUser } = useLogout();

  const userLogout = async () => {
    setIsClickedLogoutButton(true);

    const { error: loginError } = await logoutUser();

    console.log(loginError);

    if (loginError) {
      toast.error(`Logout failed failed. ${loginError}.`);
    } else {
      toast.success('Logout successful. Thanks for using Dispatch!');
      router.push('/login');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 h-full max-w-125 min-w-0">
      <div className="flex justify-between w-full">
        <h2 className="font-bold text-2xl">Conversations</h2>

        <div className="flex gap-2">
          <ThemeToggleButton />

          <Popover>
            <PopoverTrigger asChild>
              <Button className="cursor-pointer">
                <Icon icon="material-symbols:settings" className="size-4 cursor-pointer"></Icon>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex flex-col gap-3">
              <PopoverHeader>
                <PopoverTitle className="text-xl font-bold">Settings</PopoverTitle>
              </PopoverHeader>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
                    <Icon icon="material-symbols:person" className="size-4" />
                    Update profile
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                      Update your details below. Changes take a moment to sync everywhere.
                    </DialogDescription>
                    <div className="flex w-full gap-2 pt-2">
                      <div className="w-full max-w-md">
                        <form className="flex flex-col gap-5">
                          <FieldGroup className="flex flex-col gap-3">
                            <Field>
                              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>

                              <div className="flex flex-col gap-2">
                                <Input
                                  id="fullName"
                                  type="text"
                                  placeholder="[Current full name]"
                                />
                              </div>
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="gender">Gender</FieldLabel>

                              <div className="flex flex-col gap-2">
                                <Select>
                                  <SelectTrigger className="w-full max-w-full">
                                    <SelectValue placeholder="Select a new gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Gender</SelectLabel>
                                      <SelectItem value="apple">Male</SelectItem>
                                      <SelectItem value="banana">Female</SelectItem>
                                      <SelectItem value="blueberry">Others</SelectItem>
                                      <SelectItem value="grapes">Prefer not to say</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </Field>

                            <Field>
                              <FieldLabel htmlFor="fullName">Username</FieldLabel>

                              <div className="flex flex-col gap-2">
                                <Input id="username" type="text" placeholder="[Current username]" />
                              </div>
                            </Field>

                            <Field orientation="horizontal">
                              <Button type="submit" className="w-full cursor-pointer text-lg">
                                Login
                              </Button>
                            </Field>
                          </FieldGroup>
                        </form>
                      </div>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
                    <Icon icon="material-symbols:logout" className="size-4" />
                    Logout?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to logout?</DialogTitle>
                    <DialogDescription>
                      You will be redirected to the login page if you click Logout.
                    </DialogDescription>
                    <div className="flex w-full gap-2 pt-2">
                      <Button
                        className="flex-1 cursor-pointer text-md"
                        onClick={() => userLogout()}
                        disabled={isClickedLogoutButton}
                      >
                        Logout
                      </Button>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <InputGroup className="w-full shrink-0">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <ChatList />
    </div>
  );
}
