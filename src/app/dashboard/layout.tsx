'use client';
import type { ReactNode } from 'react';
import { AuthProvider, AuthContext } from '@/lib/auth';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/dashboard/sidebar';
import AppHeader from '@/components/dashboard/header';

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // If context is loaded and user is not authenticated, redirect to login
    if (auth !== undefined && !auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth, router]);

  if (!auth || !auth.isAuthenticated) {
    // Render a loading state or null while checking auth
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-foreground">Loading...</div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </AuthProvider>
  );
}
