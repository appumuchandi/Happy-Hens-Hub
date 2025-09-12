
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
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { addDays, format, parseISO, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Download, Printer, Trash2, Calendar as CalendarIcon } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { downloadPdfReport, directPrint } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const salesSchema = z.object({
  buyerName: z.string().min(1, 'Buyer name is required.'),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  pricePerPiece: z.coerce.number().positive('Price must be a positive number.'),
});

type SalesFormValues = z.infer<typeof salesSchema>;
const RECORDS_PER_PAGE = 10;


export default function SalesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterType, setFilterType] = useState('daily');
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const getFilteredData = () => {
    if (filterType === 'daily' && selectedDay) {
        const start = startOfDay(selectedDay);
        const end = endOfDay(selectedDay);
        return salesHistory.filter(r => {
            const recordDate = parseISO(r.date);
            return recordDate >= start && recordDate <= end;
        });
    }
    if (filterType === 'monthly') {
        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);
        return salesHistory.filter(r => {
            const recordDate = parseISO(r.date);
            return recordDate >= start && recordDate <= end;
        });
    }
    if (filterType === 'yearly') {
        const start = startOfYear(new Date(selectedYear, 0, 1));
        const end = endOfYear(new Date(selectedYear, 11, 31));
        return salesHistory.filter(r => {
            const recordDate = parseISO(r.date);
            return recordDate >= start && recordDate <= end;
        });
    }
    return salesHistory;
  };

  const generateReportHtml = (records: any[]) => {
      let tableRows = '';
      records.forEach(sale => {
          const pricePerPiece = sale.quantity > 0 ? (parseFloat(sale.revenue) / sale.quantity).toFixed(2) : '0.00';
          tableRows += `<tr class="border-b">
                              <td class="p-2">${format(new Date(sale.date), 'yyyy-MM-dd')}</td>
                              <td class="p-2">${sale.buyerName}</td>
                              <td class="p-2">${sale.quantity}</td>
                              <td class="p-2">₹${pricePerPiece}</td>
                              <td class="p-2">₹${sale.revenue}</td>
                          </tr>`;
      });

      return `<table class="w-full border-collapse">
                  <thead>
                      <tr class="border-b">
                          <th class="p-2 text-left">Date</th>
                          <th class="p-2 text-left">Buyer</th>
                          <th class="p-2 text-left">Quantity</th>
                          <th class="p-2 text-left">Price/pcs (₹)</th>
                          <th class="p-2 text-left">Revenue (₹)</th>
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
    downloadPdfReport('Sales Report', reportHtml);
    toast({ title: "Report Download Started", description: "Your sales report is being generated." });
    setOpenDownloadDialog(false);
  };
  
  const handleDirectPrint = () => {
      const filteredData = getFilteredData();
      if (filteredData.length === 0) {
        toast({ variant: 'destructive', title: "No Data", description: "No records found for the selected period." });
        return;
      }
      const reportHtml = generateReportHtml(filteredData);
      directPrint('Sales Report', reportHtml);
      setOpenDownloadDialog(false);
  }


  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      buyerName: '',
      quantity: undefined,
      pricePerPiece: undefined,
    },
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('salesHistory');
        if (savedData) {
            setSalesHistory(JSON.parse(savedData));
        }

        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                form.setValue('pricePerPiece', parsedSettings.pricePerEgg || 0);
            } catch(e) {
                console.error("Failed to parse settings", e);
            }
        }
    }
  }, [form]);


  const { watch } = form;
  const quantity = watch('quantity');
  const pricePerPiece = watch('pricePerPiece');
  
  useEffect(() => {
    const revenue = (quantity || 0) * (pricePerPiece || 0);
    setTotalRevenue(revenue);
  }, [quantity, pricePerPiece]);

  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  function onSubmit(data: SalesFormValues) {
    const newSale = {
        id: `SALE${Date.now()}`,
        date: new Date().toISOString(),
        buyerName: data.buyerName,
        quantity: data.quantity,
        revenue: totalRevenue.toFixed(2),
    };
    
    const updatedHistory = [newSale, ...salesHistory];
    setSalesHistory(updatedHistory);
    localStorage.setItem('salesHistory', JSON.stringify(updatedHistory));

    toast({
      title: 'Sale Recorded!',
      description: `Sale to ${data.buyerName} for ₹${totalRevenue.toFixed(2)} has been recorded.`,
    });
    
    const currentPrice = form.getValues('pricePerPiece');
    form.reset({
        buyerName: '',
        quantity: undefined,
        pricePerPiece: currentPrice
    });
  }

  const handleDelete = (id: string) => {
    const updatedHistory = salesHistory.filter((sale: any) => sale.id !== id);
    setSalesHistory(updatedHistory);
    localStorage.setItem('salesHistory', JSON.stringify(updatedHistory));
    toast({
        title: "Sale Deleted",
        description: "The sale record has been removed.",
    })
  }

  const totalPages = Math.ceil(salesHistory.length / RECORDS_PER_PAGE);
  const paginatedData = salesHistory.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  ).map((sale: any) => ({
    ...sale,
    date: format(new Date(sale.date), 'EEE, yyyy-MM-dd'),
    pricePerPiece: sale.quantity > 0 ? (parseFloat(sale.revenue) / sale.quantity).toFixed(2) : '0.00',
  }));

  const availableYears = Array.from(new Set(salesHistory.map(r => parseISO(r.date).getFullYear()))).sort((a,b) => b-a);
  const availableMonths = Array.from({ length: 12 }, (_, i) => new Date(selectedYear, i, 1));


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Record Manual Sales</h1>
        <Dialog open={openDownloadDialog} onOpenChange={setOpenDownloadDialog}>
            <DialogTrigger asChild>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Download Sales Report</DialogTitle>
                    <DialogDescription>
                        Select a period to generate the report for.
                    </DialogDescription>
                </DialogHeader>
                <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily">
                        <div className="flex justify-center py-4">
                           <Calendar mode="single" selected={selectedDay} onSelect={setSelectedDay} className="rounded-md border" />
                        </div>
                    </TabsContent>
                    <TabsContent value="monthly">
                        <div className="grid grid-cols-2 gap-4 py-4">
                             <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(Number(val))}>
                                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                <SelectContent>
                                    {availableYears.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <Select value={selectedMonth.getMonth().toString()} onValueChange={(val) => setSelectedMonth(new Date(selectedYear, Number(val)))}>
                                <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                                <SelectContent>
                                    {availableMonths.map((month, i) => <SelectItem key={i} value={i.toString()}>{format(month, 'MMMM')}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                    <TabsContent value="yearly">
                        <div className="py-4">
                            <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(Number(val))}>
                                <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                <SelectContent>
                                    {availableYears.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>
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
            <CardTitle className="font-headline">Add New Manual Sale</CardTitle>
            <CardDescription>Use this for in-person or non-portal sales.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter buyer's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (pcs)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter quantity" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerPiece"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Piece (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter price per piece" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="space-y-2 rounded-lg bg-muted p-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Total Revenue</span>
                        <span className="font-bold text-foreground">₹{totalRevenue.toFixed(2)}</span>
                    </div>
                </div>
                <Button type="submit" className="w-full">Record Sale</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recent Manual Sales</CardTitle>
            <CardDescription>View recent sales transactions recorded here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price/pcs (₹)</TableHead>
                        <TableHead>Revenue (₹)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? paginatedData.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.buyerName}</TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell>₹{sale.pricePerPiece}</TableCell>
                            <TableCell>₹{sale.revenue}</TableCell>
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
                                        This action cannot be undone. This will permanently delete this sale record.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(sale.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No sales history found.
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

    