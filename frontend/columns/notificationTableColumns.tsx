'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import NotificationDetailsDialog from '@/components/notificationDetailsDialog';

import { Notification, ReadState } from '@/types/notifications';
import { Icon } from '@iconify/react';

const formatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export const notificationTableColumns = (
  updateNotificationReadStatus: (notificationIds: string[], readState: ReadState) => void
): ColumnDef<Notification>[] => [
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
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => (
      <NotificationDetailsDialog
        type={row.original.type}
        content={row.original.content}
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
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  updateNotificationReadStatus(
                    [row.original.notificationId],
                    row.original.isReadByReceiver ? 'unread' : 'read'
                  )
                }
              >
                <Icon icon="material-symbols:check" className="w-4 h-4" /> Mark as{' '}
                {row.original.isReadByReceiver ? 'unread' : 'read'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon icon="material-symbols:delete" className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
