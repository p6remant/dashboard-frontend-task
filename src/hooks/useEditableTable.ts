import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnSizingState,
} from '@tanstack/react-table';
import type { User } from '@/types';
import { useTableState } from './useTableState';

interface UseEditableTableProps {
  data: User[];
  columns: ColumnDef<User>[];
}

export function useEditableTable({ data, columns }: UseEditableTableProps) {
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

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [rowState, setRowState] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
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
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnSizingChange: setColumnSizing,
  });

  const handleEdit = (row: User) => {
    setEditingRowId(row.id);
    setRowState({ ...row });
    setErrors({});
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setRowState({});
    setErrors({});
  };

  const handleRowStateChange = (field: keyof User, value: any) => {
    setRowState((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return {
    table,
    editingRowId,
    rowState,
    errors,
    setErrors,
    handleEdit,
    handleCancel,
    handleRowStateChange,
    setEditingRowId,
    setRowState,
  };
}
