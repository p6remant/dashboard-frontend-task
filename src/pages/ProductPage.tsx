import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useProductsTable } from '@/hooks/useProductsTable';
import { AddProductModal, type ProductFormMode } from '@/components/modals/AddProductModal';
import { ProductsListTable } from '@/components/table/ProductsListTable';
import { ProductToolbar } from '@/components/table/ProductToolbar';
import { TablePagination } from '@/components/table/TablePagination';
import { productColumns } from '@/components/table/productColumns';
import { RetryCard } from '@/components/RetryCard';
import { TableListSkeleton } from '@/components/skeleton/TableListSkeleton';
import { Button } from '@/components/ui/button';
import { createProduct, fetchProducts, updateProduct } from '@/lib/api';
import type { Product } from '@/types';
import { Loader, Plus } from 'lucide-react';

export default function ProductPage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const skipLocationModalReset = useRef(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProductFormMode>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const debouncedTableSearch = useDebounce(tableSearch, 300);

  const { data: products = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      setIsModalOpen(false);
      setEditingProduct(null);
      setModalMode('create');
    },
    onError: () => toast.error('Failed to update product'),
  });

  const handleEditProduct = useCallback((product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleGlobalFilterChange = useCallback((value: string) => {
    setTableSearch(value);
  }, []);

  const handleSaveProduct = useCallback(async (values: Omit<Product, 'id'>) => {
    if (modalMode === 'edit' && editingProduct) {
      await updateMutation.mutateAsync({ ...values, id: editingProduct.id });
    } else {
      await createMutation.mutateAsync(values);
    }
  }, [modalMode, editingProduct, updateMutation, createMutation]);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setEditingProduct(null);
    setIsModalOpen(true);
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingProduct(null);
      setModalMode('create');
    }
  }, []);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const tableMeta = useMemo(() => ({
    onEditProduct: handleEditProduct,
  }), [handleEditProduct]);

  const { table } = useProductsTable({
    data: products,
    columns: productColumns,
    meta: tableMeta,
  });

  const handleCategoryFilterChange = useCallback((value: string) => {
    table.getColumn('category')?.setFilterValue(value || undefined);
  }, [table]);

  const handleBrandFilterChange = useCallback((value: string) => {
    table.getColumn('brand')?.setFilterValue(value || undefined);
  }, [table]);

  useEffect(() => {
    table.setGlobalFilter(debouncedTableSearch);
  }, [debouncedTableSearch, table]);

  useEffect(() => {
    if (skipLocationModalReset.current) {
      skipLocationModalReset.current = false;
      return;
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setModalMode('create');
  }, [location.pathname, location.search]);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const categoryFilterValue = (table.getColumn('category')?.getFilterValue() as string) ?? '';
  const brandFilterValue = (table.getColumn('brand')?.getFilterValue() as string) ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage products, categories and pricing.
          </p>
        </div>
        <Button className="gap-2" onClick={openCreateModal} disabled={isSaving}>
          {isSaving ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {!isSaving && 'New product'}
        </Button>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        {isLoading && !isError ? (
          <TableListSkeleton />
        ) : isError ? (
          <RetryCard
            title="Failed to load products"
            description="Something went wrong while fetching the product catalog."
            error={error}
            onRetry={handleRetry}
            isRetrying={isFetching}
          />
        ) : (
          <>
            <ProductToolbar
              globalFilter={tableSearch}
              onGlobalFilterChange={handleGlobalFilterChange}
              categoryFilter={categoryFilterValue}
              onCategoryFilterChange={handleCategoryFilterChange}
              brandFilter={brandFilterValue}
              onBrandFilterChange={handleBrandFilterChange}
            />

            <ProductsListTable table={table} />
            <TablePagination table={table} />
          </>
        )}
      </div>

      <AddProductModal
        mode={modalMode}
        product={editingProduct}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onSubmit={handleSaveProduct}
        isSubmitting={isSaving}
      />
    </div>
  );
}