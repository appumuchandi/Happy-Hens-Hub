

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Wheat, Send, Recycle, ClipboardList, Moon, Sun, User as UserIcon, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { siteSettings as defaultSettings, type SiteSettings, dashboardStats } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';

const RupeeIcon = () => (
    <span className="font-bold">₹</span>
);

const H3Logo = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 80" 
        className="h-10 w-auto" 
        fill="none" 
    >
        <text 
            x="0" y="65" 
            fontSize="80" 
            fill="hsl(var(--foreground))"
            fontFamily="sans-serif"
            fontWeight="bold"
        >
            H
        </text>
         <text 
            x="68" y="40" 
            fontSize="48" 
            fill="hsl(var(--destructive))"
            fontFamily="sans-serif"
            fontWeight="normal"
        >
            3
        </text>
    </svg>
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
    const [showPassword, setShowPassword] = useState(false);

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
                    <H3Logo />
                    <span className="text-2xl font-bold font-headline">Happy Hen's Hub</span>
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
                </div>
            </nav>
        </header>

        <main>
             {/* Welcome Section */}
             <section className="py-20 text-center bg-background">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground animate-slide-in-left">Welcome to Happy Hens Hub</h1>
                </div>
            </section>

            {/* Farm Updates Section */}
             <section id="farm-updates" className="py-20 bg-card">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 font-headline">Farm Updates</h2>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
                                    <Image src="https://placehold.co/40x40/3399FF/FFFFFF.png" alt="Bulk Egg Orders" width={40} height={40} data-ai-hint="eggs basket"/>
                                </div>
                                <h3 className="text-xl font-bold">Bulk Egg Orders</h3>
                                <p className="text-muted-foreground">Please contact Farm administrator for Bulk Eggs.</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-orange-100 dark:bg-orange-900/50 p-4 rounded-full">
                                    <Wheat className="w-8 h-8 text-orange-600 dark:text-orange-400"/>
                                </div>
                                <h3 className="text-xl font-bold">Ready Feed Orders</h3>
                                <p className="text-muted-foreground">Please contact Farm administrator for Feed.</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                                    <Recycle className="w-8 h-8 text-green-600 dark:text-green-400"/>
                                </div>
                                <h3 className="text-xl font-bold">Compost Fertilizer</h3>
                                <p className="text-2xl font-bold text-foreground">370 Bags</p>
                                <p className="text-muted-foreground">at Rs. 170/Bag</p>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full">
                                    <ClipboardList className="w-8 h-8 text-yellow-600 dark:text-yellow-400"/>
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
            <section id="login" className="py-20 bg-background">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg">
                        <div className="flex flex-col items-center mb-8">
                            <H3Logo />
                            <h2 className="text-2xl font-bold text-foreground mt-2">Happy Hens Hub</h2>
                            <p className="text-muted-foreground">Welcome to your farm management system</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-6">
                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} className="pl-10 h-12 rounded-full bg-background border-input focus:bg-background focus:border-primary" />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="pl-4"/>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} className="pl-10 pr-10 h-12 rounded-full bg-background border-input focus:bg-background focus:border-primary" />
                                        </FormControl>
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground"/> : <Eye className="h-5 w-5 text-muted-foreground" />}
                                        </button>
                                    </div>
                                    <FormMessage className="pl-4"/>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit" size="lg" className="w-full h-14 rounded-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white text-lg font-bold shadow-lg">
                                    Sign In
                                    <ChevronRight className="ml-2"/>
                                </Button>
                            </form>
                        </Form>
                        <div className="mt-8 flex justify-between items-center text-sm">
                            <Dialog open={openContactDialog} onOpenChange={setOpenContactDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="link" className="text-muted-foreground p-0 h-auto text-left">
                                      <div className="flex flex-col items-start leading-snug">
                                        <span>Contact Farm</span>
                                        <span>Administrator</span>
                                      </div>
                                    </Button>
                                </DialogTrigger>
                                <ContactForm 
                                    setDialogOpen={setOpenContactDialog} 
                                    title="Contact Administrator" 
                                    description="For login issues or other administrative queries, please leave a message."
                                    placeholder="Please describe your login issue."
                                />
                            </Dialog>
                             <a 
                                href="https://www.google.com/maps/dir/?api=1&destination=Happy%20Hen's%20Hub,%2096J8%2B7V2,%20Mugalkhod,%20Karnataka%20587113" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                            >
                                <MapPin className="h-4 w-4"/>
                                Locate Us
                            </a>
                        </div>
                    </div>
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

    

    
