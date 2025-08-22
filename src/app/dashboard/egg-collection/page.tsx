
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { eggCollectionData } from '@/lib/placeholder-data';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

const eggCollectionSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  batch: z.string().optional(),
});

type EggCollectionFormValues = z.infer<typeof eggCollectionSchema>;

const RECORDS_PER_PAGE = 10;

export default function EggCollectionPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [collectionHistory, setCollectionHistory] = useState(eggCollectionData);
  const [currentPage, setCurrentPage] = useState(1);
  const form = useForm<EggCollectionFormValues>({
    resolver: zodResolver(eggCollectionSchema),
    defaultValues: {
      quantity: 0,
      batch: '',
    },
  });

  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  function onSubmit(data: EggCollectionFormValues) {
    const newRecord = {
        id: `EGG${Date.now()}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        quantity: data.quantity,
        collector: user?.name || 'Unknown Worker',
        batch: data.batch || 'N/A',
    };

    setCollectionHistory(prev => [newRecord, ...prev]);
    
    toast({
      title: 'Success!',
      description: `Logged ${data.quantity} eggs.`,
    });
    form.reset();
  }

  const totalPages = Math.ceil(collectionHistory.length / RECORDS_PER_PAGE);
  const paginatedData = collectionHistory.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Egg Collection</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 saffron-border">
          <CardHeader>
            <CardTitle className="font-headline">Log Today's Collection</CardTitle>
            <CardDescription>Enter the total number of eggs collected.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Eggs</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 450" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch / Flock ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Save Collection</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Collection History</CardTitle>
            <CardDescription>View past egg collection records.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Collector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>{record.batch}</TableCell>
                      <TableCell>{record.collector}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
