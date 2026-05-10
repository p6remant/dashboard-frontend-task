import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_ROW_PLACEHOLDERS = 6;

interface TableListSkeletonProps {
  rowCount?: number;
}

export function TableListSkeleton({ rowCount = DEFAULT_ROW_PLACEHOLDERS }: TableListSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-3">
        <Skeleton className="h-9 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Skeleton className="h-10 rounded-none border-b border-border" />
        <div className="space-y-2 p-3">
          {Array.from({ length: rowCount }).map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-44" />
      </div>
    </div>
  );
}
