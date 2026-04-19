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
    size: 20,
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
    size: 40,
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
    size: 20,
    header: 'Date',
    cell: ({ row }) => (
      <p className="max-w-10">{formatter.format(new Date(row.original.createdAt))}</p>
    ),
  },
  {
    id: 'actions',
    size: 10,
    cell: ({ row }) => {
      return <NotificationRowActions notification={row.original} />;
    },
  },
];
