
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getFeedOptimizationInsights } from './actions';
import { eggCollectionData as defaultEggData } from '@/lib/placeholder-data';
import type { FeedOptimizationInsightsOutput } from '@/ai/flows/feed-optimization-insights';
import { AlertTriangle, Bot, Lightbulb, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { subDays } from 'date-fns';


const generateDummyFeedData = (eggData: any[]) => {
    return eggData.map(d => ({
        date: d.date,
        feedConsumption: Math.floor(70 + Math.random() * 10)
    }));
};

export default function FeedOptimizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<FeedOptimizationInsightsOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
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

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEggData = eggCollectionHistory
      .filter(d => new Date(d.date) >= sevenDaysAgo)
      .map(d => ({ date: d.date, eggCount: d.quantity }));

    if(recentEggData.length < 1){
        toast({
            variant: 'destructive',
            title: 'Not Enough Data',
            description: 'Need at least one day of egg collection data to generate insights.',
        });
        setIsLoading(false);
        return;
    }
      
    const recentFeedData = generateDummyFeedData(recentEggData);

    const result = await getFeedOptimizationInsights({
      eggYieldData: recentEggData,
      feedData: recentFeedData,
    });

    if (result.success) {
      setInsights(result.data);
      toast({ title: 'Insights Generated', description: 'AI analysis complete.' });
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
            <h1 className="text-3xl font-bold font-headline">AI Feed Optimizer</h1>
            <p className="text-muted-foreground">
            Get AI-powered insights to optimize feed and boost egg production.
            </p>
        </div>
        <Button onClick={handleGenerateInsights} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Data...
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
                <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Ready to Optimize?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Click 'Generate Insights' to analyze the last 7 days of egg collection data.</p>
            </CardContent>
        </Card>
      )}

      {insights && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary"/>
                <CardTitle className="font-headline text-primary">Actionable Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {insights.insights.map((insight, index) => (
                  <li key={index} className="text-foreground">{insight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-destructive"/>
                <CardTitle className="font-headline text-destructive">Detected Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                    {insights.anomalies.map((anomaly, index) => (
                    <li key={index} className="text-foreground">{anomaly}</li>
                    ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Lightbulb className="w-6 h-6 text-accent"/>
                <CardTitle className="font-headline text-accent">Seasonal Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                    {insights.seasonalRecommendations.map((rec, index) => (
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
