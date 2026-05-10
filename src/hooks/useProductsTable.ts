import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import type { Product, ProductsTableMeta } from '@/types';
import { useTableState } from './useTableState';

interface UseProductsTableProps {
  data: Product[];
  columns: ColumnDef<Product>[];
  meta?: ProductsTableMeta;
}

export function useProductsTable({ data, columns, meta }: UseProductsTableProps) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
  } = useTableState();

  const table = useReactTable({
    data,
    columns,
    meta: meta ?? {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  });

  return { table };
}
