
import React from 'react';
import { notFound } from 'next/navigation';
import { getAllSettings } from '@/lib/db';
import { PricingClient } from '@/components/pricing/pricing-client';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const settings = getAllSettings();
  const isPricingEnabled = settings.NEXT_PUBLIC_PRICING_PAGE !== 'OFF';

  if (!isPricingEnabled) {
    notFound();
  }

  return <PricingClient settings={settings} />;
}
