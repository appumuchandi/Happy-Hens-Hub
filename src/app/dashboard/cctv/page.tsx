
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, CameraOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


interface CameraFeed {
  id: number;
  name: string;
  hint: string;
  isConnected: boolean;
}

export default function CctvPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  const initialFeeds: CameraFeed[] = [
    { id: 1, name: 'Coop Entrance', hint: 'security camera', isConnected: false },
    { id: 2, name: 'Feeding Area', hint: 'farm animals', isConnected: false },
    { id: 3, name: 'Perimeter - North', hint: 'farm field', isConnected: false },
    { id: 4, name: 'Storage Barn', hint: 'barn interior', isConnected: false },
  ];

  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(initialFeeds);

  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const handleConnect = (feedId: number) => {
    setCameraFeeds(prevFeeds => 
      prevFeeds.map(feed => 
        feed.id === feedId ? { ...feed, isConnected: true } : feed
      )
    );
    setOpenDialog(null);
    toast({
        title: 'Camera Connected!',
        description: 'Live feed is now available.',
    });
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">CCTV Monitoring</h1>
        <p className="text-muted-foreground">
          Live feed from your farm's security cameras.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {cameraFeeds.map((feed) => (
          <Card key={feed.id} className="overflow-hidden saffron-border">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3 px-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-foreground" />
                <CardTitle className="text-lg font-semibold">{feed.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-card flex items-center justify-center">
                 {feed.isConnected ? (
                    <Image
                        src={`https://placehold.co/600x400.png`}
                        alt={`Live feed for ${feed.name}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        data-ai-hint={feed.hint}
                    />
                 ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <CameraOff className="w-16 h-16" />
                        <p className="mt-2">Camera Offline</p>
                        <Dialog open={openDialog === feed.id} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="mt-4" onClick={() => setOpenDialog(feed.id)}>
                                    Connect Camera
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Connect to {feed.name}</DialogTitle>
                                <DialogDescription>
                                    Enter the camera's stream URL and password. This is a placeholder for real integration.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="url" className="text-right">
                                    Stream URL
                                    </Label>
                                    <Input id="url" defaultValue="rtsp://192.168.1.108/stream" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right">
                                    Password
                                    </Label>
                                    <Input id="password" type="password" defaultValue="password" className="col-span-3" />
                                </div>
                                </div>
                                <DialogFooter>
                                <Button type="submit" onClick={() => handleConnect(feed.id)}>Connect</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                 )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
