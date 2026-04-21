import { useState } from 'react';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import DeleteNotificationDialog from '@/components/notifications/deleteNotificationDialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

import { SortState } from '@/types/global';
import {
  ReadStateForSelect,
  NotificationsToShow,
  Notification,
  ReadState,
} from '@/types/notifications';

interface NotificationPageHeaderProps {
  onResetSelection: () => void;
  selectedRows: Notification[];
  readStateMajority: ReadState;
}

export default function NotificationPageHeader({
  onResetSelection,
  selectedRows,
  readStateMajority,
}: NotificationPageHeaderProps) {
  const notifications = useNotificationsStore((state) => state.notifications);
  const isInitialLoad = useNotificationsStore((state) => state.isInitialLoad);

  const unreadNotifications = useNotificationsStore((state) => state.unreadNotifications);

  const readState = useNotificationsStore((state) => state.readState);

  const sortState = useNotificationsStore((state) => state.sortState);

  const notificationsToShow = useNotificationsStore((state) => state.notificationsToShow);

  const [dialogOpen, setDialogOpen] = useState(false);

  const markLoading = useNotificationsStore((state) => state.markLoading);

  const deleteLoading = useNotificationsStore((state) => state.deleteLoading);

  const { setReadState, setSortState, setNotificationsToShow, setMarkLoading, setDeleteLoading } =
    useNotificationsStore();

  const updateNotificationsReadStatus = useNotificationsStore(
    (state) => state.updateNotificationsReadStatus
  );

  return (
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
                onResetSelection();
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

      <DeleteNotificationDialog
        isOpen={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          onResetSelection();
          setDeleteLoading(false);
        }}
        notificationIds={selectedRows.map((row) => row.notificationId)}
      />
    </div>
  );
}
