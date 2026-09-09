import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  Info, 
  Settings, 
  UserCheck, 
  Share2, 
  Cookie, 
  Clock, 
  Scale, 
  Users, 
  FileText, 
  Mail 
} from 'lucide-react';
import { getAllSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  const settings = getAllSettings();
  const lastUpdated = settings.NEXT_PUBLIC_LAST_UPDATED || "July 16, 2026";
  const supportEmail = settings.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@poultrymanager.in';
  const siteUrl = (settings.NEXT_PUBLIC_SITE_URL || 'https://poultrymanager.in').replace('http://', 'https://');

  const sections = [
    {
      id: "intro",
      title: "Introduction",
      icon: Info,
      content: (
        <div className="space-y-4">
          <p>
            Welcome to <strong>PoultryManager</strong> ("we", "our", or "us").
          </p>
          <p>
            PoultryManager is a cloud-based ERP platform designed to help commercial poultry farms manage production, feed, inventory, finance, employees, and day-to-day farm operations.
          </p>
          <p>
            We are committed to protecting your personal and business information in accordance with applicable laws, including the <strong>Digital Personal Data Protection Act, 2023 (India)</strong>.
          </p>
          <p>
            By using our website or services, you agree to the collection and use of information as described in this Privacy Policy.
          </p>
        </div>
      )
    },
    {
      id: "collection",
      title: "1. Information We Collect",
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Account Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Company or farm name</li>
              <li>Business address</li>
              <li>User role</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Farm & Business Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Farm details</li>
              <li>Branch and shed information</li>
              <li>Bird batches</li>
              <li>Feed management records</li>
              <li>Inventory records</li>
              <li>Production records</li>
              <li>Financial records</li>
              <li>Employee information</li>
              <li>Reports generated within the platform</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Technical Information</h4>
            <p className="mb-2">When you use our website or software, we may automatically collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Access logs</li>
              <li>Date and time of access</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "usage",
      title: "2. How We Use Your Information",
      icon: Settings,
      content: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide and operate our software services</li>
          <li>Create and manage user accounts</li>
          <li>Improve platform performance</li>
          <li>Provide customer support</li>
          <li>Respond to enquiries</li>
          <li>Send important service-related notifications</li>
          <li>Maintain platform security</li>
          <li>Detect fraud and unauthorized access</li>
          <li>Comply with legal obligations</li>
        </ul>
      )
    },
    {
      id: "ownership",
      title: "3. Data Ownership",
      icon: UserCheck,
      content: (
        <div className="space-y-4">
          <p>
            All farm records, production data, inventory records, financial information, and other business data entered into PoultryManager remain the property of the respective customer.
          </p>
          <p>
            PoultryManager does not claim ownership of customer business data.
          </p>
        </div>
      )
    },
    {
      id: "sharing",
      title: "4. Data Sharing",
      icon: Share2,
      content: (
        <div className="space-y-4">
          <p>
            We respect your privacy. We do <strong>not</strong> sell, rent, or share your personal or business information with third parties for advertising or marketing purposes.
          </p>
          <p>Information may only be shared:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>With trusted service providers required to operate our platform</li>
            <li>To comply with applicable laws or legal processes</li>
            <li>To protect our legal rights and platform security</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      title: "5. Data Security",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <p>
            We implement industry-standard technical and organizational security measures to protect customer information from unauthorized access, disclosure, alteration, or destruction.
          </p>
          <p>
            These measures include secure cloud infrastructure, encrypted communication (SSL/TLS), user authentication, access controls, and regular security updates.
          </p>
          <p className="text-sm italic">
            While we strive to protect your information, no internet-based system can guarantee absolute security.
          </p>
        </div>
      )
    },
    {
      id: "cookies",
      title: "6. Cookies",
      icon: Cookie,
      content: (
        <div className="space-y-4">
          <p>Our website may use cookies and similar technologies to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Improve website functionality</li>
            <li>Remember user preferences</li>
            <li>Analyze website performance</li>
            <li>Enhance user experience</li>
          </ul>
          <p>
            You may disable cookies through your browser settings, although some features may not function properly.
          </p>
        </div>
      )
    },
    {
      id: "retention",
      title: "7. Data Retention",
      icon: Clock,
      content: (
        <p>
          We retain customer information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.
        </p>
      )
    },
    {
      id: "rights",
      title: "8. Your Rights",
      icon: Scale,
      content: (
        <div className="space-y-4">
          <p>Subject to applicable laws, you may request to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Update your account information</li>
            <li>Request deletion of eligible personal information</li>
            <li>Close your account</li>
          </ul>
          <p>
            Requests may be submitted to: <a href={`mailto:${supportEmail}`} className="text-primary font-bold hover:underline">{supportEmail}</a>
          </p>
        </div>
      )
    },
    {
      id: "children",
      title: "9. Children's Privacy",
      icon: Users,
      content: (
        <p>
          PoultryManager is intended for business users and is not designed for individuals under the age of 18. We do not knowingly collect personal information from children.
        </p>
      )
    },
    {
      id: "changes",
      title: "10. Changes to this Privacy Policy",
      icon: FileText,
      content: (
        <p>
          We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated "Last Updated" date.
        </p>
      )
    },
    {
      id: "contact",
      title: "11. Contact Us",
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p>If you have any questions regarding this Privacy Policy, please contact us:</p>
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
              Privacy Policy
            </h1>
            
            <p className="text-slate-500 text-sm font-medium mb-10">
              Last Updated: {lastUpdated} | DPDP Act (India) Compliance
            </p>

            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                    <div className="bg-primary/10 p-2.5 rounded-xl">
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
                Thank you for trusting PoultryManager with your farm business data.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
