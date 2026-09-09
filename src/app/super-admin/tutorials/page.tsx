
import React from 'react';
import { getTutorialsAdmin } from './actions';
import { TutorialManagementClient } from '@/components/admin/tutorial-management-client';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TutorialManagementPage() {
  let tutorials: any[] = [];
  let error: string | null = null;

  try {
    tutorials = await getTutorialsAdmin();
  } catch (e: any) {
    error = e.message === 'AUTH_REQUIRED' ? 'AUTH' : 'DB';
  }

  if (error === 'AUTH') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl max-w-md">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <Button asChild className="rounded-full px-8">
            <Link href="/super-admin/login">Login to Continue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" className="rounded-full gap-2 mb-4 hover:bg-white" asChild>
              <Link href="/super-admin/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tutorial Manager</h1>
                  <p className="text-slate-500 font-medium text-sm mt-1">
                    Manage the video library for the Learning Center
                  </p>
                </div>
              </div>
            </div>
          </div>

          <TutorialManagementClient initialTutorials={tutorials} />
        </div>
      </main>
    </div>
  );
}
