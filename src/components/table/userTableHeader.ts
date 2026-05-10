import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/types';

export const userTableHeader: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      editable: true,
      type: 'text',
      required: true,
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      editable: true,
      type: 'text',
      required: true,
      mutedLinkAccent: true,
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    meta: {
      editable: true,
      type: 'phone',
      required: true,
    },
  },
  {
    accessorKey: 'department',
    header: 'Department',
    meta: {
      editable: true,
      type: 'select',
      required: true,
    },
  },
  {
    accessorKey: 'yearsExperience',
    header: 'Experience',
    meta: {
      editable: true,
      type: 'number',
      required: true,
    },
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    meta: {
      editable: true,
      type: 'currency',
      required: true,
    },
  },
  {
    accessorKey: 'bonusPercent',
    header: 'Bonus %',
    meta: {
      editable: true,
      type: 'percentage',
      required: true,
    },
  },
  {
    accessorKey: 'hireDate',
    header: 'Hire Date',
    meta: {
      editable: true,
      type: 'date',
      required: true,
    },
  },
  {
    id: 'status',
    accessorKey: 'active',
    header: 'Status',
    filterFn: 'equals',
    meta: {
      editable: true,
      type: 'checkbox',
      userField: 'active',
    },
  },
];
