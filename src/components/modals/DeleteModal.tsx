import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { User } from '@/types';

interface DeleteModalProps {
  open: boolean;
  user: User | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteModal({
  open,
  user,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteModalProps) {
  
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await onConfirm();
  };

  const description = user
    ? `Are you sure you want to delete ${user.name}? This action cannot be undone.`
    : 'This action cannot be undone.';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center gap-3 text-center">
          <AlertDialogTitle className="text-center">Delete user?</AlertDialogTitle>
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:text-red-400"
            aria-hidden
          >
            <Trash2 className="size-5" />
          </div>
          <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:opacity-90"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}