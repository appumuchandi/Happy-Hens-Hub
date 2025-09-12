
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { Users, UserPlus, Trash2, Download, Printer } from 'lucide-react';
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
import { downloadPdfReport, directPrint } from '@/lib/utils';

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
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const generateReportHtml = (records: Worker[]) => {
      let tableRows = '';
      records.forEach(worker => {
          tableRows += `<tr class="border-b">
                            <td class="p-2">${worker.name}</td>
                            <td class="p-2">${worker.mobile}</td>
                            <td class="p-2">₹${worker.salary}</td>
                        </tr>`;
      });

      return `<table class="w-full border-collapse">
                <thead>
                    <tr class="border-b">
                        <th class="p-2 text-left">Name</th>
                        <th class="p-2 text-left">Mobile No.</th>
                        <th class="p-2 text-left">Salary (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
              </table>`;
  };

  const handleDownloadPdf = () => {
      const reportHtml = generateReportHtml(workers);
      downloadPdfReport('Workers Report', reportHtml);
      toast({ title: "Report Download Started", description: "Your worker report is being generated." });
      setOpenDownloadDialog(false);
  };
  
  const handleDirectPrint = () => {
      const reportHtml = generateReportHtml(workers);
      directPrint('Workers Report', reportHtml);
      setOpenDownloadDialog(false);
  }


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

  return (
    <div className="space-y-6">
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
                        Choose your preferred method to get the report.
                    </DialogDescription>
                </DialogHeader>
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
                        <TableCell>₹{worker.salary}</TableCell>
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

    