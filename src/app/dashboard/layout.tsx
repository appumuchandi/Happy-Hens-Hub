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
    // If context is no longer loading and user is not authenticated, redirect
    if (auth && auth.isLoaded && !auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth, router]);

  // Render a loading state while the auth status is being determined.
  if (!auth || !auth.isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  // If loaded and not authenticated, we'll be redirecting, so render nothing to avoid flicker.
  if (!auth.isAuthenticated) {
    return null;
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
