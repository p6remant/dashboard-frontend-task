import { flexRender, type Table } from '@tanstack/react-table';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductsListTableProps {
  table: Table<Product>;
}

export function ProductsListTable({ table }: ProductsListTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <UITable>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                return (
                  <TableHead
                    key={header.id}
                    onClick={() => canSort && header.column.toggleSorting()}
                    className={cn(
                      'min-w-[100px] text-xs font-semibold uppercase tracking-wider',
                      canSort && 'cursor-pointer hover:bg-muted/80',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {isSorted ? (
                        <span className="text-primary">{isSorted === 'asc' ? '↑' : '↓'}</span>
                      ) : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={productColumnCount(table)}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No products match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </UITable>
    </div>
  );
}

function productColumnCount(table: Table<Product>) {
  return Math.max(table.getVisibleFlatColumns().length, 1);
}
