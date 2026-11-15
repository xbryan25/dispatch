'use client';

import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useImperativeHandle, useState } from 'react';

import { useNotificationsStore } from '@/store/useNotificationsStore';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSelectionChange: (rows: Row<TData>[]) => void;
  getRowClassName?: (row: TData) => string;
  tableRef?: React.RefObject<{ resetSelection: () => void } | null>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSelectionChange,
  getRowClassName,
  tableRef,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const currentPage = useNotificationsStore((state) => state.currentPage);
  const totalPages = useNotificationsStore((state) => state.totalPages);

  const setCurrentPage = useNotificationsStore((state) => state.setCurrentPage);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      rowSelection,
      sorting,
      pagination: {
        pageIndex: currentPage - 1, // ← TanStack is 0-based, your API is 1-based
        pageSize: 1,
      },
    },
    onPaginationChange: () => {}, // Tells TanStack that own code will control pagination
  });

  useEffect(() => {
    onSelectionChange?.(table.getFilteredSelectedRowModel().rows);
  }, [onSelectionChange, table, rowSelection]);

  useImperativeHandle(tableRef, () => ({
    resetSelection: () => table.resetRowSelection(),
  }));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <Table className="min-w-[760px]" style={{ tableLayout: 'fixed' }}>
          <TableHeader className="bg-stone-50 dark:bg-stone-950/70">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400" style={{ width: header.column.getSize() }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`group border-stone-100 hover:bg-amber-50/40 data-[state=selected]:bg-amber-50 dark:border-stone-800 dark:hover:bg-amber-400/5 dark:data-[state=selected]:bg-amber-400/10 ${getRowClassName?.(row.original) ?? ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-[4.5rem] px-4 py-3 text-sm" style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-stone-500">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-stone-500 dark:text-stone-400">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-stone-200 px-4 dark:border-stone-700"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-stone-200 px-4 dark:border-stone-700"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
