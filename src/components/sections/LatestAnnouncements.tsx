import Link from 'next/link';
import { Megaphone, ArrowRight, AlertTriangle, Info, Star } from 'lucide-react';

async function getAnnouncements() {
  // Sample data — in production fetched from DB
  return [
    {
      _id: '1',
      title: 'Annual Rajput Sammelan 2024 – Registration Open',
      content: 'The grand Annual Rajput Sammelan will be held in Pune this year. All community members are welcome.',
      priority: 'high',
      createdAt: new Date('2024-11-15'),
    },
    {
      _id: '2',
      title: 'New Heritage Museum Partnership Announced',
      content: 'Rajputana Maharashtra has partnered with the Maharashtra State Museum to preserve Rajput artifacts.',
      priority: 'medium',
      createdAt: new Date('2024-11-10'),
    },
    {
      _id: '3',
      title: 'Community Blood Donation Drive – December 2024',
      content: 'Participate in our community blood donation drive across all districts this December.',
      priority: 'low',
      createdAt: new Date('2024-11-08'),
    },
  ];
}

const priorityConfig = {
  high: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20 border-red-800/30', label: 'Urgent' },
  medium: { icon: Star, color: 'text-royal-gold', bg: 'bg-royal-gold/10 border-gold-dim', label: 'Important' },
  low: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800/30', label: 'General' },
};

export default async function LatestAnnouncements() {
  const announcements = await getAnnouncements();

  return (
    <section className="py-20 bg-royal-black pattern-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Megaphone size={16} className="text-royal-gold" />
              <span className="text-xs font-display tracking-[0.3em] text-royal-gold uppercase">Community Updates</span>
            </div>
            <h2 className="section-title">Latest Announcements</h2>
            <div className="h-px w-20 bg-gradient-to-r from-royal-gold to-transparent mt-3" />
          </div>
          <Link href="/announcements" className="hidden md:flex items-center gap-2 text-xs text-royal-gold/70 hover:text-royal-gold transition-colors font-display tracking-wider">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {announcements.map((ann) => {
            const config = priorityConfig[ann.priority as keyof typeof priorityConfig];
            const Icon = config.icon;
            return (
              <div
                key={ann._id}
                className={`royal-card p-5 flex items-start gap-4 hover:border-royal-gold/40 transition-all duration-300 group cursor-pointer rounded-xl border ${config.bg}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-royal-dark`}>
                  <Icon size={15} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <h3 className="font-display text-sm font-semibold text-royal-cream/90 group-hover:text-royal-gold transition-colors">
                      {ann.title}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-display tracking-wider ${config.color} bg-royal-dark border border-current/20`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-royal-cream/55 font-sans leading-relaxed line-clamp-2">
                    {ann.content}
                  </p>
                </div>
                <div className="text-[10px] text-royal-cream/30 whitespace-nowrap font-sans flex-shrink-0">
                  {ann.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/announcements" className="btn-ghost py-2 px-6 text-xs rounded-lg inline-flex items-center gap-2">
            View All Announcements <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
