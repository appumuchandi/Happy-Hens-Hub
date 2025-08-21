'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { eggCollectionData, salesData } from '@/lib/placeholder-data';
import { subDays, format, startOfMonth, getMonth, parseISO } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TimeRange = 'daily' | 'monthly' | 'yearly';

const processChartData = (range: TimeRange) => {
  if (range === 'yearly') {
    const monthlyData: { [key: string]: { eggs: number; sales: number } } = {};
    const monthLabels = Array.from({ length: 12 }, (_, i) => format(new Date(0, i), 'MMM'));

    monthLabels.forEach(label => {
        monthlyData[label] = { eggs: 0, sales: 0 };
    });

    [...eggCollectionData, ...salesData].forEach(d => {
        const date = parseISO(d.date);
        const month = getMonth(date);
        const monthLabel = monthLabels[month];
        
        if ('quantity' in d) {
            monthlyData[monthLabel].eggs += d.quantity;
        }
        if ('revenue' in d) {
            monthlyData[monthLabel].sales += parseFloat(d.revenue);
        }
    });

    return monthLabels.map(label => ({
        date: label,
        eggs: monthlyData[label].eggs,
        sales: monthlyData[label].sales
    }));
  }

  const days = range === 'monthly' ? 30 : 7;
  const lastDays = Array.from({ length: days }, (_, i) => subDays(new Date(), i)).reverse();

  return lastDays.map(date => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayLabel = format(date, 'MMM d');
    
    const dailyEggs = eggCollectionData
      .filter(d => d.date === dateString)
      .reduce((sum, current) => sum + current.quantity, 0);
      
    const dailySales = salesData
      .filter(s => s.date === dateString)
      .reduce((sum, current) => sum + parseFloat(current.revenue), 0);

    return {
      date: dayLabel,
      eggs: dailyEggs,
      sales: dailySales,
    };
  });
};


export default function ReportsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const chartData = processChartData(timeRange);
  
  const chartTitleSuffix = {
    daily: 'Last 7 Days',
    monthly: 'Last 30 Days',
    yearly: 'This Year'
  }

  if (user?.role === 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline">Reports &amp; Analytics</h1>
                <p className="text-muted-foreground">Visualize your farm's performance over time.</p>
            </div>
            <div className="flex gap-2">
                <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                    <TabsList>
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                </Tabs>
                {user?.role === 'OWNER' && (
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                )}
            </div>
        </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="saffron-border">
          <CardHeader>
            <CardTitle className="font-headline">Egg Production</CardTitle>
            <CardDescription>Total eggs collected for: {chartTitleSuffix[timeRange]}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="eggs" fill="hsl(var(--chart-1))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="saffron-border">
          <CardHeader>
            <CardTitle className="font-headline">Sales Revenue (₹)</CardTitle>
            <CardDescription>Total sales revenue for: {chartTitleSuffix[timeRange]}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2 }} content={<ChartTooltipContent formatter={(value, name) => [`₹${(value as number).toFixed(2)}`, name]} />} />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ r: 5, fill: 'hsl(var(--chart-2))', strokeWidth: 2, stroke: 'hsl(var(--background))' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
