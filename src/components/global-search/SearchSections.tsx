import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export const searchResultRowClassName =
  'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/45';

interface SearchResultSectionProps {
  title: string;
  children: ReactNode;
  onClear: () => void;
}

export function SearchResultSection({ title, children, onClear }: SearchResultSectionProps) {
  return (
    <>
      <div className="border-t border-neutral-100 dark:border-neutral-800" />
      <section className="py-1">
        <div className="flex items-center justify-between px-3 pt-1 pb-2">
          <span className="text-xs font-bold tracking-tight text-muted-foreground uppercase">{title}</span>
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear All
          </button>
        </div>
        {children}
      </section>
    </>
  );
}

interface QuickSearchLinkProps {
  query: string;
  scope: string;
  toWithSearch: string;
}

export function QuickSearchLink({ query, scope, toWithSearch }: QuickSearchLinkProps) {
  return (
    <li>
      <Link to={toWithSearch} className={searchResultRowClassName}>
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="text-sm">
          Search for <span className="font-semibold text-foreground">&quot;{query}&quot;</span> in {scope}
        </span>
      </Link>
    </li>
  );
}
