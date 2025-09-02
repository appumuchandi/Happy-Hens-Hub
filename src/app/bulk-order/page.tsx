
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type Order } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  qty: z.coerce.number().int().min(30, 'Bulk orders must be at least 30 eggs.'),
  paymentMode: z.enum(['ONLINE', 'COD'], { required_error: 'Please select a payment mode.' }),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function BulkOrderPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      qty: 30,
      paymentMode: 'COD',
    },
  });

  function onSubmit(data: OrderFormValues) {
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      paymentStatus: data.paymentMode === 'ONLINE' ? 'PAID' : 'PENDING',
      ...data,
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
      localStorage.setItem('onlineOrders', JSON.stringify([newOrder, ...existingOrders]));

      toast({
        title: 'Order Placed!',
        description: "Thank you! We've received your order and will contact you shortly to confirm.",
      });
      form.reset();
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to place order',
        description: 'Could not save the order. Please try again.',
      });
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
         <Button asChild variant="ghost" className="mb-4">
             <Link href="/">
                <ArrowLeft />
                Back to Home
            </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Bulk Egg Order</CardTitle>
            <CardDescription>
              Place your order for fresh, high-quality eggs directly from our farm. Minimum order is 30 eggs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                            <Input placeholder="e.g., +91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please provide your full delivery address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="qty"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quantity (in pieces)</FormLabel>
                            <FormControl>
                                <Input type="number" min="30" step="1" {...field} />
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
                            className="flex items-center space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="COD" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Cash on Delivery (COD)
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="ONLINE" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Pay Online (UPI)
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2" />
                  Submit Order
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
