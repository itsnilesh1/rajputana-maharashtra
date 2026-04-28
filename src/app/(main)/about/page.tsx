import { Metadata } from 'next';
import { Crown, Shield, Scroll, Users, Target, Eye, Heart } from 'lucide-react';

export const metadata: Metadata = { title: 'About Us' };

const values = [
  { icon: Shield, title: 'Honor & Valor', desc: 'We uphold the ancient Rajput code of conduct — fearlessness in the face of adversity, integrity in all dealings.' },
  { icon: Heart, title: 'Community First', desc: 'Every decision we make puts the collective well-being of our community above personal gain or preference.' },
  { icon: Scroll, title: 'Living Heritage', desc: 'Our traditions are not museum pieces. We actively practice and evolve our cultural legacy for modern times.' },
  { icon: Users, title: 'Inclusive Strength', desc: 'Spanning all clans, professions, and districts — united under one Rajputana identity in Maharashtra.' },
];

const leadership = [
  { name: 'Thakur Vikram Singh Rathore', role: 'Founder & President', district: 'Pune', bio: 'Third-generation Maharashtrian Rajput with 20 years of community leadership.' },
  { name: 'Rani Padmavati Bhonsle', role: 'Vice President', district: 'Nashik', bio: 'Heritage researcher and educator dedicated to documenting Rajput clan histories.' },
  { name: 'Kunwar Arjun Sisodiya', role: 'Secretary General', district: 'Mumbai', bio: 'Legal advocate championing Rajput community rights across the state.' },
  { name: 'Thakurani Savitri Chauhan', role: 'Cultural Director', district: 'Nagpur', bio: 'Classical dancer and cultural ambassador preserving Rajput performing arts.' },
];

export default function AboutPage() {
  return (
    <main className="bg-royal-black min-h-screen">
      {/* Hero */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-dark/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-royal-gold/4 blur-[120px]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">Who We Are</p>
          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">
            About <span className="gold-text">Rajputana Maharashtra</span>
          </h1>
          <div className="w-24 h-0.5 bg-gold-gradient mx-auto mb-8" />
          <p className="font-serif text-xl text-white/60 italic leading-relaxed max-w-3xl mx-auto">
            A living bridge between our glorious past and a powerful future — connecting Rajput families
            across Maharashtra in a bond of shared identity, culture, and purpose.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-royal-dark/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              label: 'Our Mission',
              color: 'text-royal-gold',
              text: 'To unite, empower, and celebrate the Rajput community across all 9 districts of Maharashtra — preserving our ancient heritage while building pathways for modern success through education, entrepreneurship, and cultural pride.',
            },
            {
              icon: Eye,
              label: 'Our Vision',
              color: 'text-royal-amber',
              text: 'A thriving, self-reliant Rajput community in Maharashtra where every family has access to a strong support network, cultural resources, and opportunities — rooted in honor, driven by ambition, united in brotherhood.',
            },
            {
              icon: Crown,
              label: 'Our Purpose',
              color: 'text-royal-gold',
              text: 'To be the definitive digital and physical home for Maharashtrian Rajputs — connecting 4,200+ families, archiving 600 years of history, and creating new chapters of excellence for generations yet to come.',
            },
          ].map(({ icon: Icon, label, color, text }) => (
            <div key={label} className="royal-card rounded-2xl p-8 text-center hover:border-royal-gold/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-6">
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h3 className="font-display text-xl text-white tracking-wide mb-4">{label}</h3>
              <p className="font-serif text-white/55 leading-relaxed italic text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-4 text-center">Our Journey</p>
          <h2 className="font-display text-4xl text-white text-center mb-12 tracking-wide">The Story So Far</h2>
          <div className="space-y-8">
            {[
              { year: '2018', title: 'Foundation', text: 'Rajputana Maharashtra was founded by a group of 12 community leaders in Pune, united by a shared concern: the disconnect between younger Rajput generations and their heritage.' },
              { year: '2019', title: 'First Sammelan', text: 'Our inaugural state-wide gathering at Shaniwar Wada, Pune drew over 800 attendees from 6 districts — proving the hunger for community connection.' },
              { year: '2021', title: 'Digital Expansion', text: 'Launch of our digital community platform, allowing members across all districts to connect, share, and participate regardless of location.' },
              { year: '2023', title: 'Heritage Documentation', text: 'Partnership with Maharashtra state archives to begin systematic documentation of Rajput clan histories, folk traditions, and architectural heritage.' },
              { year: '2025', title: 'New Chapter', text: 'With 4,200+ registered members and presence in all 9 districts, we launch this comprehensive community platform — our most ambitious initiative yet.' },
            ].map(({ year, title, text }) => (
              <div key={year} className="flex gap-6">
                <div className="flex-shrink-0 w-16">
                  <span className="font-display text-royal-gold text-lg">{year}</span>
                </div>
                <div className="flex-1 border-l border-gold-dim/40 pl-6 pb-8 relative">
                  <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-royal-gold border-2 border-royal-black" />
                  <h3 className="font-display text-white text-lg mb-2 tracking-wide">{title}</h3>
                  <p className="font-serif text-white/55 leading-relaxed italic">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-royal-dark/30">
        <div className="max-w-6xl mx-auto">
          <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-4 text-center">What We Stand For</p>
          <h2 className="font-display text-4xl text-white text-center mb-12 tracking-wide">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="royal-card rounded-2xl p-6 hover:border-royal-gold/40 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-royal-maroon/40 flex items-center justify-center mb-5 group-hover:bg-royal-gold/10 transition-colors">
                  <Icon className="w-6 h-6 text-royal-gold" />
                </div>
                <h3 className="font-display text-white mb-3 tracking-wide">{title}</h3>
                <p className="font-sans text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-4 text-center">Guiding Voices</p>
          <h2 className="font-display text-4xl text-white text-center mb-12 tracking-wide">Our Leadership</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map(({ name, role, district, bio }) => (
              <div key={name} className="royal-card rounded-2xl p-6 text-center hover:border-royal-gold/40 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-royal-maroon/40 border-2 border-royal-gold/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-2xl text-royal-gold">{name[0]}</span>
                </div>
                <h3 className="font-display text-white text-sm tracking-wide mb-1">{name}</h3>
                <p className="font-sans text-royal-gold text-xs mb-1">{role}</p>
                <p className="font-sans text-white/30 text-xs mb-3">{district}</p>
                <p className="font-serif text-white/45 text-xs leading-relaxed italic">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
