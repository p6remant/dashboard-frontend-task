import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type FieldError } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DEFAULT_NEW_USER, USER_DEPARTMENTS } from '@/lib/constants/users';
import type { User } from '@/types';
import { parsePhone } from '@/lib/formatters';
import { addUserFormSchema, type AddUserFormValues } from '@/lib/validations/addUserSchema';

type NewUserPayload = Omit<User, 'id'>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: NewUserPayload) => Promise<void>;
  isSubmitting: boolean;
}

const INITIAL_VALUES: AddUserFormValues = {
  ...DEFAULT_NEW_USER,
  department: '',
  bonusPercent: DEFAULT_NEW_USER.bonusPercent * 100,
};

export function AddUserModal({ open, onOpenChange, onSubmit, isSubmitting }: AddUserModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    mode: 'onChange',
    defaultValues: INITIAL_VALUES,
  });

  useEffect(() => {
    if (open) reset(INITIAL_VALUES);
  }, [open, reset]);

  const handleClose = () => onOpenChange(false);

  const onFormSubmit = async (values: AddUserFormValues) => {
    const payload: NewUserPayload = {
      ...values,
      phone: parsePhone(values.phone),
      bonusPercent: values.bonusPercent / 100,
    };
    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new user to the table.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldWrapper label="Name" required error={errors.name}>
              <Input
                {...register('name')}
                placeholder="e.g. Jordan Lee"
                autoComplete="name"
                aria-invalid={!!errors.name}
              />
            </FieldWrapper>

            <FieldWrapper label="Email" required error={errors.email}>
              <Input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
            </FieldWrapper>

            <FieldWrapper label="Phone" required error={errors.phone}>
              <Input
                {...register('phone')}
                type="tel"
                inputMode="tel"
                placeholder="Enter phone number"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
              />
            </FieldWrapper>

            <FieldWrapper label="Department" required error={errors.department}>
              <Controller
                control={control}
                name="department"
                render={({ field }) => (
                  <Select
                    value={field.value ? field.value : undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-9 w-full" aria-invalid={!!errors.department}>
                      <SelectValue placeholder="Choose a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldWrapper>

            <FieldWrapper label="Years Experience" required error={errors.yearsExperience}>
              <Input
                {...register('yearsExperience')}
                type="number"
                min={0}
                placeholder="e.g. 5"
                aria-invalid={!!errors.yearsExperience}
              />
            </FieldWrapper>

            <FieldWrapper label="Salary" required error={errors.salary}>
              <Input
                {...register('salary')}
                type="number"
                step="0.01"
                placeholder="e.g. 85000"
                aria-invalid={!!errors.salary}
              />
            </FieldWrapper>

            <FieldWrapper label="Bonus %" required error={errors.bonusPercent}>
              <Input
                {...register('bonusPercent')}
                type="number"
                max={100}
                step="0.01"
                placeholder="e.g. 10"
                aria-invalid={!!errors.bonusPercent}
              />
            </FieldWrapper>

            <FieldWrapper label="Hire Date" required error={errors.hireDate}>
              <Input
                {...register('hireDate')}
                type="date"
                aria-invalid={!!errors.hireDate}
              />
            </FieldWrapper>
          </div>

          <div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Active User</Label>
              <p className="text-xs text-muted-foreground">Toggle account availability.</p>
            </div>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent hover:bg-transparent hover:opacity-100 dark:bg-transparent dark:hover:bg-transparent"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldWrapper({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        aria-required={required}
      >
        {label}
        {required ? (
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
