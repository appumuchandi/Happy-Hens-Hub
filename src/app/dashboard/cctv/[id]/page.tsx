
'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, ArrowLeft, Video, CameraOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

// Mock camera data - in a real app, this would be fetched
const cameraFeeds = [
    { id: 1, name: 'Coop Entrance', hint: 'security camera', location: 'Coop A', isConnected: false },
    { id: 2, name: 'Feeding Area 1', hint: 'farm animals', location: 'Coop A', isConnected: true },
    { id: 3, name: 'Perimeter - North', hint: 'farm field', location: 'Farm Boundary', isConnected: false },
    { id: 4, name: 'Storage Barn', hint: 'barn interior', location: 'Barn Alpha', isConnected: true },
    { id: 5, name: 'Coop Exit', hint: 'security camera', location: 'Coop B', isConnected: false },
    { id: 6, name: 'Feeding Area 2', hint: 'farm animals', location: 'Coop B', isConnected: true },
    { id: 7, name: 'Water Station', hint: 'water trough', location: 'Coop A', isConnected: true },
    { id: 8, name: 'Perimeter - East', hint: 'farm field', location: 'Farm Boundary', isConnected: false },
    { id: 9, name: 'Hatchery Room', hint: 'egg incubator', location: 'Main Building', isConnected: true },
    { id: 10, name: 'Office Entrance', hint: 'office building', location: 'Main Building', isConnected: false },
];


export default function SingleCctvPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  
  const cameraId = params.id;
  const camera = cameraFeeds.find(c => c.id.toString() === cameraId);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('cctvAuthenticated');
    if (sessionAuth !== 'true') {
        router.push('/dashboard/cctv');
    } else {
        setIsAllowed(true);
    }
  }, [router]);

  useEffect(() => {
    // This is a mock to start playing when the component loads if connected.
    // In a real app, you would initialize the video stream here.
    if (camera?.isConnected) {
      setIsPlaying(true);
    }
  }, [camera]);


  const handlePlay = () => {
    // In a real implementation, you'd start the HLS/WebRTC stream.
    // Here we just toggle the state.
    if (!camera?.isConnected) {
        toast({ variant: 'destructive', title: 'Camera Offline', description: 'Cannot play feed from an offline camera.' });
        return;
    }
    setIsPlaying(true);
    toast({ title: 'Playback Started', description: `Live feed for ${camera.name} is now playing.` });
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast({ title: 'Playback Paused' });
  };

  const handleStop = () => {
    setIsPlaying(false);
    // In a real app, you might tear down the stream connection here.
    toast({ title: 'Playback Stopped' });
  };
  
  if (!isAllowed) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-foreground flex items-center gap-2">
                <Lock /> Verifying access...
            </div>
      </div>
    );
  }


  if (!camera) {
    return (
       <div className="flex flex-col items-center justify-center h-full text-center">
        <CameraOff className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Camera Not Found</h1>
        <p className="text-muted-foreground">The camera you are looking for does not exist.</p>
        <Button onClick={() => router.push('/dashboard/cctv')} className="mt-6">
            <ArrowLeft className="mr-2" />
            Back to Camera List
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <Button variant="outline" onClick={() => router.push('/dashboard/cctv')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Camera List
        </Button>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Video className="w-7 h-7 text-primary"/>
                    {camera.name}
                </CardTitle>
                <CardDescription>
                    Location: {camera.location}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-card border rounded-md flex items-center justify-center relative overflow-hidden">
                    {camera.isConnected ? (
                        <>
                            <Image
                                src={`https://picsum.photos/seed/${camera.id}/1280/720`}
                                alt={`Live feed for ${camera.name}`}
                                layout="fill"
                                objectFit="cover"
                                className={`transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-30 blur-sm'}`}
                                data-ai-hint={camera.hint}
                            />
                            {!isPlaying && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                                    <p className="text-white text-lg font-semibold">PAUSED</p>
                                </div>
                            )}
                        </>

                    ) : (
                        <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                            <CameraOff className="w-24 h-24" />
                            <p className="mt-4 text-xl font-semibold">Camera Offline</p>
                            <p className="text-sm">This camera is not connected. Please check the hardware and connection.</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    <Button size="lg" onClick={handlePlay} disabled={isPlaying || !camera.isConnected}>
                        <Play className="mr-2"/> Play
                    </Button>
                     <Button size="lg" variant="secondary" onClick={handlePause} disabled={!isPlaying || !camera.isConnected}>
                        <Pause className="mr-2"/> Pause
                    </Button>
                     <Button size="lg" variant="destructive" onClick={handleStop} disabled={!camera.isConnected}>
                        <Square className="mr-2"/> Stop
                    </Button>
                </div>

                {!camera.isConnected && (
                    <Alert variant="destructive" className="mt-6">
                        <AlertTitle>Connection Issue</AlertTitle>
                        <AlertDescription>
                            This camera is currently offline and cannot be viewed. Please check the camera's power and network connection.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

    