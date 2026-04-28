import Link from 'next/link';
import { Crown, MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  Community: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/about#mission' },
    { label: 'Leadership', href: '/about#leadership' },
    { label: 'Join Us', href: '/register' },
  ],
  Heritage: [
    { label: 'History', href: '/heritage?category=history' },
    { label: 'Culture', href: '/heritage?category=culture' },
    { label: 'Traditions', href: '/heritage?category=traditions' },
    { label: 'Gallery', href: '/gallery' },
  ],
  Districts: [
    { label: 'Pune', href: '/districts/pune' },
    { label: 'Mumbai', href: '/districts/mumbai' },
    { label: 'Nashik', href: '/districts/nashik' },
    { label: 'Nagpur', href: '/districts/nagpur' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Volunteer', href: '/contact#volunteer' },
    { label: 'Submit Event', href: '/events/submit' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-royal-charcoal border-t border-gold-dim">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-royal-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full border-2 border-royal-gold flex items-center justify-center bg-royal-dark">
                <Crown size={20} className="text-royal-gold" />
              </div>
              <div>
                <div className="font-display text-base font-bold tracking-widest text-royal-gold">RAJPUTANA</div>
                <div className="font-display text-xs tracking-[0.3em] text-royal-cream/50">MAHARASHTRA</div>
              </div>
            </Link>
            <p className="font-serif text-royal-cream/60 text-sm leading-relaxed mb-6">
              Preserving the legacy, uniting the community, and celebrating the Rajput heritage across Maharashtra. 
              Together we stand, as one community with pride.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-gold-dim flex items-center justify-center text-royal-cream/40 hover:text-royal-gold hover:border-royal-gold transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-xs uppercase tracking-widest text-royal-gold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-royal-cream/55 hover:text-royal-gold transition-colors font-sans tracking-wide"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gold-dim">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <a href="mailto:contact@rajputana-maharashtra.org" className="flex items-center gap-2 text-xs text-royal-cream/50 hover:text-royal-gold transition-colors">
                <Mail size={13} className="text-royal-gold/50" />
                contact@rajputana-maharashtra.org
              </a>
              <span className="flex items-center gap-2 text-xs text-royal-cream/50">
                <MapPin size={13} className="text-royal-gold/50" />
                Maharashtra, India
              </span>
            </div>
            <p className="text-xs text-royal-cream/30 font-sans">
              © {new Date().getFullYear()} Rajputana Maharashtra. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
