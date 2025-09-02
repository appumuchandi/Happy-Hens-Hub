
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import type { Order } from '@/types';
import { onlineOrdersData } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, XCircle, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function OnlineOrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedOrders = localStorage.getItem('onlineOrders');
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            } else {
                setOrders(onlineOrdersData);
                localStorage.setItem('onlineOrders', JSON.stringify(onlineOrdersData));
            }
        }
    }, []);

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('onlineOrders', JSON.stringify(updatedOrders));
        toast({
            title: 'Order Updated',
            description: `Order #${orderId.slice(-4)} has been marked as ${status}.`
        });
    };

    const getStatusBadgeVariant = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'default';
            case 'accepted': return 'secondary';
            case 'delivered': return 'default'; // Success
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    };

    const getStatusBadgeClass = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'bg-green-700 text-white';
            default: return '';
        }
    }


    if (user?.role !== 'OWNER') {
        return <p className="text-destructive">You do not have permission to view this page.</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Online Orders</h1>
                <p className="text-muted-foreground">
                    Manage incoming bulk orders from customers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>
                        You have {orders.filter(o => o.status === 'pending').length} pending orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">#{order.id.slice(-6)}</TableCell>
                                        <TableCell>{format(parseISO(order.timestamp), 'dd MMM, yyyy')}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.name}</div>
                                            <div className="text-xs text-muted-foreground">{order.phone}</div>
                                        </TableCell>
                                        <TableCell>{order.qty} pcs</TableCell>
                                        <TableCell>
                                            <Badge variant={order.paymentStatus === 'PAID' ? 'secondary' : 'outline'} className={cn(order.paymentStatus === 'PAID' && 'bg-green-200 text-green-900')}>
                                                {order.paymentMode} ({order.paymentStatus})
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(order.status)} className={getStatusBadgeClass(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'accepted')}>
                                                        <CheckCircle className="mr-2" /> Accept Order
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                                        <Truck className="mr-2" /> Mark as Delivered
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => updateOrderStatus(order.id, 'rejected')}>
                                                        <XCircle className="mr-2" /> Reject Order
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                     <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No online orders yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
