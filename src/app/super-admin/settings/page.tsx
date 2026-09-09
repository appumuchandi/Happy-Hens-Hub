import React from 'react';
import { getSystemSettings } from '../actions';
import { AdminSettingsClient } from '@/components/admin/admin-settings-client';
import { Settings, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  let settings: Record<string, string> = {};
  
  try {
    settings = await getSystemSettings();
  } catch (e) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center max-w-md">
          <ShieldCheck className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
          <p className="text-slate-500 mb-6">Please login to manage system settings.</p>
          <Button asChild className="rounded-full px-8">
            <Link href="/super-admin/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="mb-8">
            <Button variant="ghost" className="rounded-full gap-2 mb-4 hover:bg-white" asChild>
              <Link href="/super-admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <div className="flex items-center gap-5 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <Settings className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                  Manage application configuration and environment variables
                </p>
              </div>
            </div>
          </div>

          <AdminSettingsClient initialSettings={settings} />

        </div>
      </main>
    </div>
  );
}