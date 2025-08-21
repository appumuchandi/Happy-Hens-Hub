'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Egg,
  LineChart,
  BrainCircuit,
  LogOut,
  Boxes,
} from 'lucide-react';
import type { Role } from '@/types';

const RupeeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m19 13-10 8" />
      <path d="m6 13 10 8" />
    </svg>
  );

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['OWNER', 'WORKER', 'VIEWER'] },
  { href: '/dashboard/egg-collection', label: 'Egg Collection', icon: Egg, roles: ['OWNER', 'WORKER'] },
  { href: '/dashboard/sales', label: 'Sales', icon: RupeeIcon, roles: ['OWNER', 'WORKER'] },
  { href: '/dashboard/reports', label: 'Reports', icon: LineChart, roles: ['OWNER', 'VIEWER'] },
  { href: '/dashboard/feed-optimization', label: 'AI Feed Optimizer', icon: BrainCircuit, roles: ['OWNER'] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const userRole = user?.role;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4">
      <div className="flex items-center gap-2 mb-8">
        <Boxes className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">HEN's HUB</h1>
      </div>
      <nav className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) =>
          item.roles.includes(userRole as Role) ? (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-2',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ) : null
        )}
      </nav>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-destructive/80"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
