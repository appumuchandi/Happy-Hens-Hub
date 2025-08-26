
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { siteSettings as defaultSettings, type SiteSettings } from '@/lib/placeholder-data';
import { Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const settingsSchema = z.object({
  pricePerEgg: z.coerce.number().positive('Price must be a positive number.'),
  availableStock: z.coerce.number().int().nonnegative('Stock cannot be negative.'),
  qrCodeUrl: z.string().url('Please enter a valid URL.'),
  upiId: z.string().min(3, 'UPI ID seems too short.'),
  contactInfo: z.string().min(10, 'Please enter a valid contact number or email.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  aboutFarm: z.string().min(50, 'Description should be at least 50 characters.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings(parsedSettings);
          form.reset(parsedSettings);
        }
    }
  }, [form]);
  
  if (!user) {
    return <p className="text-destructive">You must be logged in to view this page.</p>;
  }

  function onSubmit(data: SettingsFormValues) {
    localStorage.setItem('siteSettings', JSON.stringify(data));
    setSettings(data);
    toast({
      title: 'Settings Saved!',
      description: 'Your public site information has been updated.',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage the public information displayed on your farm's homepage.
        </p>
      </div>

      <Card>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Public Information</CardTitle>
                         <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                    <CardDescription>This information will be visible to all visitors on your homepage.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <FormField
                        control={form.control}
                        name="pricePerEgg"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Price Per Egg (₹)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="availableStock"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Available Stock (eggs)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="aboutFarm"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>About the Farm</FormLabel>
                            <FormControl>
                                <Textarea rows={10} placeholder="Tell your customers about your farm..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     </div>
                     <div className="space-y-6">
                        <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>UPI ID</FormLabel>
                            <FormControl>
                                <Input placeholder="your-upi@bank" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="qrCodeUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>UPI QR Code Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://your-image-host.com/qr.png" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="contactInfo"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Contact Info (Phone/Email)</FormLabel>
                            <FormControl>
                                <Input placeholder="+91 98765 43210" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Farm Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Your farm's physical address" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     </div>
                </CardContent>
            </form>
         </Form>
      </Card>
    </div>
  );
}
