async function getStats() {
  try {
    // In production, these come from the DB
    return { members: 5000, events: 150, districts: 12, articles: 80 };
  } catch {
    return { members: 5000, events: 150, districts: 12, articles: 80 };
  }
}

export default async function CommunityStats() {
  const stats = await getStats();

  const items = [
    { label: 'Community Members', value: `${(stats.members / 1000).toFixed(1)}K+`, desc: 'Verified Rajput members' },
    { label: 'Events Conducted', value: `${stats.events}+`, desc: 'Across Maharashtra' },
    { label: 'Active Districts', value: `${stats.districts}`, desc: 'District chapters' },
    { label: 'Heritage Articles', value: `${stats.articles}+`, desc: 'Published stories' },
  ];

  return (
    <section className="relative py-16 bg-royal-charcoal border-y border-gold-dim">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="text-center group">
              <div className="font-display text-3xl md:text-4xl font-black text-royal-gold mb-1 group-hover:scale-105 transition-transform duration-300">
                {item.value}
              </div>
              <div className="font-display text-xs uppercase tracking-widest text-royal-cream/70 mb-1">{item.label}</div>
              <div className="text-xs text-royal-cream/35 font-sans">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
