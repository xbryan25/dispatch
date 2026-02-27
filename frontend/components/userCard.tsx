import { Icon } from '@iconify/react';
import { Button } from './ui/button';
import Link from 'next/link';
import UnfriendDialog from './unfriendDialog';

export default function UserCard() {
  return (
    <div className="h-full w-full flex items-center bg-stone-200 dark:bg-stone-700 rounded-lg transition-transform duration-500 hover:scale-102 px-2 gap-2">
      <div className="h-22 w-22 rounded-full bg-stone-600"></div>
      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        <h2 className="font-semibold">xbryan25</h2>
        <h3 className="text-xs">Bryan Agan</h3>
        <h3 className="text-xs">30 friends</h3>
        <h3 className="text-xs">5 mutual friends</h3>
      </div>

      <div className="flex flex-col items-start justify-start gap-4">
        <Link href="/messages">
          <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
            <Icon icon="material-symbols:chat" width="20" height="20" />
          </Button>
        </Link>

        <UnfriendDialog />
      </div>
    </div>
  );
}
