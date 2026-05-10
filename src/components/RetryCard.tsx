import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RetryCardProps {
  title?: string;
  description?: string;
  error?: unknown;
  /** Use `() => { void refetch(); }` so async refetch does not widen the return type. */
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function RetryCard({
  title = "We couldn't load this data",
  description = 'Check your connection and try again.',
  error,
  onRetry,
  isRetrying = false,
  className,
}: RetryCardProps) {
  return (
    <div
      className={cn(
        'flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-6 shrink-0" aria-hidden />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {error != null ? (
          <p className="pt-1 wrap-break-word font-mono text-[11px] text-muted-foreground">
            {error instanceof Error ? error.message : String(error)}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2"
        onClick={() => onRetry()}
        disabled={isRetrying}
      >
        <RefreshCw className={cn('size-4 shrink-0', isRetrying && 'animate-spin')} aria-hidden />
        {isRetrying ? 'Retrying…' : 'Try again'}
      </Button>
    </div>
  );
}
