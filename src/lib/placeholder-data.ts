import { subDays, format } from 'date-fns';

export const dashboardStats = {
  dailyEggCount: 450,
  weeklyEggCount: 3150,
  monthlyEggCount: 12600,
  henCount: 500,
  feedConsumption: 75, // in kg for today
  weeklyFeedConsumption: 525, // in kg for this week
  salesRevenue: 150.00,
  salesTransactions: 5,
  profit: 50.00
};

const today = new Date();
export const eggCollectionData = Array.from({ length: 30 }, (_, i) => ({
  id: `EGG${1001 + i}`,
  date: format(subDays(today, i), 'yyyy-MM-dd'),
  quantity: Math.floor(400 + Math.random() * 100),
  collector: i % 3 === 0 ? 'Worker 1' : 'Worker 2',
  batch: `B${101 + (i % 5)}`,
}));

export const salesData = Array.from({ length: 50 }, (_, i) => ({
  id: `SALE${2001 + i}`,
  date: format(subDays(today, Math.floor(i / 2)), 'yyyy-MM-dd'),
  buyerName: `Customer ${String.fromCharCode(65 + (i % 10))}`,
  quantity: Math.floor(1 + Math.random() * 5) * 30, // in pieces (1-5 trays)
  revenue: (Math.floor(1 + Math.random() * 5) * 30 * 0.35).toFixed(2),
}));

export const feedData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(today, i), 'yyyy-MM-dd'),
    feedConsumption: Math.floor(70 + Math.random() * 10),
}));

export const workersData = [
  {
    id: 'WORKER001',
    name: 'Worker 1',
    mobile: '+91 9876543210',
    workingDays: 28,
    nonWorkingDays: 2,
    salary: '15,000'
  },
  {
    id: 'WORKER002',
    name: 'Worker 2',
    mobile: '+91 9876543211',
    workingDays: 29,
    nonWorkingDays: 1,
    salary: '15,500'
  },
   {
    id: 'WORKER003',
    name: 'Worker 3',
    mobile: '+91 9876543212',
    workingDays: 25,
    nonWorkingDays: 5,
    salary: '14,000'
  },
   {
    id: 'WORKER004',
    name: 'Worker 4',
    mobile: '+91 9876543213',
    workingDays: 30,
    nonWorkingDays: 0,
    salary: '16,000'
  }
];
