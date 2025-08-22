
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';
import Image from 'next/image';

export default function CctvPage() {
  const { user } = useAuth();

  if (user?.role !== 'OWNER') {
    return <p className="text-destructive">You do not have permission to view this page.</p>;
  }

  const cameraFeeds = [
    { id: 1, name: 'Coop Entrance', hint: 'security camera' },
    { id: 2, name: 'Feeding Area', hint: 'farm animals' },
    { id: 3, name: 'Perimeter - North', hint: 'farm field' },
    { id: 4, name: 'Storage Barn', hint: 'barn interior' },
  ];

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
            <CardHeader className="flex flex-row items-center gap-2 bg-muted/50 py-3 px-4">
              <Video className="w-5 h-5 text-foreground" />
              <CardTitle className="text-lg font-semibold">{feed.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-card flex items-center justify-center">
                 <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={`Live feed for ${feed.name}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    data-ai-hint={feed.hint}
                  />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
