'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Image as ImageIcon, Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { DISTRICT_NAMES } from '@/lib/constants';

const CATEGORIES = [
  { value: 'all',          label: 'All' },
  { value: 'events',       label: 'Events' },
  { value: 'heritage',     label: 'Heritage' },
  { value: 'community',    label: 'Community' },
  { value: 'festivals',    label: 'Festivals' },
  { value: 'achievements', label: 'Achievements' },
];

function GalleryContent() {
  const { data: session } = useSession();
  const [items, setItems]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('all');
  const [district, setDistrict] = useState('');
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [lightbox, setLightbox] = useState<any>(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', district: '', category: 'community', caption: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]     = useState('');

  async function fetchGallery(p = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (district) params.set('district', district);
      params.set('page', String(p));
      const res  = await fetch(`/api/gallery?${params}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(p);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchGallery(1); }, [category, district]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG or WebP allowed'); return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Max file size is 3MB'); return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || !uploadForm.title.trim()) {
      toast.error('Title and image are required'); return;
    }
    setUploading(true);
    try {
      // 1. Upload to Cloudinary
      const fd = new FormData();
      fd.append('file', selectedFile);
      fd.append('type', 'gallery');
      const upRes  = await fetch('/api/upload', { method: 'POST', body: fd });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error || 'Upload failed');

      // 2. Create gallery submission
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          imageUrl:      upData.url,
          imagePublicId: upData.publicId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      toast.success('Photo submitted for review! Admin will approve it shortly.');
      setShowUpload(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadForm({ title: '', district: '', category: 'community', caption: '' });
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-royal-gold/4 blur-[100px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">Community Gallery</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">
            Our <span className="gold-text">Gallery</span>
          </h1>
          <div className="w-24 h-0.5 bg-gold-gradient mx-auto mb-6" />
          <p className="font-serif text-lg text-white/55 italic mb-8">
            Moments, milestones, and memories from the Rajput community across Maharashtra.
          </p>
          {session ? (
            <button onClick={() => setShowUpload(true)}
              className="btn-royal rounded-xl text-sm px-6 py-3 inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Submit a Photo
            </button>
          ) : (
            <Link href="/register" className="btn-royal rounded-xl text-sm px-6 py-3 inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Login to Submit
            </Link>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 px-4 border-y border-gold-dim/20 bg-royal-dark/30 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all ${
                  category === c.value
                    ? 'bg-royal-gold text-royal-black'
                    : 'border border-gold-dim text-white/40 hover:border-royal-gold/50 hover:text-white/70'
                }`}>
                {c.label}
              </button>
            ))}
          </div>
          <select value={district} onChange={e => setDistrict(e.target.value)}
            className="ml-auto px-4 py-2 rounded-xl bg-royal-dark border border-gold-dim text-white/60 font-sans text-sm focus:outline-none focus:border-royal-gold/60">
            <option value="">All Districts</option>
            {DISTRICT_NAMES.map(d => <option key={d} value={d} className="bg-royal-dark">{d}</option>)}
          </select>
          {total > 0 && <span className="font-sans text-xs text-white/30">{total} photo{total !== 1 ? 's' : ''}</span>}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-royal-gold animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-display text-white/30 tracking-wide text-xl">No photos yet</p>
              <p className="font-sans text-white/20 text-sm mt-2">
                {session
                  ? <button onClick={() => setShowUpload(true)} className="text-royal-gold hover:underline">Submit the first photo →</button>
                  : <><Link href="/login" className="text-royal-gold underline">Login</Link> to submit photos</>}
              </p>
            </div>
          ) : (
            <>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {items.map((item: any) => (
                  <div key={item._id}
                    className="break-inside-avoid relative rounded-2xl overflow-hidden bg-royal-dark border border-gold-dim/20 hover:border-royal-gold/40 transition-all group cursor-pointer"
                    onClick={() => setLightbox(item)}>
                    <div className="relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div>
                          <p className="font-sans text-white text-xs font-semibold">{item.title}</p>
                          {item.district && <p className="font-sans text-white/60 text-xs">{item.district}</p>}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="font-sans text-xs px-2 py-0.5 rounded-full bg-black/50 text-white/60 capitalize">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => fetchGallery(page - 1)} disabled={page <= 1}
                    className="px-4 py-2 rounded-xl border border-gold-dim text-white/50 font-sans text-sm disabled:opacity-30 hover:border-royal-gold/50 hover:text-white transition-all">
                    ← Prev
                  </button>
                  <span className="font-sans text-sm text-white/40">Page {page} of {pages}</span>
                  <button onClick={() => fetchGallery(page + 1)} disabled={page >= pages}
                    className="px-4 py-2 rounded-xl border border-gold-dim text-white/50 font-sans text-sm disabled:opacity-30 hover:border-royal-gold/50 hover:text-white transition-all">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.title}
              width={900}
              height={600}
              className="w-full h-auto rounded-2xl"
            />
            <div className="mt-4 text-center">
              <p className="font-display text-white text-lg">{lightbox.title}</p>
              {lightbox.caption && <p className="font-serif text-white/50 text-sm italic mt-1">{lightbox.caption}</p>}
              {lightbox.district && <p className="font-sans text-white/30 text-xs mt-1">{lightbox.district} · {lightbox.category}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-gold-dim rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-white text-xl tracking-wide">Submit a Photo</h2>
              <button onClick={() => { setShowUpload(false); setSelectedFile(null); setPreviewUrl(''); }}
                className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File drop zone */}
              <div>
                <label className="block font-sans text-xs text-white/40 uppercase tracking-widest mb-2">
                  Photo * (JPEG/PNG/WebP, max 3MB)
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gold-dim hover:border-royal-gold/50 rounded-xl p-6 cursor-pointer transition-colors">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" width={300} height={200} className="rounded-lg object-contain max-h-40" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-white/20 mb-2" />
                      <span className="font-sans text-white/30 text-sm">Click to choose image</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="block font-sans text-xs text-white/40 uppercase tracking-widest mb-2">Title *</label>
                <input type="text" required value={uploadForm.title}
                  onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Rajputana Pune Meet 2024"
                  className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-2.5 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-sans text-xs text-white/40 uppercase tracking-widest mb-2">District</label>
                  <select value={uploadForm.district}
                    onChange={e => setUploadForm(f => ({ ...f, district: e.target.value }))}
                    className="w-full bg-royal-black/60 border border-gold-dim text-white/70 px-3 py-2.5 rounded-xl font-sans text-sm focus:outline-none focus:border-royal-gold/60">
                    <option value="">Select district</option>
                    {DISTRICT_NAMES.map(d => <option key={d} value={d} className="bg-royal-dark">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
                  <select value={uploadForm.category}
                    onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-royal-black/60 border border-gold-dim text-white/70 px-3 py-2.5 rounded-xl font-sans text-sm focus:outline-none focus:border-royal-gold/60">
                    {CATEGORIES.filter(c => c.value !== 'all').map(c =>
                      <option key={c.value} value={c.value} className="bg-royal-dark">{c.label}</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs text-white/40 uppercase tracking-widest mb-2">Caption (optional)</label>
                <input type="text" value={uploadForm.caption}
                  onChange={e => setUploadForm(f => ({ ...f, caption: e.target.value }))}
                  placeholder="Brief description of the photo"
                  className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-2.5 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
              </div>

              <p className="font-sans text-xs text-white/25 italic">
                Your photo will be reviewed by admin before appearing in the gallery.
              </p>

              <button type="submit" disabled={uploading || !selectedFile}
                className="btn-royal w-full rounded-xl py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Submit for Review</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>}>
      <GalleryContent />
    </Suspense>
  );
}
