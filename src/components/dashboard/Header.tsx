import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Moon, Search, Sun } from 'lucide-react';

import usersData from '@/mock/data.json';
import productsData from '@/mock/products.json';
import type { Product, User } from '@/types';
import { SearchDropdown } from '@/components/global-search/SearchDropdown';
import { SearchCategory } from '@/components/global-search/types';
import { SEARCH_DEBOUNCE_DELAY, SEARCH_DROPDOWN_EXIT_MS } from '@/lib/constants/search';

const USERS_LIST = usersData as User[];
const PRODUCTS_LIST = productsData as Product[];

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [mountDropdown, setMountDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>(SearchCategory.All);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [visibility, setVisibility] = useState({ users: true, products: true, other: true });
  
  const urlQuery = searchParams.get('q') ?? '';
  const [localSearchTerm, setLocalSearchTerm] = useState(urlQuery);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchSuffix = useMemo(() => {
    const s = searchParams.toString();
    return s ? `?${s}` : '';
  }, [searchParams]);

  const filteredUsers = useMemo(() => {
    if (activeCategory === SearchCategory.Products || !urlQuery) return [];
    return USERS_LIST.filter(user => user.name.toLowerCase().includes(urlQuery.toLowerCase()));
  }, [urlQuery, activeCategory]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === SearchCategory.Users || !urlQuery) return [];
    return PRODUCTS_LIST.filter(product => product.name.toLowerCase().includes(urlQuery.toLowerCase()));
  }, [urlQuery, activeCategory]);

  const hasAnySection = visibility.users || visibility.products || visibility.other;
  const showDropdown = isSearchActive && urlQuery.length > 0 && hasAnySection;
  const isDropdownClosing = mountDropdown && !showDropdown;

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  const handleGlobalReset = useCallback(() => {
    setLocalSearchTerm('');
    setActiveCategory(SearchCategory.All);
    setVisibility({ users: true, products: true, other: true });
    setIsSearchActive(false);
    setMountDropdown(false);
    containerRef.current?.querySelector('input')?.blur();
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const updateVisibility = useCallback((key: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [key]: false }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    const root = e.currentTarget;
    requestAnimationFrame(() => {
      if (root.contains(document.activeElement)) return;
      setIsSearchActive(false);
    });
  }, []);

  useEffect(() => {
    setLocalSearchTerm(urlQuery);
    if (urlQuery) setVisibility({ users: true, products: true, other: true });
  }, [urlQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        const clean = localSearchTerm.trim();
        clean ? next.set('q', clean) : next.delete('q');
        return next;
      }, { replace: true });
    }, SEARCH_DEBOUNCE_DELAY);
    return () => window.clearTimeout(timer);
  }, [localSearchTerm, setSearchParams]);

  useLayoutEffect(() => {
    if (showDropdown) setMountDropdown(true);
  }, [showDropdown]);

  useEffect(() => {
    if (showDropdown || !mountDropdown) return;
    const timer = window.setTimeout(() => {
      setMountDropdown(false);
      setIsSearchActive(false);
      setVisibility({ users: true, products: true, other: true });
    }, SEARCH_DROPDOWN_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [showDropdown, mountDropdown]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-2 sm:px-4 lg:px-6">
      <div className="flex min-w-0 shrink-0 items-center lg:hidden">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="h-9 w-9">
          <Menu />
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative min-w-0 flex-1 lg:max-w-md"
        onFocusCapture={() => setIsSearchActive(true)}
        onBlurCapture={handleBlur}
      >
        <Search className="pointer-events-none absolute top-1/2 left-4 z-1 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localSearchTerm}
          onChange={handleSearchChange}
          placeholder="Search for user or product"
          className="h-10 rounded-full border-neutral-200 bg-background pl-10 pr-4 shadow-none focus-visible:ring-2 focus-visible:ring-neutral-200/80 dark:border-neutral-700"
          autoComplete="off"
        />

        {mountDropdown && (
          <SearchDropdown
            query={urlQuery}
            searchSuffix={searchSuffix}
            activeCategory={activeCategory}
            filteredUsers={filteredUsers}
            filteredProducts={filteredProducts}
            usersSectionVisible={visibility.users}
            productsSectionVisible={visibility.products}
            isOtherVisible={visibility.other}
            isClosing={isDropdownClosing}
            onCategoryChange={setActiveCategory}
            onReset={handleGlobalReset}
            onClearUsersSection={() => updateVisibility('users')}
            onClearProductsSection={() => updateVisibility('products')}
            onClearOtherSection={() => updateVisibility('other')}
          />
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0">
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="flex items-center gap-2 py-1.5 sm:px-2">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs font-semibold">RB</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">Ramesh B.</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}