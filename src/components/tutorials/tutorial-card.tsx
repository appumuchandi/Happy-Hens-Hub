
'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Clock, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tutorial {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  role: string;
  createdAt: string;
}

export function TutorialCard({ 
  tutorial, 
  onClick 
}: { 
  tutorial: Tutorial; 
  onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={tutorial.thumbnail} 
          alt={tutorial.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-2xl scale-90 group-hover:scale-100 transition-all duration-500">
            <Play className="h-7 w-7 fill-current ml-1" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            {tutorial.role}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
          {tutorial.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
          {tutorial.description}
        </p>
        
        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <User className="h-3 w-3" />
            {tutorial.role}
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Calendar className="h-3 w-3" />
            {new Date(tutorial.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </div>
        </div>
      </div>
    </div>
  );
}
