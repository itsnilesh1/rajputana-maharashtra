'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Users, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const taglines = [
  'Preserving the Royal Legacy',
  'Uniting the Rajput Community',
  'Celebrating Our Heritage',
  'One Community, One Pride',
];

export default function HeroSection() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTaglineIndex((i) => (i + 1) % taglines.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pattern-overlay">
      {/* Background layers */}
      <div className="absolute inset-0 bg-royal-gradient" />
      
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #7B1C2C 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }}
      />

      {/* Decorative top ornament */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-dim bg-royal-dark/50 mb-8 animate-fade-in">
          <Shield size={12} className="text-royal-gold" />
          <span className="text-xs font-display tracking-[0.3em] text-royal-gold/80 uppercase">
            Est. Community of Maharashtra
          </span>
        </div>

        {/* Main title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-slide-up">
          <span className="gold-text">RAJPUTANA</span>
          <br />
          <span className="text-white/90">MAHARASHTRA</span>
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-royal-gold" />
          <Star size={12} className="text-royal-gold" fill="currentColor" />
          <div className="font-display text-xs tracking-[0.5em] text-royal-gold/60 uppercase">Since Ancient Times</div>
          <Star size={12} className="text-royal-gold" fill="currentColor" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-royal-gold" />
        </div>

        {/* Rotating tagline */}
        <div className="h-12 flex items-center justify-center mb-8">
          <p
            className={`font-serif text-xl md:text-2xl text-royal-cream/70 italic transition-all duration-400 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {taglines[taglineIndex]}
          </p>
        </div>

        {/* Description */}
        <p className="font-sans text-base md:text-lg text-royal-cream/55 max-w-2xl mx-auto leading-relaxed mb-12">
          The official digital home of the Rajput community across Maharashtra — connecting members, preserving heritage, and celebrating our royal legacy together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register" className="btn-royal rounded-lg flex items-center gap-2 group">
            Join Our Community
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="btn-ghost rounded-lg">
            Learn More
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[
            { label: 'Members', value: '5,000+', icon: Users },
            { label: 'Districts', value: '12+', icon: Shield },
            { label: 'Clans', value: '50+', icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={18} className="text-royal-gold/50 mb-1" />
              <span className="font-display text-2xl font-bold text-royal-gold">{value}</span>
              <span className="text-xs text-royal-cream/40 tracking-widest uppercase font-sans">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-royal-black to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
        <span className="text-[10px] tracking-[0.3em] text-royal-cream/30 uppercase font-sans">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-royal-gold/40 to-transparent" />
      </div>
    </section>
  );
}
