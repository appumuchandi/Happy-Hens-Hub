import { LoginForm } from '@/components/auth/login-form';
import { AuthProvider } from '@/lib/auth';
import { Egg } from 'lucide-react';

export default function LoginPage() {
  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-8">
          <div className="text-center">
            <Egg className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl font-bold font-headline tracking-tight text-foreground">
              HEN's HUB
            </h1>
            <p className="mt-2 text-muted-foreground">
              Modern Poultry Farm Management
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </AuthProvider>
  );
}
