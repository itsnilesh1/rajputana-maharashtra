import Link from 'next/link';
import { Crown, Users } from 'lucide-react';

export default function JoinCTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="royal-card rounded-3xl p-12 md:p-16 relative overflow-hidden text-center">
          {/* Background glows */}
          <div className="absolute inset-0 bg-maroon-gradient opacity-20 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <Crown className="w-12 h-12 text-royal-gold mx-auto mb-6 animate-float" />
            <p className="font-display text-royal-gold/60 tracking-[0.4em] text-xs uppercase mb-4">
              Join the Legacy
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-wide mb-4">
              Be Part of the <span className="gold-text">Story</span>
            </h2>
            <p className="font-serif text-white/55 text-lg italic max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of Rajput families across Maharashtra. Create your profile, connect
              with your clan, and help preserve our magnificent heritage for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="btn-royal rounded-xl text-sm px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" /> Create Your Profile
              </Link>
              <Link
                href="/members"
                className="btn-ghost rounded-xl text-sm px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" /> Browse Members
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
