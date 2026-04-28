'use client';
import { useState, useEffect, Suspense } from 'react';
import { Search, Users, Loader2, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { DISTRICT_NAMES, CLANS } from '@/lib/constants';
import MemberBadge, { VerifiedTick } from '@/components/ui/MemberBadge';

function MembersContent() {
  const { data: session } = useSession();
  const [members, setMembers]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [district, setDistrict] = useState('');
  const [clan, setClan]         = useState('');
  const [search, setSearch]     = useState('');
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);

  async function fetchMembers(p = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (district) params.set('district', district);
      if (clan && clan !== 'All Clans') params.set('clan', clan);
      if (search) params.set('search', search);
      params.set('page', String(p));
      const res = await fetch(`/api/members?${params}`);
      const data = await res.json();
      setMembers(data.members || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setPage(p);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMembers(1); }, [district, clan]);

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">Our People</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">
            Community <span className="gold-text">Members</span>
          </h1>
          <div className="w-24 h-0.5 bg-gold-gradient mx-auto mb-6" />
          <p className="font-serif text-lg text-white/55 italic mb-8">
            Verified Rajput families across all 36 districts of Maharashtra.
          </p>

          {/* Badge legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <MemberBadge approvalStatus="approved" size="sm" showRole={false} />
            <span className="font-sans text-xs text-white/30">= Verified approved member</span>
          </div>

          {session ? (
            <Link href="/dashboard/profile" className="btn-royal rounded-xl text-sm px-6 py-3 inline-flex items-center gap-2">
              <Users className="w-4 h-4" /> My Profile
            </Link>
          ) : (
            <Link href="/register" className="btn-royal rounded-xl text-sm px-6 py-3 inline-flex items-center gap-2">
              <Users className="w-4 h-4" /> Register to Join
            </Link>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 px-4 border-y border-gold-dim/20 bg-royal-dark/30 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchMembers(1)}
              placeholder="Search name, city… (Enter)"
              className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60"
            />
          </div>
          <select value={district} onChange={e => setDistrict(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-royal-dark border border-gold-dim text-white/60 font-sans text-sm focus:outline-none focus:border-royal-gold/60">
            <option value="">All Districts</option>
            {DISTRICT_NAMES.map(d => <option key={d} value={d} className="bg-royal-dark">{d}</option>)}
          </select>
          <select value={clan} onChange={e => setClan(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-royal-dark border border-gold-dim text-white/60 font-sans text-sm focus:outline-none focus:border-royal-gold/60">
            <option value="All Clans">All Clans</option>
            {CLANS.filter(c => c !== 'Other').map(c => <option key={c} value={c} className="bg-royal-dark">{c}</option>)}
          </select>
          {total > 0 && (
            <span className="font-sans text-xs text-white/30 ml-auto whitespace-nowrap">
              {total} verified member{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-royal-gold animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-display text-white/30 tracking-wide text-xl">No verified members found</p>
              <p className="font-sans text-white/20 text-sm mt-2">
                {!session
                  ? <><Link href="/register" className="text-royal-gold underline">Register</Link> and submit your profile</>
                  : 'Try adjusting your filters'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {members.map((m: any) => (
                  <div key={m._id}
                    className="relative royal-card rounded-2xl p-5 group hover:border-royal-gold/50 hover:shadow-royal transition-all duration-300 overflow-hidden">

                    {/* Premium gold shimmer bar on hover */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-3 mb-4">
                      {/* Avatar with verified ring */}
                      <div className="relative w-14 h-14 flex-shrink-0">
                        {/* Gold ring for verified */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A84C] via-[#f0d080] to-[#8B1A1A] p-[2px]">
                          <div className="w-full h-full rounded-full bg-royal-black overflow-hidden">
                            {m.photo ? (
                              <Image src={m.photo} alt={m.name} width={56} height={56} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="font-display text-royal-gold text-xl">{m.name[0]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Verified tick overlay */}
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <VerifiedTick size="sm" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-white text-sm font-semibold truncate group-hover:text-royal-gold transition-colors">
                          {m.name}
                        </p>
                        <p className="font-sans text-white/40 text-xs">{m.clan}</p>
                      </div>
                    </div>

                    {/* Verified badge */}
                    <div className="mb-3">
                      <MemberBadge approvalStatus="approved" size="sm" showRole={false} />
                    </div>

                    <div className="space-y-1.5 border-t border-gold-dim/20 pt-3">
                      <p className="font-sans text-xs text-white/45 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-royal-gold/50 flex-shrink-0" />
                        {m.profession}
                      </p>
                      <p className="font-sans text-xs text-white/45 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-royal-gold/50 flex-shrink-0" />
                        {m.city}, {m.district}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => fetchMembers(page - 1)} disabled={page <= 1}
                    className="px-4 py-2 rounded-xl border border-gold-dim text-white/50 font-sans text-sm disabled:opacity-30 hover:border-royal-gold/50 hover:text-white transition-all">
                    ← Prev
                  </button>
                  <span className="font-sans text-sm text-white/40">Page {page} of {pages}</span>
                  <button onClick={() => fetchMembers(page + 1)} disabled={page >= pages}
                    className="px-4 py-2 rounded-xl border border-gold-dim text-white/50 font-sans text-sm disabled:opacity-30 hover:border-royal-gold/50 hover:text-white transition-all">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>}>
      <MembersContent />
    </Suspense>
  );
}
