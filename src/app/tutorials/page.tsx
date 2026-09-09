import React from 'react';
import { notFound } from 'next/navigation';
import { getPublicSettings } from '@/lib/db';
import { getPublishedTutorials } from './actions';
import { TutorialsClient } from '@/components/tutorials/tutorials-client';

export const dynamic = 'force-dynamic';

export default async function TutorialsPage() {
  const settings = getPublicSettings();
  const isTutorialsEnabled = settings.NEXT_PUBLIC_TUTORIALS_PAGE !== 'OFF';

  if (!isTutorialsEnabled) {
    notFound();
  }

  const result = await getPublishedTutorials();
  
  return <TutorialsClient tutorials={result.tutorials} />;
}
