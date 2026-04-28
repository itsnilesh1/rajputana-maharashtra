'use client';
import { useState, useEffect, useRef } from 'react';
import { Crown, Save, CheckCircle, Clock, Info, Loader2, Camera, X, Upload } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { CLANS, DISTRICT_NAMES } from '@/lib/constants';

const STATUS_INFO: Record<string, { label: string; color: string; note: string }> = {
  pending:            { label: 'Pending Review', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', note: 'Your profile is waiting for admin review. You will be notified once reviewed.' },
  approved:           { label: 'Approved & Public', color: 'text-green-400 border-green-400/30 bg-green-400/10', note: 'Your profile is live and visible in the members directory.' },
  rejected:           { label: 'Rejected', color: 'text-red-400 border-red-400/30 bg-red-400/10', note: 'Your profile was not approved. See admin notes below. Edit and resubmit.' },
  revision_requested: { label: 'Revision Requested', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10', note: 'Admin has requested changes. Please update your profile and resubmit.' },
};

export default function ProfilePage() {
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [customClan, setCustomClan]     = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [uploading, setUploading]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', district: DISTRICT_NAMES[0], city: '', clan: 'Rathore',
    profession: '', bio: '', phone: '',
    photo: '', photoPublicId: '',
  });

  useEffect(() => {
    fetch('/api/members/me')
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          const p = d.profile;
          setApprovalStatus(p.approvalStatus || '');
          setModeratorNotes(p.moderatorNotes || '');
          setForm({
            name:          p.name || '',
            district:      p.district || DISTRICT_NAMES[0],
            city:          p.city || '',
            clan:          CLANS.includes(p.clan as any) ? p.clan : 'Other',
            profession:    p.profession || '',
            bio:           p.bio || '',
            phone:         p.phone || '',
            photo:         p.photo || '',
            photoPublicId: p.photoPublicId || '',
          });
          if (!CLANS.includes(p.clan as any)) setCustomClan(p.clan);
          if (p.approvalStatus === 'pending' || p.approvalStatus === 'approved') {
            setSubmitted(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const update = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG or WebP images allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Profile photo must be under 2MB');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'profile');
      if (form.photoPublicId) fd.append('oldPublicId', form.photoPublicId);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setForm(f => ({ ...f, photo: data.url, photoPublicId: data.publicId }));
      toast.success('Photo uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removePhoto() {
    setForm(f => ({ ...f, photo: '', photoPublicId: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim() || !form.profession.trim()) {
      toast.error('Name, city, and profession are required');
      return;
    }
    const finalClan = form.clan === 'Other' ? (customClan.trim() || 'Other') : form.clan;
    setLoading(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clan: finalClan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      setApprovalStatus('pending');
      toast.success('Profile submitted for review!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-royal-gold animate-spin" />
    </div>
  );

  const statusInfo = STATUS_INFO[approvalStatus];
  const canEdit = !approvalStatus || approvalStatus === 'rejected' || approvalStatus === 'revision_requested';

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl text-white tracking-wide mb-1">My Profile</h1>
        <p className="font-sans text-white/40 text-sm">
          {canEdit ? 'Complete your profile to join the community directory' : 'Your submitted profile details'}
        </p>
      </div>

      {/* Status Banner */}
      {statusInfo && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${statusInfo.color}`}>
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-sans text-sm font-semibold">{statusInfo.label}</p>
            <p className="font-sans text-xs opacity-80 mt-1">{statusInfo.note}</p>
            {moderatorNotes && (
              <p className="font-sans text-xs mt-2 opacity-90">
                <strong>Admin note:</strong> {moderatorNotes}
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="royal-card rounded-2xl p-6">
          <h2 className="font-display text-white tracking-wide mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-royal-maroon/20 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gold-dim">
              {form.photo ? (
                <>
                  <Image src={form.photo} alt="Profile" fill className="object-cover" />
                  {canEdit && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </>
              ) : (
                <Crown className="w-10 h-10 text-royal-gold/30" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-royal-gold animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="font-sans text-white/60 text-sm mb-2">
                {form.photo ? 'Photo uploaded' : 'Upload a profile photo'}
              </p>
              <p className="font-sans text-white/30 text-xs mb-3">JPEG, PNG or WebP · Max 2MB · Auto-cropped to square</p>
              {canEdit && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gold-dim rounded-lg font-sans text-xs text-white/60 hover:text-royal-gold hover:border-royal-gold/60 transition-all disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploading ? 'Uploading…' : form.photo ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="royal-card rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-white tracking-wide mb-2">Personal Information</h2>

          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Full Name *</label>
            <input
              type="text" value={form.name} onChange={update('name')} required disabled={!canEdit}
              placeholder="e.g. Thakur Vikram Singh Rathore"
              className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 disabled:opacity-50"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">District *</label>
              <select value={form.district} onChange={update('district')} disabled={!canEdit}
                className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm focus:outline-none focus:border-royal-gold/60 disabled:opacity-50">
                {DISTRICT_NAMES.map(d => <option key={d} value={d} className="bg-royal-dark">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">City / Taluka *</label>
              <input type="text" value={form.city} onChange={update('city')} required disabled={!canEdit}
                placeholder="e.g. Pune City"
                className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 disabled:opacity-50" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Clan / Gotra *</label>
              <select value={form.clan} onChange={update('clan')} disabled={!canEdit}
                className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm focus:outline-none focus:border-royal-gold/60 disabled:opacity-50">
                {CLANS.map(c => <option key={c} value={c} className="bg-royal-dark">{c}</option>)}
              </select>
              {form.clan === 'Other' && canEdit && (
                <input type="text" value={customClan} onChange={e => setCustomClan(e.target.value)}
                  placeholder="Type your clan name"
                  className="mt-2 w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-2.5 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
              )}
              {form.clan === 'Other' && !canEdit && customClan && (
                <p className="font-sans text-xs text-white/50 mt-2">{customClan}</p>
              )}
            </div>
            <div>
              <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Profession *</label>
              <input type="text" value={form.profession} onChange={update('profession')} required disabled={!canEdit}
                placeholder="e.g. Advocate, Engineer, Farmer"
                className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 disabled:opacity-50" />
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Phone (Optional)</label>
            <input type="tel" value={form.phone} onChange={update('phone')} disabled={!canEdit}
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 disabled:opacity-50" />
          </div>

          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">
              About You <span className="normal-case text-white/25">(max 1000 chars)</span>
            </label>
            <textarea value={form.bio} onChange={update('bio')} rows={4} maxLength={1000} disabled={!canEdit}
              placeholder="Tell the community about yourself, your family heritage, interests..."
              className="w-full bg-royal-black/60 border border-gold-dim text-white px-4 py-3 rounded-xl font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60 resize-none disabled:opacity-50" />
            <p className="font-sans text-xs text-white/20 text-right mt-1">{form.bio.length}/1000</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-4">
            <button type="submit" disabled={loading || uploading}
              className="btn-royal rounded-xl px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Submitting…' : 'Submit for Review'}
            </button>
            <p className="font-sans text-xs text-white/30">Your profile will be reviewed by admin before going public</p>
          </div>
        )}

        {!canEdit && approvalStatus === 'approved' && (
          <div className="flex items-center gap-3 p-4 bg-green-400/5 border border-green-400/20 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="font-sans text-sm text-green-400 font-semibold">Your profile is live!</p>
              <p className="font-sans text-xs text-white/40 mt-0.5">
                Visible in the <a href="/members" className="text-royal-gold hover:underline">members directory</a>.
                Contact admin to request profile updates.
              </p>
            </div>
          </div>
        )}

        {!canEdit && approvalStatus === 'pending' && (
          <div className="flex items-center gap-3 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="font-sans text-sm text-yellow-400">Awaiting admin review. We'll notify you once reviewed.</p>
          </div>
        )}
      </form>
    </div>
  );
}
