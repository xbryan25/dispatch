'use client';

import { notificationTableColumns } from '@/columns/notificationTableColumns';
import { DataTable } from '@/components/ui/data-table';
import { NotificationsToShow, ReadStateForSelect } from '@/types/notifications';

import { useEffect } from 'react';

import LoadingSpinner from '@/components/loadingSpinner';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortState } from '@/types/global';
import { Skeleton } from '@/components/ui/skeleton';

import { Notification } from '@/types/notifications';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const loading = useNotificationsStore((state) => state.loading);
  const isInitialLoad = useNotificationsStore((state) => state.isInitialLoad);

  const getNotifications = useNotificationsStore((state) => state.getNotifications);
  const updateNotificationsReadStatus = useNotificationsStore(
    (state) => state.updateNotificationsReadStatus
  );

  const readState = useNotificationsStore((state) => state.readState);
  const setReadState = useNotificationsStore((state) => state.setReadState);

  const sortState = useNotificationsStore((state) => state.sortState);
  const setSortState = useNotificationsStore((state) => state.setSortState);

  const notificationsToShow = useNotificationsStore((state) => state.notificationsToShow);
  const setNotificationsToShow = useNotificationsStore((state) => state.setNotificationsToShow);

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="flex min-h-screen gap-6 bg-zinc-200 dark:bg-stone-800 font-sans p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 min-h-screen min-w-0">
        <div className="flex justify-between w-full">
          <h2 className="font-bold text-2xl">Notifications</h2>

          <div className="flex gap-2">
            {isInitialLoad ? (
              <Skeleton className="h-9 w-43 rounded-sm" />
            ) : (
              <Select
                onValueChange={(newReadState: ReadStateForSelect) => setReadState(newReadState)}
                value={readState ?? 'all'}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Show All</SelectItem>
                    <SelectItem value="read">Show Only Read</SelectItem>
                    <SelectItem value="unread">Show Only Unread</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {isInitialLoad ? (
              <Skeleton className="h-9 w-43 rounded-sm" />
            ) : (
              <Select
                onValueChange={(newSortState: SortState) => setSortState(newSortState)}
                value={sortState ?? 'ascending'}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ascending">Show Newest First</SelectItem>
                    <SelectItem value="descending">Show Latest First</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {isInitialLoad ? (
              <Skeleton className="h-9 w-20 rounded-sm" />
            ) : (
              <Select
                onValueChange={(newNotificationsToShow: string) =>
                  setNotificationsToShow(Number(newNotificationsToShow) as NotificationsToShow)
                }
                value={String(notificationsToShow) ?? '10'}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {isInitialLoad ? (
              <Skeleton className="h-9 w-20 rounded-sm" />
            ) : (
              <Button>Mark as read</Button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={notificationTableColumns(updateNotificationsReadStatus)}
            data={notifications}
            getRowClassName={(row: Notification) =>
              row.isReadByReceiver ? 'bg-stone-100 dark:bg-stone-800' : ''
            }
          />
        )}
      </div>
    </div>
  );
}
