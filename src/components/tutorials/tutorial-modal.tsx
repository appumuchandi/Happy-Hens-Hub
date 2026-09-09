'use client';

import React from 'react';
import { X, PlayCircle } from 'lucide-react';

interface Tutorial {
  title: string;
  description: string;
  youtubeVideoId: string;
  role: string;
}

export function TutorialModal({ 
  tutorial, 
  onClose 
}: { 
  tutorial: Tutorial; 
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-5xl w-full shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2.5 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 rounded-full transition-all backdrop-blur-md"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${tutorial.youtubeVideoId}?autoplay=1`}
              title={tutorial.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="lg:col-span-4 p-10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <PlayCircle className="h-3.5 w-3.5" />
              {tutorial.role} Tutorial
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              {tutorial.title}
            </h2>
            
            <div className="h-1 w-12 bg-primary/20 mb-6 rounded-full" />
            
            <p className="text-slate-600 leading-relaxed text-sm">
              {tutorial.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
