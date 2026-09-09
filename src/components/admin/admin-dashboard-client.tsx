'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Phone, 
  Mail,
  Calendar,
  Building2,
  Ticket,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  AlertCircle,
  Hash,
  ArrowUpRight,
  FileText,
  Trash2,
  X,
  Lock,
  Copy,
  BarChart4,
  PieChart as PieChartIcon,
  Activity,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { updateRequestStatus, deleteRequestAction } from '@/app/super-admin/actions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface Request {
  id: number;
  serialNo: string;
  submissionDate: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  country: string;
  poultryName: string;
  poultryType: string;
  capacity: number;
  website: string;
  referenceCode?: string;
  status: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface Stats {
  totalRequests: number;
  pending: number;
  verifying: number;
  onboard: number;
  rejected: number;
  layerOnboard: number;
  broilerOnboard: number;
  trend: ChartData[];
  poultryDistribution: ChartData[];
  stateDistribution: ChartData[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const COLORS = ['#065f46', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

function CopyInline({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };
  return (
    <button onClick={handleCopy} className="p-1 text-slate-300 hover:text-primary transition-colors rounded hover:bg-primary/5 ml-1 inline-flex shrink-0">
      {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export function AdminDashboardClient({ initialRequests, initialStats, pagination }: { initialRequests: any[]; initialStats: Stats; pagination: PaginationInfo; }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Deletion State
  const [deleteTarget, setDeleteTarget] = useState<Request | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return requests;
    const term = searchTerm.toLowerCase();
    return requests.filter(r => 
      (r.firstName || '').toLowerCase().includes(term) ||
      (r.lastName || '').toLowerCase().includes(term) ||
      (r.poultryName || '').toLowerCase().includes(term) ||
      (r.email || '').toLowerCase().includes(term) ||
      (r.country || '').toLowerCase().includes(term) ||
      (r.website || '').toLowerCase().includes(term)
    );
  }, [requests, searchTerm]);

  async function handleStatusChange(id: number, newStatus: string) {
    setUpdatingId(id);
    const result = await updateRequestStatus(id, newStatus);
    if (result.success) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
    setUpdatingId(null);
  }

  async function handleCopyFull(request: Request) {
    const details = `
Global Registration [${request.serialNo}]
-----------------------------------------
Name: ${request.firstName} ${request.lastName}
Email: ${request.email}
Phone: ${request.contactNumber}
Country: ${request.country}
Farm: ${request.poultryName} (${request.poultryType})
Capacity: ${request.capacity.toLocaleString()} Birds
Subdomain: ${request.website}.poultrymanager.in
    `.trim();

    try {
      await navigator.clipboard.writeText(details);
      setCopiedId(request.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {}
  }

  async function handleDeleteConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteRequestAction(deleteTarget.id, deletePassword);
    if (result.success) {
      setRequests(prev => prev.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeletePassword('');
      router.refresh();
    } else {
      setDeleteError(result.error || 'Delete failed');
    }
    setIsDeleting(false);
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-amber-500' },
    { value: 'verifying', label: 'Verifying', color: 'text-blue-500' },
    { value: 'onboard', label: 'Onboarded', color: 'text-emerald-500' },
    { value: 'rejected', label: 'Rejected', color: 'text-rose-500' },
  ];

  return (
    <>
      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: initialStats.totalRequests, icon: LayoutGrid, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Global Pending', value: initialStats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Farms', value: initialStats.onboard, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-amber-50' },
          { label: 'Layer Growth', value: initialStats.layerOnboard, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" /> Growth Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialStats.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} tickFormatter={(str) => isMounted ? format(new Date(str), 'dd MMM') : str} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#065f46" strokeWidth={4} dot={{ r: 4, fill: '#065f46', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <PieChartIcon className="h-5 w-5 text-amber-600" /> Sector Split
          </h3>
          <div className="h-[300px] w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={initialStats.poultryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {initialStats.poultryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {initialStats.poultryDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl"><ClipboardList className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-bold text-slate-900">International Leads</h2>
          </div>
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter leads..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-primary text-xs"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Farm Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Setup</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50/50 transition-colors align-top">
                  <td className="px-8 py-8">
                    <div className="space-y-3">
                      <div className="font-black text-slate-900">{request.firstName} {request.lastName}</div>
                      <div className="flex flex-col gap-1.5">
                        <a href={`mailto:${request.email}`} className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-primary transition-colors">
                          <Mail className="h-3 w-3" /> {request.email}
                        </a>
                        <a href={`tel:${request.contactNumber}`} className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-primary transition-colors">
                          <Phone className="h-3 w-3" /> {request.contactNumber}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary/40" />
                        <span className="font-black text-slate-900">{request.poultryName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg border border-primary/20 bg-primary/5 text-primary uppercase">{request.poultryType}</span>
                        <span className="text-xs font-black text-slate-600">{(request.capacity || 0).toLocaleString()} Birds</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-black text-slate-900">
                        <Globe className="h-4 w-4 text-emerald-500" />
                        {request.country}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-3">
                      <div className="bg-slate-900 text-emerald-400 px-3 py-2 rounded-lg font-mono text-[10px] border border-slate-800">
                        {request.website}.poultrymanager.in
                      </div>
                      <select 
                        value={request.status} 
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        className="w-full text-[10px] font-black px-3 py-2 rounded-lg border border-slate-200 outline-none"
                      >
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleCopyFull(request)} className="p-2 text-slate-300 hover:text-primary"><ClipboardList className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteTarget(request)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center relative">
            <button onClick={() => setDeleteTarget(null)} className="absolute top-6 right-6 p-2 text-slate-400"><X className="h-5 w-5" /></button>
            <h2 className="text-2xl font-black mb-4">Confirm Deletion</h2>
            <p className="text-slate-500 mb-8">Permanently remove the registration for {deleteTarget.poultryName}?</p>
            <form onSubmit={handleDeleteConfirm} className="space-y-4">
              <input 
                type="password" required value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Delete Verification Password"
              />
              <Button type="submit" disabled={isDeleting} className="w-full h-14 bg-rose-500 hover:bg-rose-600">{isDeleting ? 'Deleting...' : 'Delete Lead'}</Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}