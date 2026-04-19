'use client';

import { notificationTableColumns } from '@/columns/notificationTableColumns';
import { DataTable } from '@/components/ui/data-table';
import { NotificationsToShow, ReadState, ReadStateForSelect } from '@/types/notifications';

import { useCallback, useEffect, useRef, useState } from 'react';

import LoadingSpinner from '@/components/shared/loadingSpinner';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import { Row } from '@tanstack/react-table';

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
import { Spinner } from '@/components/ui/spinner';
import DeleteNotificationDialog from '@/components/friends/deleteNotificationDialog';

export default function NotificationsPage() {
  const [selectedRows, setSelectedRows] = useState<Notification[]>([]);
  const [readStateMajority, setReadStateMajority] = useState<ReadState>('read');

  const [dialogOpen, setDialogOpen] = useState(false);

  const tableRef = useRef<{ resetSelection: () => void } | null>(null);

  const notifications = useNotificationsStore((state) => state.notifications);
  const loading = useNotificationsStore((state) => state.loading);
  const isInitialLoad = useNotificationsStore((state) => state.isInitialLoad);

  const markLoading = useNotificationsStore((state) => state.markLoading);
  const setMarkLoading = useNotificationsStore((state) => state.setMarkLoading);

  const deleteLoading = useNotificationsStore((state) => state.deleteLoading);
  const setDeleteLoading = useNotificationsStore((state) => state.setDeleteLoading);

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

  const unreadNotifications = useNotificationsStore((state) => state.unreadNotifications);

  useEffect(() => {
    getNotifications();
  }, []);

  const handleSelectionChange = useCallback((rows: Row<Notification>[]) => {
    const selectedNotifications = rows.map((row) => row.original);

    setSelectedRows(selectedNotifications);

    const readCount = selectedNotifications.reduce(
      (acc, notif) => (notif.isReadByReceiver ? acc + 1 : acc),
      0
    );

    setReadStateMajority(readCount > selectedNotifications.length / 2 ? 'unread' : 'read');
  }, []);

  return (
    <div className="flex min-h-screen gap-6 bg-zinc-200 dark:bg-stone-800 font-sans p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 min-h-screen min-w-0">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-2xl">Notifications</h2>
            {unreadNotifications > 0 && <p className="text-lg">({unreadNotifications} unread)</p>}
          </div>

          {notifications.length > 0 && (
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

              {selectedRows.length > 1 && (
                <Button
                  className="cursor-pointer"
                  disabled={markLoading || deleteLoading}
                  onClick={async () => {
                    await updateNotificationsReadStatus(
                      selectedRows.map((row) => row.notificationId),
                      readStateMajority
                    );
                    tableRef.current?.resetSelection();
                    setMarkLoading(false);
                  }}
                >
                  {markLoading && <Spinner data-icon="inline-start" />}
                  Mark as read
                </Button>
              )}

              {selectedRows.length > 1 && (
                <Button
                  className="cursor-pointer"
                  disabled={markLoading || deleteLoading}
                  onClick={async () => {
                    setDialogOpen(true);
                  }}
                >
                  {deleteLoading && <Spinner data-icon="inline-start" />}
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex h-full items-center">
            <LoadingSpinner />
          </div>
        ) : notifications.length > 0 ? (
          <DataTable
            columns={notificationTableColumns()}
            data={notifications}
            onSelectionChange={handleSelectionChange}
            getRowClassName={(row: Notification) =>
              row.isReadByReceiver ? 'bg-stone-100 dark:bg-stone-800' : ''
            }
            tableRef={tableRef}
          />
        ) : (
          <div className="flex h-full items-center">
            <h2 className="font-semibold text-2xl">No notifications to show.</h2>
          </div>
        )}

        <DeleteNotificationDialog
          isOpen={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            tableRef.current?.resetSelection();
            setDeleteLoading(false);
          }}
          notificationIds={selectedRows.map((row) => row.notificationId)}
        />
      </div>
    </div>
  );
}
