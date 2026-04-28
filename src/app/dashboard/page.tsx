import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import SubmissionRequest from '@/models/SubmissionRequest';
import MemberProfile from '@/models/MemberProfile';
import { Crown, User, FileText, Clock, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';

const STATUS_CONFIG: Record<string, any> = {
  pending: { label: 'Pending Review', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Clock },
  approved: { label: 'Approved', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: XCircle },
  revision_requested: { label: 'Needs Revision', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: RefreshCw },
};

function timeAgo(d: Date) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  await dbConnect();
  const [submissions, profile] = await Promise.all([
    SubmissionRequest.find({ submittedBy: session.user.id }).sort({ createdAt: -1 }).limit(5).lean(),
    MemberProfile.findOne({ user: session.user.id }).lean(),
  ]);

  const counts = (submissions as any[]).reduce((acc: any, s: any) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="royal-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-maroon/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-royal-gold/5 blur-2xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-royal-maroon/50 border-2 border-royal-gold/40 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-royal-gold text-2xl">{session.user.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-1">Welcome back</p>
            <h1 className="font-display text-2xl text-white tracking-wide">{session.user.name}</h1>
            <p className="font-sans text-white/40 text-sm mt-0.5">{session.user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-royal-gold/15 text-royal-gold/70 text-xs font-sans rounded-full capitalize">{session.user.role}</span>
          </div>
          {!(profile as any) && (
            <div className="ml-auto hidden md:block">
              <Link href="/dashboard/profile" className="btn-royal rounded-xl text-xs px-5 py-2.5 inline-flex items-center gap-2">
                <User className="w-4 h-4" /> Create Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Profile status banner */}
      {!(profile as any) && (
        <div className="flex items-center gap-4 p-4 bg-royal-gold/10 border border-royal-gold/30 rounded-xl">
          <Crown className="w-5 h-5 text-royal-gold flex-shrink-0" />
          <p className="font-sans text-sm text-white/70">
            You haven&apos;t created your community profile yet.{' '}
            <Link href="/dashboard/profile" className="text-royal-gold underline hover:text-royal-amber">Create it now</Link>
            {' '}to appear in the member directory after admin approval.
          </p>
        </div>
      )}
      {(profile as any) && (profile as any).approvalStatus === 'pending' && (
        <div className="flex items-center gap-4 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
          <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="font-sans text-sm text-yellow-300">Your profile is <strong>pending admin review</strong>. It will appear publicly once approved.</p>
        </div>
      )}
      {(profile as any) && (profile as any).approvalStatus === 'approved' && (
        <div className="flex items-center gap-4 p-4 bg-green-400/10 border border-green-400/30 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="font-sans text-sm text-green-300">Your profile is <strong>live</strong> in the community directory!</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: submissions.length, color: 'text-white' },
          { label: 'Pending', value: counts.pending || 0, color: 'text-yellow-400' },
          { label: 'Approved', value: counts.approved || 0, color: 'text-green-400' },
          { label: 'Need Revision', value: counts.revision_requested || 0, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="royal-card rounded-xl p-4 text-center">
            <p className={`font-display text-2xl ${color}`}>{value}</p>
            <p className="font-sans text-xs text-white/35 uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: 'My Profile', desc: 'Create or update your member profile', href: '/dashboard/profile', icon: User },
          { title: 'My Submissions', desc: 'View and track submitted content', href: '/dashboard/submissions', icon: FileText },
          { title: 'Submit an Event', desc: 'Propose a community event', href: '/events', icon: Crown },
        ].map(({ title, desc, href, icon: Icon }) => (
          <Link key={title} href={href} className="royal-card rounded-2xl p-6 hover:border-royal-gold/40 transition-all group flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-royal-gold/10 flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-royal-gold" />
            </div>
            <h3 className="font-display text-white tracking-wide mb-2 group-hover:text-royal-gold transition-colors">{title}</h3>
            <p className="font-sans text-white/40 text-sm flex-1">{desc}</p>
            <span className="inline-flex items-center gap-2 mt-4 text-royal-gold/50 group-hover:text-royal-gold font-sans text-xs transition-colors">
              Go <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      {submissions.length > 0 && (
        <div className="royal-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-white tracking-wide">Recent Submissions</h2>
            <Link href="/dashboard/submissions" className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {(submissions as any[]).map((sub: any) => {
              const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
              const StatusIcon = sc.icon;
              return (
                <div key={sub._id.toString()} className="flex items-center justify-between py-3 border-b border-gold-dim/15 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-royal-gold/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-royal-gold/60" />
                    </div>
                    <div>
                      <p className="font-sans text-sm text-white capitalize">{sub.requestType?.replace('_', ' ')}</p>
                      <p className="font-sans text-xs text-white/30">{timeAgo(sub.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans border ${sc.color}`}>
                    <StatusIcon className="w-3 h-3" />{sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
