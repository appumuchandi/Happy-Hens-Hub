
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CameraFeed {
  id: number;
  name: string;
  hint: string;
  location: string;
  isConnected: boolean;
}

const DEFAULT_CCTV_PASSWORD = "1234";

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
        toast({ title: 'Access Granted' });
    } else {
        toast({ variant: 'destructive', title: 'Access Denied', description: 'Incorrect password.' });
    }
  }

  const CctvSettingsDialog = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newCameraName, setNewCameraName] = useState('');
    const [newCameraLocation, setNewCameraLocation] = useState('');

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
            isConnected: false,
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
                        Manage CCTV password and add new cameras.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                    <h3 className="font-semibold text-lg">Change Password</h3>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                     <Button onClick={handlePasswordChange}>Save New Password</Button>
                </div>

                <Separator />

                <div className="space-y-4 py-2">
                     <h3 className="font-semibold text-lg">Add New Camera</h3>
                    <div className="space-y-2">
                        <Label htmlFor="new-camera-name">Camera Name</Label>
                        <Input id="new-camera-name" placeholder="e.g., Back Door" value={newCameraName} onChange={(e) => setNewCameraName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-camera-location">Camera Location</Label>
                        <Input id="new-camera-location" placeholder="e.g., Main Building" value={newCameraLocation} onChange={(e) => setNewCameraLocation(e.target.value)} />
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
    const [email, setEmail] = useState(user?.email || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);

    const handleSendOtp = () => {
        toast({ title: "OTP Sent (Simulation)", description: `An OTP has been sent to ${email}` });
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
      {openSettings && <CctvSettingsDialog />}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline">CCTV Monitoring</h1>
            <p className="text-muted-foreground">
              Select a camera to view its live feed.
            </p>
        </div>
         <Button variant="outline" size="icon" onClick={() => setOpenSettings(true)}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">CCTV Settings</span>
        </Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Camera List</CardTitle>
          <CardDescription>
            List of all available security cameras on the farm.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {cameraFeeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push(`/dashboard/cctv/${feed.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${feed.isConnected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {feed.isConnected ? <Video className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold">{feed.name}</p>
                    <p className="text-sm text-muted-foreground">{feed.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={feed.isConnected ? 'default' : 'destructive'} className={feed.isConnected ? 'bg-green-700' : ''}>
                    {feed.isConnected ? 'Online' : 'Offline'}
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    