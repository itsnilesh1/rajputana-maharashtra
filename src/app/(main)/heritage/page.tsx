'use client';
import { useState, useEffect, Suspense } from 'react';
import { Search, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['all','history','culture','heritage','traditions','personalities','achievements'];

function HeritageContent() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  async function fetchArticles() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { fetchArticles(); }, [category]);

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">Our Roots</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">Heritage &amp; <span className="gold-text">History</span></h1>
          <div className="w-24 h-0.5 bg-gold-gradient mx-auto mb-6" />
          <p className="font-serif text-lg text-white/55 italic">Explore the rich tapestry of Rajput history, culture, and traditions in Maharashtra.</p>
        </div>
      </section>

      <section className="py-8 px-4 border-y border-gold-dim/20 bg-royal-dark/30 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchArticles()}
              placeholder="Search articles..."
              className="w-full bg-royal-black/60 border border-gold-dim rounded-xl pl-10 pr-4 py-2.5 font-sans text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-royal-gold/60" />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-widest transition-all ${
                  category === cat ? 'bg-royal-gold text-royal-black font-semibold' : 'border border-gold-dim text-white/50 hover:text-royal-gold hover:border-royal-gold/50'
                }`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-display text-white/30 tracking-wide">No articles found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <div key={article._id} className="royal-card rounded-2xl overflow-hidden hover:border-royal-gold/40 transition-all group flex flex-col">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-royal-maroon/40 to-royal-dark flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-royal-gold/30 group-hover:text-royal-gold/50 transition-colors" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block px-3 py-1 bg-royal-maroon/40 text-royal-gold/80 text-xs font-sans rounded-full tracking-widest uppercase mb-4 self-start capitalize">{article.category}</span>
                    <h3 className="font-display text-white text-sm leading-snug mb-3 group-hover:text-royal-gold transition-colors flex-1">{article.title}</h3>
                    <p className="font-serif text-white/45 text-sm leading-relaxed italic mb-4 line-clamp-3">{article.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gold-dim/20">
                      <div>
                        <p className="font-sans text-xs text-white/30">{article.author?.name}</p>
                        <p className="font-sans text-xs text-white/20">{new Date(article.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                      </div>
                      <Link href={`/heritage/${article.slug}`} className="flex items-center gap-1 text-royal-gold/50 hover:text-royal-gold font-sans text-xs transition-colors">
                        Read <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function HeritagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-royal-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-royal-gold animate-spin" /></div>}>
      <HeritageContent />
    </Suspense>
  );
}
