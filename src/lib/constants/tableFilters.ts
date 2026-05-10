import { USER_DEPARTMENTS } from '@/lib/constants/users';

export const ALL_DEPARTMENTS_VALUE = '__all_departments__';
export const ALL_STATUS_VALUE = '__all_status__';

export const DEPARTMENT_FILTER_OPTIONS = [
  { value: ALL_DEPARTMENTS_VALUE, label: 'All Depts' },
  ...USER_DEPARTMENTS.map((department) => ({
    value: department,
    label: department,
  })),
];

export const STATUS_FILTER_OPTIONS = [
  { value: ALL_STATUS_VALUE, label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];
