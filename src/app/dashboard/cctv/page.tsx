
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, CameraOff, Lock, Settings } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CameraFeed {
  id: number;
  name: string;
  hint: string;
  isConnected: boolean;
}

const DEFAULT_CCTV_PASSWORD = "1234";

export default function CctvPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [openConnectDialog, setOpenConnectDialog] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [cctvPassword, setCctvPassword] = useState(DEFAULT_CCTV_PASSWORD);
  const [openSettings, setOpenSettings] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  
  const initialFeeds: CameraFeed[] = [
    { id: 1, name: 'Coop Entrance', hint: 'security camera', isConnected: false },
    { id: 2, name: 'Feeding Area', hint: 'farm animals', isConnected: false },
    { id: 3, name: 'Perimeter - North', hint: 'farm field', isConnected: false },
    { id: 4, name: 'Storage Barn', hint: 'barn interior', isConnected: false },
  ];

  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>([]);

  useEffect(() => {
    try {
        const storedFeeds = localStorage.getItem('cameraFeeds');
        if (storedFeeds) {
            setCameraFeeds(JSON.parse(storedFeeds));
        } else {
            setCameraFeeds(initialFeeds);
        }
    } catch (error) {
        console.error("Failed to parse camera feeds from localStorage", error);
        setCameraFeeds(initialFeeds);
    }
    
    try {
        const storedPassword = localStorage.getItem('cctvPassword');
        if (storedPassword) {
            setCctvPassword(storedPassword);
        }
    } catch (error) {
        console.error("Failed to parse password from localStorage", error);
    }

  }, []);

  useEffect(() => {
    if (cameraFeeds.length > 0) {
        try {
            localStorage.setItem('cameraFeeds', JSON.stringify(cameraFeeds));
        } catch (error) {
            console.error("Failed to save camera feeds to localStorage", error);
        }
    }
  }, [cameraFeeds]);

  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }
  
  const handleConnect = (feedId: number) => {
    setCameraFeeds(prevFeeds => 
      prevFeeds.map(feed => 
        feed.id === feedId ? { ...feed, isConnected: true } : feed
      )
    );
    setOpenConnectDialog(null);
    toast({
        title: 'Camera Connected!',
        description: 'Live feed is now available.',
    });
  };

  const handlePasswordSubmit = () => {
    if (password === cctvPassword) {
        setIsAuthenticated(true);
        toast({ title: 'Access Granted' });
    } else {
        toast({ variant: 'destructive', title: 'Access Denied', description: 'Incorrect password.' });
    }
  }

  const PasswordSettingsDialog = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = () => {
        if (newPassword.length < 4) {
            toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 4 characters.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match.' });
            return;
        }
        localStorage.setItem('cctvPassword', newPassword);
        setCctvPassword(newPassword);
        setOpenSettings(false);
        toast({ title: 'Success', description: 'CCTV password has been updated.' });
    };

    return (
        <Dialog open={openSettings} onOpenChange={setOpenSettings}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>CCTV Settings</DialogTitle>
                    <DialogDescription>
                        Update the password required to access the CCTV page.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenSettings(false)}>Cancel</Button>
                    <Button onClick={handlePasswordChange}>Save Password</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  const ForgotPasswordDialog = () => {
    const [email, setEmail] = useState(user?.email || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);

    const handleSendOtp = () => {
        // Simulate sending OTP
        toast({ title: "OTP Sent (Simulation)", description: `An OTP has been sent to ${email}` });
        setStep(2);
    }
    
    const handleResetPassword = () => {
        if (otp !== '123456') { // Mock OTP
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
        toast({ title: 'Password Reset Successfully' });
    }

    return (
         <Dialog open={openForgotPassword} onOpenChange={setOpenForgotPassword}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset CCTV Password</DialogTitle>
                    <DialogDescription>
                        {step === 1 ? 'Enter your email to receive an OTP.' : 'Enter the OTP and your new password.'}
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-4 py-4">
                    {step === 1 && (
                         <div className="space-y-2">
                            <Label htmlFor="email">Owner's Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    )}
                    {step === 2 && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input id="otp" placeholder="e.g., 123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password-reset">New Password</Label>
                                <Input id="new-password-reset" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                        </>
                    )}
                 </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenForgotPassword(false)}>Cancel</Button>
                    {step === 1 ? (
                        <Button onClick={handleSendOtp}>Send OTP</Button>
                    ) : (
                        <Button onClick={handleResetPassword}>Reset Password</Button>
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
      {openSettings && <PasswordSettingsDialog />}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline">CCTV Monitoring</h1>
            <p className="text-muted-foreground">
            Live feed from your farm's security cameras.
            </p>
        </div>
         <Button variant="outline" size="icon" onClick={() => setOpenSettings(true)}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">CCTV Settings</span>
        </Button>
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
                    <div className="flex flex-col items-center text-muted-foreground p-4">
                        <CameraOff className="w-16 h-16" />
                        <p className="mt-2">Camera Offline</p>
                        <Dialog open={openConnectDialog === feed.id} onOpenChange={(isOpen) => !isOpen && setOpenConnectDialog(null)}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="mt-4" onClick={() => setOpenConnectDialog(feed.id)}>
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

    