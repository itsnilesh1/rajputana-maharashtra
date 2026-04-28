'use client';
import { useEffect, useState } from 'react';
import { Users, FileCheck, Calendar, BookOpen, Clock, CheckCircle, Crown, AlertCircle, Loader2, Activity } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalMembers: number;
  totalEvents: number;
  totalArticles: number;
  pendingSubmissions: number;
  approvedThisMonth: number;
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers:0, totalMembers:0, totalEvents:0, totalArticles:0, pendingSubmissions:0, approvedThisMonth:0 });
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/submissions?status=pending').then(r => r.json()),
    ]).then(([sd, pd]) => {
      if (sd.stats) setStats(sd.stats);
      if (pd.submissions) setPending(pd.submissions.slice(0,5));
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const statCards = [
    { label:'Total Users', value:stats.totalUsers, icon:Users, color:'text-blue-400', href:'/admin/users' },
    { label:'Active Members', value:stats.totalMembers, icon:Crown, color:'text-royal-gold', href:'/admin/submissions' },
    { label:'Published Events', value:stats.totalEvents, icon:Calendar, color:'text-purple-400', href:'/admin/events' },
    { label:'Articles', value:stats.totalArticles, icon:BookOpen, color:'text-green-400', href:'/admin/articles' },
    { label:'Pending Review', value:stats.pendingSubmissions, icon:Clock, color:'text-yellow-400', href:'/admin/submissions?status=pending' },
    { label:'Approved This Month', value:stats.approvedThisMonth, icon:CheckCircle, color:'text-emerald-400', href:'/admin/submissions?status=approved' },
  ];

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">Admin Dashboard</h1>
        <p className="font-sans text-white/40 text-sm">Manage submissions, users, and community content</p>
      </div>

      {stats.pendingSubmissions > 0 && (
        <div className="flex items-center gap-4 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="font-sans text-sm text-yellow-300">
            <span className="font-semibold">{stats.pendingSubmissions} submissions</span> are awaiting review.{' '}
            <Link href="/admin/submissions?status=pending" className="underline hover:text-yellow-200">Review now →</Link>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="royal-card rounded-2xl p-5 hover:border-royal-gold/40 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="font-sans text-xs text-white/20 group-hover:text-white/40">→</span>
            </div>
            <p className="font-display text-2xl text-white mb-1">{value.toLocaleString()}</p>
            <p className="font-sans text-xs text-white/40 uppercase tracking-wider">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="royal-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-white tracking-wide">Recent Pending</h2>
            <Link href="/admin/submissions?status=pending" className="font-sans text-xs text-royal-gold/60 hover:text-royal-gold">View All</Link>
          </div>
          {pending.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck className="w-8 h-8 text-white/15 mx-auto mb-2" />
              <p className="font-sans text-white/25 text-sm">No pending submissions</p>
            </div>
          ) : pending.map((sub: any) => (
            <div key={sub._id} className="flex items-center justify-between py-3 border-b border-gold-dim/15 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-royal-gold/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-royal-gold/60" />
                </div>
                <div>
                  <p className="font-sans text-sm text-white">{sub.submittedBy?.name || 'Unknown'}</p>
                  <p className="font-sans text-xs text-white/35 capitalize">{sub.requestType?.replace('_',' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs text-white/30">{timeAgo(sub.createdAt)}</span>
                <Link href="/admin/submissions" className="px-3 py-1 text-xs font-sans border border-royal-gold/30 text-royal-gold/70 rounded-lg hover:bg-royal-gold/10">Review</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="royal-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-royal-gold" />
            <h2 className="font-display text-white tracking-wide">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Review Submissions', href:'/admin/submissions', icon:FileCheck },
              { label:'Manage Users', href:'/admin/users', icon:Users },
              { label:'Post Announcement', href:'/admin/announcements', icon:BookOpen },
              { label:'Manage Events', href:'/admin/events', icon:Calendar },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gold-dim hover:border-royal-gold/40 hover:bg-royal-gold/5 transition-all text-center group">
                <Icon className="w-5 h-5 text-royal-gold/60 group-hover:text-royal-gold" />
                <span className="font-sans text-xs text-white/50 group-hover:text-white/70">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
