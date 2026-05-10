import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_BRANDS_FILTER,
  ALL_CATEGORIES_FILTER,
  BRAND_FILTER_OPTIONS,
  CATEGORY_FILTER_OPTIONS,
} from "@/lib/constants/products";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductToolbarProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  brandFilter: string;
  onBrandFilterChange: (value: string) => void;
}

export function ProductToolbar({
  globalFilter,
  onGlobalFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  brandFilter,
  onBrandFilterChange,
}: ProductToolbarProps) {
  const clearSearch = () => onGlobalFilterChange("");

  const handleCategoryChange = (value: string) => {
    onCategoryFilterChange(value === ALL_CATEGORIES_FILTER ? "" : value);
  };

  const handleBrandChange = (value: string) => {
    onBrandFilterChange(value === ALL_BRANDS_FILTER ? "" : value);
  };

  const categoryValue = categoryFilter || ALL_CATEGORIES_FILTER;
  const brandValue = brandFilter || ALL_BRANDS_FILTER;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2">
      <div className="relative flex min-w-0 flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products"
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="h-9 pl-9 pr-10"
        />
        {globalFilter ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 h-8 w-8 p-0 hover:bg-muted focus-visible:ring-0"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        ) : null}
      </div>

      <FilterSelect
        value={categoryValue}
        onChange={handleCategoryChange}
        options={CATEGORY_FILTER_OPTIONS}
        placeholder="Category"
        triggerClassName="h-9 w-[168px]"
      />
      <FilterSelect
        value={brandValue}
        onChange={handleBrandChange}
        options={BRAND_FILTER_OPTIONS}
        placeholder="Brand"
        triggerClassName="h-9 w-[150px]"
      />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  triggerClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  triggerClassName?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className={cn("h-9 w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
