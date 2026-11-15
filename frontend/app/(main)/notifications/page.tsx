'use client';

import { Row } from '@tanstack/react-table';
import { Bell } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import { notificationTableColumns } from '@/columns/notificationTableColumns';

import NotificationPageHeader from '@/components/notifications/notificationsPageHeader';
import NotificationLoadingTable from '@/components/notifications/notificationLoadingTable';
import { DataTable } from '@/components/ui/data-table';

import { Notification } from '@/types/notifications';
import { ReadState } from '@/types/notifications';

export default function NotificationsPage() {
  const [selectedRows, setSelectedRows] = useState<Notification[]>([]);
  const [readStateMajority, setReadStateMajority] = useState<ReadState>('read');

  const tableRef = useRef<{ resetSelection: () => void } | null>(null);

  const notifications = useNotificationsStore((state) => state.notifications);
  const loading = useNotificationsStore((state) => state.loading);

  const getNotifications = useNotificationsStore((state) => state.getNotifications);
  const columns = useMemo(() => notificationTableColumns(), []);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

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
    <main className="min-h-screen bg-stone-50 px-4 py-6 font-sans dark:bg-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-6">
        <NotificationPageHeader
          onResetSelection={() => tableRef.current?.resetSelection()}
          selectedRows={selectedRows}
          readStateMajority={readStateMajority}
        />

        {loading ? (
          <NotificationLoadingTable />
        ) : notifications.length > 0 ? (
          <DataTable
            columns={columns}
            data={notifications}
            onSelectionChange={handleSelectionChange}
            getRowClassName={(row: Notification) =>
              row.isReadByReceiver
                ? 'bg-stone-50/70 text-stone-500 dark:bg-stone-900/50 dark:text-stone-400'
                : 'bg-white dark:bg-stone-900'
            }
            tableRef={tableRef}
          />
        ) : (
          <div className="flex min-h-80 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 text-center dark:border-stone-700 dark:bg-stone-900">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-300">
              <Bell className="size-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">You’re all caught up</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
              New updates and activity will show up here when they arrive.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
