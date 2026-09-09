'use client';

import React from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    description: 'Monitor bird performance, production, expenses, inventory, and profits from one centralized dashboard.',
  },
  {
    id: 'egg-tracking',
    title: 'Egg Production Tracking',
    description: 'Track daily egg production, breakages, mortality, and flock performance with detailed reports.',
  },
  {
    id: 'feed-mgmt',
    title: 'Feed Management',
    description: 'Monitor feed purchases, stock levels, daily consumption, and feed conversion to reduce waste.',
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'Manage medicines, vaccines, feed, and consumables with real-time stock updates.',
  },
  {
    id: 'flock',
    title: 'Flock Management',
    description: 'Maintain complete flock records, bird age, breed, mortality, culling, and production history.',
  },
  {
    id: 'multi-farm',
    title: 'Multi-Branch & Multi-Farm Management',
    description: 'Manage multiple farms, branches, and sheds from a single account with consolidated reporting.',
  },
  {
    id: 'payroll',
    title: 'Staff & Payroll',
    description: 'Manage employees, attendance, work schedules, salaries, and payroll in one place.',
  },
  {
    id: 'analytics',
    title: 'Reports & Analytics',
    description: 'Track financial year-wise and monthly profit/loss breakdowns.',
  },
  {
    id: 'cloud',
    title: 'Secure Cloud Access',
    description: 'Access your farm anytime, anywhere with automatic backups and secure cloud storage.',
  },
];

export function ProductShowcase() {
  return (
    <section className="py-24 bg-white" id="showcase">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            Powerful Tools for Modern Farmers
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to optimize production and simplify your daily routine, all in one enterprise-grade platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => {
            return (
              <div 
                key={feature.id}
                className="group bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:bg-white hover:border-primary/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Standard Feature
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
