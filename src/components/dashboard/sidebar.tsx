
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Egg,
  LogOut,
  Users,
  Archive,
  Video,
  Settings,
  MessageSquare,
  Wheat,
  ShoppingCart,
  KeyRound,
  Package,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const RupeeIcon = () => (
    <span className="h-5 w-5 font-bold flex items-center justify-center">₹</span>
  );

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/egg-collection', label: 'Egg Collection', icon: Egg },
  { href: '/dashboard/sales', label: 'Sales', icon: RupeeIcon },
  { href: '/dashboard/workers', label: 'Workers', icon: Users },
  { href: '/dashboard/batch-records',label: 'Batch Records', icon: Archive },
  { href: '/dashboard/feed-optimization', label: 'Feed Stock', icon: Wheat },
  { href: '/dashboard/egg-reservations', label: 'Egg Reservations', icon: ShoppingCart },
  { href: '/dashboard/feed-orders', label: 'Feed Orders', icon: Package },
  { href: '/dashboard/cctv', label: 'CCTV', icon: Video },
  { href: '/dashboard/customer-messages', label: 'Customer Messages', icon: MessageSquare },
  { href: '/dashboard/login-credentials', label: 'Login Credentials', icon: KeyRound },
];


export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  
  const handleLinkClick = (href: string) => {
    if (pathname.startsWith('/dashboard/cctv') && !href.startsWith('/dashboard/cctv')) {
      sessionStorage.removeItem('cctvAuthenticated');
    }
    if (pathname.startsWith('/dashboard/login-credentials') && !href.startsWith('/dashboard/login-credentials')) {
      sessionStorage.removeItem('credentialsAuthenticated');
    }
    router.push(href);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('cctvAuthenticated');
    sessionStorage.removeItem('credentialsAuthenticated');
    logout();
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
       <div className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <h1 className="text-2xl font-bold font-headline text-foreground">HEN's HUB</h1>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col space-y-2">
            {navItems.map((item) =>
                <Button
                key={item.href}
                variant="ghost"
                onClick={() => handleLinkClick(item.href)}
                className={cn(
                    'w-full justify-start gap-2',
                    (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard'))
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'hover:bg-accent/50 hover:text-foreground'
                )}
                >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                </Button>
            )}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-destructive/80"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
