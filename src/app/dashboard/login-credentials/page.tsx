
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, Users, KeyRound } from 'lucide-react';
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

export default function LoginCredentialsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);
  const [loginHistory, setLoginHistory] = useState<Record<string, string>>({});

  const form = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  useEffect(() => {
     if (typeof window !== 'undefined') {
        const savedCreds = localStorage.getItem('workerCredentials');
        const history = localStorage.getItem('loginHistory');
        
        const parsedCreds = savedCreds ? JSON.parse(savedCreds) : [];
        const parsedHistory = history ? JSON.parse(history) : {};
        
        // Add owner to the list for display purposes
        const allUsers = [{ username: 'appu_muchandi', password: '•••' }, ...parsedCreds];
        
        setStoredUsers(allUsers);
        setLoginHistory(parsedHistory);
     }
  }, []);

  const updateStoredUsers = (users: StoredUser[]) => {
      // Filter out the owner before saving to not store owner credentials in the workers list
      const workersOnly = users.filter(u => u.username !== 'appu_muchandi');
      setStoredUsers(users);
      localStorage.setItem('workerCredentials', JSON.stringify(workersOnly));
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
        // Update existing user
        updatedUsers[existingUserIndex] = { ...updatedUsers[existingUserIndex], ...data };
        toast({ title: 'Credentials Updated!', description: `Login for ${data.username} has been updated.` });
    } else {
        // Add new user
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
                                        <TableCell>{'••••••••'}</TableCell>
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
                                                    </Description>
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
