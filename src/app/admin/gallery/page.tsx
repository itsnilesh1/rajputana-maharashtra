'use client';
import { useState } from 'react';
import { Image as ImageIcon, Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const PENDING_GALLERY = [
  { _id: '1', title: 'Heritage Walk Photos — Nashik', imageUrl: 'https://picsum.photos/seed/g1/400/300', district: 'Nashik', category: 'heritage', caption: 'Photos from the Nandur Fort walk.', submittedBy: { name: 'Vikram Singh' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { _id: '2', title: 'Community Diwali Celebration', imageUrl: 'https://picsum.photos/seed/g2/400/300', district: 'Pune', category: 'festivals', caption: 'Diwali celebration at community centre.', submittedBy: { name: 'Priya Rathore' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { _id: '3', title: 'Youth Camp Group Photo', imageUrl: 'https://picsum.photos/seed/g3/400/300', district: 'Mumbai', category: 'community', caption: 'Youth leadership camp 2025 participants.', submittedBy: { name: 'Meera Sisodiya' }, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

const PUBLISHED = [
  { _id: '4', title: 'Annual Sammelan 2024', imageUrl: 'https://picsum.photos/seed/g4/400/300', district: 'Pune', category: 'events', submittedBy: { name: 'Admin' }, createdAt: '2024-12-16', isPublished: true },
  { _id: '5', title: 'Pratapgad Heritage Walk', imageUrl: 'https://picsum.photos/seed/g5/400/300', district: 'Satara', category: 'heritage', submittedBy: { name: 'Admin' }, createdAt: '2025-01-10', isPublished: true },
];

export default function AdminGalleryPage() {
  const [pending, setPending] = useState(PENDING_GALLERY);
  const [published, setPublished] = useState(PUBLISHED);
  const [tab, setTab] = useState<'pending' | 'published'>('pending');

  function approve(id: string) {
    const item = pending.find((p) => p._id === id);
    if (!item) return;
    setPending((prev) => prev.filter((p) => p._id !== id));
    setPublished((prev) => [...prev, { ...item, isPublished: true }]);
    toast.success('Photo published to gallery!');
  }

  function reject(id: string) {
    setPending((prev) => prev.filter((p) => p._id !== id));
    toast.success('Photo rejected');
  }

  function unpublish(id: string) {
    const item = published.find((p) => p._id === id);
    if (!item) return;
    setPublished((prev) => prev.filter((p) => p._id !== id));
    toast.success('Photo removed from gallery');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">Gallery Management</h1>
        <p className="font-sans text-white/40 text-sm">Review and moderate community photo submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {[
          { key: 'pending', label: 'Pending', count: pending.length },
          { key: 'published', label: 'Published', count: published.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm transition-all ${
              tab === key
                ? 'bg-royal-gold text-royal-black font-semibold'
                : 'border border-gold-dim text-white/50 hover:border-royal-gold/40 hover:text-white/70'
            }`}
          >
            {label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${tab === key ? 'bg-royal-black/20' : 'bg-white/10'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Pending */}
      {tab === 'pending' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pending.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <ImageIcon className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="font-display text-white/25 tracking-wide">No pending submissions</p>
            </div>
          ) : (
            pending.map((item) => (
              <div key={item._id} className="royal-card rounded-2xl overflow-hidden hover:border-royal-gold/30 transition-all">
                <div className="relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-yellow-400/90 text-yellow-900 text-xs font-sans rounded-full">
                    Pending
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-white text-sm mb-1 leading-snug">{item.title}</h3>
                  <p className="font-sans text-xs text-white/35 mb-1">{item.district} · {item.category}</p>
                  <p className="font-sans text-xs text-white/25 mb-1">by {item.submittedBy.name}</p>
                  {item.caption && <p className="font-serif text-white/40 text-xs italic mt-2">{item.caption}</p>}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => approve(item._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg text-xs font-sans hover:bg-green-500/30 transition-all">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => reject(item._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg text-xs font-sans hover:bg-red-500/30 transition-all">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Published */}
      {tab === 'published' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {published.map((item) => (
            <div key={item._id} className="royal-card rounded-2xl overflow-hidden hover:border-royal-gold/30 transition-all">
              <div className="relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-green-400/90 text-green-900 text-xs font-sans rounded-full">
                  Published
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-white text-sm mb-1 leading-snug">{item.title}</h3>
                <p className="font-sans text-xs text-white/35 mb-3">{item.district} · {item.category}</p>
                <button onClick={() => unpublish(item._id)}
                  className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400/70 rounded-lg text-xs font-sans hover:bg-red-500/20 transition-all">
                  Remove from Gallery
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
