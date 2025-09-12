
'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { Users, UserPlus, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';

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
type ReportType = 'daily' | 'monthly' | 'yearly';


const PrintableReport = forwardRef<HTMLDivElement, { records: any[] }>(({ records }, ref) => {
    return (
        <div ref={ref} className="p-10">
            <h1 className="text-2xl font-bold mb-4 font-headline">Workers Report</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile No.</TableHead>
                        <TableHead>Salary (₹)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((worker) => (
                        <TableRow key={worker.id}>
                            <TableCell>{worker.name}</TableCell>
                            <TableCell>{worker.mobile}</TableCell>
                            <TableCell>{worker.salary}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
});
PrintableReport.displayName = 'PrintableReport';


export default function WorkersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const reportComponentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
      content: () => reportComponentRef.current,
      documentTitle: 'Workers Report',
      onAfterPrint: () => {
        toast({ title: "Report Downloaded", description: "Your worker report has been successfully generated." });
        setOpenDownloadDialog(false);
      }
  });


  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: '',
      mobile: '',
      salary: undefined,
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWorkers = localStorage.getItem('workersData');
      if (savedWorkers) {
        setWorkers(JSON.parse(savedWorkers));
      }
    }
  }, []);

  
  function onAddWorkerSubmit(data: WorkerFormValues) {
    const newWorker: Worker = {
      id: `WORKER${Date.now()}`,
      name: data.name,
      mobile: data.mobile,
      salary: data.salary.toLocaleString(),
    };
    const updatedWorkers = [...workers, newWorker];
    setWorkers(updatedWorkers);
    localStorage.setItem('workersData', JSON.stringify(updatedWorkers));
    toast({ title: 'Worker Added!', description: `${data.name} has been added to your records.` });
    form.reset();
  }

  const handleDeleteWorker = (id: string) => {
    const updatedWorkers = workers.filter(worker => worker.id !== id);
    setWorkers(updatedWorkers);
    localStorage.setItem('workersData', JSON.stringify(updatedWorkers));
    toast({ title: 'Worker Removed', description: 'The worker has been removed from your records.' });
  }

  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: format(new Date(0, i), 'MMMM') }));

  return (
    <div className="space-y-6">
       <div className="hidden">
            <PrintableReport ref={reportComponentRef} records={workers} />
       </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Workers Management</h1>
          <p className="text-muted-foreground">
            Manage your worker records.
          </p>
        </div>
        <Dialog open={openDownloadDialog} onOpenChange={setOpenDownloadDialog}>
            <DialogTrigger asChild>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Download Worker Report</DialogTitle>
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
                                        <Input type="number" placeholder="Enter monthly salary" {...field} value={field.value ?? ''}/>
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

    </div>
  );
}
