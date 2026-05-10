import { useMemo, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchUserById } from '@/lib/api';

function parseUserId(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const id = useMemo(() => parseUserId(userId), [userId]);

  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id!),
    enabled: id !== null,
  });

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (id === null) return <ErrorState message="Invalid user id." onBack={goBack} />;
  
  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-48 w-full max-w-lg" />
      </div>
    );
  }

  if (isError || !user) return <ErrorState message="User not found." onBack={goBack} />;

  return (
    <div className="space-y-6">
      <BackBar onBack={goBack} />
      <Card className="max-w-lg border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="divide-y divide-border/50">
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Phone" value={user.phone} />
            <DetailRow label="Department" value={user.department} />
            <DetailRow label="Experience" value={`${user.yearsExperience} years`} />
            <DetailRow label="Salary" value={`$${user.salary.toLocaleString()}`} />
            <DetailRow label="Bonus" value={`${(user.bonusPercent * 100).toFixed(1)}%`} />
            <DetailRow label="Hire date" value={user.hireDate} />
            <DetailRow label="Status" value={user.active ? 'Active' : 'Inactive'} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}


function ErrorState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <BackBar onBack={onBack} />
      <p className="text-muted-foreground">{message}</p>
      <Link to="/users" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Go to users list
      </Link>
    </div>
  );
}

import { memo } from 'react';
const BackBar = memo(({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5 -ml-2 text-muted-foreground hover:bg-transparent hover:opacity-100 hover:text-foreground dark:hover:bg-transparent"
      onClick={onBack}
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      Back
    </Button>
    <span className="hidden text-muted-foreground sm:inline">·</span>
    <Link to="/users" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
      All users
    </Link>
  </div>
));
BackBar.displayName = 'BackBar';

const DetailRow = memo(({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
));
DetailRow.displayName = 'DetailRow';