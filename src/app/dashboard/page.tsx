'use client';

import { useAuth } from '@/hooks/use-auth';
import StatCard from '@/components/dashboard/stat-card';
import { dashboardStats } from '@/lib/placeholder-data';
import { Egg, Users, LineChart, AlertTriangle } from 'lucide-react';

// Using a simple component for the Rupee icon for consistency
const RupeeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m19 13-10 8" />
      <path d="m6 13 10 8" />
    </svg>
  );

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    dailyEggCount,
    weeklyEggCount,
    monthlyEggCount,
    henCount,
    feedConsumption,
    salesRevenue,
    profit,
  } = dashboardStats;

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Daily Egg Collection"
          value={dailyEggCount.toLocaleString()}
          icon={Egg}
          description="Total eggs collected today"
        />
        <StatCard
          title="Weekly Egg Collection"
          value={weeklyEggCount.toLocaleString()}
          icon={Egg}
          description="Total eggs this week"
          color="sky"
        />

        {(user?.role === 'OWNER' || user?.role === 'WORKER') && (
          <StatCard
            title="Daily Sales Revenue"
            value={`₹${salesRevenue.toFixed(2)}`}
            icon={RupeeIcon}
            description="Total revenue today"
          />
        )}

        {user?.role === 'OWNER' && (
          <StatCard
            title="Estimated Profit"
            value={`₹${profit.toFixed(2)}`}
            icon={RupeeIcon}
            description="Today's estimated profit"
            color="sky"
          />
        )}

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
        
        {user?.role === 'OWNER' && (
          <StatCard
            title="Monthly Egg Count"
            value={monthlyEggCount.toLocaleString()}
            icon={Egg}
            description="Total eggs this month"
          />
        )}

        {user?.role === 'OWNER' && (
           <StatCard
            title="System Alert"
            value="Low Feed Stock"
            icon={AlertTriangle}
            description="Feed level below 20%"
            color="red"
          />
        )}
      </div>
    </div>
  );
}
