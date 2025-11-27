
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Recycle, Check, X, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type CompostOrderStatus = 'Pending' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

interface CompostOrder {
    id: string;
    name: string;
    phone: string;
    quantity: number;
    timestamp: string;
    status: CompostOrderStatus;
}

export default function CompostOrdersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<CompostOrder[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedOrders = localStorage.getItem('compostOrders');
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            }
        }
    }, []);

    const updateOrderStatus = (id: string, status: CompostOrderStatus) => {
        const updatedOrders = orders.map(order => 
            order.id === id ? { ...order, status } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('compostOrders', JSON.stringify(updatedOrders));
        
        toast({
            title: 'Order Updated',
            description: `The order status has been set to "${status}".`,
        });

        const order = orders.find(o => o.id === id);
        if (status === 'Ready for Pickup' && order) {
            const message = `Hello ${order.name}, your compost fertilizer order from HEN's HUB is ready for pickup. Thank you!`;
            const smsUrl = `sms:${order.phone}?body=${encodeURIComponent(message)}`;
            window.location.href = smsUrl;
        }
    };

    const getStatusVariant = (status: CompostOrderStatus) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Ready for Pickup': return 'secondary';
            case 'Completed': return 'outline';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    }
    
     const getStatusColor = (status: CompostOrderStatus) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500';
            case 'Ready for Pickup': return 'bg-blue-500';
            case 'Completed': return 'bg-green-500';
            case 'Cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }

    if (!user) {
        return <p className="text-destructive">You must be logged in to view this page.</p>;
    }
    
    const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Compost Orders</h1>
                <p className="text-muted-foreground">
                    Manage compost fertilizer order requests from customers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                    <CardDescription>
                        You have {orders.filter(r => r.status === 'Pending').length} pending orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedOrders.length > 0 ? (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Quantity (bags)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{format(parseISO(order.timestamp), 'PPP p')}</TableCell>
                                            <TableCell className="font-medium">{order.name}</TableCell>
                                            <TableCell>{order.phone}</TableCell>
                                            <TableCell>{order.quantity}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" disabled={order.status === 'Completed' || order.status === 'Cancelled'}>Manage</Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}>
                                                            <Truck className="mr-2" /> Ready for Pickup
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Completed')}>
                                                            <Check className="mr-2" /> Mark as Completed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="text-destructive">
                                                            <X className="mr-2" /> Cancel Order
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Recycle className="mx-auto h-12 w-12" />
                            <p className="mt-4">No compost orders have been placed yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
