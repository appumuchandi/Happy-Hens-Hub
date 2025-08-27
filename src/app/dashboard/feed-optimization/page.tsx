
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Save, Wheat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FeedStock {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
}

const defaultFeedStocks: FeedStock[] = [
  { id: 'starter', name: 'Starter Mash', quantity: 1500, unit: 'kg', lastUpdated: new Date().toISOString() },
  { id: 'grower', name: 'Grower Pellets', quantity: 2200, unit: 'kg', lastUpdated: new Date().toISOString() },
  { id: 'layer', name: 'Layer Crumble', quantity: 3000, unit: 'kg', lastUpdated: new Date().toISOString() },
  { id: 'corn', name: 'Cracked Corn', quantity: 800, unit: 'kg', lastUpdated: new Date().toISOString() },
];


export default function FeedStockPage() {
  const [feedStocks, setFeedStocks] = useState<FeedStock[]>([]);
  const [initialState, setInitialState] = useState<FeedStock[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
     if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('feedStocks');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFeedStocks(parsed);
        setInitialState(parsed);
      } else {
        setFeedStocks(defaultFeedStocks);
        setInitialState(defaultFeedStocks);
      }
    }
  }, []);

  if (!user) {
    return <p className="text-destructive">You must be logged in to view this page.</p>;
  }

  const handleStockChange = (id: string, newQuantity: string) => {
    const quantity = parseFloat(newQuantity);
    setFeedStocks(prevStocks => 
        prevStocks.map(stock => 
            stock.id === id ? { ...stock, quantity: isNaN(quantity) ? 0 : quantity } : stock
        )
    );
  }

  const handleSaveChanges = () => {
    localStorage.setItem('feedStocks', JSON.stringify(feedStocks));
    setInitialState(feedStocks);
    toast({ title: 'Success!', description: 'Feed stock levels have been updated.' });
  }
  
  const hasChanges = JSON.stringify(feedStocks) !== JSON.stringify(initialState);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Feed Stock</h1>
            <p className="text-muted-foreground">
             Manage and monitor your farm's feed inventory.
            </p>
        </div>
        <Button onClick={handleSaveChanges} disabled={!hasChanges} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {feedStocks.map((stock) => (
                <Card key={stock.id} className="saffron-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                         <CardTitle className="text-xl font-headline">{stock.name}</CardTitle>
                         <Wheat className="w-6 h-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                             <Label htmlFor={`feed-${stock.id}`}>Current Stock ({stock.unit})</Label>
                             <Input 
                                id={`feed-${stock.id}`}
                                type="number"
                                value={stock.quantity}
                                onChange={(e) => handleStockChange(stock.id, e.target.value)}
                                className="text-2xl font-bold h-12"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">Last updated: {new Date(stock.lastUpdated).toLocaleDateString()}</p>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
