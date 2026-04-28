import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Crown } from 'lucide-react';

const EVENTS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Annual Rajputana Sammelan 2025',
    date: '2025-12-15',
    endDate: '2025-12-16',
    venue: 'Shaniwar Wada Grounds, Pune',
    district: 'Pune',
    type: 'Annual Meet',
    organizer: 'Rajputana Maharashtra',
    contact: 'events@rajputana-maharashtra.org',
    description: `The Annual Rajputana Sammelan is the grandest gathering of the Rajput community across Maharashtra. This two-day event brings together families from all 9 districts for cultural programs, community discussions, felicitation ceremonies, and an opportunity to connect with your roots and your people.

This year's theme is **"Virasat aur Vikas"** — Heritage and Progress — celebrating our glorious past while forging a dynamic future for the Rajput community in Maharashtra.`,
    agenda: [
      { time: '08:00 AM', activity: 'Registration & Welcome Tea' },
      { time: '10:00 AM', activity: 'Inaugural Ceremony — Lamp Lighting & Vandemataram' },
      { time: '11:00 AM', activity: 'Cultural Keynote: "600 Years of Rajput Legacy in Maharashtra"' },
      { time: '01:00 PM', activity: 'Community Lunch (Traditional Rajput Cuisine)' },
      { time: '02:30 PM', activity: 'Panel Discussion: Youth in Community Leadership' },
      { time: '04:00 PM', activity: 'Cultural Performances — Folk Dance & Music' },
      { time: '06:00 PM', activity: 'Felicitation Ceremony — Community Excellence Awards' },
      { time: '08:00 PM', activity: 'Grand Rajput Dinner & Cultural Night' },
    ],
    highlights: [
      '800+ expected attendees from all 9 districts',
      'Traditional Rajput cuisine and cultural performances',
      'Community excellence award ceremony',
      'Heritage exhibition and photography display',
      'Youth networking session',
      'Live classical music and folk dance performances',
    ],
    banner: '',
  },
  '2': {
    id: '2',
    title: 'Navratri Mahotsav — Mumbai',
    date: '2025-10-02',
    endDate: '2025-10-11',
    venue: 'Bandra-Kurla Complex, Mumbai',
    district: 'Mumbai',
    type: 'Festival',
    organizer: 'Mumbai District Chapter',
    contact: 'mumbai@rajputana-maharashtra.org',
    description: `Nine nights of vibrant cultural celebrations featuring traditional Garba and Dandiya Raas in the true Rajput tradition. The Navratri Mahotsav is one of Mumbai's most anticipated community events, drawing thousands of participants each year.

The event features live music by renowned folk artists, traditional costume contests, prasad distribution, and a special Maa Durga Aarti each evening.`,
    agenda: [
      { time: '06:00 PM', activity: 'Evening Aarti & Prayers' },
      { time: '07:00 PM', activity: 'Garba & Dandiya Raas' },
      { time: '09:00 PM', activity: 'Live Folk Music Performance' },
      { time: '10:30 PM', activity: 'Prasad Distribution & Closing Aarti' },
    ],
    highlights: [
      'Nine nights of traditional Garba and Dandiya',
      'Live folk music by renowned artists',
      'Traditional costume contest with prizes',
      'Prasad distribution each evening',
      'Special Maa Durga Aarti',
    ],
    banner: '',
  },
};

export async function generateStaticParams() {
  return Object.keys(EVENTS).map((id) => ({ slug: id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = EVENTS[params.slug];
  return { title: event ? event.title : 'Event Not Found' };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = EVENTS[params.slug];

  if (!event) {
    return (
      <main className="bg-royal-black min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h1 className="font-display text-white text-3xl mb-4">Event Not Found</h1>
          <Link href="/events" className="text-royal-gold hover:underline font-sans text-sm">← Back to Events</Link>
        </div>
      </main>
    );
  }

  const startDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const isSameDay = endDate ? startDate.toDateString() === endDate.toDateString() : true;

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden border-b border-gold-dim/20">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-maroon/15 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-royal-gold/4 blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/events" className="inline-flex items-center gap-2 font-sans text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Events
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-block px-3 py-1 bg-royal-gold/15 text-royal-gold/80 text-xs font-sans rounded-full tracking-widest uppercase border border-royal-gold/20">
              {event.type}
            </span>
            <span className="font-sans text-xs text-white/30">{event.district} District</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl text-white tracking-wide mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Event meta */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-royal-gold/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-royal-gold" />
              </div>
              <div>
                <p className="font-sans text-xs text-white/30 uppercase tracking-wider">Date</p>
                <p className="font-sans text-sm text-white">
                  {startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {!isSameDay && endDate && (
                    <> — {endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-royal-gold/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-royal-gold" />
              </div>
              <div>
                <p className="font-sans text-xs text-white/30 uppercase tracking-wider">Venue</p>
                <p className="font-sans text-sm text-white">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-royal-gold/10 flex items-center justify-center">
                <Crown className="w-4 h-4 text-royal-gold" />
              </div>
              <div>
                <p className="font-sans text-xs text-white/30 uppercase tracking-wider">Organizer</p>
                <p className="font-sans text-sm text-white">{event.organizer}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${event.contact}`} className="btn-royal rounded-xl text-xs px-6 py-3 inline-flex items-center gap-2">
              Register Interest
            </a>
            <button className="btn-ghost rounded-xl text-xs px-6 py-3 inline-flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share Event
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="royal-card rounded-2xl p-7">
              <h2 className="font-display text-white text-xl tracking-wide mb-5">About This Event</h2>
              <div className="space-y-4">
                {event.description.split('\n\n').map((para: string, i: number) => {
                  const parts = para.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={i} className="font-serif text-white/65 leading-relaxed text-base italic">
                      {parts.map((part: string, j: number) =>
                        j % 2 === 1
                          ? <strong key={j} className="text-royal-gold not-italic font-semibold">{part}</strong>
                          : part
                      )}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Agenda */}
            {event.agenda && (
              <div className="royal-card rounded-2xl p-7">
                <h2 className="font-display text-white text-xl tracking-wide mb-5">Event Schedule</h2>
                <div className="relative">
                  <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-gold-dim/40" />
                  <div className="space-y-4">
                    {event.agenda.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-5 group">
                        <div className="w-16 flex-shrink-0 text-right">
                          <span className="font-sans text-xs text-royal-gold/60">{item.time}</span>
                        </div>
                        <div className="relative mt-0.5 flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-royal-gold/40 border-2 border-royal-black group-hover:bg-royal-gold transition-colors" />
                        </div>
                        <p className="font-sans text-sm text-white/70 group-hover:text-white/90 transition-colors pt-0.5">{item.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Highlights */}
            {event.highlights && (
              <div className="royal-card rounded-2xl p-6">
                <h3 className="font-display text-white tracking-wide mb-4">Event Highlights</h3>
                <ul className="space-y-2.5">
                  {event.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-royal-gold mt-2 flex-shrink-0" />
                      <span className="font-sans text-sm text-white/60">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick info */}
            <div className="royal-card rounded-2xl p-6">
              <h3 className="font-display text-white tracking-wide mb-4">Quick Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'District', value: event.district },
                  { label: 'Contact', value: event.contact },
                  { label: 'Organizer', value: event.organizer },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-sans text-xs text-white/30 uppercase tracking-wider">{label}</p>
                    <p className="font-sans text-sm text-white/70 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="royal-card rounded-2xl p-6 text-center">
              <Crown className="w-8 h-8 text-royal-gold/40 mx-auto mb-3" />
              <h3 className="font-display text-white tracking-wide mb-2">Attend This Event</h3>
              <p className="font-sans text-white/40 text-xs mb-4 leading-relaxed">
                All Rajput community members are welcome. Login to express your interest.
              </p>
              <Link href="/register" className="btn-royal rounded-lg text-xs px-5 py-2.5 inline-block">
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
