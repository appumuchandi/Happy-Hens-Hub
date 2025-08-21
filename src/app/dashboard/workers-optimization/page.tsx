'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getWorkerOptimizationInsights } from './actions';
import { eggCollectionData } from '@/lib/placeholder-data';
import type { WorkerOptimizationInsightsOutput } from '@/ai/flows/worker-optimization-insights';
import { AlertTriangle, Bot, Lightbulb, Loader2, Users } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function WorkerOptimizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<WorkerOptimizationInsightsOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    const result = await getWorkerOptimizationInsights({
      eggCollectionData: eggCollectionData, // Using all 30 days of placeholder data
    });

    if (result.success) {
      setInsights(result.data);
      toast({ title: 'Insights Generated', description: 'AI analysis of worker performance is complete.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to generate insights.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">AI Worker Optimizer</h1>
            <p className="text-muted-foreground">
            Analyze worker performance and boost team efficiency.
            </p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Performance...
            </>
          ) : (
             <>
              <Bot className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      {!insights && !isLoading && (
         <Card className="saffron-border text-center py-12">
            <CardContent>
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Ready to Optimize Your Team?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Click 'Generate Insights' to analyze the last 30 days of collection data.</p>
            </CardContent>
        </Card>
      )}

      {insights && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary"/>
                <CardTitle className="font-headline text-primary">Productivity Insights</CardTitle>
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
                <CardTitle className="font-headline text-destructive">Consistency Analysis</CardTitle>
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
                <CardTitle className="font-headline text-accent">Recommendations</CardTitle>
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
    </div>
  );
}
