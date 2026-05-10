import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';
import { StatusBadge, statusVariantFromActive } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, formatPercent, formatPhone } from '@/lib/formatters';

interface UserDetailsModalProps {
  open: boolean;
  user: User | null;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({ open, user, onOpenChange }: UserDetailsModalProps) {
  const handleClose = () => onOpenChange(false);

  const getDetails = (u: User) => [
    { label: 'Name', value: u.name },
    { label: 'Email', value: u.email },
    { label: 'Phone', value: formatPhone(u.phone) },
    { label: 'Department', value: u.department },
    { label: 'Experience', value: `${u.yearsExperience} years` },
    { label: 'Salary', value: formatCurrency(u.salary) },
    { label: 'Bonus', value: formatPercent(u.bonusPercent) },
    { label: 'Hire Date', value: formatDate(u.hireDate) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>Review complete profile details for this user.</DialogDescription>
        </DialogHeader>

        {!user ? (
          <p className="text-sm text-muted-foreground">No user selected.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {getDetails(user).map((item) => (
              <DetailItem key={item.label} {...item} />
            ))}

            <div className="sm:col-span-2">
              <DetailLabel>Status</DetailLabel>
              <div className="mt-1">
                <StatusBadge variant={statusVariantFromActive(user.active)} />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-muted-foreground">{children}</p>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}