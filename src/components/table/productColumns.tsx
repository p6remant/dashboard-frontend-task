import type { ColumnDef, Row } from '@tanstack/react-table';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge, statusVariantFromActive } from '@/components/ui/StatusBadge';
import { TABLE_MUTED_LINK, TABLE_MUTED_LINK_CATEGORY } from '@/lib/constants/tableCellStyles';
import { cn } from '@/lib/utils';
import type { Product, ProductsTableMeta } from '@/types';

function equalsFilter(row: Row<Product>, columnId: string, filterValue: unknown) {
  if (filterValue === undefined || filterValue === '') return true;
  return row.getValue(columnId) === filterValue;
}

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableGlobalFilter: true,
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    sortingFn: 'alphanumeric',
    enableGlobalFilter: false,
    filterFn: equalsFilter,
    cell: ({ getValue }) => (
      <span className={TABLE_MUTED_LINK_CATEGORY}>{String(getValue())}</span>
    ),
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    enableGlobalFilter: false,
    sortingFn: 'alphanumeric',
    filterFn: equalsFilter,
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    enableGlobalFilter: false,
    cell: ({ getValue }) => <span className={TABLE_MUTED_LINK}>{String(getValue())}</span>,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    enableGlobalFilter: false,
    sortingFn: 'basic',
    cell: ({ getValue }) => {
      const n = Number(getValue());
      const positive = n > 0;
      return (
        <span
          className={cn(
            'inline-flex min-w-8 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
            positive
              ? 'bg-[#e8f3ee] text-[#259e76]'
              : 'bg-[#ffeceb] text-[#dc2626]',
          )}
        >
          {n}
        </span>
      );
    },
  },
  {
    accessorKey: 'active',
    id: 'status',
    header: 'Status',
    enableGlobalFilter: false,
    sortingFn: 'basic',
    cell: ({ getValue }) => (
      <StatusBadge variant={statusVariantFromActive(Boolean(getValue()))} />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableGlobalFilter: false,
    cell: ({ row, table }) => {
      const onEditProduct = (table.options.meta as ProductsTableMeta | undefined)?.onEditProduct;
      if (!onEditProduct) return null;
      return (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 transition-all active:scale-95"
          title="Edit product"
          onClick={() => onEditProduct(row.original)}
        >
          <Edit2 className="h-3 w-3" />
          <span className="sr-only">Edit product</span>
        </Button>
      );
    },
  },
];
