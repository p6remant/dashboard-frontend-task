import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { StatusBadge, statusVariantFromActive } from "@/components/ui/StatusBadge";
import { TABLE_MUTED_LINK, TABLE_MUTED_LINK_CATEGORY } from "@/lib/constants/tableCellStyles";
import { cn } from "@/lib/utils";
import { USER_DEPARTMENTS } from "@/lib/constants/users";
import type { TableMeta } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatPercent,
  formatPhone,
  parseCurrency,
  parseDate,
  parsePhone,
} from "@/lib/formatters";

interface EditableCellProps {
  value: any;
  isEditing: boolean;
  onChange: (value: any) => void;
  error?: string;
  meta?: TableMeta;
}

export function EditableCell({ value, isEditing, onChange, error, meta }: EditableCellProps) {
  if (!isEditing) {

    const type = meta?.type;

    switch (type) {
      case "currency":
        return <span>{formatCurrency(value)}</span>;
      case "percentage":
        return <span>{formatPercent(Number(value ?? 0))}</span>;
      case "phone":
        return <span>{formatPhone(String(value ?? ""))}</span>;
      case "date":
        return <span>{formatDate(value)}</span>;
      case "checkbox":
        return <StatusBadge variant={statusVariantFromActive(Boolean(value))} />;
      case "select":
        return (
          <span className={TABLE_MUTED_LINK_CATEGORY}>{String(value ?? "")}</span>
        );
      default:
        if (meta?.mutedLinkAccent) {
          return <span className={TABLE_MUTED_LINK}>{String(value ?? "")}</span>;
        }
        return <span>{value}</span>;
    }
  }

  const inputClasses = cn(
    "flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs transition-all",
    error && "border-destructive focus-visible:ring-destructive"
  );

  switch (meta?.type) {
    case "currency":
      return <CurrencyEditInput {...{ value, onChange, inputClasses }} />;

    case "percentage":
      return <PercentEditInput {...{ value, onChange, inputClasses }} />;

    case "date":
      return (
        <Input
          type="date"
          value={typeof value === "string" ? parseDate(value) : ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={inputClasses}
        />
      );

    case "phone":
      return (
        <Input
          type="tel"
          value={formatPhone(String(value ?? ""))}
          onChange={(e) => onChange(parsePhone(e.target.value))}
          placeholder="(415) 555-0101"
          className={inputClasses}
        />
      );

    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger error={!!error} size="sm" className="h-8">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {USER_DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return <Switch checked={value} onCheckedChange={onChange} className="h-6 w-11" />;

    default:
      return (
        <Input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      );
  }
}

const getInitialValue = (val: unknown, factor = 1) => 
  typeof val === "number" && Number.isFinite(val) ? (val * factor).toFixed(2) : "";

function CurrencyEditInput({ value, onChange, inputClasses }: any) {
  const [text, setText] = useState(() => getInitialValue(value));
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    if (!raw.trim() || /^[.-]+$/.test(raw.trim())) return onChange(0);
    const n = parseCurrency(raw);
    if (!Number.isNaN(n)) onChange(n);
  };

  return (
    <Input inputMode="decimal" value={text} onChange={handleChange} className={inputClasses} />
  );
}

function PercentEditInput({ value, onChange, inputClasses }: any) {
  const [text, setText] = useState(() => getInitialValue(value, 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    if (!raw.trim() || /^[.-]+$/.test(raw.trim())) return onChange(0);
    const pct = parseFloat(raw);
    if (!Number.isNaN(pct)) onChange(pct / 100);
  };

  return (
    <Input inputMode="decimal" value={text} onChange={handleChange} className={inputClasses} />
  );
}