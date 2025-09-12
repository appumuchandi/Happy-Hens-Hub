
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: string;
}

export default function CustomerMessagesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedMessages = localStorage.getItem('customerMessages');
            if (storedMessages) {
                const parsedMessages: Message[] = JSON.parse(storedMessages);
                const fifteenDaysAgo = new Date();
                fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

                const recentMessages = parsedMessages.filter(msg => new Date(msg.timestamp) > fifteenDaysAgo);

                if(recentMessages.length !== parsedMessages.length){
                    localStorage.setItem('customerMessages', JSON.stringify(recentMessages));
                }
                setMessages(recentMessages);
            }
        }
    }, []);

    const handleDeleteMessage = (id: string) => {
        const updatedMessages = messages.filter(msg => msg.id !== id);
        setMessages(updatedMessages);
        localStorage.setItem('customerMessages', JSON.stringify(updatedMessages));
        toast({
            title: 'Message Deleted',
            description: 'The message has been successfully removed.',
        });
    }

    if (user?.role !== 'OWNER') {
        return <p className="text-destructive">You do not have permission to view this page.</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Customer Messages</h1>
                <p className="text-muted-foreground">
                    View messages from visitors on your homepage. Messages are automatically deleted after 15 days.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inbox</CardTitle>
                    <CardDescription>
                        You have {messages.length} new message{messages.length === 1 ? '' : 's'}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {messages.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {messages.map((msg) => (
                                <AccordionItem key={msg.id} value={msg.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                           <div className="flex flex-col items-start">
                                                <span className="font-semibold">{msg.name}</span>
                                                <span className="text-sm text-muted-foreground">{msg.email}</span>
                                           </div>
                                            <span className="text-xs text-muted-foreground">
                                                {format(parseISO(msg.timestamp), 'PPP')} ({15 - differenceInDays(new Date(), parseISO(msg.timestamp))} days left)
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 bg-muted/50 rounded-md">
                                             <p className="whitespace-pre-wrap">{msg.message}</p>
                                             <div className="flex justify-end gap-2 mt-4">
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`mailto:${msg.email}?subject=RE: Inquiry from HEN's HUB`}>
                                                        <Mail className="mr-2"/>
                                                        Reply via Email
                                                    </a>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteMessage(msg.id)} disabled={user?.role !== 'OWNER'}>
                                                    <Trash2 className="mr-2"/>
                                                    Delete
                                                </Button>
                                             </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Mail className="mx-auto h-12 w-12" />
                            <p className="mt-4">No new messages.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
