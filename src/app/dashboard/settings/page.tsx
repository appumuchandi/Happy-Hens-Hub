
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { siteSettings as defaultSettings, type SiteSettings } from '@/lib/placeholder-data';
import { Save } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '@/components/ui/separator';
import type { WorkerCredentials } from '@/types';

const settingsSchema = z.object({
  pricePerEgg: z.coerce.number().positive('Price must be a positive number.'),
  availableStock: z.coerce.number().int().nonnegative('Stock cannot be negative.'),
  compostBags: z.coerce.number().int().nonnegative('Compost bags must be a non-negative number.'),
  compostPricePerBag: z.coerce.number().nonnegative('Compost price must be a non-negative number.'),
  maizeQuintals: z.coerce.number().nonnegative('Maize quintals must be a non-negative number.'),
  henCount: z.coerce.number().int().positive('Hen count must be a positive number.'),
  feedConsumption: z.coerce.number().positive('Feed consumption must be a positive number.'),
});

const workerCredentialsSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters long.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;
type WorkerCredentialsFormValues = z.infer<typeof workerCredentialsSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  const workerForm = useForm<WorkerCredentialsFormValues>({
    resolver: zodResolver(workerCredentialsSchema),
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          settingsForm.reset(parsedSettings);
        } else {
           settingsForm.reset(defaultSettings);
        }

        const storedWorkerCredentials = localStorage.getItem('workerCredentials');
        if (storedWorkerCredentials) {
            const parsedCredentials = JSON.parse(storedWorkerCredentials);
            workerForm.reset(parsedCredentials);
        } else {
            workerForm.reset({ username: 'worker', password: 'password' });
        }
    }
  }, [settingsForm, workerForm]);
  
  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to manage settings.</p>;
  }

  function onSettingsSubmit(data: SettingsFormValues) {
    localStorage.setItem('siteSettings', JSON.stringify(data));
    toast({
      title: 'Settings Saved!',
      description: 'Your farm information has been updated.',
    });
  }

  function onWorkerCredentialsSubmit(data: WorkerCredentialsFormValues) {
    localStorage.setItem('workerCredentials', JSON.stringify(data));
    toast({
        title: 'Worker Credentials Updated!',
        description: 'The login for workers has been successfully saved.',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage the public information displayed on your farm's homepage and dashboard.
        </p>
      </div>

      <Form {...settingsForm}>
          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Farm & Site Information</CardTitle>
                         <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                    <CardDescription>This information will be visible to visitors and used in dashboard calculations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div>
                        <h3 className="text-lg font-medium mb-4">Core Farm Metrics</h3>
                         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FormField
                            control={settingsForm.control}
                            name="henCount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Active Hen Count</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter hen count" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={settingsForm.control}
                            name="feedConsumption"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Daily Feed Consumption (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="Enter feed consumption" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={settingsForm.control}
                            name="pricePerEgg"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Price Per Egg (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="Enter price per egg" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={settingsForm.control}
                            name="availableStock"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Available Stock (eggs)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter available stock" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                         </div>
                     </div>
                     
                    <Separator />
                    
                    <div>
                        <h3 className="text-lg font-medium mb-4">Homepage Updates</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                             <FormField
                            control={settingsForm.control}
                            name="compostBags"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Compost Fertilizer (Bags)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter number of bags" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={settingsForm.control}
                            name="compostPricePerBag"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Compost Price per Bag (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter price per bag" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={settingsForm.control}
                            name="maizeQuintals"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Maize Requirement (Quintals)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="Enter maize quintals" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
      </Form>

       <Form {...workerForm}>
          <form onSubmit={workerForm.handleSubmit(onWorkerCredentialsSubmit)}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Worker Login Credentials</CardTitle>
                         <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Credentials
                        </Button>
                    </div>
                    <CardDescription>Set the username and password that workers will use to log in to the dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={workerForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Worker Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter a username for workers" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={workerForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Worker Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter a secure password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </form>
      </Form>
    </div>
  );
}
