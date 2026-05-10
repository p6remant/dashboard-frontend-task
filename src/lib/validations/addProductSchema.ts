import { z } from 'zod';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS, PRODUCT_UNITS } from '@/lib/constants/products';

export const addProductFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .pipe(z.enum(PRODUCT_CATEGORIES, { message: 'Select a valid category' })),
  brand: z
    .string()
    .min(1, 'Brand is required')
    .pipe(z.enum(PRODUCT_BRANDS, { message: 'Select a valid brand' })),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .pipe(z.enum(PRODUCT_UNITS, { message: 'Select a valid unit' })),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  active: z.boolean(),
});

export type AddProductFormFieldValues = z.input<typeof addProductFormSchema>;
export type AddProductFormValues = z.output<typeof addProductFormSchema>;
