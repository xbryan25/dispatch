'use client';

import { Row } from '@tanstack/react-table';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import { notificationTableColumns } from '@/columns/notificationTableColumns';

import NotificationPageHeader from '@/components/notifications/notificationsPageHeader';
import LoadingSpinner from '@/components/shared/loadingSpinner';
import { DataTable } from '@/components/ui/data-table';

import { Notification } from '@/types/notifications';
import { ReadState } from '@/types/notifications';

export default function NotificationsPage() {
  const [selectedRows, setSelectedRows] = useState<Notification[]>([]);
  const [readStateMajority, setReadStateMajority] = useState<ReadState>('read');

  const tableRef = useRef<{ resetSelection: () => void } | null>(null);

  const notifications = useNotificationsStore((state) => state.notifications);
  const loading = useNotificationsStore((state) => state.loading);

  const { getNotifications } = useNotificationsStore();

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
        <NotificationPageHeader
          onResetSelection={() => tableRef.current?.resetSelection()}
          selectedRows={selectedRows}
          readStateMajority={readStateMajority}
        />

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
      </div>
    </div>
  );
}
