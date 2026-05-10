import { z } from 'zod';
import { parsePhone } from '@/lib/formatters';

export const addUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .refine((value) => /^\d{10,15}$/.test(parsePhone(value)), {
      message: 'Phone number must contain 10-15 digits',
    }),
  department: z.string().min(1, 'Department is required'),
  yearsExperience: z.coerce.number().min(0, 'Experience must be 0 or greater'),
  salary: z.coerce.number().positive('Salary must be positive'),
  bonusPercent: z.coerce
    .number()
    .min(0, 'Bonus must be at least 0%')
    .max(100, 'Bonus cannot exceed 100%'),
  hireDate: z
    .string()
    .min(1, 'Hire date is required')
    .refine((date) => !Number.isNaN(Date.parse(date)), 'Invalid hire date'),
  active: z.boolean(),
});

export type AddUserFormValues = z.infer<typeof addUserFormSchema>;
