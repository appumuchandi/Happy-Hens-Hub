import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Hammer, Mail } from "lucide-react";
import { getPublicSettings } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  await headers();
  const settings = getPublicSettings();
  const siteUrl = (settings.NEXT_PUBLIC_SITE_URL || 'https://poultrymanager.in').replace('http://', 'https://');

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "PoultryManager | #1 Poultry Farm Management ERP Software",
      template: "%s | PoultryManager"
    },
    description: "The #1 cloud platform designed for modern poultry farmers. Track batches, optimize FCR, and master your farm finances in one place.",
    keywords: ["poultry management software India", "farm management ERP", "broiler farm software", "layer farm ERP", "poultry production tracking", "poultry FCR calculator", "PoultryManager India", "poultry ERP system", "poultry farm records app"],
    applicationName: "PoultryManager",
    appleWebApp: {
      title: "PoultryManager",
      statusBarStyle: "default",
      capable: true,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: "PoultryManager",
      title: "PoultryManager | Enterprise-Grade Poultry Farm ERP",
      description: "The #1 cloud platform designed for modern poultry farmers. Track batches, optimize FCR, and master your farm finances in one place.",
      images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "PoultryManager | Enterprise-Grade Poultry Farm ERP",
      description: "The #1 cloud platform designed for modern poultry farmers. Track batches, optimize FCR, and master your farm finances in one place.",
      images: ["/images/og-image.png"],
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#065f46',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getPublicSettings();
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || "";
  
  const isMaintenanceMode = settings.NEXT_PUBLIC_MAINTENANCE_MODE === 'ON';
  const isSuperAdminPath = pathname.startsWith('/super-admin');
  
  const showMaintenance = isMaintenanceMode && !isSuperAdminPath;
  const supportEmail = settings.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@poultrymanager.in';
  const gaId = settings.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en-IN" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {showMaintenance ? (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl border border-slate-200">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary">
                <Hammer className="h-10 w-10 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Under Maintenance</h1>
              <p className="text-slate-600 mb-10 leading-relaxed font-medium">
                We're currently performing some scheduled updates to improve your experience. We'll be back online shortly.
              </p>
              <div className="pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-4">Need urgent assistance?</p>
                <a href={`mailto:${supportEmail}`} className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                  <Mail className="h-4 w-4" />
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Navbar settings={settings} />
            {children}
            <Footer settings={settings} />
            {gaId && (
              <>
                <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', { page_path: window.location.pathname });
                  `}
                </Script>
              </>
            )}
          </>
        )}
      </body>
    </html>
  );
}
