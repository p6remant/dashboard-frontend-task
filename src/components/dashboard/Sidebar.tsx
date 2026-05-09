import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SIDEBAR_ITEMS } from '@/lib/constants/sidebar';

type SidebarVariant = 'desktop' | 'drawer';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  variant?: SidebarVariant;
  onNavigate?: () => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  className,
  variant = 'desktop',
  onNavigate,
}: SidebarProps) {
  const location = useLocation();
  const isDrawer = variant === 'drawer';

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col transition-all duration-300',
        isDrawer ? 'bg-background' : 'border-r border-border bg-muted',
        isOpen ? 'w-64' : 'w-20',
        className,
      )}
    >
      <div
        className={cn(
          'h-16 flex shrink-0 items-center gap-2 border-b border-border px-3',
          isDrawer ? 'justify-between' : 'justify-between',
        )}
      >
        <div
          className={cn(
            'min-w-0 font-bold',
            isDrawer ? 'text-xl' : 'flex-1 text-center text-2xl',
            !isOpen && !isDrawer && 'text-2xl',
          )}
        >
          {(isOpen || isDrawer) ? 'Dashboard' : 'D'}
        </div>

        {isDrawer ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-sm p-0 hover:bg-muted"
            onClick={onToggle}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 shrink-0 lg:inline-flex"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {SIDEBAR_ITEMS.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {(isOpen || isDrawer) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
