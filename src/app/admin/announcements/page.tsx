'use client';
import { useState } from 'react';
import { Bell, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isGlobal: boolean;
  district: string;
  isActive: boolean;
  createdAt: string;
}

const DUMMY: Announcement[] = [
  { _id: '1', title: 'Annual Rajputana Sammelan 2025 Dates Announced', content: 'The annual sammelan is scheduled for December 15, 2025 at Shaniwar Wada grounds, Pune.', priority: 'high', isGlobal: true, district: '', isActive: true, createdAt: '2025-09-01' },
  { _id: '2', title: 'New Member Registration Now Open', content: 'We are pleased to announce that registration is now open for all Rajput families across Maharashtra.', priority: 'medium', isGlobal: true, district: '', isActive: true, createdAt: '2025-08-15' },
  { _id: '3', title: 'Nashik District Meet — November', content: 'Nashik district members are invited to the quarterly district meet on November 10.', priority: 'low', isGlobal: false, district: 'Nashik', isActive: true, createdAt: '2025-10-01' },
];

const PRIORITY_CONFIG = {
  high: 'text-red-400 bg-red-400/10 border-red-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(DUMMY);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', priority: 'medium' as 'low'|'medium'|'high',
    isGlobal: true, district: '', expiresAt: '',
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      // Add to local state for demo
      const newAnn: Announcement = {
        _id: String(Date.now()),
        title: form.title,
        content: form.content,
        priority: form.priority,
        isGlobal: form.isGlobal,
        district: form.district,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      toast.success('Announcement published!');
      setShowForm(false);
      setForm({ title: '', content: '', priority: 'medium', isGlobal: true, district: '', expiresAt: '' });
    } catch {
      toast.error('Failed to publish');
    } finally {
      setLoading(false);
    }
  }

  function toggleActive(id: string) {
    setAnnouncements((prev) => prev.map((a) => a._id === id ? { ...a, isActive: !a.isActive } : a));
  }

  function remove(id: string) {
    if (confirm('Delete this announcement?')) {
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      toast.success('Deleted');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wide mb-1">Announcements</h1>
          <p className="font-sans text-white/40 text-sm">Manage community-wide and district-specific announcements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-royal rounded-xl text-xs px-5 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="royal-card rounded-2xl p-6 border border-royal-gold/30">
          <h3 className="font-display text-white text-lg tracking-wide mb-5">Create Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={update('title')} required
                className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors"
                placeholder="Announcement title" />
            </div>
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Content *</label>
              <textarea value={form.content} onChange={update('content')} required rows={3}
                className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 transition-colors resize-none"
                placeholder="Announcement details..." />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Priority</label>
                <select value={form.priority} onChange={update('priority')}
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60 transition-colors">
                  <option value="low" className="bg-royal-dark">Low</option>
                  <option value="medium" className="bg-royal-dark">Medium</option>
                  <option value="high" className="bg-royal-dark">High</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Scope</label>
                <select value={form.isGlobal ? 'global' : 'district'} onChange={(e) => setForm((f) => ({ ...f, isGlobal: e.target.value === 'global' }))}
                  className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60 transition-colors">
                  <option value="global" className="bg-royal-dark">Global (All Districts)</option>
                  <option value="district" className="bg-royal-dark">District Specific</option>
                </select>
              </div>
              {!form.isGlobal && (
                <div>
                  <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">District</label>
                  <select value={form.district} onChange={update('district')}
                    className="w-full bg-royal-black/60 border border-gold-dim rounded-xl px-4 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-royal-gold/60 transition-colors">
                    {['Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Kolhapur', 'Jalgaon', 'Satara', 'Solapur', 'Ahmednagar'].map((d) => (
                      <option key={d} value={d} className="bg-royal-dark">{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost rounded-xl text-xs px-5 py-2.5">Cancel</button>
              <button type="submit" disabled={loading} className="btn-royal rounded-xl text-xs px-5 py-2.5 disabled:opacity-50">
                {loading ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann._id} className={`royal-card rounded-2xl p-5 transition-all duration-300 ${!ann.isActive ? 'opacity-50' : 'hover:border-royal-gold/30'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-sans border ${PRIORITY_CONFIG[ann.priority]}`}>
                    {ann.priority.toUpperCase()}
                  </span>
                  {ann.isGlobal ? (
                    <span className="font-sans text-xs text-white/30">Global</span>
                  ) : (
                    <span className="font-sans text-xs text-royal-gold/50">{ann.district} District</span>
                  )}
                  {!ann.isActive && (
                    <span className="font-sans text-xs text-white/20 italic">Hidden</span>
                  )}
                </div>
                <h3 className="font-display text-white text-sm tracking-wide mb-1">{ann.title}</h3>
                <p className="font-sans text-white/45 text-xs leading-relaxed line-clamp-2">{ann.content}</p>
                <p className="font-sans text-xs text-white/20 mt-2">{new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(ann._id)} title={ann.isActive ? 'Hide' : 'Show'}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors">
                  {ann.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(ann._id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/40 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
