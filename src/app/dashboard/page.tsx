
'use client';

import { useAuth } from '@/hooks/use-auth';
import StatCard from '@/components/dashboard/stat-card';
import { siteSettings as defaultSettings } from '@/lib/placeholder-data';
import { Egg, Users, LineChart, AlertTriangle, Save, Server } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const RupeeIcon = () => (
    <span className="h-5 w-5 font-bold">₹</span>
  );

const settingsSchema = z.object({
  pricePerEgg: z.coerce.number().positive('Price must be a positive number.'),
  availableStock: z.coerce.number().int().nonnegative('Stock cannot be negative.'),
  compostBags: z.coerce.number().int().nonnegative('Compost bags must be a non-negative number.'),
  compostPricePerBag: z.coerce.number().nonnegative('Compost price must be a non-negative number.'),
  maizeQuintals: z.coerce.number().nonnegative('Maize quintals must be a non-negative number.'),
  henCount: z.coerce.number().int().positive('Hen count must be a positive number.'),
  feedConsumption: z.coerce.number().positive('Feed consumption must be a positive number.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;


export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [totalFeedStock, setTotalFeedStock] = useState(0);

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  const { watch } = settingsForm;
  const formValues = watch();

   useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
          try {
            const parsedSettings = JSON.parse(storedSettings);
            settingsForm.reset(parsedSettings);
          } catch(e) {
             settingsForm.reset(defaultSettings);
          }
        } else {
           settingsForm.reset(defaultSettings);
        }

        const storedSales = localStorage.getItem('salesHistory');
        if (storedSales) {
            setSalesHistory(JSON.parse(storedSales));
        }
        
        const storedFeed = localStorage.getItem('feedContainers');
        if (storedFeed) {
            const feedContainers = JSON.parse(storedFeed);
            const total = feedContainers.reduce((acc: number, container: any) => acc + container.quantity, 0);
            setTotalFeedStock(total);
        }
    }
  }, [settingsForm]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'siteSettings' && event.newValue) {
        try {
          const parsedSettings = JSON.parse(event.newValue);
          settingsForm.reset(parsedSettings);
        } catch (e) {
          console.error("Failed to parse settings from storage event", e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [settingsForm]);
  
  const todaysRevenue = salesHistory
    .filter(o => {
        try {
            return new Date(o.date).toDateString() === new Date().toDateString();
        } catch (e) {
            return false;
        }
    })
    .reduce((acc, o) => acc + parseFloat(o.revenue), 0);

  const totalFeedCapacity = 10000;
  const feedStockPercentage = totalFeedCapacity > 0 ? (totalFeedStock / totalFeedCapacity) * 100 : 0;
  const showLowFeedAlert = feedStockPercentage < 20;

  function onSettingsSubmit(data: SettingsFormValues) {
    localStorage.setItem('siteSettings', JSON.stringify(data));
    toast({
      title: 'Settings Saved!',
      description: 'Your farm information has been updated.',
    });
    settingsForm.reset(data); // Ensures form state is in sync
  }

  if (!user) {
    return <p className="text-destructive">You must be logged in to view this page.</p>;
  }
  
  const isOwner = user.role === 'OWNER';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Here's a snapshot of your farm's performance.
            </p>
        </div>
         {isOwner && (
          <Button onClick={settingsForm.handleSubmit(onSettingsSubmit)} disabled={!settingsForm.formState.isDirty}>
              <Save className="mr-2 h-4 w-4" />
              {settingsForm.formState.isDirty ? 'Save Changes' : 'Saved'}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Manual Sales Revenue"
          value={`₹${todaysRevenue.toFixed(2)}`}
          icon={RupeeIcon}
          description="Total revenue from recorded manual sales"
          color="sky"
        />
        <StatCard
            title="Available Egg Stock"
            value={(formValues.availableStock || 0).toLocaleString()}
            icon={Egg}
            description="Total eggs available to sell"
        />
        <StatCard
          title="Active Hen Count"
          value={(formValues.henCount || 0).toLocaleString()}
          icon={Users}
          description="Total active hens in the farm"
        />
        <StatCard
          title="Daily Feed Consumption"
          value={`${(formValues.feedConsumption || 0).toLocaleString()} kg`}
          icon={LineChart}
          description="Estimated feed consumed today"
          color="sky"
        />
        {showLowFeedAlert && (
          <StatCard
              title="System Alert"
              value="Low Feed Stock"
              icon={AlertTriangle}
              description={`Feed level is at ${feedStockPercentage.toFixed(1)}% capacity`}
              color="red"
            />
        )}
      </div>

       {isOwner && (
        <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline flex items-center gap-2"><Server /> Farm Settings</CardTitle>
                      <CardDescription>Manage the public information and dashboard metrics.</CardDescription>
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
       )}
    </div>
  );
}
