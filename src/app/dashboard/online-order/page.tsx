import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function OnlineOrderPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Online Orders</h1>
        <p className="text-muted-foreground">
          Manage and track incoming online orders.
        </p>
      </div>

      <Card className="saffron-border text-center py-24">
        <CardContent>
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-medium">No Online Orders Yet</h3>
            <p className="mt-2 text-md text-muted-foreground">This feature is coming soon. Check back later to manage your online sales.</p>
        </CardContent>
    </Card>
    </div>
  );
}
