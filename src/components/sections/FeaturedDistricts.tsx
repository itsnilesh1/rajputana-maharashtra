import Link from 'next/link';
import { MapPin, Users, ArrowRight } from 'lucide-react';

const districts = [
  { name: 'Pune', slug: 'pune', region: 'Western Maharashtra', members: 1200, events: 18, color: 'from-amber-900/30 to-royal-dark' },
  { name: 'Mumbai', slug: 'mumbai', region: 'Konkan', members: 980, events: 22, color: 'from-red-900/30 to-royal-dark' },
  { name: 'Nashik', slug: 'nashik', region: 'Northern Maharashtra', members: 640, events: 12, color: 'from-yellow-900/30 to-royal-dark' },
  { name: 'Nagpur', slug: 'nagpur', region: 'Vidarbha', members: 520, events: 9, color: 'from-orange-900/30 to-royal-dark' },
  { name: 'Kolhapur', slug: 'kolhapur', region: 'Southern Maharashtra', members: 430, events: 8, color: 'from-amber-900/30 to-royal-dark' },
  { name: 'Aurangabad', slug: 'aurangabad', region: 'Marathwada', members: 380, events: 7, color: 'from-red-900/30 to-royal-dark' },
];

export default function FeaturedDistricts() {
  return (
    <section className="py-20 bg-royal-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin size={16} className="text-royal-gold" />
            <span className="text-xs font-display tracking-[0.3em] text-royal-gold uppercase">Across Maharashtra</span>
          </div>
          <h2 className="section-title text-center">District Chapters</h2>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-royal-gold" />
            <div className="w-1.5 h-1.5 rounded-full bg-royal-gold" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-royal-gold" />
          </div>
          <p className="section-subtitle mt-4 max-w-lg mx-auto">
            Our community spans across major districts of Maharashtra, united by heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {districts.map((d) => (
            <Link
              key={d.slug}
              href={`/districts/${d.slug}`}
              className={`royal-card rounded-xl p-6 group hover:border-royal-gold/50 transition-all duration-300 hover:shadow-royal bg-gradient-to-br ${d.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-royal-gold group-hover:text-royal-amber transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-royal-cream/50 font-sans mt-0.5">{d.region}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gold-dim flex items-center justify-center group-hover:border-royal-gold transition-colors">
                  <MapPin size={14} className="text-royal-gold/60 group-hover:text-royal-gold" />
                </div>
              </div>

              <div className="flex items-center gap-5 mb-5">
                <div>
                  <div className="font-display text-lg font-bold text-royal-cream/90">{d.members.toLocaleString()}</div>
                  <div className="text-[10px] text-royal-cream/40 uppercase tracking-wider font-sans flex items-center gap-1">
                    <Users size={9} /> Members
                  </div>
                </div>
                <div className="w-px h-8 bg-gold-dim" />
                <div>
                  <div className="font-display text-lg font-bold text-royal-cream/90">{d.events}</div>
                  <div className="text-[10px] text-royal-cream/40 uppercase tracking-wider font-sans">Events/Yr</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-royal-gold/60 font-display tracking-wider group-hover:text-royal-gold transition-colors">
                  View Chapter
                </span>
                <ArrowRight size={14} className="text-royal-gold/40 group-hover:text-royal-gold group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/districts" className="btn-ghost rounded-lg inline-flex items-center gap-2 text-sm">
            View All Districts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
