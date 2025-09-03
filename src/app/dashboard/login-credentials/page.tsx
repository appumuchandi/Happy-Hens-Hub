
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, Users, KeyRound, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { WorkerCredentials } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
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

const credentialsSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters long.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

interface StoredUser extends WorkerCredentials {
    lastLogin?: string;
}

const CREDENTIALS_PASSWORD = "appu1234";

export default function LoginCredentialsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);
  const [loginHistory, setLoginHistory] = useState<Record<string, string>>({});
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  useEffect(() => {
     if (typeof window !== 'undefined') {
        const sessionAuth = sessionStorage.getItem('credentialsAuthenticated');
        if (sessionAuth === 'true') {
            setIsAuthenticated(true);
        }

        const savedCreds = localStorage.getItem('workerCredentials');
        const history = localStorage.getItem('loginHistory');
        
        const parsedCreds = savedCreds ? JSON.parse(savedCreds) : [];
        const parsedHistory = history ? JSON.parse(history) : {};
        
        const allUsers: StoredUser[] = [{ username: 'appu_muchandi', password: '•••' }, ...parsedCreds];
        
        setStoredUsers(allUsers);
        setLoginHistory(parsedHistory);
     }
  }, []);

  const updateStoredUsers = (users: StoredUser[]) => {
      const workersOnly = users.filter(u => u.username !== 'appu_muchandi');
      localStorage.setItem('workerCredentials', JSON.stringify(workersOnly));
      setStoredUsers(users);
  }

  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to manage login credentials.</p>;
  }

  function onSubmit(data: CredentialsFormValues) {
     if (data.username === 'appu_muchandi') {
      toast({ variant: 'destructive', title: 'Cannot modify owner', description: 'The owner account cannot be modified from here.' });
      return;
    }
    
    const existingUserIndex = storedUsers.findIndex(u => u.username === data.username);
    let updatedUsers = [...storedUsers];

    if(existingUserIndex > -1){
        const workersOnly = updatedUsers.filter(u => u.username !== 'appu_muchandi');
        const workerIndex = workersOnly.findIndex(w => w.username === data.username);
        if (workerIndex > -1) {
            workersOnly[workerIndex] = { ...workersOnly[workerIndex], ...data };
            updatedUsers = [{ username: 'appu_muchandi', password: '•••' }, ...workersOnly];
            toast({ title: 'Credentials Updated!', description: `Login for ${data.username} has been updated.` });
        }
    } else {
        updatedUsers.push(data);
        toast({ title: 'User Added!', description: `${data.username} can now log in.` });
    }
    
    updateStoredUsers(updatedUsers);
    form.reset();
  }

  const handleDeleteUser = (username: string) => {
    if (username === 'appu_muchandi') {
      toast({ variant: 'destructive', title: 'Cannot delete owner', description: 'The owner account cannot be deleted.' });
      return;
    }
    const updatedUsers = storedUsers.filter(u => u.username !== username);
    updateStoredUsers(updatedUsers);
    toast({ title: 'User Deleted', description: `${username} has been removed.` });
  }

  const togglePasswordVisibility = (username: string) => {
    setPasswordVisibility(prev => ({ ...prev, [username]: !prev[username] }));
  }
  
  const handlePasswordSubmit = () => {
    if (password === CREDENTIALS_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem('credentialsAuthenticated', 'true');
        toast({ title: 'Access Granted' });
    } else {
        toast({ variant: 'destructive', title: 'Access Denied', description: 'Incorrect password.' });
    }
  }

  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center font-headline flex items-center justify-center gap-2">
                        <Lock /> Secure Area
                    </CardTitle>
                    <CardDescription className="text-center">
                        This is a restricted area. Please enter your owner password to continue.
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
                            placeholder="Enter your password"
                        />
                    </div>
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
      <div>
        <h1 className="text-3xl font-bold font-headline">Login Credentials</h1>
        <p className="text-muted-foreground">
          Create and manage login access for your workers and managers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="font-headline flex items-center gap-2"><KeyRound/> Add / Edit User</CardTitle>
                        </div>
                        <CardDescription>Enter a username to update an existing user or create a new one.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter username" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            Save Credentials
                        </Button>
                    </CardContent>
                </Card>
              </form>
            </Form>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Users/> Users</CardTitle>
                    <CardDescription>List of users with access to the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Password</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {storedUsers.length > 0 ? storedUsers.map((u) => (
                                    <TableRow key={u.username}>
                                        <TableCell className="font-medium">{u.username}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                            <span>
                                                {u.username === 'appu_muchandi' 
                                                    ? '••••••••' 
                                                    : passwordVisibility[u.username] ? u.password : '••••••••'
                                                }
                                            </span>
                                            {u.username !== 'appu_muchandi' && (
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePasswordVisibility(u.username)}>
                                                     {passwordVisibility[u.username] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {loginHistory[u.username] 
                                                ? format(parseISO(loginHistory[u.username]), 'PPP p') 
                                                : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon" disabled={u.username === 'appu_muchandi'}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete User</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the user <span className="font-bold">{u.username}</span> and cannot be undone.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteUser(u.username)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No users created yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    