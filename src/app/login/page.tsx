
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Egg } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthProvider } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function OwnerLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    // Hardcoded owner credentials
    if (data.email === 'owner@henshub.com' && data.password === 'password123') {
        login();
        router.push('/dashboard');
    } else {
        toast({
            variant: 'destructive',
            title: 'Invalid Credentials',
            description: 'Please check your email and password.',
        });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-8">
            <div className="text-center">
                <Egg className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold font-headline tracking-tight text-foreground">
                HEN's HUB
                </h1>
                <p className="mt-2 text-muted-foreground">
                Owner Login
                </p>
            </div>
             <Card className="w-full max-w-md saffron-border shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="owner@henshub.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Sign In
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    </main>
  );
}


export default function LoginPage() {
    return (
        <AuthProvider>
            <OwnerLoginForm />
        </AuthProvider>
    )
}
