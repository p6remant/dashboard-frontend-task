import { LayoutDashboard, Package, Users, type LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/products', label: 'Products', icon: Package },
];
