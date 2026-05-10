import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Check, X, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableCell } from './EditableCell';
import type { TableMeta, User } from '@/types';

interface DataTableProps {
  table: any;
  editingRowId: number | null;
  rowState: Partial<User>;
  errors: Record<string, string>;
  onEdit: (row: User) => void;
  onSave: (rowData: Partial<User>) => Promise<void>;
  onCancel: () => void;
  onView: (row: User) => void;
  onDelete: (row: User) => void;
  onRowStateChange: (field: keyof User, value: any) => void;
  isSaving: boolean;
  deletingRowId: number | null;
}

export function DataTable({
  table,
  editingRowId,
  rowState,
  errors,
  onEdit,
  onSave,
  onCancel,
  onView,
  onDelete,
  onRowStateChange,
  isSaving,
  deletingRowId,
}: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <Table style={{ width: table.getTotalSize() }}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header: any) => {
                const isSorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                
                return (
                  <TableHead
                    key={header.id}
                    onClick={() => canSort && header.column.toggleSorting()}
                    className={cn(
                      'group relative min-w-[120px] text-xs font-semibold uppercase tracking-wider transition-colors',
                      canSort && 'cursor-pointer hover:bg-muted/80',
                    )}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : (header.column.columnDef.header as string) || 'Table Header'}
                      {isSorted && (
                        <span className="text-primary">
                          {isSorted === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none bg-transparent transition-colors',
                          header.column.getIsResizing() ? 'bg-primary/40' : 'group-hover:bg-border',
                        )}
                      />
                    )}
                  </TableHead>
                );
              })}
              <TableHead className="w-[140px] text-xs font-semibold uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row: any) => (
              <DataTableRow
                key={row.id}
                row={row}
                isEditing={editingRowId === row.original.id}
                isSaving={isSaving}
                isDeleting={deletingRowId === row.original.id}
                rowState={rowState}
                errors={errors}
                handlers={{ onSave, onCancel, onView, onEdit, onDelete, onRowStateChange }}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length + 1}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// sub-component to keep the main table render clean
function DataTableRow({ 
  row, isEditing, isSaving, isDeleting, rowState, errors, handlers 
}: any) {
  return (
    <TableRow
      className={cn(
        'transition-colors',
        isEditing 
          ? 'border-x-2 border-x-neutral-400 bg-muted/55 shadow-sm dark:border-x-neutral-500' 
          : 'hover:bg-muted/50'
      )}
    >
      {row.getVisibleCells().map((cell: any) => {
        const meta = cell.column.columnDef.meta as TableMeta | undefined;
        const field = (meta?.userField ?? cell.column.id) as keyof User;
        return (
        <TableCell
          key={cell.id}
          className="min-w-[120px] py-2 text-xs"
          style={{ width: cell.column.getSize() }}
        >
          <EditableCell
            value={isEditing ? (rowState[field] ?? cell.getValue()) : cell.getValue()}
            isEditing={isEditing}
            onChange={(val) => handlers.onRowStateChange(field, val)}
            error={errors[field as string]}
            meta={cell.column.columnDef.meta}
          />
        </TableCell>
        );
      })}
      
      <TableCell className="py-2">
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <ActionButton 
                title="Save changes" 
                onClick={() => handlers.onSave(rowState)} 
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              </ActionButton>
              <ActionButton title="Cancel" onClick={handlers.onCancel}>
                <X className="h-3 w-3" />
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                title="View details"
                onClick={() => handlers.onView(row.original)}
                className="text-[#0a5adb] hover:bg-[#eff6ff] hover:text-[#084fc7]"
              >
                <Eye className="h-3 w-3" />
              </ActionButton>
              <ActionButton title="Edit row" onClick={() => handlers.onEdit(row.original)}>
                <Edit2 className="h-3 w-3" />
              </ActionButton>
              <ActionButton 
                title="Delete row" 
                onClick={() => handlers.onDelete(row.original)}
                disabled={isDeleting}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              </ActionButton>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function ActionButton({ children, className, ...props }: any) {
  return (
    <Button
      size="sm"
      variant="outline"
      className={cn("h-7 w-7 p-0 transition-all active:scale-95", className)}
      {...props}
    >
      {children}
    </Button>
  );
}