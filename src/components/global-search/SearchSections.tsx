import type { ReactNode } from 'react';

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
      <div className="border-t border-border/60 dark:border-border/70" />
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

/* OTHER section quick rows — used by SearchDropdown when “Other” is enabled (currently commented out there).
interface QuickSearchLinkProps {
  query: string;
  scope: string;
  to: string;
  onSelectResult: () => void;
}

export function QuickSearchLink({ query, scope, to, onSelectResult }: QuickSearchLinkProps) {
  return (
    <li>
      <Link to={to} className={searchResultRowClassName} onClick={onSelectResult}>
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="text-sm">
          Search for <span className="font-semibold text-foreground">&quot;{query}&quot;</span> in {scope}
        </span>
      </Link>
    </li>
  );
}
*/
