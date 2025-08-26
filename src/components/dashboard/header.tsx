'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Video,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

const RupeeIcon = () => (
    <span className="h-4 w-4 font-bold">₹</span>
  );

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/egg-collection', label: 'Egg Collection', icon: Egg },
  { href: '/dashboard/sales', label: 'Sales', icon: RupeeIcon },
  { href: '/dashboard/workers', label: 'Workers', icon: Users },
  { href: '/dashboard/batch-records',label: 'Batch Records', icon: Archive },
  { href: '/dashboard/feed-optimization', label: 'AI Feed Optimizer', icon: BrainCircuit },
  { href: '/dashboard/cctv', label: 'CCTV', icon: Video },
  { href: '/dashboard/settings', label: 'Site Settings', icon: Settings },
];

export default function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const handleLinkClick = (href: string) => {
    if (pathname.startsWith('/dashboard/cctv') && !href.startsWith('/dashboard/cctv')) {
      sessionStorage.removeItem('cctvAuthenticated');
    }
    router.push(href);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cctvAuthenticated');
    logout();
  }

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
             <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                 <Boxes className="h-6 w-6 text-primary" />
                 <span className="font-headline">HEN's HUB</span>
              </Link>
              {navItems.map((item) =>
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === item.href && 'text-primary bg-muted'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={`https://placehold.co/40x40/FF9933/121212.png?text=${user?.name?.charAt(0)}`} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>{user?.name}</DropdownMenuItem>
            <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/20 focus:text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
