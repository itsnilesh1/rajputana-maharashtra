import { Shield, Crown, Star } from 'lucide-react';

// Role badges
const ROLE_BADGES: Record<string, {
  label: string;
  icon: typeof Shield;
  className: string;
  glow: string;
}> = {
  admin: {
    label: 'Admin',
    icon: Crown,
    className: 'bg-gradient-to-r from-royal-maroon to-[#C9A84C] text-white border border-[#C9A84C]/60 shadow-[0_0_12px_rgba(201,168,76,0.4)]',
    glow: 'shadow-[0_0_18px_rgba(201,168,76,0.5)]',
  },
  moderator: {
    label: 'Moderator',
    icon: Shield,
    className: 'bg-gradient-to-r from-purple-900 to-purple-700 text-purple-200 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    glow: 'shadow-[0_0_14px_rgba(168,85,247,0.4)]',
  },
};

// Member status badges
const STATUS_BADGES: Record<string, {
  label: string;
  icon: typeof Star;
  className: string;
}> = {
  approved: {
    label: 'Verified Member',
    icon: Star,
    className: 'bg-gradient-to-r from-[#1a0a00] to-[#2d1a00] text-[#C9A84C] border border-[#C9A84C]/50 shadow-[0_0_10px_rgba(201,168,76,0.25)]',
  },
};

interface MemberBadgeProps {
  role?: string;
  approvalStatus?: string;
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
  showStatus?: boolean;
}

const SIZE = {
  sm: { badge: 'px-1.5 py-0.5 text-[10px] gap-1', icon: 'w-2.5 h-2.5' },
  md: { badge: 'px-2.5 py-1 text-xs gap-1.5',     icon: 'w-3 h-3' },
  lg: { badge: 'px-3 py-1.5 text-sm gap-2',        icon: 'w-3.5 h-3.5' },
};

export default function MemberBadge({
  role,
  approvalStatus,
  size = 'md',
  showRole = true,
  showStatus = true,
}: MemberBadgeProps) {
  const s = SIZE[size];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Role badge — admin or moderator */}
      {showRole && role && ROLE_BADGES[role] && (() => {
        const b = ROLE_BADGES[role];
        const Icon = b.icon;
        return (
          <span className={`inline-flex items-center font-sans font-semibold tracking-wide rounded-full ${s.badge} ${b.className}`}>
            <Icon className={s.icon} />
            {b.label}
          </span>
        );
      })()}

      {/* Verified Member badge — approved profiles */}
      {showStatus && approvalStatus === 'approved' && (() => {
        const b = STATUS_BADGES.approved;
        const Icon = b.icon;
        return (
          <span className={`inline-flex items-center font-sans font-semibold tracking-wide rounded-full ${s.badge} ${b.className}`}>
            <Icon className={`${s.icon} fill-current`} />
            {b.label}
          </span>
        );
      })()}
    </div>
  );
}

// ─── Premium card variant — used on member cards ──────────────────────────────
export function VerifiedRing({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      {/* Animated gold ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A84C] via-[#f0d080] to-[#C9A84C] p-[2px] animate-[spin_4s_linear_infinite] opacity-80" />
      <div className="absolute inset-[2px] rounded-full bg-royal-black" />
      <div className="relative">{children}</div>
    </div>
  );
}

// ─── Inline verified tick — compact use ──────────────────────────────────────
export function VerifiedTick({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <span
      title="Verified Member"
      className={`inline-flex items-center justify-center ${sz} rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B1A1A] text-white flex-shrink-0`}
    >
      <svg viewBox="0 0 12 12" fill="none" className="w-2 h-2">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
