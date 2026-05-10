import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Package } from 'lucide-react';
import { cn, generateInitials } from '@/lib/utils';
import { SearchCategoryChips } from './SearchCategoryChips';
import { QuickSearchLink, SearchResultSection, searchResultRowClassName } from './SearchSections';
import type { Product, User } from '@/types';
import { SearchCategory } from './types';

interface SearchDropdownProps {
  query: string;
  searchSuffix: string;
  activeCategory: SearchCategory;
  filteredUsers: User[];
  filteredProducts: Product[];
  usersSectionVisible: boolean;
  productsSectionVisible: boolean;
  isOtherVisible: boolean;
  onCategoryChange: (category: SearchCategory) => void;
  onReset: () => void;
  onClearUsersSection: () => void;
  onClearProductsSection: () => void;
  onClearOtherSection: () => void;
  isClosing: boolean;
}

export function SearchDropdown({
  query,
  searchSuffix,
  activeCategory,
  filteredUsers,
  filteredProducts,
  usersSectionVisible,
  productsSectionVisible,
  isOtherVisible,
  onCategoryChange,
  onReset,
  onClearUsersSection,
  onClearProductsSection,
  onClearOtherSection,
  isClosing,
}: SearchDropdownProps) {
  return (
    <div
      id="global-search-results"
      role="region"
      aria-label="Search results"
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        'absolute top-full right-0 left-0 z-50 mt-2 max-h-[70vh] origin-top overflow-y-auto rounded-xl border border-neutral-100 bg-card text-card-foreground shadow-2xl dark:border-neutral-800',
        isClosing
          ? 'animate-out fade-out-0 zoom-out-95 slide-out-to-top-1 duration-200 ease-in'
          : 'animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-200 ease-out',
      )}
    >
      <SearchCategoryChips activeCategory={activeCategory} onCategoryChange={onCategoryChange} onReset={onReset} />

      {activeCategory !== SearchCategory.Products && usersSectionVisible && (
        <SearchResultSection title="In Users" onClear={onClearUsersSection}>
          {filteredUsers.length > 0 ? (
            <ul className="space-y-0.5 px-1 pb-2">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <Link to={`/users${searchSuffix}`} className={searchResultRowClassName}>
                    <Avatar className="size-9 shrink-0 border border-border">
                      <AvatarFallback className="bg-teal-700 text-xs font-semibold text-white">{generateInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 truncate text-sm font-medium text-foreground">{user.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 pb-3 text-sm text-muted-foreground italic">No users matching &quot;{query}&quot;</p>
          )}
        </SearchResultSection>
      )}

      {activeCategory !== SearchCategory.Users && productsSectionVisible && (
        <SearchResultSection title="In Products" onClear={onClearProductsSection}>
          {filteredProducts.length > 0 ? (
            <ul className="space-y-0.5 px-1 pb-2">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <Link to={`/products${searchSuffix}`} className={searchResultRowClassName}>
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                      <Package className="size-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.category} / {product.brand}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 pb-3 text-sm text-muted-foreground italic">No products matching &quot;{query}&quot;</p>
          )}
        </SearchResultSection>
      )}

      {isOtherVisible && (
        <SearchResultSection title="Other" onClear={onClearOtherSection}>
          <ul className="space-y-0.5 px-1 pb-2">
            <QuickSearchLink query={query} scope="Users" toWithSearch={`/users${searchSuffix}`} />
            <QuickSearchLink query={query} scope="Products" toWithSearch={`/products${searchSuffix}`} />
          </ul>
        </SearchResultSection>
      )}
    </div>
  );
}
