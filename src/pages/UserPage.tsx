import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEditableTable } from '@/hooks/useEditableTable';
import { useDebounce } from '@/hooks/useDebounce';
import { AddUserModal } from '@/components/modals/AddUserModal';
import { DataTable } from '@/components/table/DataTable';
import { TableToolbar } from '@/components/table/TableToolbar';
import { TablePagination } from '@/components/table/TablePagination';
import { userTableHeader } from '@/components/table/userTableHeader';
import { DeleteModal } from '@/components/modals/DeleteModal';
import { UserDetailsModal } from '@/components/modals/UserDetailsModal';
import { RetryCard } from '@/components/RetryCard';
import { TableListSkeleton } from '@/components/skeleton/TableListSkeleton';
import { Button } from '@/components/ui/button';
import { Plus, Loader } from 'lucide-react';
import type { User } from '@/types';
import { validateUser } from '@/lib/validations/userSchema';
import { createUser, fetchUsers, updateUser, deleteUser } from '@/lib/api';

export default function UserPage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const skipLocationModalReset = useRef(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | null>(null);
  const [savingRowId, setSavingRowId] = useState<number | null>(null);
  const [deletingRowId, setDeletingRowId] = useState<number | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  
  const debouncedTableSearch = useDebounce(tableSearch, 300);

  const { data: users = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User added successfully');
      setIsAddOpen(false);
    },
    onError: () => toast.error('Failed to add user'),
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: () => toast.error('Failed to update user'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const {
    table,
    editingRowId,
    rowState,
    errors,
    setErrors,
    handleEdit,
    handleCancel,
    handleRowStateChange,
  } = useEditableTable({
    data: users,
    columns: userTableHeader,
  });


  const handleGlobalFilterChange = useCallback((value: string) => {
    setTableSearch(value);
  }, []);

  const handleDepartmentFilterChange = useCallback((value: string) => {
    table.getColumn('department')?.setFilterValue(value || undefined);
  }, [table]);

  const handleActiveFilterChange = useCallback((value: string) => {
    if (!value) {
      table.getColumn('status')?.setFilterValue(undefined);
    } else {
      table.getColumn('status')?.setFilterValue(value === 'true');
    }
  }, [table]);

  const handleSave = useCallback(async (rowData: Partial<User>) => {
    try {
      const validation = validateUser(rowData as User);
      if ('fieldErrors' in validation) {
        setErrors(validation.fieldErrors as Record<string, string>);
        return;
      }

      setSavingRowId((rowData.id as number) ?? null);
      await updateMutation.mutateAsync(rowData as User);
      handleCancel();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save user');
    } finally {
      setSavingRowId(null);
    }
  }, [handleCancel, setErrors, updateMutation]);

  const handleDelete = useCallback(async (userId: number) => {
    try {
      setDeletingRowId(userId);
      await deleteMutation.mutateAsync(userId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeletingRowId(null);
    }
  }, [deleteMutation]);

  const handleAddUser = useCallback(async (payload: Omit<User, 'id'>) => {
    await createMutation.mutateAsync(payload);
  }, [createMutation]);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleOpenAddModal = useCallback(() => setIsAddOpen(true), []);
  
  const handleViewUser = useCallback((row: User) => setSelectedUser(row), []);
  const handleCloseViewModal = useCallback(() => setSelectedUser(null), []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteUser) return;
    await handleDelete(pendingDeleteUser.id);
    setPendingDeleteUser(null);
  }, [pendingDeleteUser, handleDelete]);

  const handleCloseDeleteModal = useCallback(() => setPendingDeleteUser(null), []);

  useEffect(() => {
    table.setGlobalFilter(debouncedTableSearch);
  }, [debouncedTableSearch, table]);

  useEffect(() => {
    if (skipLocationModalReset.current) {
      skipLocationModalReset.current = false;
      return;
    }
    setSelectedUser(null);
    setIsAddOpen(false);
    setPendingDeleteUser(null);
  }, [location.pathname, location.search]);

  const departmentFilterValue = (table.getColumn('department')?.getFilterValue() as string) ?? '';
  const rawStatusFilter = table.getColumn('status')?.getFilterValue();
  const statusFilterValue =
    rawStatusFilter !== undefined ? String(rawStatusFilter) : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage user data with inline editing, validation, and type-safe operations.
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={handleOpenAddModal}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {!createMutation.isPending && 'Add User'}
        </Button>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        {isLoading && !isError ? (
          <TableListSkeleton />
        ) : isError ? (
          <RetryCard
            title="Failed to load users"
            description="Something went wrong while fetching the user list."
            error={error}
            onRetry={handleRetry}
            isRetrying={isFetching}
          />
        ) : (
          <>
            <TableToolbar
              globalFilter={tableSearch}
              onGlobalFilterChange={handleGlobalFilterChange}
              departmentFilter={departmentFilterValue}
              onDepartmentFilterChange={handleDepartmentFilterChange}
              activeFilter={statusFilterValue}
              onActiveFilterChange={handleActiveFilterChange}
            />

            <DataTable
              table={table}
              editingRowId={editingRowId}
              rowState={rowState}
              errors={errors}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onView={handleViewUser}
              onDelete={setPendingDeleteUser}
              onRowStateChange={handleRowStateChange}
              isSaving={updateMutation.isPending && savingRowId !== null}
              deletingRowId={deletingRowId}
            />

            <TablePagination table={table} />
          </>
        )}
      </div>

      <AddUserModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddUser}
        isSubmitting={createMutation.isPending}
      />

      <UserDetailsModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onOpenChange={handleCloseViewModal}
      />

      <DeleteModal
        open={Boolean(pendingDeleteUser)}
        user={pendingDeleteUser}
        isDeleting={deleteMutation.isPending}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}