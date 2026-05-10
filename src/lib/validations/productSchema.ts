import { z } from 'zod';
import { addProductFormSchema } from '@/lib/validations/addProductSchema';

type ValidationFailure = { fieldErrors: Record<string, string>; isValid: false };

const createValidationFailure = (error: unknown): ValidationFailure | { isValid: false } => {
  if (error instanceof z.ZodError) {
    const fieldErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      fieldErrors[path] = err.message;
    });
    return { fieldErrors, isValid: false };
  }
  return { isValid: false };
};

export const validateCreateProduct = (data: unknown) => {
  try {
    return addProductFormSchema.parse(data);
  } catch (error) {
    return createValidationFailure(error);
  }
};
