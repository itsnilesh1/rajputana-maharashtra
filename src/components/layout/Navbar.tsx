'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ChevronDown, Shield, User, LogOut, Bell, Crown } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '/about' },
  {
    label: 'Heritage',
    href: '/heritage',
    children: [
      { label: 'History', href: '/heritage?category=history' },
      { label: 'Culture', href: '/heritage?category=culture' },
      { label: 'Traditions', href: '/heritage?category=traditions' },
      { label: 'Personalities', href: '/heritage?category=personalities' },
    ],
  },
  { label: 'Members', href: '/members' },
  { label: 'Events', href: '/events' },
  { label: 'Districts', href: '/districts' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-royal-black/95 backdrop-blur-md border-b border-gold-dim shadow-royal'
          : 'bg-transparent'
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-maroon-gradient text-center py-1.5 px-4 text-xs font-sans tracking-wider text-royal-cream/90">
        🏆 &nbsp; Rajputana Maharashtra — Connecting Heritage, Culture & Community Across Maharashtra
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-royal-gold flex items-center justify-center bg-royal-dark group-hover:border-royal-amber transition-colors">
              <Crown size={18} className="text-royal-gold" />
            </div>
            <div>
              <div className="font-display text-sm font-bold tracking-widest text-royal-gold leading-none">RAJPUTANA</div>
              <div className="font-display text-xs tracking-[0.3em] text-royal-cream/60 leading-none mt-0.5">MAHARASHTRA</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="nav-link flex items-center gap-1 px-3 py-2 text-xs">
                    {link.label}
                    <ChevronDown size={12} />
                  </button>
                  {activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 royal-card shadow-royal-lg py-2 animate-fade-in">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-xs text-royal-cream/70 hover:text-royal-gold hover:bg-royal-gold/5 transition-colors font-display tracking-wider"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href} className="nav-link px-3 py-2 text-xs">
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold-dim hover:border-royal-gold transition-all">
                  <div className="w-7 h-7 rounded-full bg-maroon-gradient flex items-center justify-center">
                    <User size={14} className="text-royal-gold" />
                  </div>
                  <span className="text-xs font-display tracking-wider text-royal-cream/80">
                    {session.user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className="text-royal-gold/60" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 royal-card shadow-royal-lg py-2 hidden group-hover:block animate-fade-in">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-xs text-royal-cream/70 hover:text-royal-gold hover:bg-royal-gold/5 transition-colors font-display tracking-wider">
                    <User size={13} /> My Dashboard
                  </Link>
                  {['admin', 'moderator'].includes(session.user.role || '') && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-xs text-royal-amber hover:text-royal-gold hover:bg-royal-gold/5 transition-colors font-display tracking-wider">
                      <Shield size={13} /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gold-dim my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-900/10 transition-colors font-display tracking-wider w-full"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost py-2 px-4 text-xs rounded-lg">
                  Sign In
                </Link>
                <Link href="/register" className="btn-royal py-2 px-4 text-xs rounded-lg">
                  Join Community
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-royal-gold"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-royal-charcoal border-t border-gold-dim animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-display tracking-wider text-royal-cream/70 hover:text-royal-gold hover:bg-royal-gold/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            <div className="border-t border-gold-dim pt-3 mt-3 flex flex-col gap-2">
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="btn-ghost py-2.5 text-xs rounded-lg text-center" onClick={() => setIsOpen(false)}>
                    My Dashboard
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost py-2.5 text-xs rounded-lg text-center text-red-400 border-red-900/50">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost py-2.5 text-xs rounded-lg text-center" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-royal py-2.5 text-xs rounded-lg text-center" onClick={() => setIsOpen(false)}>
                    Join Community
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
