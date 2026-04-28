'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { Search, Users, Calendar, BookOpen, MapPin, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// Dummy search results for demo
const DUMMY_RESULTS = {
  members: [
    { _id: '1', name: 'Thakur Vikram Singh Rathore', district: 'Pune', clan: 'Rathore', profession: 'Advocate', city: 'Pune' },
    { _id: '2', name: 'Kunwar Arjun Sisodiya', district: 'Mumbai', clan: 'Sisodiya', profession: 'Entrepreneur', city: 'Andheri' },
  ],
  events: [
    { _id: '1', title: 'Annual Rajputana Sammelan 2025', date: '2025-12-15', district: 'Pune', venue: 'Shaniwar Wada Grounds' },
    { _id: '2', title: 'Navratri Mahotsav', date: '2025-10-02', district: 'Mumbai', venue: 'BKC Grounds' },
  ],
  articles: [
    { _id: '1', title: 'The Rajput Legacy in the Deccan Plateau', category: 'history', slug: 'rajput-legacy-deccan', description: 'Tracing 600 years of Rajput presence.' },
    { _id: '2', title: 'Warriors Who Shaped Deccan History', category: 'personalities', slug: 'warriors-deccan-history', description: 'Profiles of remarkable Rajput leaders.' },
  ],
};

type TabType = 'all' | 'members' | 'events' | 'articles';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-royal-black flex items-center justify-center"><Search className="w-8 h-8 text-royal-gold animate-pulse" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof DUMMY_RESULTS | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // Simulate search — in production calls /api/search?q=...
        setResults(DUMMY_RESULTS);
        setLoading(false);
      }, 400);
    } else {
      setResults(null);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const totalResults = results
    ? results.members.length + results.events.length + results.articles.length
    : 0;

  const tabs: { key: TabType; label: string; icon: any; count: number }[] = [
    { key: 'all', label: 'All', icon: Search, count: totalResults },
    { key: 'members', label: 'Members', icon: Users, count: results?.members.length || 0 },
    { key: 'events', label: 'Events', icon: Calendar, count: results?.events.length || 0 },
    { key: 'articles', label: 'Articles', icon: BookOpen, count: results?.articles.length || 0 },
  ];

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4 text-center">Find Anything</p>
          <h1 className="font-display text-5xl text-white tracking-wide mb-8 text-center">
            <span className="gold-text">Search</span> the Community
          </h1>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members, events, articles, districts..."
              autoFocus
              className="w-full bg-royal-dark border border-gold-dim rounded-2xl pl-14 pr-12 py-5 font-sans text-base text-white placeholder:text-white/25 focus:outline-none focus:border-royal-gold/60 transition-colors shadow-royal"
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults(null); }} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
            {loading && (
              <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-royal-gold animate-spin" />
            )}
          </div>

          {/* Tabs */}
          {results && (
            <div className="flex gap-2 mt-5 flex-wrap">
              {tabs.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans transition-all ${
                    activeTab === key
                      ? 'bg-royal-gold text-royal-black font-semibold'
                      : 'border border-gold-dim text-white/50 hover:text-white/70 hover:border-royal-gold/40'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === key ? 'bg-royal-black/20' : 'bg-white/10'}`}>{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {!query && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="font-display text-white/25 tracking-wide">Start typing to search</p>
              <p className="font-sans text-white/15 text-sm mt-2">Search across members, events, articles, and districts</p>
            </div>
          )}

          {query && query.length < 2 && (
            <p className="text-center font-sans text-white/30 py-8">Type at least 2 characters to search</p>
          )}

          {results && totalResults === 0 && (
            <div className="text-center py-12">
              <p className="font-display text-white/30 tracking-wide">No results found for &ldquo;{query}&rdquo;</p>
              <p className="font-sans text-white/20 text-sm mt-2">Try different keywords</p>
            </div>
          )}

          {results && (
            <>
              {/* Members */}
              {(activeTab === 'all' || activeTab === 'members') && results.members.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-4 h-4 text-royal-gold" />
                    <h2 className="font-display text-white tracking-wide">Members</h2>
                    <span className="font-sans text-xs text-white/30">({results.members.length})</span>
                  </div>
                  <div className="space-y-3">
                    {results.members.map((m) => (
                      <div key={m._id} className="royal-card rounded-xl p-4 flex items-center gap-4 hover:border-royal-gold/40 transition-all">
                        <div className="w-10 h-10 rounded-full bg-royal-maroon/40 flex items-center justify-center flex-shrink-0">
                          <span className="font-display text-royal-gold">{m.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-white text-sm">{m.name}</p>
                          <p className="font-sans text-xs text-white/40">{m.clan} · {m.profession} · {m.city}, {m.district}</p>
                        </div>
                        <Link href="/members" className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold transition-colors">View →</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-4 h-4 text-royal-gold" />
                    <h2 className="font-display text-white tracking-wide">Events</h2>
                    <span className="font-sans text-xs text-white/30">({results.events.length})</span>
                  </div>
                  <div className="space-y-3">
                    {results.events.map((ev) => (
                      <div key={ev._id} className="royal-card rounded-xl p-4 flex items-center gap-4 hover:border-royal-gold/40 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-royal-maroon/30 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="font-display text-royal-gold text-base">{new Date(ev.date).getDate()}</span>
                          <span className="font-sans text-white/40 text-xs">{new Date(ev.date).toLocaleString('en-IN', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-white text-sm">{ev.title}</p>
                          <p className="font-sans text-xs text-white/40"><MapPin className="w-3 h-3 inline mr-1" />{ev.venue} · {ev.district}</p>
                        </div>
                        <Link href="/events" className="font-sans text-xs text-royal-gold/50 hover:text-royal-gold transition-colors">View →</Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {(activeTab === 'all' || activeTab === 'articles') && results.articles.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-4 h-4 text-royal-gold" />
                    <h2 className="font-display text-white tracking-wide">Heritage Articles</h2>
                    <span className="font-sans text-xs text-white/30">({results.articles.length})</span>
                  </div>
                  <div className="space-y-3">
                    {results.articles.map((article) => (
                      <Link key={article._id} href={`/heritage/${article.slug}`} className="royal-card rounded-xl p-4 flex items-center gap-4 hover:border-royal-gold/40 transition-all block">
                        <div className="w-10 h-10 rounded-xl bg-royal-maroon/30 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-royal-gold/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-white text-sm">{article.title}</p>
                          <p className="font-sans text-xs text-white/40 capitalize">{article.category} · {article.description}</p>
                        </div>
                        <span className="font-sans text-xs text-royal-gold/50">Read →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
