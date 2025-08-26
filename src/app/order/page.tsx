
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { siteSettings as defaultSettings, type SiteSettings, type Order, onlineOrdersData } from '@/lib/placeholder-data';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Egg, ShoppingCart, User, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const RupeeIcon = () => (
    <span className="font-bold">₹</span>
);

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  paymentMode: z.enum(['COD', 'ONLINE'], {
    required_error: "You need to select a payment mode.",
  }),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function OrderPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [orders, setOrders] = useState<Order[]>([]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      quantity: 30, // Default to 1 tray
      paymentMode: 'COD',
    },
  });
  
  useEffect(() => {
     if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            setOrders(onlineOrdersData);
        }
     }
  }, []);

  const quantity = form.watch('quantity');
  const totalAmount = (quantity || 0) * settings.pricePerEgg;

  function onSubmit(data: OrderFormValues) {
    if (data.quantity > settings.availableStock) {
        toast({
            variant: 'destructive',
            title: 'Out of Stock',
            description: `Sorry, we only have ${settings.availableStock} eggs available.`
        });
        return;
    }

    const newOrder: Order = {
        id: `ORD${Date.now()}`,
        name: data.name,
        phone: data.phone,
        address: data.address,
        qty: data.quantity,
        paymentMode: data.paymentMode,
        paymentStatus: data.paymentMode === 'COD' ? 'PENDING' : 'PAID', // Simulate online payment as pre-paid
        status: 'pending',
        timestamp: new Date().toISOString(),
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Also update stock
    const updatedSettings = {...settings, availableStock: settings.availableStock - data.quantity};
    setSettings(updatedSettings);
    localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));


    toast({
      title: 'Order Placed!',
      description: 'Thank you! The farm owner will contact you shortly to confirm.',
    });
    form.reset();
  }

  const handleQuantityChange = (change: number) => {
    const currentQuantity = Number(form.getValues('quantity')) || 0;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
        form.setValue('quantity', 1);
    } else {
        form.setValue('quantity', newQuantity);
    }
  }


  return (
    <div className="bg-card min-h-screen">
       <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                 <Egg className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline">HEN's HUB</span>
            </Link>
            <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
            </Button>
        </nav>
      </header>

       <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-3xl">Place Your Order</CardTitle>
            <CardDescription>Fill out the form below to order fresh eggs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Current Price (per egg)</p>
                    <p className="text-3xl font-bold text-primary flex items-center"><RupeeIcon/>{settings.pricePerEgg.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm text-muted-foreground">Available Stock (eggs)</p>
                    <p className="text-3xl font-bold text-accent">{settings.availableStock.toLocaleString()}</p>
                </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><User/>Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </div>
                
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin/>Delivery Address</h3>
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Enter your complete delivery address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>

                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Egg/>Order Details</h3>
                    <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity (eggs)</FormLabel>
                        <FormControl>
                            <div className="flex items-center justify-center gap-4">
                                <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-30)} disabled={field.value <= 30}>
                                    <ChevronDown className="w-6 h-6"/>
                                </Button>
                                <Input type="number" className="text-2xl font-bold w-24 h-auto text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" {...field} />
                                <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(30)}>
                                    <ChevronUp className="w-6 h-6"/>
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                        control={form.control}
                        name="paymentMode"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Payment Mode</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="COD" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Cash on Delivery (COD)
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="ONLINE" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Pay Online (via QR code after confirmation)
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
                
                <CardFooter className="flex-col gap-4 p-0 pt-6">
                    <div className="w-full flex justify-between items-center bg-background p-4 rounded-lg border">
                        <span className="font-semibold text-lg">Total Amount</span>
                        <span className="font-bold text-2xl text-primary flex items-center"><RupeeIcon/>{totalAmount.toFixed(2)}</span>
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={!quantity || quantity < 1 || quantity > settings.availableStock}>Place Order</Button>
                    {quantity > settings.availableStock && (
                        <p className="text-destructive text-sm text-center">The requested quantity exceeds available stock.</p>
                    )}
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
