
import React from 'react';
import { Button } from '@/components/ui/button';
import { getOnboardingRequests, logoutAction } from '../actions';
import { AdminDashboardClient } from '@/components/admin/admin-dashboard-client';
import { 
  LayoutDashboard, 
  LogOut, 
  ShieldAlert,
  Settings,
  AlertCircle,
  Video
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  
  let data: any = null;
  let errorType: 'AUTH' | 'DATABASE' | null = null;
  
  try {
    data = await getOnboardingRequests(currentPage, 100);
  } catch (e: any) {
    if (e.message === 'AUTH_REQUIRED') {
      errorType = 'AUTH';
    } else {
      errorType = 'DATABASE';
    }
  }

  if (errorType === 'AUTH') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Access Denied</h1>
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              You are not authorized to view this page. Your session may have expired or you are not signed in.
            </p>
            <Button className="rounded-full px-10 h-14 font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/super-admin/login">Return to Login</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (errorType === 'DATABASE') {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">System Error</h1>
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              We encountered an issue connecting to the database. Please try refreshing the page or contact support if the issue persists.
            </p>
            <Button className="rounded-full px-10 h-14 font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/super-admin/dashboard">Retry Connection</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Monitoring: Onboarding Requests
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full px-5 h-11 border-slate-200 hover:bg-slate-50 font-bold text-slate-600" asChild>
                <Link href="/super-admin/tutorials">
                  <Video className="h-4 w-4 mr-2" />
                  Tutorial Manager
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full px-5 h-11 border-slate-200 hover:bg-slate-50 font-bold text-slate-600" asChild>
                <Link href="/super-admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Link>
              </Button>
              <form action={logoutAction}>
                <Button variant="destructive" className="rounded-full px-6 h-11 font-bold gap-2 shadow-lg shadow-destructive/10">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>

          <AdminDashboardClient 
            initialRequests={data.requests} 
            initialStats={data.stats}
            pagination={data.pagination}
          />

        </div>
      </main>
    </div>
  );
}
