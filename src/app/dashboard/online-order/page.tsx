'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, DollarSign, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

const placeholderOrders = [
  { id: 'ORD001', customer: 'Alice', quantity: 2, status: 'pending', total: 300 },
  { id: 'ORD002', customer: 'Bob', quantity: 1, status: 'delivered', total: 150 },
  { id: 'ORD003', customer: 'Charlie', quantity: 5, status: 'pending', total: 750 },
  { id: 'ORD004', customer: 'Diana', quantity: 3, status: 'accepted', total: 450 },
];

export default function OnlineOrderPage() {
  const { user } = useAuth();
  const [isStoreActive, setIsStoreActive] = useState(true);
  const [pricePerTray, setPricePerTray] = useState(150);
  const [stock, setStock] = useState(500);

  if (user?.role === 'WORKER') {
     return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  // A Viewer would see the customer-facing page, not the owner's dashboard
  if (user?.role === 'VIEWER') {
    return (
       <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Buy Fresh Eggs</h1>
          <p className="text-muted-foreground">Place your order for farm-fresh eggs, delivered to you.</p>
        </div>
        <Card className="saffron-border text-center py-24">
          <CardContent>
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-medium">Online Store Coming Soon!</h3>
              <p className="mt-2 text-md text-muted-foreground">Check back later to place your order directly from HEN's HUB.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Online Orders</h1>
        <p className="text-muted-foreground">
          Manage your e-commerce store settings and track incoming orders.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg">Store Status</CardTitle>
              <Switch
                id="store-status"
                checked={isStoreActive}
                onCheckedChange={setIsStoreActive}
              />
            </CardHeader>
            <CardContent>
               <Label htmlFor="store-status" className="text-sm text-muted-foreground">
                {isStoreActive ? 'Your online store is active and accepting orders.' : 'Your store is offline. Customers cannot place new orders.'}
              </Label>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><DollarSign className="w-5 h-5"/>Set Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Label htmlFor="price">Price per Tray (₹)</Label>
                <Input id="price" type="number" value={pricePerTray} onChange={(e) => setPricePerTray(Number(e.target.value))} />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><Package className="w-5 h-5"/>Set Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Label htmlFor="stock">Available Eggs (pcs)</Label>
                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Recent Orders</CardTitle>
            <CardDescription>Review and manage incoming online sales.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Quantity (Trays)</TableHead>
                            <TableHead>Total (₹)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {placeholderOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>₹{order.total}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'pending' ? 'default' : order.status === 'delivered' ? 'secondary' : 'outline'}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {order.status === 'pending' && <Button size="sm">Accept</Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
