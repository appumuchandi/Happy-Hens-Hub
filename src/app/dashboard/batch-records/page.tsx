
'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useReactToPrint } from 'react-to-print';

interface VaccinationRecord {
  vaccine: string;
  date: string;
  day: number;
}

interface Batch {
  id: string;
  name: string;
  creationDate: string;
  vaccinationRecords: VaccinationRecord[];
}

const batchSchema = z.object({
  name: z.string().min(2, 'Batch name must be at least 2 characters.'),
});
type BatchFormValues = z.infer<typeof batchSchema>;


const vaccinationSchema = z.object({
    vaccine: z.string().min(2, 'Vaccine name is required.'),
    date: z.date({ required_error: "A date for vaccination is required."}),
});
type VaccinationFormValues = z.infer<typeof vaccinationSchema>;

type ReportType = 'daily' | 'monthly' | 'yearly';

const PrintableReport = forwardRef<HTMLDivElement, { records: Batch[] }>(({ records }, ref) => {
    return (
        <div ref={ref} className="p-10">
            <h1 className="text-2xl font-bold mb-4 font-headline">Batch Records Report</h1>
            {records.map(batch => (
                <div key={batch.id} className="mb-8 page-break-after">
                    <h2 className="text-xl font-semibold">Batch: {batch.name}</h2>
                    <p className="text-sm text-muted-foreground">Created On: {format(parseISO(batch.creationDate), 'PPP')}</p>
                    <Table className="mt-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vaccine</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Day of Life</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batch.vaccinationRecords.length > 0 ? batch.vaccinationRecords.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell>{record.vaccine}</TableCell>
                                    <TableCell>{format(parseISO(record.date), 'PPP')}</TableCell>
                                    <TableCell>{record.day}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">No vaccination records for this batch.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            ))}
             <style jsx global>{`
                @media print {
                    .page-break-after {
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    );
});
PrintableReport.displayName = 'PrintableReport';


export default function BatchRecordsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isVaccineDialogOpen, setIsVaccineDialogOpen] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const reportComponentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
      content: () => reportComponentRef.current,
      documentTitle: 'Batch Records Report',
      onAfterPrint: () => {
        toast({ title: "Report Downloaded", description: "Your batch records report has been successfully generated." });
        setOpenDownloadDialog(false);
      }
  });


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('batchRecords');
        if (savedData) {
            setBatches(JSON.parse(savedData));
        }
    }
  }, []);

  const batchForm = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: { name: '' },
  });

  const vaccineForm = useForm<VaccinationFormValues>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: { vaccine: '', date: new Date() },
  });

  const { watch } = vaccineForm;
  const watchedDate = watch('date');

  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const handleAddBatch = (data: BatchFormValues) => {
    const newBatch: Batch = {
        id: `BATCH${Date.now()}`,
        name: data.name,
        creationDate: new Date().toISOString(),
        vaccinationRecords: []
    };
    const updatedBatches = [...batches, newBatch];
    setBatches(updatedBatches);
    localStorage.setItem('batchRecords', JSON.stringify(updatedBatches));
    toast({ title: 'Batch Added!', description: `Batch "${data.name}" has been created.` });
    batchForm.reset();
  }
  
  const handleAddVaccination = (data: VaccinationFormValues) => {
    if (!selectedBatch) return;

    const dayOfVaccination = differenceInDays(data.date, parseISO(selectedBatch.creationDate));

    const newRecord: VaccinationRecord = {
        vaccine: data.vaccine,
        date: data.date.toISOString(),
        day: dayOfVaccination,
    };
    
    const updatedBatches = batches.map(batch => 
        batch.id === selectedBatch.id 
        ? { ...batch, vaccinationRecords: [...batch.vaccinationRecords, newRecord].sort((a,b) => a.day - b.day) } 
        : batch
    );
    
    setBatches(updatedBatches);
    localStorage.setItem('batchRecords', JSON.stringify(updatedBatches));

    toast({ title: 'Vaccination Added!', description: `Record for ${data.vaccine} added to ${selectedBatch.name}.` });
    vaccineForm.reset({ vaccine: '', date: new Date() });
    setIsVaccineDialogOpen(false);
  }
  
  const handleDeleteBatch = (id: string) => {
    const updatedBatches = batches.filter(batch => batch.id !== id);
    setBatches(updatedBatches);
    localStorage.setItem('batchRecords', JSON.stringify(updatedBatches));
    toast({ title: 'Batch Deleted', description: 'The batch record has been removed.' });
  }

  const getVaccinationDay = () => {
    if (selectedBatch && watchedDate) {
        return differenceInDays(watchedDate, parseISO(selectedBatch.creationDate));
    }
    return 0;
  }
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: format(new Date(0, i), 'MMMM') }));

  return (
    <div className="space-y-6">
        <div style={{ display: 'none' }}>
            <PrintableReport ref={reportComponentRef} records={batches} />
        </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Batch Records</h1>
        <Dialog open={openDownloadDialog} onOpenChange={setOpenDownloadDialog}>
            <DialogTrigger asChild>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Download Batch Records Report</DialogTitle>
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
              <CardTitle className="font-headline">Add New Batch</CardTitle>
              <CardDescription>Create a new batch to track.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...batchForm}>
                <form onSubmit={batchForm.handleSubmit(handleAddBatch)} className="space-y-4">
                  <FormField
                    control={batchForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Broiler Batch 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Add Batch</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">All Batches</CardTitle>
              <CardDescription>View and manage all your batch records.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Name</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Vaccination Records</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.length > 0 ? batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell>{format(parseISO(batch.creationDate), 'PPP')}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {batch.vaccinationRecords.map((record, index) => (
                              <Badge key={index} variant="secondary" className="flex flex-col items-start gap-1 p-2">
                                <span className="font-semibold">{record.vaccine}</span>
                                <span className="text-xs text-muted-foreground">
                                    {format(parseISO(record.date), 'PPP')} (Day {record.day})
                                </span>
                              </Badge>
                            ))}
                            {batch.vaccinationRecords.length === 0 && <span className="text-xs text-muted-foreground">No records yet.</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                           <Dialog open={isVaccineDialogOpen && selectedBatch?.id === batch.id} onOpenChange={(isOpen) => {
                               if(!isOpen) {
                                   setSelectedBatch(null);
                                   vaccineForm.reset({ vaccine: '', date: new Date() });
                               }
                               setIsVaccineDialogOpen(isOpen);
                           }}>
                            <DialogTrigger asChild>
                               <Button variant="outline" size="sm" onClick={() => setSelectedBatch(batch)}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Vaccine
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Vaccination Record for {batch.name}</DialogTitle>
                                    <DialogDescription>Enter the details of the vaccination.</DialogDescription>
                                </DialogHeader>
                                 <Form {...vaccineForm}>
                                    <form onSubmit={vaccineForm.handleSubmit(handleAddVaccination)} className="space-y-4 py-4">
                                        <FormField control={vaccineForm.control} name="vaccine" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vaccine Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., Newcastle Disease (NDV)" {...field} /></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )} />
                                        <FormField control={vaccineForm.control} name="date" render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date of Vaccination</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" className="pl-3 text-left font-normal">
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < parseISO(batch.creationDate) || date > new Date()} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage/>
                                            </FormItem>
                                        )} />
                                         <div className="space-y-2 rounded-lg bg-muted p-3">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Day of Vaccination</span>
                                                <span className="font-bold text-foreground">Day {getVaccinationDay()}</span>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                            <Button type="submit">Save Record</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="destructive" size="icon" disabled={user?.role !== 'OWNER'}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete the batch "{batch.name}" and all its records.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBatch(batch.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No batches created yet.
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
