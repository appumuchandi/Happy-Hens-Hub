
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { Users, Bot, Loader2, Lightbulb, AlertTriangle, UserPlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { workerOptimizationInsights } from '@/ai/flows/worker-optimization-insights';
import { type WorkerOptimizationInsightsOutput } from '@/ai/flows/worker-optimization-insights';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Worker {
  id: string;
  name: string;
  mobile: string;
  salary: string;
}

const workerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  mobile: z.string().regex(/^\+?[0-9]{10,14}$/, 'Please enter a valid mobile number.'),
  salary: z.coerce.number().positive('Salary must be a positive number.'),
});

type WorkerFormValues = z.infer<typeof workerSchema>;

export default function WorkersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<WorkerOptimizationInsightsOutput | null>(null);
  const [eggCollectionHistory, setEggCollectionHistory] = useState<any[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      mobile: '',
      salary: 0,
    },
  });

  // Load workers data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWorkers = localStorage.getItem('workersData');
      if (savedWorkers) {
        setWorkers(JSON.parse(savedWorkers));
      }
      
      const savedEggData = localStorage.getItem('eggCollectionHistory');
       if (savedEggData) {
         setEggCollectionHistory(JSON.parse(savedEggData));
       }
    }
  }, []);

  // Save workers data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workersData', JSON.stringify(workers));
    }
  }, [workers]);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEggData = eggCollectionHistory
      .filter(d => new Date(d.date) >= thirtyDaysAgo)
      .map(d => ({ date: d.date, quantity: d.quantity, collector: d.collector }));

    if (recentEggData.length < 1) {
      toast({
        variant: 'destructive',
        title: 'Not Enough Data',
        description: 'Need at least one day of egg collection data from the last 30 days to generate insights.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await workerOptimizationInsights({
        eggCollectionData: recentEggData,
      });
      setInsights(result);
      toast({ title: 'Insights Generated', description: 'AI analysis complete.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate insights.',
      });
    }

    setIsLoading(false);
  };
  
  function onAddWorkerSubmit(data: WorkerFormValues) {
    const newWorker: Worker = {
      id: `WORKER${Date.now()}`,
      name: data.name,
      mobile: data.mobile,
      salary: data.salary.toLocaleString(),
    };
    setWorkers(prev => [...prev, newWorker]);
    toast({ title: 'Worker Added!', description: `${data.name} has been added to your records.` });
    form.reset();
  }

  const handleDeleteWorker = (id: string) => {
    setWorkers(prev => prev.filter(worker => worker.id !== id));
    toast({ title: 'Worker Removed', description: 'The worker has been removed from your records.' });
  }

  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Workers Management</h1>
          <p className="text-muted-foreground">
            Manage your worker records and generate AI-powered optimization insights.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
         <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><UserPlus /> Add New Worker</CardTitle>
                    <CardDescription>Enter the details for a new worker.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onAddWorkerSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Worker Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter mobile no." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="salary"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Salary (₹)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter monthly salary" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Add Worker</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Users /> Worker Records</CardTitle>
                <CardDescription>Your current list of active workers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile No.</TableHead>
                        <TableHead>Salary (₹)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {workers.length > 0 ? workers.map((worker) => (
                        <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>{worker.mobile}</TableCell>
                        <TableCell>{worker.salary}</TableCell>
                        <TableCell className="text-right">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" disabled={user?.role !== 'OWNER'}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete {worker.name}'s record.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteWorker(worker.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No workers added yet.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="font-headline">AI Worker Optimization</CardTitle>
              <CardDescription>Analyze worker productivity based on egg collection data.</CardDescription>
            </div>
            <Button onClick={handleGenerateInsights} disabled={isLoading || user?.role !== 'OWNER'}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Worker Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!insights && !isLoading && (
            <div className="text-center py-12">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Ready for AI Insights?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Click the button to analyze worker performance from the last 30 days of collection data.</p>
            </div>
          )}
          {insights && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <CardTitle className="font-headline text-primary text-lg">Productivity Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    {insights.productivityInsights.map((insight, index) => (
                      <li key={index} className="text-foreground">{insight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <CardTitle className="font-headline text-destructive text-lg">Consistency Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    {insights.consistencyAnalysis.map((anomaly, index) => (
                      <li key={index} className="text-foreground">{anomaly}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-accent" />
                  <CardTitle className="font-headline text-accent text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="text-foreground">{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
