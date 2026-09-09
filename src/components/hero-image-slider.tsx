'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// We append a version parameter (?v=4) to force the browser and Next.js to bypass cached versions of these images
const images = [
  '/images/hero-dashboard.png?v=4',
  '/images/hero-dashboard2.png?v=4',
  '/images/hero-dashboard3.png?v=4',
  '/images/hero-dashboard4.png?v=4',
];

export function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const handleManualNext = () => {
    setIsAutoPlaying(false);
    nextImage();
  };

  const handleManualPrev = () => {
    setIsAutoPlaying(false);
    prevImage();
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, nextImage]);

  return (
    <div className="relative w-full overflow-hidden aspect-[16/10] bg-slate-50 group">
      {/* Images */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={src}
            alt={`PoultryManager Dashboard View ${index + 1}`}
            fill
            priority={index === 0}
            className="object-contain"
          />
        </div>
      ))}

      {/* Navigation Buttons - Visible on Hover */}
      <div className="absolute inset-0 z-20 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleManualPrev}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-md text-slate-800 shadow-xl border border-white/50 pointer-events-auto transition-all hover:scale-110 active:scale-95"
          aria-label="Previous dashboard image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleManualNext}
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-md text-slate-800 shadow-xl border border-white/50 pointer-events-auto transition-all hover:scale-110 active:scale-95"
          aria-label="Next dashboard image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots/Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(i);
            }}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
              i === currentIndex 
                ? 'w-6 sm:w-8 bg-primary shadow-sm' 
                : 'w-1.5 sm:w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to dashboard view ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
