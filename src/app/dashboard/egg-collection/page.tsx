
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
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { format, parseISO, getYear, getMonth, getDate } from 'date-fns';
import { Download, Printer, Trash2 } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { downloadPdfReport, directPrint } from '@/lib/utils';


const eggCollectionSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  batch: z.string().optional(),
});

type EggCollectionFormValues = z.infer<typeof eggCollectionSchema>;
const RECORDS_PER_PAGE = 10;


export default function EggCollectionPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [collectionHistory, setCollectionHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [days, setDays] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    const allDates = collectionHistory.map(r => parseISO(r.date));
    const uniqueYears = [...new Set(allDates.map(d => getYear(d)))].sort((a, b) => b - a);
    setYears(uniqueYears);

    if (selectedYear !== 'all') {
        const yearNum = parseInt(selectedYear);
        const filteredMonths = [...new Set(allDates.filter(d => getYear(d) === yearNum).map(d => getMonth(d)))].sort((a, b) => a - b);
        setMonths(filteredMonths);
    } else {
        setMonths([]);
    }

    if (selectedYear !== 'all' && selectedMonth !== 'all') {
        const yearNum = parseInt(selectedYear);
        const monthNum = parseInt(selectedMonth);
        const filteredDays = [...new Set(allDates.filter(d => getYear(d) === yearNum && getMonth(d) === monthNum).map(d => getDate(d)))].sort((a, b) => a - b);
        setDays(filteredDays);
    } else {
        setDays([]);
    }
  }, [collectionHistory, selectedYear, selectedMonth]);
  
  const getFilteredData = () => {
    if (selectedYear === 'all') return collectionHistory;

    const yearNum = parseInt(selectedYear);
    let filtered = collectionHistory.filter(r => getYear(parseISO(r.date)) === yearNum);

    if (selectedMonth !== 'all') {
        const monthNum = parseInt(selectedMonth);
        filtered = filtered.filter(r => getMonth(parseISO(r.date)) === monthNum);
    }

    if (selectedDay !== 'all') {
        const dayNum = parseInt(selectedDay);
        filtered = filtered.filter(r => getDate(parseISO(r.date)) === dayNum);
    }

    return filtered;
  };
  
  const generateReportHtml = (records: any[]) => {
      let tableRows = '';
      records.forEach(record => {
          tableRows += `<tr class="border-b">
                            <td class="p-2">${record.date}</td>
                            <td class="p-2">${record.quantity}</td>
                            <td class="p-2">${record.batch}</td>
                            <td class="p-2">${record.collector}</td>
                        </tr>`;
      });

      return `<table class="w-full border-collapse">
                <thead>
                  <tr class="border-b">
                    <th class="p-2 text-left">Date</th>
                    <th class="p-2 text-left">Quantity</th>
                    <th class="p-2 text-left">Batch</th>
                    <th class="p-2 text-left">Collector</th>
                  </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
              </table>`;
  };

  const handleDownloadPdf = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) {
      toast({ variant: 'destructive', title: "No Data", description: "No records found for the selected period." });
      return;
    }
    const reportHtml = generateReportHtml(filteredData);
    downloadPdfReport('Egg Collection Report', reportHtml);
    toast({ title: "Report Download Started", description: "Your egg collection report is being generated." });
    setOpenDownloadDialog(false);
  };
  
  const handleDirectPrint = () => {
      const filteredData = getFilteredData();
      if (filteredData.length === 0) {
        toast({ variant: 'destructive', title: "No Data", description: "No records found for the selected period." });
        return;
      }
      const reportHtml = generateReportHtml(filteredData);
      directPrint('Egg Collection Report', reportHtml);
      setOpenDownloadDialog(false);
  }
  
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
        date: new Date().toISOString(),
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
  ).map(rec => ({...rec, date: format(parseISO(rec.date), 'yyyy-MM-dd')}));

  return (
    <div className="space-y-6">
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
                        Select a period to generate the report for.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={selectedYear === 'all'}>
                        <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Months</SelectItem>
                            {months.map(month => <SelectItem key={month} value={month.toString()}>{format(new Date(2000, month), 'MMMM')}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedDay} onValueChange={setSelectedDay} disabled={selectedMonth === 'all'}>
                        <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Days</SelectItem>
                            {days.map(day => <SelectItem key={day} value={day.toString()}>{day}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter className="sm:justify-center pt-4">
                    <Button variant="outline" onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
                    {!isMobile && (
                        <Button onClick={handleDirectPrint}>
                            <Printer className="mr-2"/>
                            Print
                        </Button>
                    )}
                    <Button onClick={handleDownloadPdf}>
                        <Download className="mr-2"/>
                        Download PDF
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

    