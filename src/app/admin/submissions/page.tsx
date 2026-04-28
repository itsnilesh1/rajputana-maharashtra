'use client';
import { useEffect, useState, Suspense } from 'react';
import { FileCheck, Clock, CheckCircle, XCircle, RefreshCw, Eye, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

type Status = 'pending' | 'approved' | 'rejected' | 'revision_requested';

interface Submission {
  _id: string;
  requestType: string;
  submittedBy: { name: string; email: string };
  payload: Record<string, any>;
  status: Status;
  moderatorNotes: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, any> = {
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Clock },
  approved: { label: 'Approved', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: XCircle },
  revision_requested: { label: 'Revision', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: RefreshCw },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSubmissions(); }, [statusFilter, typeFilter]);

  const counts = submissions.reduce((acc: any, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  async function handleAction(action: 'approve' | 'reject' | 'request_revision') {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${selected._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, moderatorNotes: notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Submission ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent for revision'}!`);
      setSelected(null);
      setNotes('');
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">Submissions</h1>
        <p className="font-sans text-white/40 text-sm">Review and moderate all community submissions</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All', count: submissions.length },
          { key: 'pending', label: 'Pending', count: counts.pending || 0 },
          { key: 'approved', label: 'Approved', count: counts.approved || 0 },
          { key: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
          { key: 'revision_requested', label: 'Revision', count: counts.revision_requested || 0 },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans transition-all ${
              statusFilter === key ? 'bg-royal-gold text-royal-black font-semibold' : 'border border-gold-dim text-white/50 hover:text-white/70'
            }`}>
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${statusFilter === key ? 'bg-royal-black/20' : 'bg-white/10'}`}>{count}</span>
          </button>
        ))}
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="ml-auto px-4 py-2 rounded-xl bg-royal-dark border border-gold-dim text-white/60 font-sans text-sm focus:outline-none">
          {['all','member_profile','event','article','gallery','contact','volunteer','suggestion'].map((t) => (
            <option key={t} value={t} className="bg-royal-dark capitalize">{t === 'all' ? 'All Types' : t.replace('_',' ')}</option>
          ))}
        </select>
      </div>

      <div className={`grid gap-6 ${selected ? 'lg:grid-cols-2' : ''}`}>
        <div className="royal-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-royal-gold animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-dim/20">
                    {['Submitter','Type','Status','Submitted',''].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-sans text-xs text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <FileCheck className="w-10 h-10 text-white/15 mx-auto mb-3" />
                        <p className="font-display text-white/25 tracking-wide">No submissions found</p>
                        <p className="font-sans text-white/15 text-xs mt-1">When users submit profiles, events or gallery — they appear here</p>
                      </td>
                    </tr>
                  ) : submissions.map((sub) => {
                    const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={sub._id}
                        className={`border-b border-gold-dim/10 hover:bg-royal-gold/3 cursor-pointer transition-colors ${selected?._id === sub._id ? 'bg-royal-gold/5' : ''}`}
                        onClick={() => { setSelected(sub === selected ? null : sub); setNotes(''); }}>
                        <td className="px-5 py-4">
                          <p className="font-sans text-sm text-white">{sub.submittedBy?.name || 'Unknown'}</p>
                          <p className="font-sans text-xs text-white/35">{sub.submittedBy?.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 bg-royal-gold/10 text-royal-gold/70 text-xs font-sans rounded-full capitalize">
                            {sub.requestType?.replace('_',' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans border ${sc.color}`}>
                            <StatusIcon className="w-3 h-3" />{sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-sans text-xs text-white/35">{timeAgo(sub.createdAt)}</td>
                        <td className="px-5 py-4">
                          <Eye className="w-4 h-4 text-royal-gold/40" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div className="royal-card rounded-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-white text-lg tracking-wide capitalize">
                  {selected.requestType?.replace('_',' ')} Review
                </h3>
                <p className="font-sans text-xs text-white/40 mt-1">
                  by <span className="text-white/60">{selected.submittedBy?.name}</span> · {timeAgo(selected.createdAt)}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/60"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-royal-black/40 rounded-xl p-4 border border-gold-dim/20 max-h-60 overflow-y-auto">
              <h4 className="font-sans text-xs text-white/40 uppercase tracking-widest mb-3">Submitted Data</h4>
              <div className="space-y-2">
                {Object.entries(selected.payload || {}).map(([k, v]) =>
                  v ? (
                    <div key={k} className="grid grid-cols-5 gap-2">
                      <span className="font-sans text-xs text-white/30 capitalize col-span-2">{k.replace('_',' ')}:</span>
                      <span className="font-sans text-xs text-white/70 col-span-3 break-all">{String(v)}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Moderator Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="Add notes for the submitter..."
                className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 resize-none" />
            </div>

            {selected.status === 'pending' ? (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleAction('approve')} disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/40 text-green-400 rounded-xl font-sans text-sm hover:bg-green-500/30 disabled:opacity-50">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => handleAction('request_revision')} disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-xl font-sans text-sm hover:bg-orange-500/30 disabled:opacity-50">
                  <AlertTriangle className="w-4 h-4" /> Revision
                </button>
                <button onClick={() => handleAction('reject')} disabled={actionLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl font-sans text-sm hover:bg-red-500/30 disabled:opacity-50">
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            ) : (
              <div className={`p-3 rounded-xl border text-sm font-sans ${STATUS_CONFIG[selected.status]?.color}`}>
                This submission has been <strong>{selected.status.replace('_',' ')}</strong>.
                {selected.moderatorNotes && <p className="mt-1 text-xs opacity-80">Note: {selected.moderatorNotes}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSubmissionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>}>
      <SubmissionsContent />
    </Suspense>
  );
}
