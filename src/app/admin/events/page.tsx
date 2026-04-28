'use client';
import { useState } from 'react';
import { Calendar, MapPin, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DUMMY_EVENTS = [
  { _id: '1', title: 'Annual Rajputana Sammelan 2025', date: '2025-12-15', venue: 'Shaniwar Wada Grounds, Pune', district: 'Pune', isPublished: true, organizer: 'Admin', createdAt: '2025-08-01' },
  { _id: '2', title: 'Navratri Mahotsav — Mumbai', date: '2025-10-02', venue: 'Bandra-Kurla Complex', district: 'Mumbai', isPublished: true, organizer: 'Mumbai District', createdAt: '2025-09-01' },
  { _id: '3', title: 'Youth Leadership Summit', date: '2025-11-20', venue: 'MIT College, Pune', district: 'Pune', isPublished: false, organizer: 'Youth Wing', createdAt: '2025-09-15' },
  { _id: '4', title: 'Community Entrepreneur Meet', date: '2026-01-10', venue: 'Hotel Radisson, Nagpur', district: 'Nagpur', isPublished: true, organizer: 'Nagpur District', createdAt: '2025-10-01' },
  { _id: '5', title: 'Heritage Fort Walk — Nashik', date: '2025-12-05', venue: 'Nandur Fort, Nashik', district: 'Nashik', isPublished: true, organizer: 'Heritage Team', createdAt: '2025-09-20' },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState(DUMMY_EVENTS);
  const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');

  const filtered = events.filter((e) => {
    if (filter === 'published') return e.isPublished;
    if (filter === 'unpublished') return !e.isPublished;
    return true;
  });

  function togglePublish(id: string) {
    setEvents((prev) => prev.map((e) => e._id === id ? { ...e, isPublished: !e.isPublished } : e));
    const ev = events.find((e) => e._id === id);
    toast.success(ev?.isPublished ? 'Event unpublished' : 'Event published');
  }

  function remove(id: string) {
    if (confirm('Delete this event?')) {
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success('Event deleted');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">Events</h1>
        <p className="font-sans text-white/40 text-sm">Manage published and upcoming community events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Events', value: events.length, color: 'text-white' },
          { label: 'Published', value: events.filter((e) => e.isPublished).length, color: 'text-green-400' },
          { label: 'Drafts', value: events.filter((e) => !e.isPublished).length, color: 'text-yellow-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="royal-card rounded-xl p-4 text-center">
            <p className={`font-display text-2xl ${color}`}>{value}</p>
            <p className="font-sans text-xs text-white/40 uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'published', 'unpublished'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-sans text-xs uppercase tracking-wider transition-all capitalize ${
              filter === f ? 'bg-royal-gold text-royal-black font-semibold' : 'border border-gold-dim text-white/50 hover:border-royal-gold/40 hover:text-white/70'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="royal-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-dim/20">
                {['Event', 'Date & Venue', 'District', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 font-sans text-xs text-white/30 uppercase tracking-widest text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={event._id} className="border-b border-gold-dim/10 hover:bg-royal-gold/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-sans text-sm text-white">{event.title}</p>
                    <p className="font-sans text-xs text-white/30 mt-0.5">by {event.organizer}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 font-sans text-xs text-white/60 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-royal-gold/40" />
                      {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 font-sans text-xs text-white/40">
                      <MapPin className="w-3.5 h-3.5 text-royal-gold/30" />
                      <span className="truncate max-w-[160px]">{event.venue}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-royal-maroon/30 text-royal-gold/70 text-xs font-sans rounded-full">{event.district}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans border ${
                      event.isPublished
                        ? 'text-green-400 bg-green-400/10 border-green-400/30'
                        : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                    }`}>
                      {event.isPublished ? <><CheckCircle className="w-3 h-3" /> Published</> : <><XCircle className="w-3 h-3" /> Draft</>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => togglePublish(event._id)}
                        className={`p-1.5 rounded-lg transition-colors text-xs font-sans border ${
                          event.isPublished
                            ? 'border-yellow-500/30 text-yellow-400/60 hover:bg-yellow-500/10 hover:text-yellow-400'
                            : 'border-green-500/30 text-green-400/60 hover:bg-green-500/10 hover:text-green-400'
                        }`}
                        title={event.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {event.isPublished ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button onClick={() => remove(event._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
