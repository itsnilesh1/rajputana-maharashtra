'use client';
import { useState, useEffect, Suspense } from 'react';
import { Calendar, MapPin, Search, Plus, Loader2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const DISTRICTS = ['All','Pune','Mumbai','Nashik','Nagpur','Kolhapur','Jalgaon','Satara','Solapur','Ahmednagar'];

function EventsContent() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('All');
  const [search, setSearch] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  async function fetchEvents() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (district !== 'All') params.set('district', district);
      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      let evs = data.events || [];
      if (search) evs = evs.filter((e: any) =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.venue?.toLowerCase().includes(search.toLowerCase())
      );
      setEvents(evs);
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { fetchEvents(); }, [district]);

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">What's Happening</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">Community <span className="gold-text">Events</span></h1>
          <div className="w-24 h-0.5 bg-gold-gradient mx-auto mb-6" />
          <p className="font-serif text-lg text-white/55 italic mb-6">Join gatherings, festivals, and cultural programs across all districts.</p>
          {session && (
            <button onClick={() => setShowSubmit(true)} className="btn-royal rounded-xl text-sm px-6 py-3 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Submit an Event
            </button>
          )}
        </div>
      </section>

      <section className="py-6 px-4 border-y border-gold-dim/20 bg-royal-dark/30 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchEvents()}
              placeholder="Search events..."
              className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {DISTRICTS.map(d => (
              <button key={d} onClick={() => setDistrict(d)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs uppercase tracking-wider transition-all ${
                  district === d ? 'bg-royal-gold text-royal-black font-semibold' : 'border border-gold-dim text-white/50 hover:text-royal-gold hover:border-royal-gold/50'
                }`}>{d}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-display text-white/30 tracking-wide">No events found</p>
            </div>
          ) : events.map((event: any) => {
            const d = new Date(event.date);
            return (
              <div key={event._id} className="royal-card rounded-2xl p-6 md:p-8 hover:border-royal-gold/40 transition-all group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-royal-maroon/40 border border-royal-gold/20 flex flex-col items-center justify-center">
                      <span className="font-display text-royal-gold text-xl leading-none">{d.getDate()}</span>
                      <span className="font-sans text-white/50 text-xs mt-1">{d.toLocaleString('en-IN',{month:'short'})}</span>
                      <span className="font-sans text-white/30 text-xs">{d.getFullYear()}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-white text-lg md:text-xl tracking-wide mb-3 group-hover:text-royal-gold transition-colors">{event.title}</h3>
                    <p className="font-serif text-white/50 italic text-sm leading-relaxed mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-2 font-sans text-xs text-white/40"><MapPin className="w-3.5 h-3.5 text-royal-gold/40" />{event.venue}</span>
                      <span className="flex items-center gap-2 font-sans text-xs text-white/40"><Clock className="w-3.5 h-3.5 text-royal-gold/40" />{event.district} District</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link href={`/events/${event._id}`} className="btn-ghost rounded-lg text-xs px-4 py-2 whitespace-nowrap">View Details</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {showSubmit && <EventSubmitModal onClose={() => setShowSubmit(false)} onSuccess={fetchEvents} />}
    </main>
  );
}

function EventSubmitModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ title:'', date:'', venue:'', district:'Pune', description:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(f => ({...f,[k]:e.target.value}));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/events', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      toast.success('Event submitted for review!');
      onSuccess();
    } catch (err: any) { toast.error(err.message || 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-royal-black/80 backdrop-blur-sm">
      <div className="royal-card rounded-2xl p-8 w-full max-w-lg border border-gold-dim">
        {done ? (
          <div className="text-center py-6">
            <Calendar className="w-12 h-12 text-royal-gold mx-auto mb-4" />
            <h3 className="font-display text-white text-xl mb-2">Event Submitted!</h3>
            <p className="font-serif text-white/50 italic text-sm mb-5">Pending admin review before publishing.</p>
            <button onClick={onClose} className="btn-royal rounded-xl text-sm px-6 py-2.5">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-white text-xl tracking-wide">Submit an Event</h3>
              <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              {[{label:'Event Title',key:'title',type:'text',ph:'e.g. Navratri Celebration 2025'},{label:'Date',key:'date',type:'date',ph:''},{label:'Venue',key:'venue',type:'text',ph:'Full address'}].map(({label,key,type,ph}) => (
                <div key={key}>
                  <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={update(key)} required placeholder={ph}
                    className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
                </div>
              ))}
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">District</label>
                <select value={form.district} onChange={update('district')} className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60">
                  {['Pune','Mumbai','Nashik','Nagpur','Kolhapur','Jalgaon','Satara','Solapur','Ahmednagar'].map(d => <option key={d} value={d} className="bg-royal-dark">{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={form.description} onChange={update('description')} required rows={3} placeholder="Tell us about this event..."
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 resize-none" />
              </div>
              <button type="submit" disabled={loading} className="btn-royal w-full rounded-xl py-3 text-sm disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-royal-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>}>
      <EventsContent />
    </Suspense>
  );
}
