'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, LayoutDashboard, User, FileText, Bell, Shield, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

interface DashboardSidebarProps {
  user: { name: string; email: string; role: string };
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/submissions', label: 'My Submissions', icon: FileText },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gold-dim/20">
        <Link href="/" className="flex items-center gap-3">
          <Crown className="w-7 h-7 text-royal-gold" />
          <div>
            <p className="font-display text-sm text-royal-gold tracking-widest">RAJPUTANA</p>
            <p className="font-sans text-xs text-white/30">Member Portal</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gold-dim/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-royal-gold/5">
          <div className="w-10 h-10 rounded-full bg-royal-maroon/50 border-2 border-royal-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-royal-gold">{user.name[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-sans text-sm text-white truncate">{user.name}</p>
            <p className="font-sans text-xs text-white/30 truncate">{user.email}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 bg-royal-gold/15 text-royal-gold/70 text-xs font-sans rounded-full capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive(href, exact)
                ? 'bg-royal-gold/15 text-royal-gold border border-royal-gold/20'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="font-sans text-sm">{label}</span>
          </Link>
        ))}

        {(user.role === 'admin' || user.role === 'moderator') && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-royal-gold/50 hover:text-royal-gold hover:bg-royal-gold/5 transition-all mt-4"
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span className="font-sans text-sm">Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gold-dim/20 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all font-sans text-sm">
          ← Back to Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full font-sans text-sm"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-royal-dark border border-gold-dim text-royal-gold"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-royal-dark border-r border-gold-dim/20 flex-col z-30">
        <SidebarContent />
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-royal-dark border-r border-gold-dim/20 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
