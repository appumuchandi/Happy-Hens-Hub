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
  Menu,
  Boxes,
  Users,
  Archive,
} from 'lucide-react';
import type { Role } from '@/types';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const RupeeIcon = () => (
    <span className="h-4 w-4 font-bold">₹</span>
  );

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['OWNER', 'WORKER', 'VIEWER'] },
  { href: '/dashboard/egg-collection', label: 'Egg Collection', icon: Egg, roles: ['OWNER', 'WORKER'] },
  { href: '/dashboard/sales', label: 'Sales', icon: RupeeIcon, roles: ['OWNER', 'WORKER'] },
  { href: '/dashboard/batch-records', label: 'Batch Records', icon: Archive, roles: ['OWNER', 'WORKER'] },
  { href: '/dashboard/reports', label: 'Reports', icon: LineChart, roles: ['OWNER', 'WORKER'] },
  { href: '/dashboard/workers-optimization', label: 'Workers', icon: Users, roles: ['OWNER'] },
  { href: '/dashboard/feed-optimization', label: 'AI Feed Optimizer', icon: BrainCircuit, roles: ['OWNER'] },
];

export default function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-card">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                 <Boxes className="h-6 w-6 text-primary" />
                 <span className="font-headline">HEN's HUB</span>
              </Link>
              {navItems.map((item) =>
                item.roles.includes(user?.role as Role) ? (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === item.href && 'text-primary bg-muted'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ) : null
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40/FF9933/121212.png?text=${user?.name.charAt(0)}`} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>{user?.name} ({user?.role})</DropdownMenuItem>
            <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/20 focus:text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
