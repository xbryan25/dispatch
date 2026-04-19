'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

export default function PaginationButtons() {
  const totalPages = useFriendsStore((state) => state.totalPages);
  const currentPage = useFriendsStore((state) => state.currentPage);
  const loading = useFriendsStore((state) => state.loading);

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis-end', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis-start', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          'ellipsis-start',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          'ellipsis-end',
          totalPages
        );
      }
    }
    return pages;
  };

  const updateCurrentPage = (newPage: number) => {
    loadUsersData(newPage);
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
            onClick={() => updateCurrentPage(currentPage - 1)}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page !== 'ellipsis-start' && page !== 'ellipsis-end') {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  className={loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  onClick={() => {
                    if (typeof page === 'number') {
                      updateCurrentPage(page);
                    }
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages || loading
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
            onClick={() => updateCurrentPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
