

export type Role = 'OWNER' | 'WORKER' | 'VIEWER';

export type User = {
  name: string;
  username: string;
  role: Role;
};

export type SiteSettings = {
    pricePerEgg: number;
    availableStock: number;
    compostBags: number;
    compostPricePerBag: number;
    maizeQuintals: number;
    henCount: number;
    feedConsumption: number;
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

export type WorkerCredentials = {
  username: string;
  password?: string; 
}
