'use client';

import { notificationTableColumns } from '@/columns/notificationTableColumns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const columns = notificationTableColumns();

export default function NotificationLoadingTable() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white pb-2 shadow-sm dark:border-stone-800 dark:bg-stone-900"
    >
      <Table className="min-w-[760px]" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          {columns.map((column, index) => (
            <col key={index} style={{ width: column.size ?? 150 }} />
          ))}
        </colgroup>
        <TableHeader className="bg-stone-50 dark:bg-stone-950/70">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className="h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400"
                style={{ width: column.size ?? 150 }}
              >
                {index === 0 ? (
                  <Skeleton className="size-4 rounded" />
                ) : typeof column.header === 'string' ? (
                  column.header
                ) : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="border-stone-100 hover:bg-transparent dark:border-stone-800"
            >
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={columnIndex}
                  className="h-[4.5rem] px-4 py-3 text-sm"
                  style={{ width: column.size ?? 150 }}
                >
                  {columnIndex === 0 ? (
                    <Skeleton className="size-4 rounded" />
                  ) : columnIndex === 1 ? (
                    <Skeleton className="h-5 w-20 rounded-full" />
                  ) : columnIndex === 2 ? (
                    <Skeleton className="h-4 w-4/5 rounded" />
                  ) : columnIndex === 3 ? (
                    <Skeleton className="h-3 w-24 rounded" />
                  ) : (
                    <Skeleton className="size-7 rounded-lg" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
