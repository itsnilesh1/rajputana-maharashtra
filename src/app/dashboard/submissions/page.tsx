'use client';
import { useEffect, useState, Suspense } from 'react';
import { FileText, Clock, CheckCircle, XCircle, RefreshCw, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  _id: string;
  requestType: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  createdAt: string;
  updatedAt: string;
  moderatorNotes?: string;
  payload?: { title?: string; name?: string };
}

const STATUS_CONFIG: Record<string, any> = {
  pending: { label: 'Pending Review', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Clock, desc: 'Your submission is in the review queue.' },
  approved: { label: 'Approved & Live', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: CheckCircle, desc: 'Your submission has been approved and is publicly visible.' },
  rejected: { label: 'Not Approved', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: XCircle, desc: 'Your submission was not approved. See moderator notes.' },
  revision_requested: { label: 'Needs Revision', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: RefreshCw, desc: 'Please update your submission based on moderator feedback.' },
};

const TYPE_LABELS: Record<string, string> = {
  member_profile: 'Member Profile', event: 'Event', article: 'Article',
  gallery: 'Gallery Image', contact: 'Contact Form', volunteer: 'Volunteer Form',
  suggestion: 'Suggestion', announcement: 'Announcement',
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function SubmissionsContent() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(d => setSubmissions(d.submissions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const counts = submissions.reduce((acc: any, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">My Submissions</h1>
        <p className="font-sans text-white/40 text-sm">Track the status of all your submitted content</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold-dim text-white/50 hover:text-royal-gold hover:border-royal-gold/40 transition-all font-sans text-xs uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5" /> Profile
        </Link>
        <Link href="/events" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold-dim text-white/50 hover:text-royal-gold hover:border-royal-gold/40 transition-all font-sans text-xs uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5" /> Event
        </Link>
        <Link href="/contact" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold-dim text-white/50 hover:text-royal-gold hover:border-royal-gold/40 transition-all font-sans text-xs uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5" /> Contact / Suggestion
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All', count: submissions.length },
          { key: 'pending', label: 'Pending', count: counts.pending || 0 },
          { key: 'approved', label: 'Approved', count: counts.approved || 0 },
          { key: 'revision_requested', label: 'Revision', count: counts.revision_requested || 0 },
          { key: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans transition-all ${
              filter === key ? 'bg-royal-gold text-royal-black font-semibold' : 'border border-gold-dim text-white/50 hover:text-white/70 hover:border-royal-gold/40'
            }`}>
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === key ? 'bg-royal-black/20' : 'bg-white/10'}`}>{count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="royal-card rounded-2xl p-12 text-center">
          <FileText className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="font-display text-white/30 tracking-wide">No submissions found</p>
          <p className="font-sans text-white/20 text-sm mt-2">Submit your profile or an event to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(sub => {
            const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
            const StatusIcon = sc.icon;
            return (
              <div key={sub._id} className={`royal-card rounded-2xl p-6 border transition-all ${sub.status === 'revision_requested' ? 'border-orange-400/30' : 'hover:border-royal-gold/30'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-royal-gold/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-royal-gold/60" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-display text-white text-sm tracking-wide">
                          {sub.payload?.title || sub.payload?.name || TYPE_LABELS[sub.requestType] || sub.requestType}
                        </h3>
                        <span className="font-sans text-xs text-white/30 capitalize">{TYPE_LABELS[sub.requestType]}</span>
                      </div>
                      <p className="font-sans text-xs text-white/30">Submitted {timeAgo(sub.createdAt)}</p>
                      <p className="font-sans text-xs text-white/40 mt-1">{sc.desc}</p>
                      {sub.moderatorNotes && (
                        <div className={`mt-3 p-3 rounded-lg border text-xs font-sans ${
                          sub.status === 'revision_requested' ? 'bg-orange-400/5 border-orange-400/20 text-orange-300' :
                          sub.status === 'rejected' ? 'bg-red-400/5 border-red-400/20 text-red-300' :
                          'bg-green-400/5 border-green-400/20 text-green-300'}`}>
                          <span className="font-semibold block mb-1">Admin Note:</span>{sub.moderatorNotes}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans border flex-shrink-0 ${sc.color}`}>
                    <StatusIcon className="w-3 h-3" />{sc.label}
                  </span>
                </div>
                {sub.status === 'revision_requested' && (
                  <div className="mt-4 pt-4 border-t border-orange-400/20">
                    <Link href="/dashboard/profile" className="btn-ghost rounded-lg text-xs px-4 py-2 inline-block">Update Submission</Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>}>
      <SubmissionsContent />
    </Suspense>
  );
}
