
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { onlineOrdersData } from '@/lib/placeholder-data';
import { Package } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuth();

  if (user?.role !== 'VIEWER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  const userOrders = onlineOrdersData.filter(o => o.customer === user?.name);

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">My Orders</h1>
        <p className="text-muted-foreground">
          Track the status of your recent purchases.
        </p>
      </div>

       <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Package/>Order History</CardTitle>
                <CardDescription>Here are all the orders you have placed with us.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {userOrders.length > 0 ? userOrders.map(order => (
                         <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
                            <div>
                                <p className="font-semibold">{order.quantity} Tray(s) - <span className="font-normal text-muted-foreground">ID: {order.id}</span></p>
                                <p className="text-sm">Total: ₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                            <Badge variant={order.status === 'pending' ? 'default' : order.status === 'accepted' ? 'secondary' : order.status === 'delivered' ? 'outline' : 'destructive'} className={order.status === 'accepted' ? 'bg-green-700' : ''}>
                                {order.status}
                            </Badge>
                         </div>
                    )) : (
                        <p>You have not placed any orders yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
