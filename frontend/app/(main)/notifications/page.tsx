'use client';

import { notificationTableColumns } from '@/columns/notificationTableColumns';
import { DataTable } from '@/components/ui/data-table';
import { Notification } from '@/types/notifications';

import { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/loadingSpinner';

import { useNotificationsStore } from '@/store/useNotificationsStore';

export default function NotificationsPage() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const loading = useNotificationsStore((state) => state.loading);

  const getNotifications = useNotificationsStore((state) => state.getNotifications);

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="flex min-h-screen gap-6 bg-zinc-200 dark:bg-stone-800 font-sans p-4">
      <div className="flex-1 flex flex-col items-center gap-4 bg-white dark:bg-stone-900 rounded-xl p-5 min-h-screen min-w-0">
        <div className="flex justify-between w-full">
          <h2 className="font-bold text-2xl">Notifications</h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={notificationTableColumns} data={notifications} />
        )}
      </div>
    </div>
  );
}
