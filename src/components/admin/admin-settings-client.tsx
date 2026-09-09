'use client';

import React, { useState } from 'react';
import { updateSystemSettings } from '@/app/super-admin/actions';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Hammer,
  Mail,
  Layers,
  Zap,
  ShieldCheck,
  Headphones,
  Lock,
  MessageSquare,
  KeyRound
} from 'lucide-react';

interface SettingsField {
  key: string;
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  description?: string;
}

interface SettingsSection {
  title: string;
  icon: any;
  fields: SettingsField[];
}

interface SettingsProps {
  initialSettings: Record<string, string>;
}

export function AdminSettingsClient({ initialSettings }: SettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (message) setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const result = await updateSystemSettings(settings);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'System configuration updated successfully.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    }
    
    setIsSaving(false);
  };

  const sections: SettingsSection[] = [
    {
      title: "Security & Access",
      icon: Lock,
      fields: [
        { key: 'SUPER_ADMIN_USERID', label: 'Admin User ID', type: 'password' },
        { key: 'SUPER_ADMIN_PASSWORD', label: 'Admin Password', type: 'password' },
        { key: 'DELETE_PASSWORD', label: 'Deletion Verification Password', type: 'password' },
        { key: 'TWO_FACTOR_AUTH', label: 'Two-Factor Authentication (2FA)', type: 'select', options: ['OFF', 'ON'] },
      ]
    },
    {
      title: "Telegram Integration",
      icon: MessageSquare,
      fields: [
        { key: 'TELEGRAM_BOT_TOKEN', label: 'Telegram API Token', type: 'password', placeholder: '123456789:ABC...', description: 'Your BotFather API Token. Masked for security.' },
        { key: 'TELEGRAM_CHAT_ID', label: 'Telegram Chat ID', type: 'text', placeholder: 'e.g., -100123456789', description: 'The Chat ID where you want to receive alerts.' },
      ]
    },
    {
      title: "Platform & Availability",
      icon: Hammer,
      fields: [
        { key: 'NEXT_PUBLIC_MAINTENANCE_MODE', label: 'Maintenance Mode', type: 'select', options: ['OFF', 'ON'] },
        { key: 'NEXT_PUBLIC_PRICING_PAGE', label: 'Pricing Visibility', type: 'select', options: ['ON', 'OFF'] },
        { key: 'NEXT_PUBLIC_TUTORIALS_PAGE', label: 'Tutorials Visibility', type: 'select', options: ['ON', 'OFF'] },
      ]
    },
    {
      title: "Email Service (Resend)",
      icon: Mail,
      fields: [
        { key: 'RESEND_API_KEY', label: 'Resend API Key', type: 'password', placeholder: 're_...' },
        { key: 'EMAIL_FROM', label: 'Verified Sender Email', type: 'email' },
        { key: 'EMAIL_FROM_NAME', label: 'Sender Display Name', type: 'text' },
        { key: 'EMAIL_TO', label: 'Admin Alert Email', type: 'email' },
      ]
    },
    {
      title: "Contact & Support",
      icon: Headphones,
      fields: [
        { key: 'NEXT_PUBLIC_SUPPORT_EMAIL', label: 'Public Support Email', type: 'email' },
        { key: 'NEXT_PUBLIC_SUPPORT_PHONE', label: 'Public WhatsApp Number', type: 'text' },
        { key: 'NEXT_PUBLIC_SITE_URL', label: 'Public Site URL', type: 'text' },
      ]
    }
  ];

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-20">
      {message && (
        <div className={`p-6 rounded-[2rem] border flex items-start gap-4 animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
          <div>
            <p className="font-black text-sm uppercase tracking-tight">{message.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="font-medium text-sm mt-1">{message.text}</p>
          </div>
        </div>
      )}

      {sections.map((section, idx) => (
        <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400">
              <section.icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
          </div>
          
          <div className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.fields.map((field) => {
                const options = field.type === "select" ? field.options ?? [] : [];
                return (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={settings[field.key] || (options.length > 0 ? options[0] : "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-white font-bold text-sm"
                      >
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={settings[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm"
                      />
                    )}
                    {field.description && <p className="text-[10px] text-slate-400 font-medium ml-1">{field.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isSaving}
          className="rounded-full px-12 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-3 bg-primary"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? 'Saving Changes...' : 'Commit Configuration'}
        </Button>
      </div>
    </form>
  );
}
