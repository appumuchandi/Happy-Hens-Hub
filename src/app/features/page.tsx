'use client';

import React from 'react';
import { ProductShowcase } from '@/components/product-showcase';
import { 
  Layers,
  LineChart,
  Calculator,
  Scale,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Powerful Tools for <br />
              <span className="text-primary italic">Modern Poultry Farming</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Everything you need to optimize production, track performance, and maximize profitability in one enterprise-grade platform.
            </p>
          </div>
        </section>

        {/* CORE BENEFITS GRID */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { title: "Batch Management", desc: "Manage Broiler and Layer batches from placement to market with complete lifecycle visibility.", icon: Layers },
                { title: "FCR & Growth", desc: "Monitor Feed Conversion Ratio and daily growth metrics with automated precision.", icon: LineChart },
                { title: "Profit Tracking", desc: "Real-time visibility into your farm expenses, sales, and overall profitability.", icon: Calculator },
                { title: "Feed Optimization", desc: "Track every bag. Optimize consumption patterns to significantly reduce overhead costs.", icon: Scale },
                { title: "Health Records", desc: "Comprehensive logging of vaccinations, medications, and mortality to maintain flock health.", icon: ShieldCheck },
                { title: "Automated Reports", desc: "Professional reports for accountants and bank loans, generated with a single click.", icon: FileText }
              ].map((feature, idx) => (
                <div key={idx} className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:-translate-y-2">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-white shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-base font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILED SHOWCASE */}
        <ProductShowcase />
      </main>
    </div>
  );
}