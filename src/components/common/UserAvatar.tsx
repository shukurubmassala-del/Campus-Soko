import React from 'react';
import { ShieldCheck, User as UserIcon, GraduationCap } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  showVerifiedBadge?: boolean;
}

// Deterministic pastel/brand color pair based on user name
const AVATAR_PALETTES = [
  { bg: 'from-emerald-600 to-teal-700', text: 'text-white' },
  { bg: 'from-blue-600 to-indigo-700', text: 'text-white' },
  { bg: 'from-amber-500 to-orange-600', text: 'text-slate-950' },
  { bg: 'from-purple-600 to-indigo-800', text: 'text-white' },
  { bg: 'from-teal-600 to-emerald-800', text: 'text-white' },
  { bg: 'from-rose-600 to-pink-700', text: 'text-white' },
  { bg: 'from-cyan-600 to-blue-700', text: 'text-white' },
];

function getInitials(name: string): string {
  if (!name || !name.trim()) return 'CS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPaletteIndex(name: string): number {
  if (!name) return 0;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % AVATAR_PALETTES.length;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-13 h-13 text-base',
  xl: 'w-18 h-18 sm:w-20 sm:h-20 text-xl font-black',
};

const BADGE_SIZES = {
  xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
  sm: 'w-3 h-3 -bottom-0.5 -right-0.5',
  md: 'w-3.5 h-3.5 -bottom-1 -right-1',
  lg: 'w-4 h-4 -bottom-1 -right-1',
  xl: 'w-5 h-5 -bottom-1 -right-1',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  className = '',
  size = 'md',
  isVerified = false,
  showVerifiedBadge = false,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Check if avatarUrl is an unwanted cartoon/AI-costume avatar or empty
  const hasValidUrl = typeof avatarUrl === 'string' && avatarUrl.trim().length > 0;
  const isAiCostumedAvatar =
    !hasValidUrl ||
    avatarUrl.includes('avataaars') ||
    avatarUrl.includes('bottts') ||
    avatarUrl.includes('personas');

  const shouldUseImage = hasValidUrl && !isAiCostumedAvatar && !imageError;
  const initials = getInitials(name);
  const palette = AVATAR_PALETTES[getPaletteIndex(name)];
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const badgeSize = BADGE_SIZES[size] || BADGE_SIZES.md;

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      {shouldUseImage ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClass} rounded-2xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-2xs`}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-2xl bg-gradient-to-br ${palette.bg} ${palette.text} font-bold flex items-center justify-center shadow-2xs border border-white/20 tracking-wider`}
          title={name}
        >
          {initials}
        </div>
      )}

      {/* Optional Verified Student Badge */}
      {showVerifiedBadge && isVerified && (
        <span
          className={`absolute ${badgeSize} bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xs p-0.5`}
          title="Verified Student"
        >
          <ShieldCheck className="w-full h-full text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
        </span>
      )}
    </div>
  );
};
