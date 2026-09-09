'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

interface FooterProps {
  settings?: Record<string, string>;
}

export function Footer({ settings = {} }: FooterProps) {
  const [year, setYear] = useState<string>('');
  
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const supportEmail = settings?.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@poultrymanager.in';
  const supportPhone = settings?.NEXT_PUBLIC_SUPPORT_PHONE;
  const isTutorialsEnabled = settings?.NEXT_PUBLIC_TUTORIALS_PAGE !== 'OFF';

  return (
    <footer className="bg-white border-t border-slate-100 py-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 flex flex-col items-start space-y-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png?v=4"
                alt="PoultryManager"
                width={320}
                height={90}
                priority
                className="h-12 sm:h-16 md:h-20 w-auto"
              />
            </Link>
            <div className="space-y-3">
              <p className="text-slate-900 font-bold text-sm tracking-tight">
                Better Data. Better Decisions. Better Farm Management.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                  <Mail className="h-3 w-3 text-primary" aria-hidden="true" />
                  <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">{supportEmail}</a>
                </div>
                {supportPhone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <MessageCircle className="h-3 w-3 text-primary" aria-hidden="true" />
                    <a 
                      href={`https://wa.me/${supportPhone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      WhatsApp: {supportPhone}
                    </a>
                  </div>
                )}
                <p className="text-xs text-slate-400 font-medium pt-1">
                  © {year || new Date().getFullYear()} PoultryManager. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link href="/get-started" className="hover:text-primary transition-colors">Get Started</Link></li>
              <li><Link href="/features" className="hover:text-primary transition-colors">Core Features</Link></li>
              {isTutorialsEnabled && <li><Link href="/tutorials" className="hover:text-primary transition-colors">Learning Center</Link></li>}
              <li><Link href="/faq" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
