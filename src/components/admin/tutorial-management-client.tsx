
'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Youtube, 
  LayoutGrid,
  Hash,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteTutorial, togglePublishStatus } from '@/app/super-admin/tutorials/actions';
import { TutorialFormModal } from './tutorial-form-modal';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function TutorialManagementClient({ initialTutorials }: { initialTutorials: any[] }) {
  const [tutorials, setTutorials] = useState(initialTutorials);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTutorial, setEditingTutorial] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTutorials = tutorials.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      await deleteTutorial(id);
      setTutorials(prev => prev.filter(t => t.id !== id));
    }
  }

  async function handleTogglePublish(id: number, current: number) {
    await togglePublishStatus(id, current);
    setTutorials(prev => prev.map(t => t.id === id ? { ...t, isPublished: current === 1 ? 0 : 1 } : t));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-white font-medium text-sm"
          />
        </div>
        
        <Button 
          onClick={() => { setEditingTutorial(null); setIsModalOpen(true); }}
          className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Tutorial
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutorial Title</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Order</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTutorials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">
                    No tutorials found. Add your first tutorial to get started.
                  </td>
                </tr>
              ) : (
                filteredTutorials.map((tutorial) => (
                  <tr key={tutorial.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="relative w-24 aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <Image src={tutorial.thumbnail} alt="" fill className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <Youtube className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{tutorial.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <a 
                            href={tutorial.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] font-medium text-slate-400 hover:text-primary flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            YouTube Link
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        {tutorial.role}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 font-black text-xs">
                        <Hash className="h-3 w-3" />
                        {tutorial.displayOrder}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button 
                        onClick={() => handleTogglePublish(tutorial.id, tutorial.isPublished)}
                        className={cn(
                          "p-2 rounded-xl transition-all",
                          tutorial.isPublished === 1 ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100" : "text-slate-300 bg-slate-50 hover:bg-slate-100"
                        )}
                        title={tutorial.isPublished === 1 ? "Click to Unpublish" : "Click to Publish"}
                      >
                        {tutorial.isPublished === 1 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingTutorial(tutorial); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(tutorial.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TutorialFormModal 
          tutorial={editingTutorial} 
          onClose={() => { setIsModalOpen(false); setEditingTutorial(null); }} 
          onSuccess={() => { window.location.reload(); }}
        />
      )}
    </div>
  );
}
