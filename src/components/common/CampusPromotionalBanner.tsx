import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { ChevronRight, Sparkles } from 'lucide-react';

export const CampusPromotionalBanner: React.FC = () => {
  const { language, setIsCreateListingOpen, currentUser, setIsAuthModalOpen, setRoleView } = useCampusSoko();

  const handleClick = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreateListingOpen(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#064E3B] via-[#075945] to-[#043d2e] dark:from-[#032d22] dark:to-[#021f17] p-3.5 sm:p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.99] border border-emerald-500/20"
      aria-label="Sell. Buy. Connect. Your campus marketplace is here!"
    >
      {/* Background Glow Accents */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-6 w-28 h-28 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: 3D Graduation Cap on Stacked Books Artwork */}
        <div className="relative shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 shadow-inner group-hover:scale-105 transition-transform">
          <svg
            viewBox="0 0 64 64"
            className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bottom Book (Green) */}
            <path
              d="M14 46L32 52L50 46L32 40L14 46Z"
              fill="#10B981"
            />
            <path
              d="M14 46V50L32 56V52L14 46Z"
              fill="#059669"
            />
            <path
              d="M50 46V50L32 56V52L50 46Z"
              fill="#047857"
            />

            {/* Middle Book (Gold / Orange) */}
            <path
              d="M16 40L32 45L48 40L32 35L16 40Z"
              fill="#F59E0B"
            />
            <path
              d="M16 40V44L32 49V45L16 40Z"
              fill="#D97706"
            />
            <path
              d="M48 40V44L32 49V45L48 40Z"
              fill="#B45309"
            />

            {/* Top Book (Teal) */}
            <path
              d="M18 34L32 38.5L46 34L32 29.5L18 34Z"
              fill="#06B6D4"
            />
            <path
              d="M18 34V37.5L32 42V38.5L18 34Z"
              fill="#0891B2"
            />
            <path
              d="M46 34V37.5L32 42V38.5L46 34Z"
              fill="#0E7490"
            />

            {/* 3D Cyan Graduation Cap */}
            <path
              d="M32 10L52 17L32 24L12 17L32 10Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="0.8"
            />
            {/* Cap Underneath Depth */}
            <path
              d="M20 21.5V26.5C20 29.5 25.4 32 32 32C38.6 32 44 29.5 44 26.5V21.5L32 25.5L20 21.5Z"
              fill="#0284C7"
            />
            {/* Tassel */}
            <path
              d="M32 17L44 22V28"
              stroke="#FBBF24"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="44" cy="28.5" r="1.5" fill="#F59E0B" />
          </svg>
        </div>

        {/* Center: Title & Subtext */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[16px] sm:text-[18px] font-extrabold text-white tracking-tight leading-snug">
              {language === 'sw' ? 'Uza. Nunua. Ungana.' : 'Sell. Buy. Connect.'}
            </h3>
          </div>
          <p className="text-[12px] sm:text-[13px] text-emerald-100/90 font-normal line-clamp-1 mt-0.5">
            {language === 'sw'
              ? 'Soko lako la wanafunzi chuo lipo hapa!'
              : 'Your campus marketplace is here!'}
          </p>
        </div>

        {/* Right: Action Chevron */}
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/15 group-hover:bg-white/25 group-hover:translate-x-0.5 text-white transition-all">
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
