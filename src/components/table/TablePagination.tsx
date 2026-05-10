import { Button } from '@/components/ui/button';
import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const handlePrevious = () => table.previousPage();
  const handleNext = () => table.nextPage();

  const currentPage = pageCount === 0 ? 0 : pageIndex + 1;

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="text-xs font-medium text-muted-foreground">
        Showing page <span className="text-foreground">{currentPage}</span> of{' '}
        <span className="text-foreground">{pageCount}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!canPrevious}
          className="h-8 w-[90px] gap-1 transition-all active:scale-95"
        >
          <ChevronLeft className="h-3 w-3" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!canNext}
          className="h-8 w-[90px] gap-1 transition-all active:scale-95"
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}