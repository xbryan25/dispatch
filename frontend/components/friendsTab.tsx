import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function FriendsTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-5 grid-rows-5 h-full gap-3 overflow-hidden font-sans p-4">
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>

        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>

        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>

        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
        <div className="h-full w-full bg-stone-200 dark:bg-stone-700 rounded-lg transition-all duration-500 hover:scale-102"></div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
