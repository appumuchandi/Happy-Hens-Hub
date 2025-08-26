
'use client';

import { useAuth } from '@/hooks/use-auth';
import StatCard from '@/components/dashboard/stat-card';
import { dashboardStats, siteSettings as defaultSettings, onlineOrdersData } from '@/lib/placeholder-data';
import { Egg, Users, LineChart, AlertTriangle, ShoppingCart } from 'lucide-react';
import type { Role, Order, SiteSettings } from '@/types';
import { useEffect, useState } from 'react';

const RupeeIcon = () => (
    <span className="h-5 w-5 font-bold">₹</span>
  );


export default function DashboardPage() {
  const { user } = useAuth();
  const {
    dailyEggCount,
    henCount,
    feedConsumption,
  } = dashboardStats;

  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        } else {
            setOrders(onlineOrdersData);
        }

        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }

        const storedSales = localStorage.getItem('salesHistory');
        if (storedSales) {
            setSalesHistory(JSON.parse(storedSales));
        }
    }
  }, []);
  
  const todaysRevenue = salesHistory
    .filter(o => new Date(o.date).toDateString() === new Date().toDateString())
    .reduce((acc, o) => acc + parseFloat(o.revenue), 0);


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
          value={henCount.toLocaleString()}
          icon={Users}
          description="Total active hens"
        />

        <StatCard
          title="Daily Feed Consumption"
          value={`${feedConsumption} kg`}
          icon={LineChart}
          description="Feed consumed today"
          color="sky"
        />
        
        <StatCard
            title="System Alert"
            value="Low Feed Stock"
            icon={AlertTriangle}
            description="Feed level below 20%"
            color="red"
          />
      </div>
    </div>
  );
}
