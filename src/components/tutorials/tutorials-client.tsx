'use client';

import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { TutorialCard } from './tutorial-card';
import { TutorialModal } from './tutorial-modal';
import { cn } from '@/lib/utils';

const ROLES = ['All', 'General', 'Owner', 'General Manager', 'Feed Manager', 'Farm Manager', 'Egg Trader'];
const ROLE_ORDER = ['General', 'Owner', 'General Manager', 'Feed Manager', 'Farm Manager', 'Egg Trader'];

export function TutorialsClient({ tutorials: initialTutorials }: { tutorials: any[] }) {
  const [activeRole, setActiveRole] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState<any | null>(null);

  const filteredTutorials = useMemo(() => {
    let list = [...initialTutorials];

    // 1. If "All" is selected, apply the specific role sorting
    if (activeRole === 'All') {
      list.sort((a, b) => {
        const indexA = ROLE_ORDER.indexOf(a.role);
        const indexB = ROLE_ORDER.indexOf(b.role);
        
        const valA = indexA === -1 ? 999 : indexA;
        const valB = indexB === -1 ? 999 : indexB;
        
        if (valA !== valB) return valA - valB;
        
        // Secondary sort by displayOrder if roles are the same
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      });

      // Deduplicate by YouTube Video ID for the "All" view
      const seen = new Set();
      return list.filter(t => {
        if (!t.youtubeVideoId) return true;
        if (seen.has(t.youtubeVideoId)) return false;
        seen.add(t.youtubeVideoId);
        return true;
      });
    }

    // 2. If a specific role is selected, filter by that role
    return list.filter(t => t.role === activeRole);
  }, [initialTutorials, activeRole]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Learn <span className="text-primary italic">PoultryManager</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Watch step-by-step video tutorials and master every feature of the PoultryManager ERP platform.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="flex items-center justify-center mb-12 px-4">
            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap justify-center gap-1.5 max-w-5xl">
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "px-6 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                    activeRole === role 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTutorials.map((tutorial) => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial} 
                  onClick={() => setSelectedTutorial(tutorial)}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
                <Filter className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No tutorials found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => setActiveRole('All')}
                className="mt-10 px-8 py-3 bg-primary/10 text-primary rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
              >
                View all tutorials
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedTutorial && (
        <TutorialModal 
          tutorial={selectedTutorial} 
          onClose={() => setSelectedTutorial(null)} 
        />
      )}
    </div>
  );
}
