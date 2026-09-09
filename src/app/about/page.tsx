import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, TrendingDown, Clock, BarChart3, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { getPublicSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = getPublicSettings();
  const isPricingEnabled = settings.NEXT_PUBLIC_PRICING_PAGE !== 'OFF';

  const impactStats = [
    {
      label: "Time Saved",
      value: "20+ Hours",
      desc: "Saved monthly on manual record-keeping and reporting.",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Waste Reduction",
      value: "Up to 5%",
      desc: "Reduction in feed waste through precision tracking.",
      icon: TrendingDown,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Performance",
      value: "Real-time",
      desc: "FCR monitoring for optimized flock growth.",
      icon: BarChart3,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      label: "Data Security",
      value: "100%",
      desc: "Data sovereignty with secure cloud encryption.",
      icon: ShieldCheck,
      color: "text-primary",
      bg: "bg-primary/5"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* OUR STORY SECTION */}
        <section className="pt-16 pb-20 bg-white relative overflow-hidden text-center lg:text-left">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              {/* Left */}
              <div>
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-slate-900 tracking-tight">
                  Built by a <span className="text-primary italic">Poultry Farmer.</span>
                </h1>

                <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-10">
                  <p className="relative pl-6 border-l-4 border-primary/30 py-1 font-medium italic text-slate-800 text-left">
                    "PoultryManager was created from real experience managing commercial poultry farms and understanding the daily challenges of operations."
                  </p>

                  <p>
                    Our integrated tools for batch monitoring, production tracking, and financial reporting are engineered to streamline your daily operations and help you manage your poultry farm with absolute precision.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Built Specifically for Poultry',
                    'Cloud-Based Platform',
                    'Daily Farm Workflows',
                    'Role-Based Access',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl hover:border-primary/30 transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>

                      <span className="font-bold text-slate-700 text-sm">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="relative rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl">
                <Image
                  src="/images/story.png"
                  alt="Poultry Farmer"
                  width={800}
                  height={900}
                  priority
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT STATS SECTION */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Empowering Farmers with <br />
                <span className="text-primary italic">Actionable Data</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium">
                PoultryManager is more than just an app, it is a performance-driven management ecosystem built to maximize your farm's efficiency and profitability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {impactStats.map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</h3>
                    <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                    <p className="text-sm text-slate-500 font-medium pt-2 leading-relaxed">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="relative rounded-[3rem] bg-emerald-50/50 border border-primary/10 overflow-hidden p-10 md:p-16 text-center shadow-xl shadow-primary/5">
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, #065f46 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1] text-slate-900">
                  Ready to Transform Your
                  <br className="hidden md:block" />
                  <span className="text-primary italic">
                    {' '}
                    poultry business?
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                  Experience the precision and clarity of an enterprise-grade
                  platform. Start your journey toward a more profitable farm
                  today.
                </p>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all bg-primary hover:bg-primary/90 text-white"
                    asChild
                  >
                    <a href={isPricingEnabled ? "/pricing" : "/get-started"}>
                      {isPricingEnabled ? "Get Started Now" : "Free Register"}
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
