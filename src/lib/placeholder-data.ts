
import { subDays, format } from 'date-fns';
import type { SiteSettings } from '@/types';

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
export const eggCollectionData: any[] = [];

export const salesData: any[] = [];

export const feedData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(today, i), 'yyyy-MM-dd'),
    feedConsumption: Math.floor(70 + Math.random() * 10),
}));

export const workersData: any[] = [];

export const batchData: any[] = [];


// --- New Firestore-like Structures ---

export const siteSettings: SiteSettings = {
    pricePerEgg: 6,
    availableStock: 5000,
    compostBags: 370,
    compostPricePerBag: 175,
    maizeQuintals: 150.00,
    henCount: 500,
    feedConsumption: 75,
};

export type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  qty: number;
  paymentMode: 'ONLINE' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  status: 'pending' | 'accepted' | 'rejected' | 'delivered';
  timestamp: string;
};


// Sample orders, this will now be managed in-app
export const onlineOrdersData: Order[] = [
    {
        id: 'ORD1672531200000',
        name: 'John Doe',
        phone: '+1-202-555-0104',
        address: '123 Farm Road, Countryside',
        qty: 60,
        paymentMode: 'ONLINE',
        paymentStatus: 'PAID',
        status: 'delivered',
        timestamp: '2023-01-01T12:00:00Z',
    },
    {
        id: 'ORD1675209600000',
        name: 'Jane Smith',
        phone: '+1-202-555-0182',
        address: '456 Meadow Lane, Greenfield',
        qty: 30,
        paymentMode: 'COD',
        paymentStatus: 'PENDING',
        status: 'accepted',
        timestamp: '2023-02-01T12:00:00Z',
    },
     {
        id: 'ORD1677628800000',
        name: 'Local Cafe',
        phone: '+1-202-555-0153',
        address: '789 Market St, Townsville',
        qty: 300,
        paymentMode: 'ONLINE',
        paymentStatus: 'PAID',
        status: 'pending',
        timestamp: new Date().toISOString(),
    },
];

// Deprecated data structures below for reference, to be removed or updated.

export const productData = {
  id: 'PROD_EGGS_01',
  name: 'Egg Tray',
  pricePerTray: 180, // 30 eggs * 6
  availableQty: 5000, // in pieces
  lastUpdated: subDays(today, 1).toISOString(),
  updatedBy: 'Farm Owner',
};

export const paymentSettings = {
    upiId: 'owner@upi',
    mobile: '+91 98765 43210',
    qrCodeUrl: 'https://placehold.co/200x200.png',
};
