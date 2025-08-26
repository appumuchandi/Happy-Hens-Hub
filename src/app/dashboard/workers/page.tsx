'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { workersData, eggCollectionData as defaultEggData } from '@/lib/placeholder-data';
import { Users, Fingerprint, Bot, Loader2, Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getWorkerOptimizationInsights } from '../workers-optimization/actions';
import type { WorkerOptimizationInsightsOutput } from '@/ai/flows/worker-optimization-insights';
import { useToast } from '@/hooks/use-toast';

export default function WorkersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<WorkerOptimizationInsightsOutput | null>(null);
  const [eggCollectionHistory, setEggCollectionHistory] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('eggCollectionHistory');
      if (savedData) {
        setEggCollectionHistory(JSON.parse(savedData));
      } else {
        setEggCollectionHistory(defaultEggData);
      }
    }
  }, []);
  
  if (!user) {
    return <p className="text-destructive">You must be logged in to view this page.</p>;
  }

  const handleBiometricSync = () => {
    router.push('/dashboard/kiosk-setup');
  };

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    if(eggCollectionHistory.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data Available',
        description: 'There is no egg collection data to analyze for worker insights.',
      });
      setIsLoading(false);
      return;
    }

    const result = await getWorkerOptimizationInsights({ eggCollectionData: eggCollectionHistory });

    if (result.success) {
      setInsights(result.data);
      toast({ title: 'Insights Generated', description: 'AI analysis for worker optimization is complete.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }

    setIsLoading(false);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Workers Management</h1>
            <p className="text-muted-foreground">
              View and manage your worker records and generate AI-powered optimization insights.
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
          </Header>
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

        <Card>
          <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="font-headline">AI Worker Optimization</CardTitle>
                <CardDescription>Analyze worker productivity based on egg collection data.</CardDescription>
              </div>
              <Button onClick={handleGenerateInsights} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Generate Worker Insights
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!insights && !isLoading && (
              <div className="text-center py-12">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Ready for AI Insights?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Click the button to analyze worker performance.</p>
              </div>
            )}
             {insights && (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-primary"/>
                      <CardTitle className="font-headline text-primary text-lg">Productivity Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      {insights.productivityInsights.map((insight, index) => (
                        <li key={index} className="text-foreground">{insight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-destructive"/>
                      <CardTitle className="font-headline text-destructive text-lg">Consistency Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ul className="space-y-2 list-disc pl-5">
                          {insights.consistencyAnalysis.map((anomaly, index) => (
                          <li key={index} className="text-foreground">{anomaly}</li>
                          ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                      <Lightbulb className="w-6 h-6 text-accent"/>
                      <CardTitle className="font-headline text-accent text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ul className="space-y-2 list-disc pl-5">
                          {insights.recommendations.map((rec, index) => (
                          <li key={index} className="text-foreground">{rec}</li>
                          ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
