
'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Ticket, Hash, Loader2, User, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addReferenceCode, deleteReferenceCode } from '@/app/super-admin/reference-codes/actions';
import { format } from 'date-fns';

export function ReferenceCodeClient({ initialCodes }: { initialCodes: any[] }) {
  const [codes, setCodes] = useState(initialCodes);
  const [partnerName, setPartnerName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!partnerName.trim() || !customCode.trim()) return;

    if (customCode.length !== 6) {
      setError('Code must be exactly 6 characters.');
      return;
    }

    setIsPending(true);
    setError(null);

    const result = await addReferenceCode(customCode, partnerName);
    if (result.success) {
      setPartnerName('');
      setCustomCode('');
      // Optimistically reload list or wait for revalidatePath
      window.location.reload();
    } else {
      setError(result.error || 'Failed to add code');
    }
    setIsPending(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Permanently delete this reference code?')) return;
    
    const result = await deleteReferenceCode(id);
    if (result.success) {
      setCodes(prev => prev.filter(c => c.id !== id));
    }
  }

  return (
    <div className="space-y-8">
      {/* Add New Code Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add New Partner Code
        </h2>
        
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reference Code (6 Letters)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="E.G. SUMMER"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6))}
                  className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-mono font-black text-sm"
                  required
                  maxLength={6}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Partner Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Partner or Representative Name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {error ? (
              <p className="text-xs text-rose-500 font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 font-medium">Assign a unique 6-character code to your partners.</p>
            )}
            <Button 
              type="submit" 
              disabled={isPending || !partnerName.trim() || customCode.length !== 6}
              className="rounded-xl h-12 px-8 font-bold gap-2 w-full sm:w-auto"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
              Save Reference Code
            </Button>
          </div>
        </form>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Reference Codes</h2>
          <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-1 rounded-lg">
            {codes.length} TOTAL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Created On</th>
                <th className="px-8 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-400 italic text-sm">
                    No active codes found. Add one above.
                  </td>
                </tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-xl font-mono font-black text-sm">
                        <Hash className="h-3 w-3" />
                        {c.code}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <User className="h-4 w-4 text-slate-300" />
                        {c.partnerName}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(c.createdAt), 'dd MMM, yyyy')}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
