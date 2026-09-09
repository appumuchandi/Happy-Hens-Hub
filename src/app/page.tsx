import { Button } from '@/components/ui/button';
import { ProductShowcase } from '@/components/product-showcase';
import { 
  ArrowRight, 
  PlayCircle,
  Layers,
  LineChart,
  Calculator,
  Scale,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Gift,
  Users,
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';
import { getPublicSettings } from '@/lib/db';
import Link from "next/link";
import { HeroImageSlider } from '@/components/hero-image-slider';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = getPublicSettings();
  const demoUrl = settings.NEXT_PUBLIC_DEMO_VIDEO_URL || 'https://youtu.be/nI0zmxJjUNs?si=CyAzT0USGju0hqsB';
  const siteUrl = (settings.NEXT_PUBLIC_SITE_URL || 'https://poultrymanager.in').replace('http://', 'https://');
  const isTutorialsEnabled = settings.NEXT_PUBLIC_TUTORIALS_PAGE !== 'OFF';
  const isPricingDisabled = settings.NEXT_PUBLIC_PRICING_PAGE === 'OFF';
  const adoptionCount = settings.NEXT_PUBLIC_ADOPTION_COUNT || '240';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'PoultryManager',
      'url': siteUrl,
      'alternateName': ['Poultry Manager', 'PoultryManager ERP']
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'PoultryManager',
      'operatingSystem': 'Web-based',
      'applicationCategory': 'BusinessApplication, ERP',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '240'
      },
      'offers': {
        '@type': 'Offer',
        'price': isPricingDisabled ? '0.00' : '0.60',
        'priceCurrency': 'INR',
        'unitText': isPricingDisabled ? 'Free for limited time' : 'per bird'
      },
      'description': "Poultry Business. The #1 cloud platform designed for modern poultry farmers. Track batches, optimize FCR, and master your farm finances in one place."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex-grow">
        {/* SECTION 1 — HERO */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 overflow-hidden bg-white">
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} 
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text Column */}
              <div className="lg:col-span-5 text-center lg:text-left order-2 lg:order-1">
                {/* Authority Ribbon */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <Star className="h-3 w-3 fill-current" />
                  World&apos;s #1 Poultry Management ERP
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 leading-[1.05]">
                  Stop Guessing, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                    Start Growing.
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                  The only farm management platform engineered by actual poultry farmers to maximize FCR and automate your daily operations.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-[0_20px_40px_-10px_rgba(6,95,70,0.3)] hover:scale-105 transition-all bg-primary hover:bg-primary/90" asChild>
                    <Link href="/get-started">
                      {isPricingDisabled ? "Free Register" : "Register Now"} 
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-16 text-base font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all" asChild>
                    {isTutorialsEnabled ? (
                      <Link href="/tutorials">
                        <PlayCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                        Watch Demo
                      </Link>
                    ) : (
                      <a href={demoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch a demonstration video of PoultryManager">
                        <PlayCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                        Watch Demo
                      </a>
                    )}
                  </Button>
                </div>

                {/* PROMINENT FREE ANNOUNCEMENT */}
                {isPricingDisabled && (
                  <div className="mt-10 flex justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Gift className="h-4 w-4 text-orange-600 animate-bounce" />
                      </div>
                      <span className="text-slate-700">
                        PoultryManager is now completely <span className="text-orange-600 font-bold">FREE</span> &nbsp;to use.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Column */}
              <div className="lg:col-span-7 order-1 lg:order-2 relative flex justify-center lg:justify-end">
                <div className="relative group w-full max-w-4xl">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
                  
                  <div className="relative rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-700 hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.18)]">
                    <HeroImageSlider />
                    
                    {/* Live Metric Badge */}
                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-30 bg-white/90 backdrop-blur-md border border-white/50 p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8 duration-1000">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Live Adoption</p>
                        <p className="text-xs md:text-sm font-black text-slate-900 leading-none">{adoptionCount} Joined Worldwide</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BANNER / SOCIAL PROOF */}
        <section className="py-12 bg-slate-50/50 border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-[0.2em]">
                <Users className="h-5 w-5 text-primary" />
                Trusted by 1,000+ Farmers
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-[0.2em]">
                <Zap className="h-5 w-5 text-primary" />
                Real-Time FCR Monitoring
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Data Sovereignty Guaranteed
              </div>
            </div>
          </div>
        </section>

        {/* CORE BENEFITS */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-slate-900">
                Data-Driven Poultry Farming
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Managing a successful poultry farm requires attention to every detail. Optimize FCR, mortality, and feed waste with our specialized tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Batch Lifecycle", desc: "Complete visibility from chick placement to final market weight for both Broiler and Layer cycles.", icon: Layers },
                { title: "Precision FCR", desc: "Calculate Feed Conversion Ratio in real-time. Stop guessing and start tracking daily growth metrics.", icon: LineChart },
                { title: "Real-Time Profit", desc: "Instant visibility into your cash flow, overheads, and net profit margins across all sheds.", icon: Calculator },
                { title: "Waste Reduction", desc: "Inventory tracking down to the individual bag. Reduce feed waste by identifying consumption patterns.", icon: Scale },
                { title: "Flock Biosecurity", desc: "Automated vaccination schedules and mortality logs to maintain the highest health standards.", icon: ShieldCheck },
                { title: "Bank-Ready Reports", desc: "Professional financial and production reports optimized for accountants and bank loan applications.", icon: FileText }
              ].map((feature, idx) => (
                <div key={idx} className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:-translate-y-2">
                  <div className="mb-8 inline-flex p-4 rounded-2xl bg-white shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProductShowcase />

        {/* OUR STORY SECTION - ELEVATED */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -z-0" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight tracking-tight">
                Built by a <span className="text-primary italic">Poultry Farmer.</span>
              </h2>
              
              <div className="space-y-8 text-lg md:text-xl text-slate-300 leading-relaxed mb-12">
                <p className="font-bold italic text-white text-2xl md:text-3xl max-w-2xl mx-auto">
                  &quot;I created PoultryManager because I was tired of manual books and guessing my farm&apos;s performance.&quot;
                </p>
                <p className="max-w-2xl mx-auto text-slate-400 font-medium">
                  We built this platform to bring enterprise-grade technology to every farmer, ensuring no egg is unaccounted for and every bird is productive.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                {[
                  "Made for All Farm Scales",
                  "Military-Grade Cloud Security",
                  "Zero-Training Workflow",
                  "Multi-User Role Permissions"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <div className="bg-primary/20 p-2 rounded-xl">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-white text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="relative rounded-[4rem] bg-emerald-50/50 border border-primary/10 overflow-hidden p-12 md:p-24 text-center shadow-2xl shadow-primary/5">
              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1] text-slate-900">
                  Ready to Transform Your <br className="hidden md:block" />
                  <span className="text-primary italic">poultry business?</span>
                </h2>
                <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
                  Join thousands of modern farmers who have professionalized their operations with the industry&apos;s most reliable ERP.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/get-started">
                    <Button size="lg" className="rounded-full px-16 h-20 text-xl font-bold shadow-[0_25px_50px_-12px_rgba(6,95,70,0.4)] hover:scale-105 transition-all bg-primary">
                      {isPricingDisabled ? "Free Register" : "Register Now"} <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
