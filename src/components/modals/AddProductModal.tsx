import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type FieldError } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  INITIAL_PRODUCT_FORM,
  PRODUCT_BRANDS,
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
} from '@/lib/constants/products';
import type { Product } from '@/types';
import {
  addProductFormSchema,
  type AddProductFormFieldValues,
  type AddProductFormValues,
} from '@/lib/validations/addProductSchema';

export type ProductFormMode = 'create' | 'edit';

interface AddProductModalProps {
  mode: ProductFormMode;
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: Omit<Product, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

export function AddProductModal({
  mode,
  product,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AddProductModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductFormFieldValues>({
    resolver: zodResolver(addProductFormSchema),
    mode: 'onChange',
    defaultValues: { ...INITIAL_PRODUCT_FORM },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && product) {
      reset({
        name: product.name,
        category: product.category as AddProductFormValues['category'],
        brand: product.brand as AddProductFormValues['brand'],
        unit: product.unit as AddProductFormValues['unit'],
        stock: product.stock,
        active: product.active,
      });
    } else {
      reset({ ...INITIAL_PRODUCT_FORM });
    }
  }, [open, mode, product, reset]);

  const handleClose = () => onOpenChange(false);

  const onFormSubmit = async (values: AddProductFormFieldValues) => {
    await onSubmit(values as unknown as AddProductFormValues);
  };

  const isEdit = mode === 'edit';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit product' : 'New product'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update inventory details below. Changes apply to your catalog immediately.'
              : 'Fill in inventory details below. New products appear in your catalog list right away.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldWrapper className="sm:col-span-2" label="Name" required error={errors.name}>
              <Input
                {...register('name')}
                className="h-9 w-full"
                placeholder="e.g. Himalayan Agarbatti"
                autoComplete="off"
                aria-invalid={!!errors.name}
              />
            </FieldWrapper>

            <FieldWrapper label="Category" required error={errors.category}>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full" aria-invalid={!!errors.category}>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldWrapper>

            <FieldWrapper label="Brand" required error={errors.brand}>
              <Controller
                control={control}
                name="brand"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full" aria-invalid={!!errors.brand}>
                      <SelectValue placeholder="Choose brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_BRANDS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldWrapper>

            <FieldWrapper label="Unit" required error={errors.unit}>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full" aria-invalid={!!errors.unit}>
                      <SelectValue placeholder="Choose unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldWrapper>

            <FieldWrapper label="Stock" required error={errors.stock}>
              <Input
                {...register('stock')}
                className="h-9 w-full"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 100"
                aria-invalid={!!errors.stock}
              />
            </FieldWrapper>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Active</Label>
              <p className="text-xs text-muted-foreground">Visible and available for sale.</p>
            </div>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent hover:bg-transparent hover:opacity-100 dark:bg-transparent dark:hover:bg-transparent"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                'Save changes'
              ) : (
                'Create product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldWrapper({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="space-y-1.5">
        <Label
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          aria-required={required}
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
        {children}
        {error && (
          <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
