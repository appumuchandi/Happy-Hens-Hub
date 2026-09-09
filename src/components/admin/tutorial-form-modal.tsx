'use client';

import React, { useState } from 'react';
import { X, Save, Loader2, Youtube, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { upsertTutorial } from '@/app/super-admin/tutorials/actions';

const ROLES = ['General', 'Owner', 'General Manager', 'Feed Manager', 'Farm Manager', 'Egg Trader'];

export function TutorialFormModal({ 
  tutorial, 
  onClose, 
  onSuccess 
}: { 
  tutorial?: any; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    id: tutorial?.id || null,
    title: tutorial?.title || '',
    description: tutorial?.description || '',
    youtubeUrl: tutorial?.youtubeUrl || '',
    role: tutorial?.role || 'General',
    keywords: tutorial?.keywords || '',
    displayOrder: tutorial?.displayOrder || 0,
    isPublished: tutorial ? tutorial.isPublished === 1 : true
  });

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await upsertTutorial(formData);
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to save tutorial');
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Youtube className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{tutorial ? 'Edit Tutorial' : 'Add New Tutorial'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-10 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Video Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm"
                placeholder="How to setup your first batch"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">YouTube URL</label>
              <input 
                required
                value={formData.youtubeUrl}
                onChange={e => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm resize-none"
                placeholder="Briefly explain what this video covers..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Category</label>
              <select 
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm bg-white"
              >
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Order</label>
              <input 
                type="number"
                value={formData.displayOrder}
                onChange={e => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Keywords (Comma separated)</label>
              <input 
                value={formData.keywords}
                onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm"
                placeholder="FCR, Batch, Onboarding..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <input 
              id="published"
              type="checkbox"
              checked={formData.isPublished}
              onChange={e => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="h-5 w-5 rounded-lg border-slate-200 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="published" className="text-sm font-bold text-slate-600 cursor-pointer">
              Publish immediately to the Learning Center
            </label>
          </div>

          {/* Action Buttons - Part of scrollable area but at the bottom */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-auto">
            <Button variant="ghost" type="button" onClick={onClose} className="rounded-full px-8">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit" className="rounded-full px-10 h-12 gap-2 shadow-lg shadow-primary/20">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {tutorial ? 'Update Tutorial' : 'Save Tutorial'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
