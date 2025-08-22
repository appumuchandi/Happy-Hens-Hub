
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { productData } from '@/lib/placeholder-data';
import { useAuth } from '@/hooks/use-auth';

const EGGS_PER_TRAY = 30;

export default function PriceAndStockPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState({
    ...productData,
    pricePerEgg: productData.pricePerTray / EGGS_PER_TRAY,
  });
  const [isStoreActive, setIsStoreActive] = useState(true);

  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const handleUpdate = (field: 'pricePerEgg' | 'pricePerTray' | 'availableQty', value: number) => {
    setProduct(prev => {
        let newPricePerEgg = prev.pricePerEgg;
        let newPricePerTray = prev.pricePerTray;

        if (field === 'pricePerEgg') {
            newPricePerEgg = value;
            newPricePerTray = value * EGGS_PER_TRAY;
        } else if (field === 'pricePerTray') {
            newPricePerTray = value;
            newPricePerEgg = value / EGGS_PER_TRAY;
        }

        toast({ title: 'Settings Updated' });

        return {
            ...prev,
            pricePerEgg: newPricePerEgg,
            pricePerTray: newPricePerTray,
            availableQty: field === 'availableQty' ? value : prev.availableQty,
            lastUpdated: new Date().toISOString(),
        };
    });
  }


  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Price & Stock</h1>
            <p className="text-muted-foreground">
              Manage your e-commerce store settings, product pricing, and inventory.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Price and Stock Settings</CardTitle>
                <CardDescription>Control your online store status, product pricing, and inventory.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                    <Label>Store Status</Label>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="store-status"
                            checked={isStoreActive}
                            onCheckedChange={setIsStoreActive}
                        />
                        <Label htmlFor="store-status" className="text-sm text-muted-foreground">
                            {isStoreActive ? 'Active' : 'Inactive'}
                        </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Toggle your online store on or off.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price-egg">Price Per Egg (₹)</Label>
                    <Input id="price-egg" type="number" value={product.pricePerEgg.toFixed(2)} onChange={(e) => handleUpdate('pricePerEgg', Number(e.target.value))} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="price-tray">Price per Tray (₹)</Label>
                    <Input id="price-tray" type="number" value={product.pricePerTray.toFixed(2)} onChange={(e) => handleUpdate('pricePerTray', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Available Eggs (pcs)</Label>
                    <Input id="stock" type="number" defaultValue={product.availableQty} onChange={(e) => handleUpdate('availableQty', Number(e.target.value))} />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
