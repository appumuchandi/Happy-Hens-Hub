
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Send, Moon, Sun, User as UserIcon, Lock, Eye, EyeOff, ChevronRight, Recycle, Wheat, Archive, ShoppingCart } from 'lucide-react';
import { siteSettings as defaultSettings } from '@/lib/placeholder-data';
import type { SiteSettings } from '@/types';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const OIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/></svg>);

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

const reservationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "A valid phone number is required"),
    quantity: z.coerce.number().int().positive("Quantity must be a positive number"),
});
type ReservationFormValues = z.infer<typeof reservationSchema>;


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
                                <Input placeholder="Enter your name" {...field} />
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
                                <Input type="email" placeholder="Enter your email" {...field} />
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
                                <Textarea placeholder="Enter your message" {...field} />
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

function ReservationForm({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
    const { toast } = useToast();
    const reservationForm = useForm<ReservationFormValues>({
        resolver: zodResolver(reservationSchema),
        defaultValues: { name: "", phone: "", quantity: undefined },
    });

    function onReservationSubmit(data: ReservationFormValues) {
        const newReservation = {
            id: `RES${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Pending',
            ...data
        };
        const existingReservations = JSON.parse(localStorage.getItem('eggReservations') || '[]');
        localStorage.setItem('eggReservations', JSON.stringify([newReservation, ...existingReservations]));
        toast({
            title: "Reservation Placed!",
            description: "Your egg request has been sent. We'll contact you when it's ready for pickup.",
        });
        reservationForm.reset();
        setDialogOpen(false);
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reserve Your Eggs</DialogTitle>
                <DialogDescription>Let us know how many eggs you need, and we'll prepare them for your pickup.</DialogDescription>
            </DialogHeader>
            <Form {...reservationForm}>
                <form onSubmit={reservationForm.handleSubmit(onReservationSubmit)} className="space-y-4">
                    <FormField name="name" control={reservationForm.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl><Input placeholder="Enter your name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="phone" control={reservationForm.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input placeholder="Enter your phone no." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="quantity" control={reservationForm.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity (in pieces)</FormLabel>
                            <FormControl><Input type="number" placeholder="Enter quantity" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" className="w-full">
                        <ShoppingCart className="mr-2"/>
                        Place Reservation
                    </Button>
                </form>
            </Form>
        </DialogContent>
    );
}

function LandingPageContent() {
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [openReservationDialog, setOpenReservationDialog] = useState(false);
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
             <section className="py-20 text-center bg-background overflow-hidden">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground animate-fade-in-bounce">
                        Welcome to <span className="text-amber-500">Happy Hens Hub</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground animate-fade-in-delay">
                        From happy hens to happy homes.
                    </p>
                </div>
            </section>
            
            {/* Farm Updates Section */}
            <section className="py-12 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline text-primary">Farm Updates</h2>
                        <p className="text-muted-foreground">Latest stock and requirement details.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Bulk Egg Orders */}
                         <Dialog open={openReservationDialog} onOpenChange={setOpenReservationDialog}>
                            <DialogTrigger asChild>
                                <Card className="bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 h-full cursor-pointer hover:border-blue-400 transition-all">
                                    <CardContent className="pt-6 flex items-center gap-4">
                                        <div className="bg-blue-500 text-white rounded-full p-3">
                                            <ShoppingCart/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Bulk Egg Orders</CardTitle>
                                            <CardDescription className="text-blue-600 dark:text-blue-400">Click here to reserve eggs for pickup.</CardDescription>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                             <ReservationForm setDialogOpen={setOpenReservationDialog} />
                        </Dialog>
                        {/* Ready Feed Orders */}
                         <Card className="bg-orange-100/50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="bg-orange-500 text-white rounded-full p-3">
                                    <Wheat />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-orange-800 dark:text-orange-300">Ready Feed Orders</CardTitle>
                                    <CardDescription className="text-orange-600 dark:text-orange-400">Please Contact Farm administrator for Feed.</CardDescription>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Compost Fertilizer */}
                         <Card className="bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="bg-green-500 text-white rounded-full p-3">
                                    <Recycle />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-green-800 dark:text-green-300">Compost Fertilizer Available</CardTitle>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{settings.compostBags} Bags</p>
                                    <p className="text-sm text-green-600 dark:text-green-500">at Rs. {settings.compostPricePerBag}/Bag</p>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Maize Requirement */}
                         <Card className="bg-yellow-100/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                            <CardContent className="pt-6 flex items-center gap-4">
                                <div className="bg-yellow-500 text-white rounded-full p-3">
                                    <Archive />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-yellow-800 dark:text-yellow-300">Maize Requirement</CardTitle>
                                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{settings.maizeQuintals.toFixed(2)} Quintal</p>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-500">Needed to restock silos</p>
                                </div>
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

    
