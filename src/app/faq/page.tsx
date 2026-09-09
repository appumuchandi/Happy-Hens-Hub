import React from 'react';
import { 
  CircleHelp, 
  ArrowRight,
  Database,
  Cloud,
  Smartphone,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getPublicSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const settings = getPublicSettings();
  const supportEmail = settings.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@poultrymanager.in';
  const isPricingEnabled = settings.NEXT_PUBLIC_PRICING_PAGE !== 'OFF';

  const categories = [
    {
      title: "Getting Started",
      icon: ArrowRight,
      questions: [
        {
          q: "How can I become a customer?",
          a: "Simply fill out the 'Get Started' form on our website. Our team will verify your details, and you will receive a confirmation email on your registered email ID. Once confirmed, you can get started managing your farm with confidence."
        },
        {
          q: "Is there a free trial?",
          a: "We offer personalized demos where we walk you through the platform using your actual farm data. This ensures you see exactly how PoultryManager fits your specific operational needs before committing."
        },
        {
          q: "Do you provide training for my staff?",
          a: "Yes. Professional and Enterprise plans include guided onboarding. For all users, we provide a comprehensive library of video tutorials and step-by-step documentation."
        }
      ]
    },
    {
      title: "Pricing & Billing",
      icon: Database,
      questions: [
        {
          q: "Why is Layer pricing different from Broiler?",
          a: "Layer farming involves longer production cycles (up to 72+ weeks) and more complex daily management requirements compared to Broiler cycles (6-8 weeks). Our pricing is adjusted to provide the best value for the specific scale of each operation."
        },
        {
          q: "Are there any hidden setup fees?",
          a: "No. We believe in transparent pricing. There are no hidden setup fees, server maintenance charges, or mandatory update fees. You only pay the per-bird rate as per your plan."
        },
        {
          q: "Can I upgrade my plan mid-cycle?",
          a: "Yes, you can upgrade your plan at any time if your bird capacity increases. The new rates will apply to the subsequent batches you place."
        },
        {
          q: "How do I pay when adding a new farm or increasing bird capacity?",
          a: "When adding a farm or bird capacity, the fee is calculated automatically. Pay via UPI or Net Banking; your expansion is activated immediately following our team's verification."
        }
      ]
    },
    {
      title: "Technical & Data",
      icon: Cloud,
      questions: [
        {
          q: "Is my farm data secure?",
          a: "Absolutely. We use industry-standard AES-256 encryption for data at rest and SSL/TLS for data in transit. Your data is stored in secure cloud environments with daily automated backups."
        },
        {
          q: "Can I access the platform without internet?",
          a: "PoultryManager is a cloud-based platform designed for real-time synchronization. While you need an internet connection to sync data, our mobile interface is optimized to work efficiently even on low-bandwidth 3G/4G connections commonly found in rural areas."
        },
        {
          q: "Can I export my reports for my accountant?",
          a: "All financial transactions can be exported in Excel formats with a single click."
        }
      ]
    },
    {
      title: "Platform Features",
      icon: Smartphone,
      questions: [
        {
          q: "Can I manage multiple farm locations?",
          a: "Yes. Our platform is built for multi-farm management. You can see consolidated reports for all your locations or drill down into specific sheds from a single owner dashboard."
        },
        {
          q: "Who owns the data I enter into PoultryManager?",
          a: "You do. Your data is your property. We simply provide the secure infrastructure and tools to manage and analyze it. We have a strict zero-sharing policy with third parties."
        },
        {
          q: "How many users can I add to my account?",
          a: "All our plans support unlimited users. You can add General Manager, farm managers, feed managers, and egg traders with specific role-based access permissions to ensure data integrity."
        }
      ]
    }
  ];

  const filteredCategories = isPricingEnabled 
    ? categories 
    : categories.filter(c => c.title !== "Pricing & Billing");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="pt-16 pb-16 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Help <span className="text-primary italic">Center</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Find answers to common questions about PoultryManager's features, pricing, and how we help you manage your farm better.
            </p>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-16">
              {filteredCategories.map((category, idx) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4">
                    <div className="sticky top-32">
                      <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                        <category.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">{category.title}</h2>
                      <p className="text-slate-500 text-sm font-medium">Common questions related to {category.title.toLowerCase()}.</p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 space-y-6">
                    {category.questions.map((item, qIdx) => (
                      <article key={qIdx} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-start gap-3">
                          <CircleHelp className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden="true" />
                          {item.q}
                        </h4>
                        <p className="text-slate-600 leading-relaxed pl-8">
                          {item.a}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STILL HAVE QUESTIONS */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                <LifeBuoy className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Still have questions?</h2>
              <p className="text-slate-400 text-lg mb-8 font-medium">
                Can't find the answer you're looking for? Our support team is ready to help you with any specific queries about your farm operations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-10 h-14 font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white" asChild>
                  <a href={`mailto:${supportEmail}`} aria-label="Email support for more information">Contact Support</a>
                </Button>
                {isPricingEnabled && (
                  <Link href="/pricing">
                    <Button size="lg" className="rounded-full px-10 h-14 font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white">
                      View Pricing Plans
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
