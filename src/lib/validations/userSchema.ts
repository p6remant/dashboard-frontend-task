import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department: z.string().min(1, 'Department is required'),
  yearsExperience: z.number().min(0, 'Experience must be 0 or greater'),
  salary: z.number().positive('Salary must be positive'),
  bonusPercent: z.number().min(0, 'Bonus percent must be 0 or greater').max(1, 'Bonus percent cannot exceed 100%'),
  hireDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  active: z.boolean(),
});

export const createUserSchema = userSchema.omit({ id: true });

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

export type User = z.infer<typeof userSchema>;

export const validateUser = (data: unknown) => {
  try {
    return userSchema.parse(data);
  } catch (error) {
    return createValidationFailure(error);
  }
};

export const validateCreateUser = (data: unknown) => {
  try {
    return createUserSchema.parse(data);
  } catch (error) {
    return createValidationFailure(error);
  }
};
