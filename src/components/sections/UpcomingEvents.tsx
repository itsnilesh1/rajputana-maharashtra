import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ChevronRight } from 'lucide-react';

const events = [
  {
    title: 'Annual Rajputana Sammelan 2025',
    date: '2025-12-15',
    district: 'Pune',
    venue: 'Shaniwar Wada Grounds',
    type: 'Annual Meet',
  },
  {
    title: 'Navratri Mahotsav — Mumbai',
    date: '2025-10-02',
    district: 'Mumbai',
    venue: 'Bandra-Kurla Complex',
    type: 'Festival',
  },
  {
    title: 'Youth Leadership Summit',
    date: '2025-11-20',
    district: 'Pune',
    venue: 'MIT College Auditorium',
    type: 'Youth',
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-3">
              What&apos;s Coming
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide">
              Upcoming <span className="gold-text">Events</span>
            </h2>
            <div className="w-24 h-0.5 bg-gold-gradient mt-4" />
          </div>
          <Link
            href="/events"
            className="hidden md:flex items-center gap-2 text-royal-gold/60 hover:text-royal-gold font-sans text-sm transition-colors"
          >
            All Events <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((ev, i) => {
            const d = new Date(ev.date);
            return (
              <div
                key={i}
                className="royal-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-royal-gold/40 transition-all duration-300 group"
              >
                <div className="flex items-center gap-6">
                  {/* Date block */}
                  <div className="w-16 h-16 rounded-xl bg-royal-maroon/40 border border-royal-gold/20 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="font-display text-royal-gold text-xl leading-none">
                      {d.getDate()}
                    </span>
                    <span className="font-sans text-white/50 text-xs mt-0.5">
                      {d.toLocaleString('en-IN', { month: 'short' })}
                    </span>
                    <span className="font-sans text-white/30 text-xs">{d.getFullYear()}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-royal-gold/10 text-royal-gold/70 text-xs font-sans rounded-full">
                        {ev.type}
                      </span>
                    </div>
                    <h3 className="font-display text-white text-base group-hover:text-royal-gold transition-colors tracking-wide">
                      {ev.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 font-sans text-xs text-white/40">
                        <MapPin className="w-3 h-3" /> {ev.venue}
                      </span>
                      <span className="font-sans text-xs text-white/25">{ev.district} District</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/events"
                  className="btn-ghost rounded-lg text-xs px-4 py-2 whitespace-nowrap flex-shrink-0"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link href="/events" className="btn-ghost rounded-xl text-xs px-6 py-3 inline-flex items-center gap-2">
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
