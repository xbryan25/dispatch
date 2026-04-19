'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function LogoutDialog() {
  const router = useRouter();

  const [isClickedLogoutButton, setIsClickedLogoutButton] = useState<boolean>(false);

  const logoutUser = useAuthStore((state) => state.logoutUser);
  const logoutError = useAuthStore((state) => state.logoutError);

  const userLogout = async () => {
    setIsClickedLogoutButton(true);

    await logoutUser();

    if (logoutError) {
      toast.error(`Logout failed failed. ${logoutError}.`);
    } else {
      toast.success('Logout successful. Thanks for using Dispatch!');
      router.push('/login');
    }
  };

  return (
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
  );
}
