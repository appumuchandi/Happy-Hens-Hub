import { 
  FileText, 
  Info, 
  Users, 
  ShieldAlert, 
  Database, 
  CreditCard, 
  Clock, 
  HardDrive, 
  Copyright, 
  Lock, 
  Scale, 
  XCircle, 
  ExternalLink, 
  Zap, 
  RefreshCw, 
  Gavel, 
  Mail 
} from 'lucide-react';
import { getAllSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TermsOfServicePage() {
  const settings = getAllSettings();
  const lastUpdated = settings.NEXT_PUBLIC_LAST_UPDATED || "July 16, 2026";
  const supportEmail = settings.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@poultrymanager.in';
  const siteUrl = (settings.NEXT_PUBLIC_SITE_URL || 'https://poultrymanager.in').replace('http://', 'https://');

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>Welcome to <strong>PoultryManager</strong> ("we", "our", or "us").</p>
          <p>These Terms of Service ("Terms") govern your access to and use of the PoultryManager website, cloud software, and related services.</p>
          <p>By accessing or using PoultryManager, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree with these Terms, you must not use our services.</p>
        </div>
      )
    },
    {
      id: "about",
      title: "2. About PoultryManager",
      icon: Info,
      content: (
        <div className="space-y-4">
          <p>PoultryManager is a cloud-based ERP platform designed to help commercial poultry farms manage:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Layer operations</li>
            <li>Broiler operations</li>
            <li>Feed management</li>
            <li>Inventory management</li>
            <li>Production records</li>
            <li>Financial management</li>
            <li>Employee management</li>
            <li>Farm and branch operations</li>
            <li>Business reporting</li>
          </ul>
        </div>
      )
    },
    {
      id: "accounts",
      title: "3. User Accounts",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p>You are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Providing accurate and complete information.</li>
            <li>Maintaining the confidentiality of your login credentials.</li>
            <li>Restricting unauthorized access to your account.</li>
            <li>All activities performed using your account.</li>
          </ul>
          <p>You must notify us immediately if you suspect unauthorized use of your account.</p>
        </div>
      )
    },
    {
      id: "use",
      title: "4. Acceptable Use",
      icon: ShieldAlert,
      content: (
        <div className="space-y-4">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Violate any applicable laws or regulations.</li>
            <li>Attempt unauthorized access to our systems or other customer accounts.</li>
            <li>Upload viruses, malware, or harmful software.</li>
            <li>Interfere with the security or operation of the platform.</li>
            <li>Copy, modify, reverse engineer, or distribute any part of the software without written permission.</li>
            <li>Use the platform for unlawful, fraudulent, or abusive purposes.</li>
          </ul>
        </div>
      )
    },
    {
      id: "data",
      title: "5. Customer Data",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p>All farm records, production data, financial information, inventory records, and other business information entered into PoultryManager remain the property of the respective customer.</p>
          <p>Customers are responsible for ensuring the accuracy and legality of the information they store within the platform.</p>
        </div>
      )
    },
    {
      id: "payments",
      title: "6. Subscription and Payments",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p>Where applicable:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Subscription fees must be paid according to the selected plan.</li>
            <li>Failure to pay may result in suspension or termination of services.</li>
            <li>Prices may be revised with prior notice.</li>
            <li>Taxes, where applicable, are the responsibility of the customer.</li>
          </ul>
        </div>
      )
    },
    {
      id: "availability",
      title: "7. Service Availability",
      icon: Clock,
      content: (
        <div className="space-y-4">
          <p>We strive to provide reliable and uninterrupted service.</p>
          <p>However, we do not guarantee that the platform will always be available without interruption. Scheduled maintenance, software updates, internet failures, third-party service interruptions, or unforeseen technical issues may temporarily affect service availability.</p>
        </div>
      )
    },
    {
      id: "backup",
      title: "8. Data Backup",
      icon: HardDrive,
      content: (
        <div className="space-y-4">
          <p>We perform routine backups to improve service reliability.</p>
          <p>However, customers are encouraged to maintain copies of critical business records where appropriate. PoultryManager is not responsible for losses arising from circumstances beyond our reasonable control.</p>
        </div>
      )
    },
    {
      id: "ip",
      title: "9. Intellectual Property",
      icon: Copyright,
      content: (
        <div className="space-y-4">
          <p>PoultryManager, including its software, source code, design, branding, logos, databases, reports, documentation, graphics, and other intellectual property, is owned by PoultryManager and protected by applicable intellectual property laws.</p>
          <p>Your subscription grants a limited, non-exclusive, non-transferable license to use the platform. No ownership rights are transferred.</p>
        </div>
      )
    },
    {
      id: "confidentiality",
      title: "10. Confidentiality",
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p>We treat customer business information as confidential and implement reasonable security measures to protect it.</p>
          <p>Customers are responsible for maintaining the confidentiality of their own account credentials.</p>
        </div>
      )
    },
    {
      id: "liability",
      title: "11. Limitation of Liability",
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p>To the maximum extent permitted by applicable law, PoultryManager shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including loss of profits, production, business opportunities, or data arising from the use or inability to use the platform.</p>
          <p>Our total liability, if any, shall not exceed the amount paid by the customer for the services during the preceding twelve (12) months.</p>
        </div>
      )
    },
    {
      id: "termination",
      title: "12. Suspension and Termination",
      icon: XCircle,
      content: (
        <div className="space-y-4">
          <p>We may suspend or terminate access to the platform if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>These Terms are violated.</li>
            <li>Required by applicable law.</li>
            <li>The platform is used for fraudulent or illegal activities.</li>
            <li>Subscription payments remain outstanding.</li>
          </ul>
          <p>Customers may discontinue using the platform at any time.</p>
        </div>
      )
    },
    {
      id: "third-party",
      title: "13. Third-Party Services",
      icon: ExternalLink,
      content: (
        <p>PoultryManager may integrate with trusted third-party services such as cloud hosting providers, email service providers, analytics providers, or payment providers. We are not responsible for the availability, security, or policies of third-party services.</p>
      )
    },
    {
      id: "changes-service",
      title: "14. Changes to the Service",
      icon: Zap,
      content: (
        <p>We may modify, improve, update, replace, or discontinue features or functionality of the platform from time to time in order to improve our services.</p>
      )
    },
    {
      id: "changes-terms",
      title: "15. Changes to These Terms",
      icon: RefreshCw,
      content: (
        <p>We may update these Terms from time to time. The latest version will always be available on this page with the revised "Last Updated" date. Continued use of the platform after any changes constitutes acceptance of the updated Terms.</p>
      )
    },
    {
      id: "law",
      title: "16. Governing Law",
      icon: Gavel,
      content: (
        <div className="space-y-4">
          <p>These Terms shall be governed by and construed in accordance with the laws of India.</p>
          <p>Any disputes arising from or relating to these Terms or the use of PoultryManager shall be subject to the exclusive jurisdiction of the competent courts located where PoultryManager's registered business is situated.</p>
        </div>
      )
    },
    {
      id: "contact",
      title: "17. Contact Us",
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p>If you have any questions regarding these Terms of Service, please contact us:</p>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="font-bold text-slate-900">PoultryManager</p>
            <p className="text-sm">Website: <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{siteUrl}</a></p>
            <p className="text-sm">Email: <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">{supportEmail}</a></p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-grow pt-12 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 md:p-16">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Terms of Service
            </h1>
            
            <p className="text-slate-500 text-sm font-medium mb-10">
              Last Updated: {lastUpdated}
            </p>

            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </h2>
                  <div className="text-slate-600 leading-relaxed pl-1 sm:pl-14">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-xs font-medium italic">
                Thank you for choosing PoultryManager.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
