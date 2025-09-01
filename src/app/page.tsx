
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Egg, Phone, MapPin, Wheat, Send, Recycle, ClipboardList, Moon, Sun } from 'lucide-react';
import { siteSettings as defaultSettings, type SiteSettings, dashboardStats } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';

const RupeeIcon = () => (
    <span className="font-bold">₹</span>
);

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const messageSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters."}),
    email: z.string().email({ message: "Please enter a valid email."}),
    message: z.string().min(10, { message: "Message must be at least 10 characters."})
});

type MessageFormValues = z.infer<typeof messageSchema>;

function ContactForm({ setDialogOpen, title = "Contact Us", description = "Fill out the form below and we'll get back to you as soon as possible.", placeholder = "How can we help you today?" }: { setDialogOpen: (open: boolean) => void, title?: string, description?: string, placeholder?: string }) {
    const { toast } = useToast();
    const messageForm = useForm<MessageFormValues>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        }
    });

    function onMessageSubmit(data: MessageFormValues) {
        const newMessage = {
            id: `MSG${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...data
        };

        const existingMessages = JSON.parse(localStorage.getItem('customerMessages') || '[]');
        localStorage.setItem('customerMessages', JSON.stringify([newMessage, ...existingMessages]));

        toast({
            title: "Message Sent!",
            description: "Thanks for reaching out. We'll get back to you soon.",
        });
        messageForm.reset();
        setDialogOpen(false);
    }
    
    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <Form {...messageForm}>
                <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="space-y-4">
                     <FormField
                        control={messageForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={messageForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={messageForm.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder={placeholder} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        <Send className="mr-2"/>
                        Send Message
                    </Button>
                </form>
            </Form>
        </DialogContent>
    )
}


function LandingPageContent() {
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const { setTheme, theme } = useTheme();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedSettings = localStorage.getItem('siteSettings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);
    
    function onLoginSubmit(data: LoginFormValues) {
        if (data.username === 'appu_muchandi' && data.password === 'appu1234') {
            login({ name: 'appu_muchandi', username: 'appu_muchandi', role: 'OWNER' });
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid Credentials',
                description: 'Please check your username and password.',
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
                     <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    {isAuthenticated ? (
                        <Button asChild>
                            <Link href="/dashboard">
                                Go to Dashboard
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </nav>
        </header>

        <main>
            {/* About Section */}
            <section id="about" className="py-12">
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
                    <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
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
                                <CardTitle className="font-headline text-2xl">Available Egg Stock</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-5xl font-bold text-accent">{settings.availableStock.toLocaleString()}</p>
                                <p className="text-muted-foreground">eggs available for order</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            {/* Farm Updates Section */}
             <section id="farm-updates" className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 font-headline">Farm Updates</h2>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <Egg className="w-8 h-8 text-blue-600"/>
                                </div>
                                <h3 className="text-xl font-bold">Bulk Egg Orders</h3>
                                <p className="text-muted-foreground">Please contact Farm administrator for Bulk Eggs.</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <Wheat className="w-8 h-8 text-orange-600"/>
                                </div>
                                <h3 className="text-xl font-bold">Ready Feed Orders</h3>
                                <p className="text-muted-foreground">Please contact Farm administrator for Feed.</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <Recycle className="w-8 h-8 text-green-600"/>
                                </div>
                                <h3 className="text-xl font-bold">Compost Fertilizer</h3>
                                <p className="text-2xl font-bold text-foreground">370 Bags</p>
                                <p className="text-muted-foreground">at Rs. 170/Bag</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-yellow-100 p-4 rounded-full">
                                    <ClipboardList className="w-8 h-8 text-yellow-600"/>
                                </div>
                                <h3 className="text-xl font-bold">Maize Requirement</h3>
                                <p className="text-2xl font-bold text-foreground">150.00 Quintal</p>
                                <p className="text-muted-foreground">Needed to restock silos</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Login Section */}
            {!isAuthenticated && (
            <section id="login" className="py-20 bg-card">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <Card className="w-full max-w-md saffron-border shadow-lg">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onLoginSubmit)}>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl text-center">Login</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
            <section id="contact" className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold font-headline mb-4">Get In Touch</h2>
                     <Dialog open={openContactDialog} onOpenChange={setOpenContactDialog}>
                        <DialogTrigger asChild>
                             <Button variant="link" className="text-lg text-muted-foreground mb-8">
                                Have questions? We'd love to hear from you.
                            </Button>
                        </DialogTrigger>
                        <ContactForm setDialogOpen={setOpenContactDialog} />
                    </Dialog>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <div>
                            <h3 className="font-semibold text-xl flex items-center justify-center gap-2">
                                <Phone className="w-6 h-6 text-primary"/>
                                Call Us
                            </h3>
                            <div className="flex flex-col mt-2">
                                <a href="tel:+918861790121" className="text-lg text-muted-foreground hover:text-primary">+91 88617 90121</a>
                                <a href="tel:+919113800449" className="text-lg text-muted-foreground hover:text-primary">+91 91138 00449</a>
                                <a href="tel:+919380970083" className="text-lg text-muted-foreground hover:text-primary">+91 93809 70083</a>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl flex items-center justify-center gap-2">
                                <MapPin className="w-6 h-6 text-primary"/>
                                Visit Us
                            </h3>
                            <a 
                                href="https://www.google.com/maps/dir/?api=1&destination=Happy%20Hen's%20Hub,%2096J8%2B7V2,%20Mugalkhod,%20Karnataka%20587113" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg text-muted-foreground hover:text-primary mt-2 block"
                            >
                                Happy Hen's Hub, 96J8+7V2, <br/> Mugalkhod, Karnataka 587113
                            </a>
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
