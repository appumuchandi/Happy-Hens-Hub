
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { workersData } from '@/lib/placeholder-data';
import { Users, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkersPage() {
  const { user } = useAuth();
  
  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  const handleBiometricSync = () => {
    window.open('/dashboard/kiosk-setup', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Workers Management</h1>
            <p className="text-muted-foreground">
              View and manage your worker records.
            </p>
        </div>
        <Button onClick={handleBiometricSync}>
          <Fingerprint className="mr-2 h-4 w-4" />
          Sync with Biometrics
        </Button>
      </div>
      
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{workersData.length}</div>
                <p className="text-xs text-muted-foreground">Currently active workers</p>
            </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="font-headline">Worker Records</CardTitle>
            <CardDescription>Detailed information of all workers for the current month.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile No.</TableHead>
                    <TableHead>Working Days</TableHead>
                    <TableHead>Non-Working Days</TableHead>
                    <TableHead className="text-right">Salary (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workersData.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>{worker.mobile}</TableCell>
                      <TableCell>{worker.workingDays}</TableCell>
                      <TableCell>{worker.nonWorkingDays}</TableCell>
                      <TableCell className="text-right">{worker.salary}</TableCell>
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
