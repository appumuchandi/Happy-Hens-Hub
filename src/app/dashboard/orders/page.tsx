
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { type Order, onlineOrdersData } from '@/lib/placeholder-data';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageCheck, PackageX, Phone, User, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function OrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedOrders = localStorage.getItem('orders');
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            } else {
                setOrders(onlineOrdersData);
            }
        }
    }, []);

    const updateOrderStatus = (orderId: string, status: 'accepted' | 'rejected' | 'delivered') => {
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        toast({ title: 'Order Updated!', description: `Order ${orderId} has been marked as ${status}.` });
    };

    if (!user) {
        return <p className="text-destructive">You must be logged in to view this page.</p>;
    }

    const OrderTable = ({ ordersToShow }: { ordersToShow: Order[] }) => (
         <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordersToShow.length > 0 ? ordersToShow.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">
                                <p className="font-semibold">{order.name}</p>
                                <p className="text-xs text-muted-foreground">{order.phone}</p>
                                <p className="text-xs text-muted-foreground">{order.id}</p>
                            </TableCell>
                            <TableCell>
                                <p>Qty: {order.qty} eggs</p>
                                <p className="text-xs text-muted-foreground">Placed: {format(new Date(order.timestamp), 'PP pp')}</p>
                            </TableCell>
                            <TableCell>
                                 <Badge variant={order.paymentMode === 'ONLINE' ? 'default' : 'secondary'}>
                                  {order.paymentMode}
                                </Badge>
                            </TableCell>
                             <TableCell>
                                <Badge variant={order.status === 'pending' ? 'default' : order.status === 'delivered' ? 'secondary' : 'outline'} className={order.status === 'accepted' ? 'bg-green-700' : ''}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild><Button size="sm" variant="outline">View</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Order Details ({order.id})</DialogTitle>
                                            <DialogDescription>
                                                Full details for the order placed by {order.name}.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                             <div className="flex items-center gap-2"><User/><p>{order.name}</p></div>
                                             <div className="flex items-center gap-2"><Phone/><p>{order.phone}</p></div>
                                             <div className="flex items-center gap-2"><MapPin/><p>{order.address}</p></div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {order.status === 'pending' && (
                                    <>
                                    <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'rejected')}>
                                        <PackageX className="mr-2"/> Reject
                                    </Button>
                                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'accepted')}>
                                        <PackageCheck className="mr-2"/> Approve
                                    </Button>
                                    </>
                                )}
                                {order.status === 'accepted' && (
                                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                        Mark as Delivered
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                           <TableCell colSpan={5} className="h-24 text-center">
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
                <h1 className="text-3xl font-bold font-headline">Order Management</h1>
                <p className="text-muted-foreground">
                Review and manage incoming customer orders.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Incoming Orders</CardTitle>
                    <CardDescription>Approve an order to confirm it with the customer. Stock is automatically deducted when an order is placed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="accepted">Accepted</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="mt-4">
                            <OrderTable ordersToShow={orders.filter(o => o.status === 'pending')} />
                        </TabsContent>
                        <TabsContent value="accepted" className="mt-4">
                            <OrderTable ordersToShow={orders.filter(o => o.status === 'accepted')} />
                        </TabsContent>
                        <TabsContent value="delivered" className="mt-4">
                            <OrderTable ordersToShow={orders.filter(o => o.status === 'delivered')} />
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
