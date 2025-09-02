

export type Role = 'OWNER' | 'WORKER' | 'VIEWER';

export type User = {
  name: string;
  username: string;
  role: 'OWNER'; // Only OWNER role is used for login now
};

export type SiteSettings = {
    pricePerEgg: number;
    availableStock: number;
    qrCodeUrl: string;
    upiId: string;
    contactInfo: string;
    address: string;
    aboutFarm: string;
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
