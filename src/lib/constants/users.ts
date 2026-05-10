import type { User } from '@/types';

export const USER_DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
] as const;

export const DEFAULT_NEW_USER: Omit<User, 'id'> = {
  name: '',
  email: '',
  phone: '',
  department: 'Engineering',
  yearsExperience: 0,
  salary: 0,
  bonusPercent: 0,
  hireDate: '',
  active: true,
};
