'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Scale,
  Wallet,
  BarChart3,
  Gift,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PoultryType = 'broiler' | 'layer';

interface PricingClientProps {
  settings: Record<string, string>;
}

export function PricingClient({ settings }: PricingClientProps) {
  const [poultryType, setPoultryType] = useState<PoultryType>('broiler');
  const specialOfferText = settings.NEXT_PUBLIC_SPECIAL_OFFER;

  const tiers = useMemo(() => [
    {
      id: 'growth',
      name: 'Growth',
      subtitle: 'Perfect for starting operations',
      minBirds: Number(settings.NEXT_PUBLIC_GROWTH_MIN_BIRDS) || 10000,
      maxBirds: Number(settings.NEXT_PUBLIC_GROWTH_MAX_BIRDS) || 30000,
      broilerPrice: Number(settings.NEXT_PUBLIC_GROWTH_BROILER_PRICE) || 1.00,
      layerPrice: Number(settings.NEXT_PUBLIC_GROWTH_LAYER_PRICE) || 10,
      offerPercentage: Number(settings.NEXT_PUBLIC_GROWTH_OFFER) || 0,
      features: ["Dedicated Subdomain", "Complete PoultryManager Access"],
    },
    {
      id: 'professional',
      name: 'Professional',
      subtitle: 'Optimal for scaling farms',
      minBirds: Number(settings.NEXT_PUBLIC_PROFESSIONAL_MIN_BIRDS) || 30000,
      maxBirds: Number(settings.NEXT_PUBLIC_PROFESSIONAL_MAX_BIRDS) || 50000,
      broilerPrice: Number(settings.NEXT_PUBLIC_PROFESSIONAL_BROILER_PRICE) || 0.80,
      layerPrice: Number(settings.NEXT_PUBLIC_PROFESSIONAL_LAYER_PRICE) || 8,
      offerPercentage: Number(settings.NEXT_PUBLIC_PROFESSIONAL_OFFER) || 20,
      features: ["Everything in Growth PLUS", "Custom Website"],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      subtitle: 'Best value for large estates',
      minBirds: Number(settings.NEXT_PUBLIC_ENTERPRISE_MIN_BIRDS) || 50000,
      maxBirds: Number(settings.NEXT_PUBLIC_ENTERPRISE_MAX_BIRDS) || 999999,
      broilerPrice: Number(settings.NEXT_PUBLIC_ENTERPRISE_BROILER_PRICE) || 0.60,
      layerPrice: Number(settings.NEXT_PUBLIC_ENTERPRISE_LAYER_PRICE) || 6,
      offerPercentage: Number(settings.NEXT_PUBLIC_ENTERPRISE_OFFER) || 40,
      features: ["Everything in Professional PLUS", "Personal Onboarding", "24/7 Priority Support"],
    }
  ], [settings]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <section className="pt-16 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {specialOfferText && (
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm font-bold mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                  <Gift className="h-4 w-4 text-amber-600 animate-pulse" />
                  {specialOfferText}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 leading-tight">
                Simple Pricing That <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Grows With Your Farm</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                Pay only for the birds you manage. No hidden fees. Every customer gets access to the complete PoultryManager platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20" asChild>
                  <Link href="/get-started">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white" id="pricing-plans">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Management Tier</h2>
              <div className="mt-8 flex justify-center">
                 <div className="inline-flex p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                    <button 
                      onClick={() => setPoultryType('broiler')}
                      className={cn("px-8 py-2 rounded-xl text-sm font-bold transition-all", poultryType === 'broiler' ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600")}
                    >
                      Broiler
                    </button>
                    <button 
                      onClick={() => setPoultryType('layer')}
                      className={cn("px-8 py-2 rounded-xl text-sm font-bold transition-all", poultryType === 'layer' ? "bg-white text-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600")}
                    >
                      Layer
                    </button>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {tiers.map((tier) => (
                <div key={tier.id} className="group bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 relative">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                    <p className="text-slate-500 text-sm">{tier.subtitle}</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">
                        ₹{poultryType === 'layer' ? tier.layerPrice : tier.broilerPrice}
                      </span>
                      <span className="text-slate-500 font-medium text-sm">/bird/cycle</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs font-bold text-primary">
                        {tier.maxBirds > 900000 ? `${tier.minBirds.toLocaleString()}+ Birds` : `${tier.minBirds.toLocaleString()} to ${tier.maxBirds.toLocaleString()} Birds`}
                      </p>
                      {tier.offerPercentage > 0 && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{tier.offerPercentage}% OFF</span>}
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className="rounded-full w-full font-bold h-12" asChild>
                    <Link href="/get-started">Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
