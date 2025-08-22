
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Package, DollarSign, PackageCheck, PackageX, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { productData, onlineOrdersData, type OnlineOrder } from '@/lib/placeholder-data';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function OnlineOrderPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // --- State for both Owner and Viewer ---
  const [orders, setOrders] = useState<OnlineOrder[]>(onlineOrdersData);
  const [product, setProduct] = useState(productData);
  
  // --- Owner specific state ---
  const [isStoreActive, setIsStoreActive] = useState(true);
  
  // --- Viewer specific state ---
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(product.pricePerTray);
  const [openCheckout, setOpenCheckout] = useState(false);
  
  useEffect(() => {
    // In a real app, product data would be fetched from Firestore
    // and updated in real-time.
    setTotal(quantity * product.pricePerTray);
  }, [quantity, product.pricePerTray]);


  if (user?.role === 'WORKER') {
     return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const setValidatedQuantity = (newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantity(1);
      return;
    }
    const maxQuantity = Math.floor(product.stock / 30);
    if (newQuantity > maxQuantity) {
      toast({ variant: 'destructive', title: `Maximum stock is ${maxQuantity} trays` });
      setQuantity(maxQuantity);
      return;
    }
    setQuantity(newQuantity);
  }

  const handleQuantityChange = (change: number) => {
    setValidatedQuantity(quantity + change);
  }
  
  const handlePlaceOrder = (paymentMethod: 'cod' | 'online') => {
    toast({
        title: 'Order Placed!',
        description: 'Your order is now pending approval.'
    });
    setOpenCheckout(false);
    setQuantity(1);
    // In a real app, this would create a new document in Firestore 'orders' collection
    // and trigger a notification for the owner.
  }

  // --- OWNER VIEW ---
  if (user?.role === 'OWNER') {
    const handleUpdateStock = (newStock: number) => {
        setProduct(p => ({...p, stock: newStock, lastUpdated: new Date().toISOString()}));
        toast({ title: 'Stock Updated' });
    }
    const handleUpdatePrice = (newPrice: number) => {
        setProduct(p => ({...p, pricePerTray: newPrice, lastUpdated: new Date().toISOString()}));
        toast({ title: 'Price Updated' });
    }

    const handleOrderStatusChange = (orderId: string, status: 'accepted' | 'rejected') => {
        setOrders(orders.map(o => {
            if (o.id === orderId) {
                if(status === 'accepted' && o.status === 'pending') {
                   // Deduct stock
                   setProduct(p => ({...p, stock: p.stock - (o.quantity * 30)}));
                   toast({ title: 'Order Approved!', description: 'Stock has been updated.' });
                }
                if (status === 'rejected' && o.paymentStatus === 'paid') {
                    toast({ title: 'Order Rejected', description: 'Refund process initiated for paid order.' });
                } else if (status === 'rejected') {
                     toast({ title: 'Order Rejected' });
                }
                return { ...o, status };
            }
            return o;
        }));
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
                    <Input id="price" type="number" defaultValue={product.pricePerTray} onChange={(e) => handleUpdatePrice(Number(e.target.value))} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2"><Package className="w-5 h-5"/>Set Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Label htmlFor="stock">Available Eggs (pcs)</Label>
                    <Input id="stock" type="number" defaultValue={product.stock} onChange={(e) => handleUpdateStock(Number(e.target.value))} />
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Incoming Orders</CardTitle>
                <CardDescription>Review and manage incoming online sales. Approve an order to deduct stock.</CardDescription>
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
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>₹{order.totalAmount}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.paymentStatus === 'paid' ? 'secondary' : 'outline'} className={order.paymentStatus === 'paid' ? 'bg-green-700' : ''}>
                                            {order.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'pending' ? 'default' : order.status === 'delivered' ? 'secondary' : 'outline'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {order.status === 'pending' && (
                                            <>
                                            <Button size="sm" variant="outline" onClick={() => handleOrderStatusChange(order.id, 'rejected')}>
                                                <PackageX className="mr-2"/> Reject
                                            </Button>
                                            <Button size="sm" onClick={() => handleOrderStatusChange(order.id, 'accepted')}>
                                                <PackageCheck className="mr-2"/> Approve
                                            </Button>
                                            </>
                                        )}
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


  // --- VIEWER VIEW (CUSTOMER STOREFRONT) ---
  return (
    <div className="space-y-8">
        {/* --- Checkout Dialog --- */}
         <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Your Order</DialogTitle>
                    <DialogDescription>Review your order details before checking out.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                        <span className="font-semibold text-lg">Total Amount</span>
                        <span className="font-bold text-2xl text-primary">₹{total.toFixed(2)}</span>
                    </div>
                     <div className="text-sm">
                        <p><span className="font-semibold">Quantity:</span> {quantity} tray(s) ({quantity * 30} eggs)</p>
                        <p><span className="font-semibold">Price per Tray:</span> ₹{product.pricePerTray.toFixed(2)}</p>
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Button variant="outline" size="lg" onClick={() => handlePlaceOrder('cod')}>
                        Cash on Delivery
                    </Button>
                    <Button size="lg" onClick={() => handlePlaceOrder('online')}>
                        <DollarSign className="mr-2"/> Pay Online
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        {/* --- Storefront UI --- */}
        <div className="flex flex-col gap-8">
            <Card className="saffron-border shadow-lg w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Buy Farm-Fresh Eggs</CardTitle>
                    <CardDescription>Place your order directly from our farm.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-card rounded-lg border">
                            <p className="text-sm text-muted-foreground">Price per Tray</p>
                            <p className="text-2xl font-bold text-primary">₹{product.pricePerTray.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-card rounded-lg border">
                            <p className="text-sm text-muted-foreground">Available Trays</p>
                            <p className="text-2xl font-bold text-accent">{Math.floor(product.stock / 30)}</p>
                        </div>
                    </div>
                     <p className="text-xs text-center text-muted-foreground">
                        Last updated: {format(new Date(product.lastUpdated), 'PPP p')}
                    </p>

                    <Separator/>

                    <div className="space-y-2">
                        <Label className="text-lg font-semibold block text-center">Select Quantity (Trays)</Label>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                <ChevronDown className="w-6 h-6"/>
                            </Button>
                            <Input 
                                type="number"
                                className="text-4xl font-bold w-24 h-auto text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={quantity}
                                onChange={(e) => setValidatedQuantity(parseInt(e.target.value, 10))}
                                min="1"
                            />
                             <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                                <ChevronUp className="w-6 h-6"/>
                            </Button>
                        </div>
                        <p className="text-center text-muted-foreground text-sm">
                            Total eggs: {quantity * 30}
                        </p>
                    </div>
                    
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="w-full flex justify-between items-center bg-muted p-4 rounded-lg">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary">₹{total.toFixed(2)}</span>
                    </div>
                    <Button size="lg" className="w-full" onClick={() => setOpenCheckout(true)}>
                        <ShoppingCart className="mr-2"/> Place Order
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
