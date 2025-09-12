
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ShoppingCart, Check, X, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { siteSettings as defaultSettings } from '@/lib/placeholder-data';
import type { SiteSettings } from '@/types';


type ReservationStatus = 'Pending' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

interface Reservation {
    id: string;
    name: string;
    phone: string;
    quantity: number;
    timestamp: string;
    status: ReservationStatus;
}

export default function EggReservationsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedReservations = localStorage.getItem('eggReservations');
            if (storedReservations) {
                setReservations(JSON.parse(storedReservations));
            }

            const storedSettings = localStorage.getItem('siteSettings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        }
    }, []);

    const updateReservationStatus = (id: string, status: ReservationStatus) => {
        const reservation = reservations.find(res => res.id === id);
        if (!reservation) return;

        // Prevent creating a new sale if already completed
        if (reservation.status === 'Completed' && status === 'Completed') {
            toast({
                variant: 'destructive',
                title: 'Already Completed',
                description: 'This reservation has already been marked as completed and a sale has been recorded.',
            });
            return;
        }

        const updatedReservations = reservations.map(res => 
            res.id === id ? { ...res, status } : res
        );
        setReservations(updatedReservations);
        localStorage.setItem('eggReservations', JSON.stringify(updatedReservations));
        
        toast({
            title: 'Reservation Updated',
            description: `The reservation status has been set to "${status}".`,
        });

        if (status === 'Completed') {
            const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
            const saleExists = salesHistory.some((sale: any) => sale.id === `SALE_RES_${reservation.id}`);

            if (!saleExists) {
                const revenue = reservation.quantity * settings.pricePerEgg;
                const newSale = {
                    id: `SALE_RES_${reservation.id}`,
                    date: new Date().toISOString(),
                    buyerName: reservation.name,
                    quantity: reservation.quantity,
                    revenue: revenue.toFixed(2),
                };

                const updatedSalesHistory = [newSale, ...salesHistory];
                localStorage.setItem('salesHistory', JSON.stringify(updatedSalesHistory));

                toast({
                    title: 'Sale Recorded!',
                    description: `Sale for ${reservation.name} automatically added to sales history.`,
                });
            }
        }
    };

    const getStatusVariant = (status: ReservationStatus) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Ready for Pickup': return 'secondary';
            case 'Completed': return 'outline';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    }
    
     const getStatusColor = (status: ReservationStatus) => {
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
    
    const sortedReservations = [...reservations].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Egg Reservations</h1>
                <p className="text-muted-foreground">
                    Manage egg reservation requests from customers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Reservation List</CardTitle>
                    <CardDescription>
                        You have {reservations.filter(r => r.status === 'Pending').length} pending reservations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedReservations.length > 0 ? (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Quantity (pcs)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedReservations.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell>{format(parseISO(res.timestamp), 'PPP p')}</TableCell>
                                            <TableCell className="font-medium">{res.name}</TableCell>
                                            <TableCell>{res.phone}</TableCell>
                                            <TableCell>{res.quantity}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(res.status)} className={getStatusColor(res.status)}>
                                                    {res.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" disabled={res.status === 'Completed' || res.status === 'Cancelled'}>Manage</Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => updateReservationStatus(res.id, 'Ready for Pickup')}>
                                                            <Truck className="mr-2" /> Ready for Pickup
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateReservationStatus(res.id, 'Completed')}>
                                                            <Check className="mr-2" /> Mark as Completed
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateReservationStatus(res.id, 'Cancelled')} className="text-destructive">
                                                            <X className="mr-2" /> Cancel Reservation
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
                            <ShoppingCart className="mx-auto h-12 w-12" />
                            <p className="mt-4">No reservations have been placed yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
