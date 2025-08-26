
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Egg } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;


function LoginPageContent() {
    const { isAuthenticated, login } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: '',
        password: '',
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);
    
    function onLoginSubmit(data: LoginFormValues) {
        if (data.email === 'owner@henshub.com' && data.password === 'appu1234') {
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
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                 <Egg className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline">HEN's HUB</span>
            </Link>
            <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <section id="login" className="py-20 w-full">
            <div className="container mx-auto px-4 flex flex-col items-center">
                <Card className="w-full max-w-md saffron-border shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onLoginSubmit)}>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl text-center">Owner Login</CardTitle>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
         <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} HEN's HUB. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
    return (
        <AuthProvider>
            <LoginPageContent />
        </AuthProvider>
    )
}
