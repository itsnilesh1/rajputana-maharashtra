'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, LayoutDashboard, FileCheck, Users, Calendar, BookOpen, Bell, Image, Activity, Settings, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/submissions', label: 'Submissions', icon: FileCheck, badge: 'pending' },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/articles', label: 'Articles', icon: BookOpen },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
];

export default function AdminSidebar({ role, userName }: { role: string; userName: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gold-dim/20">
        <Link href="/admin" className="flex items-center gap-3">
          <Crown className="w-7 h-7 text-royal-gold" />
          <div>
            <p className="font-display text-sm text-royal-gold tracking-widest">RAJPUTANA</p>
            <p className="font-sans text-xs text-white/30">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gold-dim/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-royal-gold/5">
          <div className="w-8 h-8 rounded-full bg-royal-maroon/50 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-royal-gold text-sm">{userName[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-sans text-xs text-white truncate">{userName}</p>
            <p className="font-sans text-xs text-royal-gold/60 capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
              isActive(href, exact)
                ? 'bg-royal-gold/15 text-royal-gold border border-royal-gold/20'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-sans text-sm">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-gold-dim/20 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all font-sans text-sm">
          ← View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all w-full font-sans text-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-royal-dark border border-gold-dim text-royal-gold"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-royal-dark border-r border-gold-dim/20 flex-col z-30">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-royal-dark border-r border-gold-dim/20 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
