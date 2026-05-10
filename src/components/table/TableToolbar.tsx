import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ALL_DEPARTMENTS_VALUE,
  ALL_STATUS_VALUE,
  DEPARTMENT_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '@/lib/constants/tableFilters';

interface TableToolbarProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
  activeFilter: string;
  onActiveFilterChange: (value: string) => void;
}

export function TableToolbar({
  globalFilter,
  onGlobalFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  activeFilter,
  onActiveFilterChange,
}: TableToolbarProps) {
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGlobalFilterChange(e.target.value);
  };

  const clearSearch = () => onGlobalFilterChange('');

  const handleDeptChange = (value: string) => {
    onDepartmentFilterChange(value === ALL_DEPARTMENTS_VALUE ? '' : value);
  };

  const handleStatusChange = (value: string) => {
    onActiveFilterChange(value === ALL_STATUS_VALUE ? '' : value);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <div className="relative flex min-w-[240px] flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={handleSearchChange}
          className="h-9 pl-9 pr-8" 
        />

        {globalFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 h-7 w-7 p-0 hover:bg-muted focus-visible:ring-0"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <FilterSelect
        value={departmentFilter || ALL_DEPARTMENTS_VALUE}
        onValueChange={handleDeptChange}
        options={DEPARTMENT_FILTER_OPTIONS}
        placeholder="Department"
        width="w-[140px]"
      />

      <FilterSelect
        value={activeFilter || ALL_STATUS_VALUE}
        onValueChange={handleStatusChange}
        options={STATUS_FILTER_OPTIONS}
        placeholder="Status"
        width="w-[110px]"
      />
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  width: string;
}

function FilterSelect({ value, onValueChange, options, placeholder, width }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" className={cn("h-9", width)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}