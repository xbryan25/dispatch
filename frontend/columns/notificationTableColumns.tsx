'use client';

import { ColumnDef } from '@tanstack/react-table';

import NotificationDetailsDialog from '@/components/notifications/notificationDetailsDialog';
import NotificationRowActions from '@/components/notifications/notificationRowActions';
import { Checkbox } from '@/components/ui/checkbox';


import { Notification } from '@/types/notifications';


const formatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export const notificationTableColumns = (): ColumnDef<Notification>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    size: 48,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    size: 150,
    cell: ({ row }) => (
      <NotificationDetailsDialog
        notificationId={row.original.notificationId}
        type={row.original.type}
        content={row.original.content}
        toShowInCell="type"
        dateStr={formatter.format(new Date(row.original.createdAt))}
      />
    ),
  },
  {
    accessorKey: 'message',
    header: 'Message',
    size: 460,
    cell: ({ row }) => (
      <NotificationDetailsDialog
        notificationId={row.original.notificationId}
        type={row.original.type}
        content={row.original.content}
        toShowInCell="content"
        dateStr={formatter.format(new Date(row.original.createdAt))}
      />
    ),
  },
  {
    accessorKey: 'date',
    size: 180,
    header: 'Date',
    cell: ({ row }) => (
      <p className="whitespace-normal text-xs leading-5 text-stone-500 dark:text-stone-400">{formatter.format(new Date(row.original.createdAt))}</p>
    ),
  },
  {
    id: 'actions',
    size: 64,
    cell: ({ row }) => {
      return <NotificationRowActions notification={row.original} />;
    },
  },
];
