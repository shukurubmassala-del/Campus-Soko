import React, { useState } from 'react';
import { Listing } from '../../types';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import {
  Camera,
  Heart,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Zap,
  Tag,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import { KebabMenu } from '../common/KebabMenu';
import { getUniversityColor } from '../../utils/universityColors';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const {
    language,
    favorites,
    toggleFavorite,
    setActiveListingDetail,
    recordListingView,
    openChatWithSeller,
    showToast,
    openReportModal,
    currentUniversity,
  } = useCampusSoko();

  const [imgError, setImgError] = useState(false);
  const isFav = favorites.includes(listing.id);
  const univColor = getUniversityColor(listing.universityId);

  const conditionLabels: Record<string, { sw: string; en: string }> = {
    new: { sw: 'Kipya', en: 'Brand New' },
    like_new: { sw: 'Kama Kipya', en: 'Like New' },
    good: { sw: 'Hali Nzuri', en: 'Good' },
    fair: { sw: 'Kawaida', en: 'Fair' },
  };

  const handleCardClick = () => {
    recordListingView(listing.id);
    setActiveListingDetail(listing);
  };

  const photoCount = listing.images?.length || 1;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${listing.title}, ${formatTZS(listing.price)}, ${listing.campusZone}`}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-[#E67E22]/50 dark:hover:border-[#E67E22]/50 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#E67E22] focus-visible:outline-none"
    >
      {/* Product Image Slot with Jiji Badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {listing.images &&
        listing.images[0] &&
        typeof listing.images[0] === 'string' &&
        listing.images[0].trim().length > 0 &&
        !imgError ? (
          <img
            src={listing.images[0].trim()}
            alt={listing.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-850 text-slate-400">
            <Tag className="w-8 h-8 stroke-1 mb-1 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center line-clamp-1">
              {listing.title}
            </span>
          </div>
        )}


        {/* Photo Counter Badge (Jiji Style) */}
        {photoCount > 0 && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
            <Camera className="w-3 h-3" />
            <span>{photoCount}</span>
          </div>
        )}

        {/* Card Action Controls: Clean Circular White Favorite Button with Floating Colored Shadow */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            className={`w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 flex items-center justify-center transition-all active:scale-90 hover:scale-110 cursor-pointer border border-black/5 ${
              isFav
                ? 'shadow-lg shadow-red-500/40 -translate-y-0.5 ring-2 ring-red-500/20'
                : 'shadow-md shadow-slate-950/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5'
            }`}
            aria-label={isFav ? `Ondoa ${listing.title} kwenye vitu vilivyopendwa` : `Hifadhi ${listing.title} kwenye vitu vilivyopendwa`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300 stroke-[2]'
              }`}
            />
          </button>
        </div>

        {/* Status Overlay (if sold or reserved) */}
        {listing.status !== 'active' && (
          <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
              {listing.status === 'sold'
                ? (language === 'sw' ? 'Kimeuzwa' : 'Sold')
                : (language === 'sw' ? 'Kimetengwa' : 'Reserved')}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body (Strictly emulating Anatomy Section 5) */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-1">
          {/* 1. Product Title: 14–15px, Bold */}
          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug group-hover:text-[#00B53F] transition-colors">
            {listing.title}
          </h3>

          {/* 2. Product Price: Bold Vibrant Green TZS */}
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-[15px] sm:text-[16px] font-bold text-[#00B53F] dark:text-emerald-400 tabular-nums tracking-tight">
              {formatTZS(listing.price)}
            </span>
            {listing.isNegotiable && (
              <span className="text-[10px] sm:text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                {language === 'sw' ? 'Maelewano' : 'Negotiable'}
              </span>
            )}
          </div>

          {/* 3. Seller Row: User icon/avatar + Seller Name */}
          <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-300 truncate pt-0.5">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
              {listing.sellerAvatar ? (
                <img
                  src={listing.sellerAvatar}
                  alt={listing.sellerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
                  {listing.sellerName[0]}
                </span>
              )}
            </div>
            <span className="truncate font-medium text-slate-700 dark:text-slate-200">
              {listing.sellerName}
            </span>
            {listing.sellerVerified && (
              <ShieldCheck className="w-3.5 h-3.5 text-[#00B53F] shrink-0" />
            )}
          </div>

          {/* 4. Location Row: MapPin icon + Campus / City Location */}
          <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#00B53F] dark:text-emerald-400 shrink-0" />
            <span className="truncate font-normal">
              {listing.campusZone || currentUniversity.shortName}
            </span>
          </div>
        </div>

        {/* 5. Timestamp Badge on Bottom Right (e.g., '2 days ago', '1 day ago') */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 mt-1">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${univColor.dotColor}`} />
            <span className="font-semibold text-slate-500 dark:text-slate-400">{univColor.shortName}</span>
          </div>

          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
            {listing.createdAt || 'Hivi karibuni'}
          </span>
        </div>
      </div>
    </article>
  );
};
