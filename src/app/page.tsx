
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthProvider } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Egg, Phone, MapPin, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { siteSettings as defaultSettings, type SiteSettings } from '@/lib/placeholder-data';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const RupeeIcon = () => (
    <span className="font-bold">₹</span>
);

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;


function LandingPageContent() {
    const { isAuthenticated, login } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: '',
        password: '',
        },
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }
    }, []);

    const galleryImages = [
        { src: 'https://picsum.photos/600/400?random=1', alt: 'Hens in the coop', hint: 'hens coop' },
        { src: 'https://picsum.photos/600/400?random=2', alt: 'Freshly collected eggs', hint: 'eggs basket' },
        { src: 'https://picsum.photos/600/400?random=3', alt: 'The farm landscape', hint: 'farm landscape' },
        { src: 'https://picsum.photos/600/400?random=4', alt: 'Feeding time', hint: 'chicken feed' },
    ];
    
    function onLoginSubmit(data: LoginFormValues) {
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
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                 <Egg className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline">HEN's HUB</span>
            </Link>
            <div className="flex items-center gap-2">
                 <Button asChild>
                    <Link href="/order">
                        <ShoppingCart className="mr-2"/>
                        Order Now
                    </Link>
                </Button>
                {isAuthenticated && (
                     <Button variant="outline" asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2"/>
                            Dashboard
                        </Link>
                    </Button>
                )}
            </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center bg-card">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-bold font-headline mb-4">Farm-Fresh Eggs, Delivered.</h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    Straight from our happy hens to your home. Experience the taste of quality and freshness with every order.
                </p>
                <Button size="lg" asChild>
                    <Link href="/order">
                        <ShoppingCart className="mr-2"/>
                        Place Your Order
                    </Link>
                </Button>
            </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-20">
            <div className="container mx-auto px-4">
                 <h2 className="text-4xl font-bold text-center mb-12 font-headline">About Our Farm</h2>
                 <div className="max-w-4xl mx-auto text-center text-muted-foreground">
                    <p className="whitespace-pre-line text-lg">{settings.aboutFarm}</p>
                 </div>
            </div>
        </section>

        {/* Pricing & Stock Section */}
        <section id="pricing" className="py-20 bg-card">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 font-headline">Price & Availability</h2>
                 <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="saffron-border">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">Price per Egg</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-5xl font-bold text-primary flex items-center justify-center">
                                <RupeeIcon />{settings.pricePerEgg.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl">Available Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-5xl font-bold text-accent">{settings.availableStock.toLocaleString()}</p>
                            <p className="text-muted-foreground">eggs available for order</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

         {/* Gallery Section */}
        <section id="gallery" className="py-20">
             <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 font-headline">Glimpse of Our Farm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1">
                            <Image 
                                src={image.src} 
                                alt={image.alt} 
                                width={600} 
                                height={400} 
                                data-ai-hint={image.hint}
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Login Section */}
        {!isAuthenticated && (
            <section id="login" className="py-20 border-t">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <h2 className="text-4xl font-bold font-headline mb-4 text-center">Owner Login</h2>
                    <p className="text-muted-foreground mb-8 text-center">Access the management dashboard.</p>
                    <Card className="w-full max-w-md saffron-border shadow-lg">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onLoginSubmit)}>
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
            </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-card">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold font-headline mb-8">Get In Touch</h2>
                <p className="text-lg text-muted-foreground mb-8">Have questions? We'd love to hear from you.</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                     <div className="flex items-center gap-4">
                        <Phone className="w-8 h-8 text-primary"/>
                        <div>
                            <h3 className="font-semibold text-xl">Call Us</h3>
                            <a href={`tel:${settings.contactInfo}`} className="text-lg text-muted-foreground hover:text-primary">{settings.contactInfo}</a>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <MapPin className="w-8 h-8 text-primary"/>
                         <div>
                            <h3 className="font-semibold text-xl">Visit Us</h3>
                            <p className="text-lg text-muted-foreground">{settings.address}</p>
                        </div>
                    </div>
                </div>
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

export default function LandingPage() {
    return (
        <AuthProvider>
            <LandingPageContent />
        </AuthProvider>
    )
}
