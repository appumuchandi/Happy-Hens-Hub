
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Egg, Phone, MapPin, Wheat } from 'lucide-react';
import { siteSettings as defaultSettings, type SiteSettings, dashboardStats } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RupeeIcon = () => (
    <span className="font-bold">₹</span>
);

function LandingPageContent() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    
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
                    <Link href="/login">
                        Owner Login
                    </Link>
                </Button>
            </div>
        </nav>
      </header>

      <main>
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
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2"><Wheat/>Feed Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-5xl font-bold text-sky-500">{dashboardStats.weeklyFeedConsumption} kg</p>
                            <p className="text-muted-foreground">total feed available</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
        
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
