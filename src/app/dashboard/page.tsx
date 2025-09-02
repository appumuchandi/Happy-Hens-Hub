
'use client';

import { useAuth } from '@/hooks/use-auth';
import StatCard from '@/components/dashboard/stat-card';
import { siteSettings as defaultSettings } from '@/lib/placeholder-data';
import { Egg, Users, LineChart, AlertTriangle } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { useEffect, useState } from 'react';

const RupeeIcon = () => (
    <span className="h-5 w-5 font-bold">₹</span>
  );


export default function DashboardPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [totalFeedStock, setTotalFeedStock] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }

        const storedSales = localStorage.getItem('salesHistory');
        if (storedSales) {
            setSalesHistory(JSON.parse(storedSales));
        }
        
        const storedFeed = localStorage.getItem('feedContainers');
        if (storedFeed) {
            const feedContainers = JSON.parse(storedFeed);
            const total = feedContainers.reduce((acc: number, container: any) => acc + container.quantity, 0);
            setTotalFeedStock(total);
        }
    }
  }, []);
  
  const todaysRevenue = salesHistory
    .filter(o => new Date(o.date).toDateString() === new Date().toDateString())
    .reduce((acc, o) => acc + parseFloat(o.revenue), 0);

  // Assuming a total feed capacity for the alert percentage.
  // This could be made a setting later.
  const totalFeedCapacity = 10000; // e.g., 10,000 kg total capacity
  const feedStockPercentage = totalFeedCapacity > 0 ? (totalFeedStock / totalFeedCapacity) * 100 : 0;
  const showLowFeedAlert = feedStockPercentage < 20;

  if (!user) {
    return <p className="text-destructive">You must be logged in to view this page.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your farm's performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Today's Manual Sales Revenue"
          value={`₹${todaysRevenue.toFixed(2)}`}
          icon={RupeeIcon}
          description="Total revenue from recorded manual sales"
          color="sky"
        />
        <StatCard
            title="Available Egg Stock"
            value={settings.availableStock.toLocaleString()}
            icon={Egg}
            description="Total eggs available to sell"
        />

        <StatCard
          title="Active Hen Count"
          value={settings.henCount?.toLocaleString() || 500}
          icon={Users}
          description="Total active hens in the farm"
        />

        <StatCard
          title="Daily Feed Consumption"
          value={`${settings.feedConsumption?.toLocaleString() || 75} kg`}
          icon={LineChart}
          description="Estimated feed consumed today"
          color="sky"
        />
        
        {showLowFeedAlert && (
          <StatCard
              title="System Alert"
              value="Low Feed Stock"
              icon={AlertTriangle}
              description={`Feed level is at ${feedStockPercentage.toFixed(1)}% capacity`}
              color="red"
            />
        )}
      </div>
    </div>
  );
}
