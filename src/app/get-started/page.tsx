import React, { Suspense } from 'react';
import { getPublicSettings } from '@/lib/db';
import { GetStartedForm } from '@/components/get-started/get-started-form';

export const dynamic = 'force-dynamic';

export default async function GetStartedPage() {
  const settings = getPublicSettings();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-grow py-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <GetStartedForm settings={settings} />
        </Suspense>
      </main>
    </div>
  );
}
