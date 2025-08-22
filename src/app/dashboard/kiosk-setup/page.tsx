
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, HardDrive, Wifi } from 'lucide-react';

export default function KioskSetupPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline">Biometric Device Setup</h1>
            <p className="text-muted-foreground mt-2">
                Follow these steps to connect your biometric hardware to HEN's HUB.
            </p>
        </div>

        <Card className="saffron-border">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/20 text-primary p-3 rounded-full">
                    <Download className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="font-headline text-xl">Step 1: Download Kiosk App</CardTitle>
                    <CardDescription>Install the Kiosk application on a dedicated device (Windows/Android) at your farm.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
                This application will run on-site and communicate directly with your biometric scanner. Ensure the device has a stable internet connection.
            </p>
            <Button size="lg" className="w-full">
                <Download className="mr-2" />
                Download Kiosk App (v1.0.0)
            </Button>
             <p className="text-xs text-muted-foreground mt-2 text-center">
                Note: This is a placeholder. A custom application must be developed.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-4">
                <div className="bg-accent/20 text-accent p-3 rounded-full">
                    <HardDrive className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="font-headline text-xl">Step 2: Connect Your Device</CardTitle>
                    <CardDescription>Connect the biometric scanner to your Kiosk device via USB.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>
                Once connected, launch the Kiosk App. It will automatically detect the hardware if it's a supported model (e.g., ZKTeco, SecuGen). Follow the on-screen instructions in the app to complete the initial hardware setup and driver installation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-green-500/20 text-green-500 p-3 rounded-full">
                    <Wifi className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="font-headline text-xl">Step 3: Sync with HEN's HUB</CardTitle>
                    <CardDescription>Log in to the Kiosk App using your Owner credentials to link it to your account.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              After logging in, the Kiosk App will securely sync all attendance data with your HEN's HUB dashboard in real-time. You can then view the live attendance records on the "Workers" page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

