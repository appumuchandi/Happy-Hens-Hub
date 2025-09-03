
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { batchData } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

export default function BatchRecordsPage() {
  const { user } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  
  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId === 'all' ? null : batchId);
  }

  const filteredData = selectedBatch
    ? batchData.filter(batch => batch.id === selectedBatch)
    : batchData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Batch Records</h1>
            <p className="text-muted-foreground">
              View vaccination history for all your batches.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Select onValueChange={handleBatchSelect} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {batchData.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle className="font-headline">Vaccination History</CardTitle>
            <CardDescription>
                {selectedBatch 
                    ? `Showing records for ${batchData.find(b => b.id === selectedBatch)?.name}` 
                    : 'Showing records for all batches.'
                }
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Vaccination Records</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                           {batch.vaccinationRecords.map((record, index) => (
                                <Badge key={index} variant="secondary" className="flex flex-col items-start gap-1 p-2">
                                    <span className="font-semibold">{record.vaccine}</span>
                                    <span className="text-xs text-muted-foreground">{format(new Date(record.date), 'PPP')}</span>
                                </Badge>
                           ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
