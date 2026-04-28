'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const highlights = [
  {
    title: 'The Rajput Legacy in the Deccan Plateau',
    category: 'History',
    excerpt: 'Tracing 600 years of Rajput presence across Maharashtra — from Mughal-era alliances to the Maratha confederacy.',
    slug: 'rajput-legacy-deccan',
  },
  {
    title: 'Clan Traditions: Bhonsle, Sisodiya & Chauhan Lines',
    category: 'Culture',
    excerpt: 'How ancient clan traditions have been preserved and adapted across generations in the Deccan heartland.',
    slug: 'clan-traditions-maharashtra',
  },
  {
    title: 'Warriors Who Shaped Deccan History',
    category: 'Personalities',
    excerpt: "Profiles of remarkable Rajput leaders whose valor and wisdom defined Maharashtra's medieval destiny.",
    slug: 'warriors-deccan-history',
  },
];

export default function HeritageHighlights() {
  return (
    <section className="py-24 px-4 bg-royal-dark/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-3">Our Roots</p>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide">
              Heritage &amp; <span className="gold-text">History</span>
            </h2>
            <div className="w-24 h-0.5 bg-gold-gradient mt-4" />
          </div>
          <Link
            href="/heritage"
            className="hidden md:flex items-center gap-2 text-royal-gold/60 hover:text-royal-gold font-sans text-sm transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((h) => (
            <div
              key={h.slug}
              className="royal-card rounded-2xl p-6 hover:border-royal-gold/40 transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-royal-maroon/30 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-royal-gold/60 group-hover:text-royal-gold transition-colors" />
              </div>
              <span className="inline-block px-3 py-1 bg-royal-maroon/40 text-royal-gold/80 text-xs font-sans rounded-full tracking-widest uppercase mb-4 self-start">
                {h.category}
              </span>
              <h3 className="font-display text-white text-sm leading-snug mb-3 group-hover:text-royal-gold transition-colors flex-1">
                {h.title}
              </h3>
              <p className="font-serif text-white/50 text-sm leading-relaxed italic mb-4">{h.excerpt}</p>
              <Link
                href={`/heritage/${h.slug}`}
                className="inline-flex items-center gap-2 text-royal-gold/50 hover:text-royal-gold font-sans text-xs transition-colors"
              >
                Read More <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link href="/heritage" className="btn-ghost rounded-xl text-xs px-6 py-3 inline-flex items-center gap-2">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
