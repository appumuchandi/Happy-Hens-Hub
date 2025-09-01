
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
export const eggCollectionData: any[] = [];

export const salesData: any[] = [];

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


// --- New Firestore-like Structures ---

export type SiteSettings = {
    pricePerEgg: number;
    availableStock: number;
    qrCodeUrl: string;
    upiId: string;
    contactInfo: string;
    address: string;
    aboutFarm: string;
};

export const siteSettings: SiteSettings = {
    pricePerEgg: 6,
    availableStock: 5000,
    qrCodeUrl: 'https://placehold.co/200x200.png',
    upiId: 'owner@upi',
    contactInfo: '+91 98765 43210',
    address: 'Hens Hub Farm, Ruralville, Agri-State',
    aboutFarm: `Welcome to Happy HEN's HUB, a family-owned farm dedicated to ethical and sustainable poultry farming. 
    Our hens are raised in a free-range environment, ensuring they lead happy, healthy lives. 
    We believe that the quality of our eggs is a direct reflection of the care our hens receive. 
    We avoid antibiotics and hormones, providing our flock with natural, high-quality feed. 
    Thank you for supporting local farming and choosing eggs that are as wholesome as they are delicious.`
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
