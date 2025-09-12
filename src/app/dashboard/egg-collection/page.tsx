
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
import { useState, useEffect, useRef, forwardRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Download, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
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
import { useReactToPrint } from 'react-to-print';


const eggCollectionSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  batch: z.string().optional(),
});

type EggCollectionFormValues = z.infer<typeof eggCollectionSchema>;
type ReportType = 'daily' | 'monthly' | 'yearly';

const RECORDS_PER_PAGE = 10;

const PrintableReport = forwardRef<HTMLDivElement, { records: any[] }>(({ records }, ref) => {
    return (
        <div ref={ref} className="p-10">
            <h1 className="text-2xl font-bold mb-4 font-headline">Egg Collection Report</h1>
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
                    {records.map((record) => (
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
    );
});
PrintableReport.displayName = 'PrintableReport';


export default function EggCollectionPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [collectionHistory, setCollectionHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const reportComponentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => reportComponentRef.current,
    documentTitle: 'Egg Collection Report',
    onAfterPrint: () => {
      toast({ title: "Report Downloaded", description: "Your egg collection report has been successfully generated." });
      setOpenDownloadDialog(false);
    }
  });
  
  const form = useForm<EggCollectionFormValues>({
    resolver: zodResolver(eggCollectionSchema),
    defaultValues: {
      quantity: undefined,
      batch: '',
    },
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('eggCollectionHistory');
        if (savedData) {
            setCollectionHistory(JSON.parse(savedData));
        }
    }
  }, []);

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

    const updatedHistory = [newRecord, ...collectionHistory];
    setCollectionHistory(updatedHistory);
    localStorage.setItem('eggCollectionHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: 'Success!',
      description: `Logged ${data.quantity} eggs.`,
    });
    form.reset();
  }

  const handleDelete = (id: string) => {
    const updatedHistory = collectionHistory.filter((record: any) => record.id !== id);
    setCollectionHistory(updatedHistory);
    localStorage.setItem('eggCollectionHistory', JSON.stringify(updatedHistory));
    toast({
        title: "Record Deleted",
        description: "The egg collection record has been removed.",
    })
  }

  const totalPages = Math.ceil(collectionHistory.length / RECORDS_PER_PAGE);
  const paginatedData = collectionHistory.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: format(new Date(0, i), 'MMMM') }));


  return (
    <div className="space-y-6">
      <div className="hidden">
        <PrintableReport ref={reportComponentRef} records={collectionHistory} />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Egg Collection</h1>
         <Dialog open={openDownloadDialog} onOpenChange={setOpenDownloadDialog}>
            <DialogTrigger asChild>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Download Collection Report</DialogTitle>
                <DialogDescription>
                Select the time range for your report. This will prepare the document for printing or saving as a PDF.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Report Type</Label>
                        <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Year</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {reportType === 'monthly' && (
                    <div className="space-y-2">
                        <Label>Month</Label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(month => (
                                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {reportType === 'daily' && (
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start font-normal">
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
                <Button onClick={handlePrint}>
                    <Download className="mr-2"/>
                    Download
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

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
                        <Input type="number" placeholder="Enter number of eggs" {...field} value={field.value ?? ''} />
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
                        <Input placeholder="Enter batch/flock ID" {...field} />
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? paginatedData.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>{record.batch}</TableCell>
                      <TableCell>{record.collector}</TableCell>
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
                                This action cannot be undone. This will permanently delete this collection record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(record.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No collection history found.
                        </TableCell>
                    </TableRow>
                  )}
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
                <span className="text-sm">Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
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
