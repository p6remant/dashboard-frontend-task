import { useCallback, useMemo, memo } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchProductById } from '@/lib/api';

const parseProductId = (raw: string | undefined): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
};

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const id = useMemo(() => parseProductId(productId), [productId]);

  const { data: product, isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: id !== null,
  });

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (id === null) return <FeedbackMessage message="Invalid product id." onBack={goBack} />;
  
  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-40 w-full max-w-lg" />
      </div>
    );
  }

  if (isError || !product) return <FeedbackMessage message="Product not found." onBack={goBack} />;

  return (
    <div className="space-y-6">
      <BackBar onBack={goBack} />
      <Card className="max-w-lg border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="divide-y divide-border/50">
            <DetailRow label="Category" value={product.category} />
            <DetailRow label="Brand" value={product.brand} />
            <DetailRow label="Unit" value={product.unit} />
            <DetailRow label="Stock" value={product.stock.toLocaleString()} />
            <DetailRow label="Status" value={product.active ? 'Active' : 'Inactive'} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

const BackBar = memo(({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5 -ml-2 text-muted-foreground hover:bg-transparent! hover:opacity-100 hover:text-foreground dark:hover:bg-transparent! active:bg-transparent! dark:active:bg-transparent!"
      onClick={onBack}
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      Back
    </Button>
    <span className="hidden text-muted-foreground sm:inline">·</span>
    <Link to="/products" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
      All products
    </Link>
  </div>
));
BackBar.displayName = 'BackBar';

const DetailRow = memo(({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
));
DetailRow.displayName = 'DetailRow';

const FeedbackMessage = ({ message, onBack }: { message: string, onBack: () => void }) => (
  <div className="space-y-4">
    <BackBar onBack={onBack} />
    <p className="text-muted-foreground">{message}</p>
    <Link to="/products" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
      Go to products list
    </Link>
  </div>
);