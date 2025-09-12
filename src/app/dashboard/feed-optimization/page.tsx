
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FeedContainer {
  id: string;
  name: string;
  quantity: number;
}

const defaultFeedContainers: FeedContainer[] = [
  { id: 'c1', name: 'Container 1', quantity: 1500 },
  { id: 'c2', name: 'Container 2', quantity: 2200 },
  { id: 'c3', name: 'Container 3', quantity: 3000 },
  { id: 'c4', name: 'Container 4', quantity: 800 },
];


export default function FeedStockPage() {
  const [containers, setContainers] = useState<FeedContainer[]>([]);
  const [initialState, setInitialState] = useState<FeedContainer[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
     if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('feedContainers');
      const dataToSet = savedData ? JSON.parse(savedData) : defaultFeedContainers;
      setContainers(dataToSet);
      setInitialState(JSON.parse(JSON.stringify(dataToSet))); // Deep copy for initial state
    }
  }, []);

  const handleStockChange = (id: string, newQuantity: string) => {
    const quantity = parseFloat(newQuantity);
    setContainers(prevContainers => 
        prevContainers.map(container => 
            container.id === id ? { ...container, quantity: isNaN(quantity) ? 0 : quantity } : container
        )
    );
  }

  const handleSaveChanges = () => {
    localStorage.setItem('feedContainers', JSON.stringify(containers));
    setInitialState(JSON.parse(JSON.stringify(containers))); // Deep copy for new initial state
    toast({ title: 'Success!', description: 'Feed stock levels have been updated.' });
  }
  
  const hasChanges = JSON.stringify(containers) !== JSON.stringify(initialState);
  const totalStock = containers.reduce((acc, container) => acc + container.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Feed Stock</h1>
            <p className="text-muted-foreground">
             Manage and monitor your farm's feed inventory across all containers.
            </p>
        </div>
        <Button onClick={handleSaveChanges} disabled={!hasChanges} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

      <Card className="saffron-border">
        <CardHeader>
            <CardTitle className="font-headline">Stock Levels</CardTitle>
            <CardDescription>Update the quantity (in kg) for each container.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {containers.map((container) => (
                <div key={container.id} className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor={`feed-${container.id}`} className="font-semibold text-right">
                        {container.name}
                    </Label>
                    <div className="col-span-2">
                        <Input 
                            id={`feed-${container.id}`}
                            type="number"
                            value={container.quantity}
                            onChange={(e) => handleStockChange(container.id, e.target.value)}
                            className="text-lg font-bold"
                        />
                    </div>
                </div>
            ))}
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-muted/50 p-4 rounded-b-lg">
            <div className="flex items-center gap-2 text-lg font-bold">
                 <Package className="w-6 h-6 text-primary"/>
                 <span>Total Stock</span>
            </div>
            <span className="text-2xl font-bold">{totalStock.toLocaleString()} kg</span>
        </CardFooter>
      </Card>
    </div>
  );
}

    