import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type StatusBadgeVariant = 'active' | 'inactive';

const VARIANT_CLASS: Record<StatusBadgeVariant, string> = {
  active: 'bg-[#e8f3ee] text-[#009900]',
  inactive: 'bg-[#ffeceb] text-[#ff1400]',
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: StatusBadgeVariant;
}

export function StatusBadge({ variant, className, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold tracking-tight',
        VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    >
      {children ?? (variant === 'active' ? 'Active' : 'Inactive')}
    </span>
  );
}

export function statusVariantFromActive(isActive: boolean): StatusBadgeVariant {
  return isActive ? 'active' : 'inactive';
}
