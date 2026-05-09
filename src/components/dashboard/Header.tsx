import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Moon, Search, Sun } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const globalSearch = searchParams.get('q') ?? '';

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleGlobalSearchChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-2 gap-2 sm:px-4 lg:px-6">
      <div className="flex min-w-0 shrink-0 items-center lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-9 w-9 shrink-0"
          aria-label="Open menu"
        >
          <Menu/>
        </Button>
        </div>

      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalSearch}
          onChange={(e) => handleGlobalSearchChange(e.target.value)}
          placeholder="Search..."
          className="pl-9"
          aria-label="Global Search"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-9 w-9 p-0">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
