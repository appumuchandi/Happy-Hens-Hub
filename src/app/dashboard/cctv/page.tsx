
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, CameraOff, Lock, Settings, ChevronRight, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface CameraFeed {
  id: number;
  name: string;
  hint: string;
  location: string;
  isConnected: boolean;
}

const DEFAULT_CCTV_PASSWORD = "appu1234";

export default function CctvPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [cctvPassword, setCctvPassword] = useState(DEFAULT_CCTV_PASSWORD);
  const [openSettings, setOpenSettings] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  
  const initialFeeds: CameraFeed[] = [
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
  
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>([]);

  useEffect(() => {
    try {
        const storedPassword = localStorage.getItem('cctvPassword');
        if (storedPassword) {
            setCctvPassword(storedPassword);
        }
        
        const sessionAuth = sessionStorage.getItem('cctvAuthenticated');
        if (sessionAuth === 'true') {
            setIsAuthenticated(true);
        }

    } catch (error) {
        console.error("Failed to access storage", error);
    }
     setCameraFeeds(initialFeeds);
  }, []);


  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const handlePasswordSubmit = () => {
    if (password === cctvPassword) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cctvAuthenticated', 'true');
        toast({ title: 'Access Granted' });
    } else {
        toast({ variant: 'destructive', title: 'Access Denied', description: 'Incorrect password.' });
    }
  }

  const CctvSettingsDialog = () => {
    const [newCameraName, setNewCameraName] = useState('');
    const [newCameraLocation, setNewCameraLocation] = useState('');

    const handleAddCamera = () => {
        if (!newCameraName || !newCameraLocation) {
             toast({ variant: 'destructive', title: 'Error', description: 'Please fill in both camera name and location.' });
            return;
        }
        const newCamera: CameraFeed = {
            id: cameraFeeds.length + 1,
            name: newCameraName,
            location: newCameraLocation,
            hint: 'security camera',
            isConnected: Math.random() > 0.5, // Randomly set to online/offline for demo
        };
        setCameraFeeds(prev => [...prev, newCamera]);
        setNewCameraName('');
        setNewCameraLocation('');
        toast({ title: 'Camera Added', description: `${newCamera.name} has been added to the list.` });
    }

    return (
        <Dialog open={openSettings} onOpenChange={setOpenSettings}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>CCTV Settings</DialogTitle>
                    <DialogDescription>
                        Manage and add new cameras.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                     <h3 className="font-semibold text-lg">Add New Camera</h3>
                    <div className="space-y-2">
                        <Label htmlFor="new-camera-name">Camera Name</Label>
                        <Input id="new-camera-name" placeholder="Enter camera name" value={newCameraName} onChange={(e) => setNewCameraName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-camera-location">Camera Location</Label>
                        <Input id="new-camera-location" placeholder="Enter camera location" value={newCameraLocation} onChange={(e) => setNewCameraLocation(e.target.value)} />
                    </div>
                    <Button variant="outline" onClick={handleAddCamera}>
                        <PlusCircle className="mr-2"/>
                        Add Camera
                    </Button>
                </div>


                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpenSettings(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  const ForgotPasswordDialog = () => {
    const [username, setUsername] = useState(user?.username || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [step, setStep] = useState(1);
    
    const canContinue = username && newPassword && confirmNewPassword && newPassword === confirmNewPassword && newPassword.length >= 4;

    const handleSendOtp = () => {
        toast({ title: "OTP Sent (Simulation)", description: `An OTP has been sent securely to the owner's registered contact.` });
        setStep(2);
    }
    
    const handleResetPassword = () => {
        if (otp !== '123456') { 
            toast({ variant: 'destructive', title: 'Invalid OTP' });
            return;
        }
        if (newPassword.length < 4) {
            toast({ variant: 'destructive', title: 'Password is too short' });
            return;
        }
        localStorage.setItem('cctvPassword', newPassword);
        setCctvPassword(newPassword);
        setOpenForgotPassword(false);
        setStep(1);
        setNewPassword('');
        setConfirmNewPassword('');
        setOtp('');
        toast({ title: 'Password Reset Successfully' });
    }

    return (
         <Dialog open={openForgotPassword} onOpenChange={setOpenForgotPassword}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset CCTV Password</DialogTitle>
                    <DialogDescription>
                         {step === 1 ? 'Enter your username and new password to receive an OTP.' : 'Enter the OTP to finalize the reset.'}
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-4 py-4">
                    {step === 1 ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="username">Owner's Username</Label>
                                <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password-reset">New Password</Label>
                                <Input id="new-password-reset" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-new-password-reset">Confirm New Password</Label>
                                <Input id="confirm-new-password-reset" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            </div>
                        </>
                    ) : (
                         <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <p className="text-sm text-muted-foreground">An OTP has been sent to the owner's contact. Please enter it below.</p>
                            <Input id="otp" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </div>
                    )}
                 </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setOpenForgotPassword(false); setStep(1);}}>Cancel</Button>
                    {step === 1 ? (
                        <Button onClick={handleSendOtp} disabled={!canContinue}>Continue</Button>
                    ) : (
                        <Button onClick={handleResetPassword} disabled={otp.length < 6}>Reset Password</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center h-full">
            {openForgotPassword && <ForgotPasswordDialog />}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center font-headline flex items-center justify-center gap-2">
                        <Lock /> Secure Area
                    </CardTitle>
                    <CardDescription className="text-center">
                        Please enter the password to access CCTV feeds.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cctv-password">Password</Label>
                        <Input 
                            id="cctv-password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        />
                    </div>
                     <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setOpenForgotPassword(true)}>
                        Forgot Password?
                    </Button>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handlePasswordSubmit}>
                        Unlock
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {openSettings && <CctvSettingsDialog />}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline">CCTV Monitoring</h1>
            <p className="text-muted-foreground">
              Live feeds from all connected cameras.
            </p>
        </div>
         <Button variant="outline" size="icon" onClick={() => setOpenSettings(true)}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">CCTV Settings</span>
        </Button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cameraFeeds.map((feed) => (
            <Card 
                key={feed.id} 
                className="overflow-hidden cursor-pointer group" 
                onClick={() => router.push(`/dashboard/cctv/${feed.id}`)}
            >
                <CardContent className="p-0">
                    <div className="aspect-video bg-card border-b rounded-t-md flex items-center justify-center relative">
                        {feed.isConnected ? (
                            <Image
                                src={`https://placehold.co/600x400.png`}
                                alt={`Live feed for ${feed.name}`}
                                width={600}
                                height={400}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={feed.hint}
                            />
                        ) : (
                            <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                                <CameraOff className="w-16 h-16" />
                                <p className="mt-2 font-semibold">Offline</p>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                             <Badge variant={feed.isConnected ? 'default' : 'destructive'} className={feed.isConnected ? 'bg-green-700' : ''}>
                                {feed.isConnected ? 'Online' : 'Offline'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold">{feed.name}</CardTitle>
                    <CardDescription className="text-sm">{feed.location}</CardDescription>
                </CardHeader>
            </Card>
          ))}
        </div>
    </div>
  );
}
