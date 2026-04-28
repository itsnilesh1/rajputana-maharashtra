export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Users, Calendar, ArrowRight, Image as ImageIcon } from 'lucide-react';
import dbConnect from '@/lib/db';
import { District, Announcement, Gallery } from '@/models/index';
import MemberProfile from '@/models/MemberProfile';
import Event from '@/models/Event';

interface Props { params: { slug: string } }

async function getDistrictData(slug: string) {
  await dbConnect();

  const district = await District.findOne({ slug, isActive: true }).lean() as any;
  if (!district) return null;

  const now = new Date();

  const [members, events, announcements, gallery] = await Promise.all([
    MemberProfile.find({ district: district.name, approvalStatus: 'approved', isPublic: true })
      .select('name city clan profession photo')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),

    Event.find({ district: district.name, isPublished: true, date: { $gte: now } })
      .sort({ date: 1 })
      .limit(5)
      .lean(),

    Announcement.find({
      isActive: true,
      $and: [
        { $or: [{ isGlobal: true }, { district: district.name }] },
        { $or: [{ expiresAt: { $gte: now } }, { expiresAt: { $exists: false } }, { expiresAt: null }] },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .limit(3)
      .lean(),

    Gallery.find({ district: district.name, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  // Live member count
  const memberCount = await MemberProfile.countDocuments({
    district: district.name,
    approvalStatus: 'approved',
    isPublic: true,
  });

  return { district, members, events, announcements, gallery, memberCount };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const d = await District.findOne({ slug: params.slug, isActive: true }).lean() as any;
  if (!d) return { title: 'District Not Found' };
  return {
    title: `${d.name} District | Rajputana Maharashtra`,
    description: d.description,
  };
}

export default async function DistrictPage({ params }: Props) {
  const data = await getDistrictData(params.slug);
  if (!data) notFound();

  const { district, members, events, announcements, gallery, memberCount } = data;

  const priorityColor: Record<string, string> = {
    high:   'text-red-400 border-red-400/30 bg-red-400/10',
    medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    low:    'text-blue-400 border-blue-400/30 bg-blue-400/10',
  };

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-maroon/15 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-royal-gold/4 blur-[100px]" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link href="/districts" className="inline-flex items-center gap-2 font-sans text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
            ← All Districts
          </Link>
          <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-2">
            {district.region}{district.division ? ` · ${district.division} Division` : ''}
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide mb-3">
            <span className="gold-text">{district.name}</span>
          </h1>
          {district.headquarters && (
            <p className="font-sans text-white/35 text-sm mb-5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Headquarters: {district.headquarters}
              {district.area && <span className="ml-3">· Area: {district.area}</span>}
            </p>
          )}
          <div className="w-24 h-0.5 bg-gold-gradient mb-8" />

          <div className="flex flex-wrap gap-4">
            {[
              { icon: Users, value: memberCount > 0 ? `${memberCount}` : '0', label: 'Approved Members' },
              { icon: Calendar, value: events.length > 0 ? `${events.length}` : '0', label: 'Upcoming Events' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="royal-card rounded-xl px-5 py-3 flex items-center gap-3 gold-border">
                <Icon className="w-5 h-5 text-royal-gold" />
                <div>
                  <p className="font-display text-royal-gold font-bold">{value}</p>
                  <p className="font-sans text-white/40 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20 grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <div className="royal-card rounded-2xl p-8">
            <h2 className="font-display text-white text-xl tracking-wide mb-4">About {district.name}</h2>
            <p className="font-serif text-white/60 leading-relaxed italic">{district.description}</p>
          </div>

          {/* Announcements */}
          {announcements.length > 0 && (
            <div className="royal-card rounded-2xl p-8">
              <h2 className="font-display text-white text-xl tracking-wide mb-5">Announcements</h2>
              <div className="space-y-4">
                {announcements.map((a: any) => (
                  <div key={a._id.toString()} className={`rounded-xl px-4 py-3 border ${priorityColor[a.priority] || priorityColor.medium}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-sans text-sm font-semibold">{a.title}</p>
                      <span className="font-sans text-xs opacity-60 whitespace-nowrap">
                        {a.isGlobal ? 'All Districts' : district.name}
                      </span>
                    </div>
                    <p className="font-sans text-xs opacity-80 mt-1 leading-relaxed">{a.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          <div className="royal-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-white text-xl tracking-wide">Upcoming Events</h2>
              <Link href={`/events?district=${encodeURIComponent(district.name)}`} className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold transition-colors flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-white/15 mx-auto mb-3" />
                <p className="font-sans text-white/30 text-sm">No upcoming events in {district.name}</p>
                <Link href="/dashboard" className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold mt-2 inline-block">
                  Submit an Event →
                </Link>
              </div>
            ) : events.map((ev: any) => {
              const d = new Date(ev.date);
              return (
                <Link
                  key={ev._id.toString()}
                  href={`/events/${ev.slug}`}
                  className="flex items-center gap-4 py-3 border-b border-gold-dim/20 last:border-0 hover:bg-royal-gold/3 -mx-2 px-2 rounded-lg transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-royal-maroon/30 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="font-display text-royal-gold text-sm font-bold">{d.getDate()}</span>
                    <span className="font-sans text-white/40 text-xs">{d.toLocaleString('en-IN', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-white text-sm group-hover:text-royal-gold transition-colors truncate">{ev.title}</p>
                    <p className="font-sans text-white/40 text-xs truncate">{ev.venue}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-royal-gold transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="royal-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-white text-xl tracking-wide">Gallery</h2>
                <Link href={`/gallery?district=${encodeURIComponent(district.name)}`} className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((g: any) => (
                  <div key={g._id.toString()} className="relative aspect-square rounded-xl overflow-hidden bg-royal-dark">
                    <Image
                      src={g.imageUrl}
                      alt={g.title || 'Gallery image'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 33vw, 150px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Members */}
          <div className="royal-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-white tracking-wide">Members</h2>
              <Link href={`/members?district=${encodeURIComponent(district.name)}`} className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold transition-colors">
                View All
              </Link>
            </div>
            {members.length === 0 ? (
              <div className="text-center py-6">
                <Users className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="font-sans text-white/30 text-xs">No approved members yet</p>
                <p className="font-sans text-white/20 text-xs mt-1">Be the first from {district.name}!</p>
              </div>
            ) : members.map((m: any) => (
              <div key={m._id.toString()} className="flex items-center gap-3 py-2.5 border-b border-gold-dim/20 last:border-0">
                <div className="w-9 h-9 rounded-full bg-royal-maroon/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} width={36} height={36} className="object-cover w-full h-full" />
                  ) : (
                    <span className="font-display text-royal-gold text-sm">{m.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-white text-xs font-medium truncate">{m.name}</p>
                  <p className="font-sans text-white/35 text-xs truncate">{m.clan} · {m.profession}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div className="royal-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-royal-maroon/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-royal-gold" />
            </div>
            <h3 className="font-display text-white mb-2 tracking-wide">Represent {district.name}</h3>
            <p className="font-sans text-white/40 text-xs mb-4 leading-relaxed">
              Are you a Rajput from {district.name}? Register and submit your profile to be listed in our community directory.
            </p>
            <Link href="/register" className="btn-royal rounded-lg text-xs px-4 py-2.5 inline-block mb-2 w-full">
              Create Profile
            </Link>
            <Link href="/login" className="font-sans text-xs text-white/30 hover:text-royal-gold transition-colors block">
              Already registered? Login →
            </Link>
          </div>

          {/* District info */}
          <div className="royal-card rounded-2xl p-6">
            <h3 className="font-display text-white text-sm tracking-wide mb-3">District Info</h3>
            <div className="space-y-2">
              {[
                { label: 'Region', value: district.region },
                { label: 'Division', value: district.division },
                { label: 'Headquarters', value: district.headquarters },
                { label: 'Area', value: district.area },
              ].filter(i => i.value).map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start">
                  <span className="font-sans text-xs text-white/30">{label}</span>
                  <span className="font-sans text-xs text-white/60 text-right ml-2">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
