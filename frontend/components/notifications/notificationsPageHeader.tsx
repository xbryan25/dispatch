import { Bell, CheckCheck, Trash2 } from 'lucide-react';
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
    <section className="w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <Bell className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Notifications
              </h1>
              {unreadNotifications > 0 && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
                  {unreadNotifications} unread
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Stay up to date with activity and important updates.
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-stone-100 pt-5 dark:border-stone-800 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Inbox</span>
              <span aria-hidden="true">·</span>
              <span>{notifications.length} notifications</span>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-end xl:justify-end">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Status
                </span>
                {isInitialLoad ? (
                  <Skeleton className="h-10 w-full rounded-xl sm:w-40" />
                ) : (
                  <Select
                    onValueChange={(newReadState: ReadStateForSelect) => setReadState(newReadState)}
                    value={readState ?? 'all'}
                  >
                    <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-stone-200 bg-stone-50/70 sm:w-40 dark:border-stone-700 dark:bg-stone-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="read">Read only</SelectItem>
                        <SelectItem value="unread">Unread only</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Sort
                </span>
                {isInitialLoad ? (
                  <Skeleton className="h-10 w-full rounded-xl sm:w-40" />
                ) : (
                  <Select
                    onValueChange={(newSortState: SortState) => setSortState(newSortState)}
                    value={sortState ?? 'ascending'}
                  >
                    <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-stone-200 bg-stone-50/70 sm:w-40 dark:border-stone-700 dark:bg-stone-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ascending">Newest first</SelectItem>
                        <SelectItem value="descending">Oldest first</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Per page
                </span>
                {isInitialLoad ? (
                  <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
                ) : (
                  <Select
                    onValueChange={(newNotificationsToShow: string) =>
                      setNotificationsToShow(Number(newNotificationsToShow) as NotificationsToShow)
                    }
                    value={String(notificationsToShow) ?? '10'}
                  >
                    <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-stone-200 bg-stone-50/70 sm:w-28 dark:border-stone-700 dark:bg-stone-950">
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
              </div>

              {selectedRows.length > 1 && (
                <Button
                  variant="outline"
                  className="h-10 w-full cursor-pointer rounded-xl border-stone-200 bg-white sm:w-auto dark:border-stone-700 dark:bg-stone-900"
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
                  <CheckCheck className="size-4" /> Mark as read
                </Button>
              )}

              {selectedRows.length > 1 && (
                <Button
                  variant="destructive"
                  className="h-10 w-full cursor-pointer rounded-xl sm:w-auto"
                  disabled={markLoading || deleteLoading}
                  onClick={async () => {
                    setDialogOpen(true);
                  }}
                >
                  {deleteLoading && <Spinner data-icon="inline-start" />}
                  <Trash2 className="size-4" /> Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <DeleteNotificationDialog
        isOpen={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          onResetSelection();
          setDeleteLoading(false);
        }}
        notificationIds={selectedRows.map((row) => row.notificationId)}
      />
    </section>
  );
}
