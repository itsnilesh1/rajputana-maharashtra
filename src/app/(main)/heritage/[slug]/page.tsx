import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, User } from 'lucide-react';

// Static article data — in production pulled from DB
const ARTICLES: Record<string, any> = {
  'rajput-legacy-deccan': {
    title: 'The Rajput Legacy in the Deccan Plateau',
    category: 'History',
    description: 'Tracing 600 years of Rajput presence across Maharashtra — from Mughal-era alliances to the Maratha confederacy.',
    author: 'Dr. Vikram Singh Rathore',
    date: '2025-01-15',
    content: `
## Origins of Rajput Migration to the Deccan

The story of Rajput families in Maharashtra begins in earnest during the 14th and 15th centuries, when political upheaval in Rajputana (present-day Rajasthan) forced many noble clans southward. The Bhonsle clan — whose most celebrated descendant would be Chhatrapati Shivaji Maharaj — traces its roots to the Mewar Rajput lineage, establishing itself in the Deccan long before the Maratha empire rose to prominence.

## Alliance and Adaptation

Unlike many migrant communities, Rajput families in Maharashtra did not simply transplant their culture wholesale. Instead, they engaged in a sophisticated process of cultural exchange — adopting Marathi language and customs while preserving their distinctive clan identities, martial traditions, and religious practices. The Kul (clan deity) system remained intact even as local village deities were adopted alongside.

## The Fort-Builder Legacy

Perhaps the most visible Rajput legacy in Maharashtra is architectural. The distinctive fort-building tradition — emphasizing high ground, multiple bastions, and water cisterns — influenced the design of dozens of Maratha fortifications. Forts like Raigad, Pratapgad, and Sinhagad incorporate engineering principles first developed in Rajputana centuries earlier.

## Preserving the Code of Chivalry

The Rajput code of **Kshatriya Dharma** — emphasizing honor, protection of the weak, and loyalty unto death — found resonance with existing Marathi warrior traditions. This cultural compatibility is a key reason Rajput settlers integrated so successfully into the Deccan's social fabric while retaining a strong community identity.

## Modern Legacy

Today, over 4,200 Rajput families across Maharashtra's nine major districts carry this extraordinary legacy. The community has transitioned from primarily martial and landowning roles into every sector of modern life — from medicine and law to technology and the arts — while maintaining the cultural pride and community bonds that have defined Rajput identity for centuries.

> "We carry our ancestor's valor not in swords, but in character. Every Rajput in Maharashtra is a living bridge between an ancient civilization and a modern nation." — Thakur Vikram Singh Rathore, Rajputana Maharashtra
    `,
  },
  'clan-traditions-maharashtra': {
    title: 'Clan Traditions: Bhonsle, Sisodiya & Chauhan Lines',
    category: 'Culture',
    description: 'How the great Rajput clans adapted their traditions while settling in the fertile valleys of Maharashtra.',
    author: 'Padmavati Bhonsle',
    date: '2025-02-10',
    content: `
## The Bhonsle Legacy

The Bhonsle clan, whose name is synonymous with Maratha power, traces its heritage to the Rajput Mewar lineage. In Maharashtra, they established themselves primarily in Satara, Kolhapur, and Nagpur — each branch developing distinct regional identities while preserving core clan traditions.

## Sisodiya Adaptations

The Sisodiya clan — proud descendants of the great Maharana Pratap — established strong roots in Pune and Mumbai. Their tradition of meticulous genealogical record-keeping (*vanshavali*) has proven invaluable for modern heritage documentation efforts.

## The Chauhan Presence

The Chauhans, one of the four great Agnikula Rajput clans, settled primarily in Nashik and Ahmednagar. Their folk music tradition — particularly the martial *dhamal* form — has blended with local Marathi folk styles to create a unique cultural expression.

## Shared Traditions Across Clans

Despite clan differences, certain traditions are universal among Maharashtra's Rajput community: the *Kuldevta* worship, the sacred thread ceremony (*janeu*), specific marriage customs including the seven-step ritual, and the annual *Pitru Paksha* ancestor remembrance.
    `,
  },
  'warriors-deccan-history': {
    title: 'Warriors Who Shaped Deccan History',
    category: 'Personalities',
    description: "Profiles of ten remarkable Rajput leaders whose valor and wisdom defined Maharashtra's medieval destiny.",
    author: 'Arjun Sisodiya',
    date: '2025-03-01',
    content: `
## Maloji Bhonsle (1552–1606)

The grandfather of Chhatrapati Shivaji, Maloji Bhonsle rose from modest origins to become one of the Deccan Sultanate's most trusted military commanders. His career exemplifies the Rajput tradition of earning honor through service and valor.

## Shahji Bhonsle (1594–1664)

Father of Shivaji, Shahji Bhonsle navigated the complex politics of the Deccan with extraordinary skill, serving both the Adilshahi and Nizam Shahi sultanates while cultivating the foundations that his son would build into an empire.

## Udaybhan Rathore

The fierce Rathore commander whose legendary confrontation at Kondana Fort remains one of the most celebrated examples of Rajput martial courage in Deccan history.

## Modern Warriors

The tradition continues today — not on battlefields but in courtrooms, hospitals, laboratories, and boardrooms. Maharashtra's Rajput community continues to produce outstanding individuals in every field, carrying the warrior spirit into the challenges of the modern age.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = ARTICLES[params.slug];
  return {
    title: article ? article.title : 'Article Not Found',
    description: article?.description,
  };
}

function renderContent(content: string) {
  return content
    .trim()
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="font-display text-royal-gold text-xl mt-8 mb-4 tracking-wide">{line.slice(3)}</h2>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-royal-gold/40 pl-4 my-4 font-serif text-white/60 italic text-base leading-relaxed">{line.slice(2)}</blockquote>;
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="text-royal-gold">{line.slice(2, -2)}</strong>;
      if (line === '') return <div key={i} className="h-2" />;
      // Handle inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="font-serif text-white/70 text-base leading-relaxed mb-2">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-royal-gold font-semibold">{part}</strong> : part)}
        </p>
      );
    });
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug];

  if (!article) {
    return (
      <main className="bg-royal-black min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h1 className="font-display text-white text-3xl mb-4">Article Not Found</h1>
          <Link href="/heritage" className="text-royal-gold hover:underline font-sans text-sm">
            ← Back to Heritage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      {/* Hero */}
      <section className="py-16 px-4 relative overflow-hidden border-b border-gold-dim/20">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-maroon/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-royal-gold/4 blur-[100px]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link
            href="/heritage"
            className="inline-flex items-center gap-2 font-sans text-xs text-white/30 hover:text-white/60 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Heritage
          </Link>
          <span className="inline-block px-3 py-1 bg-royal-maroon/40 text-royal-gold/80 text-xs font-sans rounded-full tracking-widest uppercase mb-5">
            {article.category}
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-white tracking-wide mb-5 leading-tight">
            {article.title}
          </h1>
          <p className="font-serif text-white/55 text-lg italic leading-relaxed mb-6">
            {article.description}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 font-sans text-white/40">
              <User className="w-4 h-4 text-royal-gold/40" /> {article.author}
            </span>
            <span className="flex items-center gap-2 font-sans text-white/40">
              <Calendar className="w-4 h-4 text-royal-gold/40" />
              {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose-royal space-y-1">
            {renderContent(article.content)}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gold-dim/30 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-sans text-xs text-white/30 uppercase tracking-widest">Written by</p>
              <p className="font-display text-white mt-1">{article.author}</p>
            </div>
            <Link href="/heritage" className="btn-ghost rounded-xl text-xs px-5 py-2.5 inline-flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> More Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
