
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

export const batchData = Array.from({ length: 5 }, (_, i) => ({
  id: `BATCH${101 + i}`,
  name: `Batch B${101 + i}`,
  vaccinationRecords: [
    { vaccine: 'Newcastle Disease (NDV)', date: format(subDays(today, 45 - i*5), 'yyyy-MM-dd') },
    { vaccine: 'Infectious Bronchitis (IBV)', date: format(subDays(today, 30 - i*5), 'yyyy-MM-dd') },
    { vaccine: 'Fowl Pox', date: format(subDays(today, 15 - i*5), 'yyyy-MM-dd') },
  ]
}));

// --- New Data for Online Ordering ---

export const productData = {
  id: 'PROD_EGGS_01',
  name: 'Egg Tray',
  pricePerTray: 150,
  stock: 15000, // in pieces
  lastUpdated: subDays(today, 1).toISOString(),
  updatedBy: 'Farm Owner',
};

export type OnlineOrder = {
  id: string;
  customer: string;
  quantity: number; // in trays
  price: number; // price per tray at time of order
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  paymentStatus: 'paid' | 'pending';
  paymentMethod: 'online' | 'cod';
  createdAt: string;
};

export const onlineOrdersData: OnlineOrder[] = [
  { 
    id: 'ORD7001', 
    customer: 'Farm Viewer',
    quantity: 2,
    price: 150,
    totalAmount: 300,
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    createdAt: subDays(today, 0).toISOString()
  },
  { 
    id: 'ORD7002', 
    customer: 'Online Customer B',
    quantity: 5,
    price: 150,
    totalAmount: 750,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    createdAt: subDays(today, 1).toISOString()
  },
  { 
    id: 'ORD7003',
    customer: 'Farm Viewer',
    quantity: 1,
    price: 145,
    totalAmount: 145,
    status: 'accepted',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    createdAt: subDays(today, 2).toISOString()
  },
    { 
    id: 'ORD7004',
    customer: 'Online Customer D',
    quantity: 10,
    price: 145,
    totalAmount: 1450,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    createdAt: subDays(today, 3).toISOString()
  },
];
