import { FileText, Users, X } from 'lucide-react';
import { SearchCategory } from './types';

interface SearchCategoryChipsProps {
  activeCategory: SearchCategory;
  onCategoryChange: (category: SearchCategory) => void;
  onReset: () => void;
}

export function SearchCategoryChips({ activeCategory, onCategoryChange, onReset }: SearchCategoryChipsProps) {
  const getChipStyle = (isActive: boolean) =>
    [
      'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
      isActive
        ? 'border-foreground/25 bg-muted/60 text-foreground'
        : 'border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground',
    ].join(' ');

  const toggleCategory = (category: SearchCategory.Users | SearchCategory.Products) => {
    onCategoryChange(activeCategory === category ? SearchCategory.All : category);
  };

  return (
    <div className="px-3 pt-3 pb-2">
      <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Search in</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={getChipStyle(activeCategory === SearchCategory.Users)} onClick={() => toggleCategory(SearchCategory.Users)}>
          <Users className="size-3.5 shrink-0" aria-hidden />
          Users
        </button>
        <button type="button" className={getChipStyle(activeCategory === SearchCategory.Products)} onClick={() => toggleCategory(SearchCategory.Products)}>
          <FileText className="size-3.5 shrink-0" aria-hidden />
          Products
        </button>
        <button type="button" className={getChipStyle(false)} onClick={onReset}>
          <X className="size-3.5 shrink-0" aria-hidden />
          Clear All
        </button>
      </div>
    </div>
  );
}
