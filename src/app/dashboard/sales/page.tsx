
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
import { salesData as defaultSalesData } from '@/lib/placeholder-data';
import { useEffect, useState } from 'react';
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


const salesSchema = z.object({
  buyerName: z.string().min(1, 'Buyer name is required.'),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  pricePerPiece: z.coerce.number().positive('Price must be a positive number.'),
});

type SalesFormValues = z.infer<typeof salesSchema>;
type ReportType = 'daily' | 'monthly' | 'yearly';

const RECORDS_PER_PAGE = 10;

export default function SalesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      buyerName: '',
      quantity: 30,
      pricePerPiece: 6,
    },
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('salesHistory');
        if (savedData) {
            setSalesHistory(JSON.parse(savedData));
        } else {
            setSalesHistory(defaultSalesData);
        }
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    }
  }, [salesHistory]);


  const { watch } = form;
  const quantity = watch('quantity');
  const pricePerPiece = watch('pricePerPiece');
  const [totalRevenue, setTotalRevenue] = useState(0);

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
    
    setSalesHistory((prev) => [newSale, ...prev]);

    toast({
      title: 'Sale Recorded!',
      description: `Sale to ${data.buyerName} for ₹${totalRevenue.toFixed(2)} has been recorded.`,
    });
    form.reset();
  }

  const handleDownload = () => {
    toast({
      title: "Generating Report...",
      description: `Your ${reportType} sales report for ${selectedYear} is being downloaded.`
    });
    setOpenDownloadDialog(false);
  }
  
  const handleDelete = (id: string) => {
    setSalesHistory((prev) => prev.filter((sale: any) => sale.id !== id));
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
    pricePerPiece: (parseFloat(sale.revenue) / sale.quantity).toFixed(2),
  }));

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: format(new Date(0, i), 'MMMM') }));

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
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Download Sales Report</DialogTitle>
                <DialogDescription>
                Select the time range for your sales report.
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
                <Button onClick={handleDownload}>
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
                        <Input type="number" placeholder="Enter quantity" {...field} />
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
                        <Input type="number" step="0.01" placeholder="Enter price per piece" {...field} />
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
