'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, WifiOff, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  settings?: Record<string, string>;
}

export function Navbar({ settings = {} }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const pathname = usePathname();

  const isMobileAppEnabled = settings?.NEXT_PUBLIC_MOBILE_APP === 'ON';
  const isPricingEnabled = settings?.NEXT_PUBLIC_PRICING_PAGE !== 'OFF';
  const isTutorialsEnabled = settings?.NEXT_PUBLIC_TUTORIALS_PAGE !== 'OFF';

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navLinks = [
    { href: '/features', label: 'Features' },
    ...(isPricingEnabled ? [{ href: '/pricing', label: 'Pricing' }] : []),
    ...(isTutorialsEnabled ? [{ href: '/tutorials', label: 'Tutorials' }] : []),
    { href: '/faq', label: 'Help Center' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="glass-nav">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0 z-50 ml-0 md:-ml-12 transition-transform hover:scale-[1.02]">
            <Image
              src="/images/logo.png?v=5"
              alt="PoultryManager"
              width={320}
              height={85}
              priority
              className="w-32 sm:w-40 md:w-44 lg:w-64 h-auto max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-18 object-contain"
            />
          </Link>

          {!isOnline && (
            <div className="absolute top-20 left-0 right-0 bg-destructive text-destructive-foreground py-1 text-center text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 animate-in slide-in-from-top-full duration-300">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-3 w-3" />
                  Working Offline — Data will sync when back online
                </div>
              </div>
            </div>
          )}

          {/* Desktop Navigation - Pillbox Style */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-primary/40 shadow-sm absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={cn(
                    "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 shrink-0 z-50">
            {isMobileAppEnabled && (
              <Button variant="outline" className="hidden lg:flex rounded-full px-6 gap-2 border-slate-200" asChild>
                <a href="/mobileapp/PoultryManager.apk" download>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download App
                </a>
              </Button>
            )}

            <Link href="/get-started" className="hidden sm:block">
              <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                {isPricingEnabled ? "Register Now" : "Free Register"}
              </Button>
            </Link>

            <button
              className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Pillbox Style with Optimized Transition */}
        <div className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-100 ease-in-out md:hidden',
          isMenuOpen ? 'max-h-[500px] opacity-100 pb-8 pt-2' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-slate-50/50 p-3 rounded-[2rem] border border-slate-100 flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl transition-all flex items-center justify-center",
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/10" 
                      : "text-slate-500 hover:bg-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/get-started" onClick={() => setIsMenuOpen(false)} className="pt-2">
              <Button className="w-full rounded-[1.5rem] h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/10">
                {isPricingEnabled ? "Register Now" : "Free Register"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
