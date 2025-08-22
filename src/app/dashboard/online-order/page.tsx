
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Package, DollarSign, PackageCheck, PackageX, ChevronDown, ChevronUp, QrCode, BellRing, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { productData, onlineOrdersData, paymentSettings, type OnlineOrder } from '@/lib/placeholder-data';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function OnlineOrderPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // --- State for both Owner and Viewer ---
  const [orders, setOrders] = useState<OnlineOrder[]>(onlineOrdersData);
  const [product, setProduct] = useState(productData);
  
  // --- Owner specific state ---
  const [isStoreActive, setIsStoreActive] = useState(true);
  
  // --- Viewer specific state ---
  const [quantity, setQuantity] = useState<number | ''>('');
  const [total, setTotal] = useState(0);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'initial' | 'qr'>('initial');
  const [showNotifyMe, setShowNotifyMe] = useState(false);
  
  const availableTrays = Math.floor(product.availableQty / 30);
  const isOutOfStock = availableTrays <= 0;

  useEffect(() => {
    if (quantity) {
        setTotal(quantity * product.pricePerTray);
    } else {
        setTotal(0);
    }
  }, [quantity, product.pricePerTray]);


  if (user?.role === 'WORKER') {
     return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const setValidatedQuantity = (newQuantityStr: string) => {
    setShowNotifyMe(false);
    if (newQuantityStr === '') {
        setQuantity('');
        return;
    }
    const newQuantity = parseInt(newQuantityStr, 10);

    if (isNaN(newQuantity)) {
        setQuantity('');
        return;
    }

     if (newQuantity < 1) {
        setQuantity(1);
        return;
    }
    
    if (newQuantity > availableTrays) {
      setShowNotifyMe(true);
    }
    setQuantity(newQuantity);
  }

  const handleQuantityChange = (change: number) => {
    const currentQuantity = Number(quantity) || 0;
    setValidatedQuantity((currentQuantity + change).toString());
  }
  
  const handlePlaceOrder = (paymentMethod: 'cod' | 'online') => {
      if (!quantity) return;

      const newOrder: OnlineOrder = {
          id: `ORD${Math.floor(Math.random() * 1000) + 7000}`,
          customer: user?.name || 'Customer',
          quantity: quantity,
          price: product.pricePerTray,
          totalAmount: total,
          status: 'pending',
          paymentStatus: paymentMethod === 'cod' ? 'cod' : 'pending_payment',
          paymentMethod: paymentMethod,
          createdAt: new Date().toISOString()
      };

      setOrders(prev => [newOrder, ...prev]);
      
      // Simulate stock reservation only for online payments before they are "verified" by owner
      if(paymentMethod === 'online'){
        setProduct(p => ({...p, availableQty: p.availableQty - (quantity * 30)}));
      }

      toast({
          title: 'Order Placed!',
          description: `Your order for ${quantity} tray(s) has been received and is pending approval.`
      });
      
      setOpenCheckout(false);
      setCheckoutStep('initial');
      setQuantity('');
  }

  const handleNotifyMe = () => {
    toast({
        title: 'Request Received!',
        description: "We'll notify you when your requested stock is available."
    });
    setShowNotifyMe(false);
    setQuantity('');
  }


  // --- OWNER VIEW ---
  if (user?.role === 'OWNER') {
    const handleUpdateStock = (newStock: number) => {
        setProduct(p => ({...p, availableQty: newStock, lastUpdated: new Date().toISOString()}));
        toast({ title: 'Stock Updated' });
    }
    const handleUpdatePrice = (newPrice: number) => {
        setProduct(p => ({...p, pricePerTray: newPrice, lastUpdated: new Date().toISOString()}));
        toast({ title: 'Price Updated' });
    }

    const handleOrderStatusChange = (orderId: string, status: 'accepted' | 'rejected') => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Prevent accepting unpaid online orders
        if (status === 'accepted' && order.paymentMethod === 'online' && order.paymentStatus === 'pending_payment') {
            toast({ variant: 'destructive', title: 'Action Required', description: 'Cannot accept until payment is confirmed by the customer.' });
            return;
        }

        setOrders(orders.map(o => {
            if (o.id === orderId) {
                if(status === 'accepted' && o.status === 'pending') {
                   // For COD orders, deduct stock on approval
                   if(o.paymentMethod === 'cod') {
                     setProduct(p => ({...p, availableQty: p.availableQty - (o.quantity * 30)}));
                   }
                   toast({ title: 'Order Approved!', description: 'Stock has been updated.' });
                } else if (status === 'rejected') {
                    // Restore stock if a pending online order is rejected before verification
                    if(o.paymentMethod === 'online') {
                        setProduct(p => ({...p, availableQty: p.availableQty + (o.quantity * 30)}));
                    }
                    toast({ title: 'Order Rejected', description: 'Stock has been restored.' });
                }
                return { ...o, status };
            }
            return o;
        }));
    }
    
    const OrderTable = ({ ordersToShow }: { ordersToShow: OnlineOrder[] }) => (
         <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Quantity (Trays)</TableHead>
                        <TableHead>Total (₹)</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordersToShow.length > 0 ? ordersToShow.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>₹{order.totalAmount}</TableCell>
                            <TableCell>
                                <Badge variant={order.paymentMethod === 'online' ? 'default' : 'secondary'}>
                                  {order.paymentMethod}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={order.paymentStatus === 'paid' || order.paymentStatus === 'cod' ? 'secondary' : 'outline'} className={(order.paymentStatus === 'paid' || order.paymentStatus === 'cod') ? 'bg-green-700' : ''}>
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
                    )) : (
                        <TableRow>
                           <TableCell colSpan={8} className="h-24 text-center">
                                No orders in this category.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

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
                    <Input id="stock" type="number" defaultValue={product.availableQty} onChange={(e) => handleUpdateStock(Number(e.target.value))} />
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Order Management</CardTitle>
                <CardDescription>Review and manage incoming online sales. Approve an order to deduct stock.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="accepted">Accepted</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="mt-4">
                        <OrderTable ordersToShow={orders.filter(o => o.status === 'pending')} />
                    </TabsContent>
                    <TabsContent value="accepted" className="mt-4">
                         <OrderTable ordersToShow={orders.filter(o => o.status === 'accepted')} />
                    </TabsContent>
                     <TabsContent value="rejected" className="mt-4">
                         <OrderTable ordersToShow={orders.filter(o => o.status === 'rejected')} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        </div>
    );
  }


  // --- VIEWER VIEW (CUSTOMER STOREFRONT) ---
  return (
    <div className="space-y-8">
        {/* --- Checkout Dialog --- */}
         <Dialog open={openCheckout} onOpenChange={(isOpen) => {
            setOpenCheckout(isOpen);
            if (!isOpen) {
              setTimeout(() => setCheckoutStep('initial'), 300); // Delay reset to allow animation
            }
         }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {checkoutStep === 'initial' ? 'Confirm Your Order' : 'Pay with UPI'}
                    </DialogTitle>
                    <DialogDescription>
                         {checkoutStep === 'initial' 
                            ? 'Review your order details before choosing a payment method.'
                            : 'Scan the QR code or use the details below to pay.'
                         }
                    </DialogDescription>
                </DialogHeader>
                
                {checkoutStep === 'initial' ? (
                    <>
                        <div className="space-y-4 py-4">
                            <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                                <span className="font-semibold text-lg">Total Amount</span>
                                <span className="font-bold text-2xl text-primary">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="text-sm">
                                <p><span className="font-semibold">Quantity:</span> {quantity} tray(s) ({Number(quantity || 0) * 30} eggs)</p>
                                <p><span className="font-semibold">Price per Tray:</span> ₹{product.pricePerTray.toFixed(2)}</p>
                            </div>
                        </div>
                        <DialogFooter className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Button variant="outline" size="lg" onClick={() => handlePlaceOrder('cod')}>
                                Cash on Delivery
                            </Button>
                            <Button size="lg" onClick={() => setCheckoutStep('qr')}>
                                <QrCode className="mr-2"/> Pay Online
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
                            <Image src={paymentSettings.qrCodeUrl} alt="UPI QR Code" width={200} height={200} data-ai-hint="QR code" />
                            <p className="font-mono text-center text-muted-foreground">{paymentSettings.upiId}</p>
                            <p className="text-sm text-center">Mobile: {paymentSettings.mobile}</p>
                        </div>
                         <Button size="lg" className="w-full" onClick={() => handlePlaceOrder('online')}>
                            I have paid
                        </Button>
                    </div>
                )}
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
                             {isOutOfStock ? (
                                <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
                            ) : (
                               <p className="text-2xl font-bold text-accent">{availableTrays}</p>
                            )}
                        </div>
                    </div>
                     <p className="text-xs text-center text-muted-foreground">
                        Last updated: {format(new Date(product.lastUpdated), 'PPP p')}
                    </p>

                    <Separator/>

                    <div className="space-y-2">
                        <Label className="text-lg font-semibold block text-center">Select Quantity (Trays)</Label>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={isOutOfStock || !quantity || quantity <= 1}>
                                <ChevronDown className="w-6 h-6"/>
                            </Button>
                            <Input 
                                type="number"
                                className="text-4xl font-bold w-24 h-auto text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={quantity}
                                onChange={(e) => setValidatedQuantity(e.target.value)}
                                min="1"
                                placeholder="0"
                                disabled={isOutOfStock}
                            />
                             <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={isOutOfStock}>
                                <ChevronUp className="w-6 h-6"/>
                            </Button>
                        </div>
                        <p className="text-center text-muted-foreground text-sm">
                            Total eggs: {Number(quantity || 0) * 30}
                        </p>
                    </div>

                    {showNotifyMe && (
                        <Alert variant="default" className="border-primary/50 text-primary">
                            <Info className="h-4 w-4 !text-primary" />
                            <AlertTitle>Low Stock!</AlertTitle>
                            <AlertDescription className="text-primary/90">
                                Only {availableTrays} trays are available. Would you like to be notified when more stock arrives?
                                <Button variant="link" className="p-0 h-auto ml-2 text-primary" onClick={handleNotifyMe}>Notify Me</Button>
                            </AlertDescription>
                        </Alert>
                    )}
                    
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="w-full flex justify-between items-center bg-muted p-4 rounded-lg">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl text-primary">₹{total.toFixed(2)}</span>
                    </div>
                    <Button size="lg" className="w-full" onClick={() => setOpenCheckout(true)} disabled={isOutOfStock || !quantity || quantity < 1 || showNotifyMe}>
                        <ShoppingCart className="mr-2"/> Place Order
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
