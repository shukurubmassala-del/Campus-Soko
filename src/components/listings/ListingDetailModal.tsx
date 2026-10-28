import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  HelpCircle,
  MapPin,
  MessageCircle,
  MessageSquare,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  X,
  Coffee,
  BookOpen,
  Tag,
  Lock,
} from 'lucide-react';
import { WhatsAppPrivacyModal } from '../trust/WhatsAppPrivacyModal';
import { BackHomeButton } from '../common/BackHomeButton';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { KebabMenu } from '../common/KebabMenu';
import { Accordion } from '../common/Accordion';
import { getUniversityColor } from '../../utils/universityColors';
import { getSafeAvatarUrl, getSafeListingImageUrl, isValidImageSrc } from '../../utils/imageUtils';

export const ListingDetailModal: React.FC = () => {
  const {
    language,
    t,
    activeListingDetail,
    setActiveListingDetail,
    favorites,
    toggleFavorite,
    openChatWithSeller,
    openReportModal,
    currentUniversity,
    showToast,
    currentUser,
    markListingStatus,
    deleteListing,
    setRoleView,
    setActiveTab,
    setFilters,
    setIsSafetyModalOpen,
    openProhibitedPolicyModal,
  } = useCampusSoko();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!activeListingDetail) return null;

  const listing = activeListingDetail;
  const isOwner = currentUser?.id === listing.sellerId;
  const isFav = favorites.includes(listing.id);
  const isSold = listing.status === 'sold';
  const rawPhotos = (listing.images || []).filter(isValidImageSrc);
  const photos = rawPhotos.length > 0 ? rawPhotos : [getSafeListingImageUrl(null)];
  const currentPhoto = photos[activePhotoIndex] || photos[0];
  const univColor = getUniversityColor(listing.universityId || currentUniversity.id);

  const conditionLabels: Record<string, { sw: string; en: string }> = {
    new: { sw: 'Kipya Kabisa', en: 'Brand New' },
    like_new: { sw: 'Kama Kipya (Hakijatumika sana)', en: 'Like New (Barely used)' },
    good: { sw: 'Hali Nzuri (Inafanya kazi bila hitilafu)', en: 'Good Condition (Fully functional)' },
    fair: { sw: 'Kawaida (Inafanya kazi)', en: 'Fair (Functional with signs of use)' },
  };

  const handleShare = () => {
    const shareData = {
      title: listing.title,
      text: `CampusSoko (${univColor.shortName}): ${listing.title} kwa ${formatTZS(listing.price)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast(language === 'sw' ? 'Kiungo kimenakiliwa!' : 'Link copied to clipboard!');
    }
  };

  const handleToggleSold = () => {
    const newStatus = isSold ? 'active' : 'sold';
    markListingStatus(listing.id, newStatus);
  };

  const handleDeleteListing = () => {
    deleteListing(listing.id);
    setActiveListingDetail(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
        
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[92vh] flex flex-col">
          
          {/* Header Controls with University Color Badge */}
          <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
              <BackHomeButton variant="compact" onClick={() => setActiveListingDetail(null)} />
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border truncate ${univColor.badgeBg} ${univColor.badgeText} ${univColor.badgeBorder}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${univColor.dotColor}`} />
                {univColor.shortName}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="truncate max-w-[120px]">{listing.campusZone}</span>
              {isOwner && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] shrink-0">
                  {t.ownerListingBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleShare}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                title={t.shareListing}
                aria-label="Shiriki tangazo / Share listing"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(listing.id)}
                className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                  isFav
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFav ? 'Ondoa kwenye vitu vilivyopendwa' : 'Hifadhi kwenye vitu vilivyopendwa'}
                aria-label={isFav ? 'Ondoa kwenye vitu vilivyopendwa' : 'Weka kwenye vitu vilivyopendwa'}
              >
                <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFav ? 'fill-red-500' : ''}`} />
              </button>

              {/* CareerFoundry Kebab Menu for Contextual Item Actions */}
              <KebabMenu
                buttonSize="md"
                ariaLabel={`Chaguzi za ${listing.title}`}
                items={[
                  {
                    label: language === 'sw' ? 'Shiriki / Copy Link' : 'Share / Copy Link',
                    icon: <Share2 className="w-3.5 h-3.5" />,
                    onClick: handleShare,
                  },
                  {
                    label: language === 'sw' ? 'Miongozo ya Usalama' : 'Campus Safety Tips',
                    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
                    onClick: () => setIsSafetyModalOpen(true),
                  },
                  {
                    label: language === 'sw' ? 'Sera ya Marufuku (PDPA)' : 'Prohibited Policy & PDPA',
                    icon: <Lock className="w-3.5 h-3.5 text-blue-500" />,
                    onClick: openProhibitedPolicyModal,
                  },
                  ...(!isOwner
                    ? [
                        {
                          label: language === 'sw' ? 'Ripoti Tangazo Hili' : 'Report this Listing',
                          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500" />,
                          destructive: true,
                          onClick: () =>
                            openReportModal({
                              type: 'listing',
                              id: listing.id,
                              title: listing.title,
                              sellerId: listing.sellerId,
                            }),
                        },
                      ]
                    : [
                        {
                          label: isSold
                            ? (language === 'sw' ? 'Weka kama Inapatikana' : 'Mark as Active')
                            : (language === 'sw' ? 'Weka kama Imeuzwa' : 'Mark as Sold'),
                          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
                          onClick: handleToggleSold,
                        },
                        {
                          label: language === 'sw' ? 'Futa Tangazo' : 'Delete Listing',
                          icon: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
                          destructive: true,
                          onClick: () => setShowDeleteConfirm(true),
                        },
                      ]),
                ]}
              />

              <button
                type="button"
                onClick={() => setActiveListingDetail(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                aria-label="Funga dirisha / Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
            
            {/* CareerFoundry Breadcrumb Trail Component */}
            <Breadcrumbs
              items={[
                {
                  label: language === 'sw' ? 'Soko la Chuo' : 'Marketplace',
                  onClick: () => {
                    setActiveListingDetail(null);
                    setRoleView('buyer');
                    setActiveTab('market');
                  },
                },
                {
                  label: currentUniversity.shortName,
                },
                {
                  label: listing.category.replace('_', ' '),
                },
                {
                  label: listing.title,
                  active: true,
                },
              ]}
              className="pb-1 border-b border-slate-100 dark:border-slate-800/60"
            />
            
            {/* Owner Management Banner & Quick Controls */}
            {isOwner && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.ownerControlsTitle}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isSold
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {isSold ? t.sold : t.active}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleToggleSold}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSold
                        ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSold ? t.markAsActive : t.markAsSold}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.deleteListingBtn}</span>
                  </button>
                </div>

                {showDeleteConfirm && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-900 dark:text-red-200 space-y-2 animate-in fade-in duration-150">
                    <p className="font-medium">{t.deleteListingConfirm}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteListing}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700"
                      >
                        {language === 'sw' ? 'Ndio, Futa' : 'Yes, Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sold Banner Notice for Non-Owners */}
            {isSold && !isOwner && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                <p className="font-semibold">{t.itemAlreadySold}</p>
              </div>
            )}

            {/* Photo Gallery Carousel */}
            <div className="space-y-3">
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner">
                {photos.length > 0 && currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={listing.title}
                    className="w-full h-full object-cover select-none"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="text-sm">{listing.title}</span>
                  </div>
                )}

                {/* Sold Watermark Overlay */}
                {isSold && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-5 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl sm:text-2xl tracking-widest shadow-xl uppercase rotate-[-6deg]">
                      {t.sold}
                    </span>
                  </div>
                )}

                {/* Prev / Next carousel controls */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                      aria-label="Picha iliyotangulia / Previous photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                      aria-label="Picha inayofuata / Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold tabular-nums">
                      {activePhotoIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Photo Thumbnails Strip */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {photos.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[8px] font-bold py-0.5 text-center">
                          {t.coverPhotoBadge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Title Block */}
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                {/* Product price: 16–18px/22–24px Bold (700) */}
                <span className="text-[22px] sm:text-[24px] font-bold text-[#2C3E50] dark:text-orange-400 tabular-nums tracking-tight">
                  {formatTZS(listing.price)}
                </span>
                <div className="flex items-center gap-2 text-[12px] sm:text-[13px] font-medium">
                  {listing.isNegotiable ? (
                    <span className="text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
                      {t.negotiable}
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {t.fixedPrice}
                    </span>
                  )}
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{listing.viewsCount} {t.views}</span>
                  </span>
                </div>
              </div>

              {/* Screen title: 22–24px, Semibold (600) */}
              <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 dark:text-white leading-snug">
                {listing.title}
              </h1>

              {/* Labels / metadata: 12–13px, Regular/Medium (400–500) */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {conditionLabels[listing.condition]?.[language] || listing.condition}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveListingDetail(null);
                    setFilters((prev) => ({ ...prev, category: listing.category }));
                    setRoleView('buyer');
                    setActiveTab('market');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 capitalize cursor-pointer transition-colors"
                  title={language === 'sw' ? `Tazama bidhaa zote za kundi hili` : `View all items in ${listing.category}`}
                >
                  {listing.category.replace('_', ' ')}
                </button>
                <span className="flex items-center gap-1 text-[12px] text-slate-400 font-normal">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{listing.createdAt}</span>
                </span>
              </div>
            </div>

            {/* Section heading: 18–20px, Semibold (600) & Body text: 14–16px, Regular (400) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-[18px] sm:text-[19px] font-semibold text-slate-900 dark:text-white">
                {t.itemDescription}
              </h2>
              <p className="text-[14px] sm:text-[15px] font-normal text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Seller Trust Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900 dark:text-white">
                  {t.sellerInfo}
                </h3>
                {listing.sellerVerified ? (
                  <div
                    title={language === 'sw' ? 'Mwanafunzi Aliyethibitishwa Chuo' : 'Verified Student at Campus'}
                    className="flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.verifiedStudent}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[12px] text-slate-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{t.unverified}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={getSafeAvatarUrl(listing.sellerAvatar, listing.sellerName)}
                  alt={listing.sellerName}
                  className="w-13 h-13 rounded-full bg-slate-200 dark:bg-slate-700 object-cover border-2 border-white dark:border-slate-800 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  {/* Product/seller name: 14–16px, Medium (500) */}
                  <h4 className="text-[15px] font-medium text-slate-900 dark:text-white truncate">
                    {listing.sellerName}
                  </h4>
                  <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{listing.sellerRating}</span>
                    </span>
                    <span>·</span>
                    <span className="truncate">{currentUniversity.shortName} ({listing.campusZone})</span>
                  </div>
                  <span className="text-[12px] text-slate-400 dark:text-slate-500 font-normal">
                    {language === 'sw' ? 'Mwanafunzi anayeaminika chuoni' : 'Active student seller'}
                  </span>
                </div>
              </div>
            </div>

            {/* Safe Campus Pickup Spot Recommendation */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold text-[14px]">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.safePickupAt}: {listing.safePickupPoint}</span>
              </div>
              <p className="text-[14px] font-normal text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                {language === 'sw'
                  ? 'Muuzaji anapendekeza kukutana hapa. Hili ni eneo rasmi la chuo lenye usalama, mwanga wa kutosha na wanafunzi wengi.'
                  : 'The seller recommends meeting at this spot. This is an open campus hub with natural daylight and security presence.'}
              </p>

              {/* Safe Meeting Points Suggestion Guide */}
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-[13px] font-semibold text-emerald-800 dark:text-emerald-300 block mb-1.5">
                  {t.safeMeetingPointsTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-medium text-emerald-950 dark:text-emerald-100">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/50">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t.safeSpotLibrary}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/50">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t.safeSpotGate}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/50">
                    <Coffee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t.safeSpotCafeteria}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/50">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t.safeSpotStudentCenter}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CareerFoundry Accordion: Safety, Meeting Spots, and Tanzania PDPA Compliance */}
            <div className="space-y-2">
              <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Miongozo ya Usalama na Sera' : 'Safety Guidelines & Policy'}
              </h3>
              <Accordion
                variant="bordered"
                allowMultiple={true}
                items={[
                  {
                    id: 'safety-rules',
                    title: t.safetyChecklistTitle,
                    defaultOpen: true,
                    icon: <ShieldCheck className="w-4 h-4" />,
                    badge: language === 'sw' ? 'Muhimu' : 'Essential',
                    content: (
                      <ul className="list-disc pl-5 space-y-1.5 text-[13px] text-slate-600 dark:text-slate-300">
                        <li>{t.safetyTip1}</li>
                        <li>{t.safetyTip2}</li>
                        <li>{t.safetyTip3}</li>
                        <li>{t.safetyTip4}</li>
                      </ul>
                    ),
                  },
                  {
                    id: 'pickup-spots',
                    title: language === 'sw' ? 'Maeneo Rasmi ya Kukutana Chuoni' : 'Campus Safe Meeting Spots',
                    icon: <MapPin className="w-4 h-4" />,
                    content: (
                      <div className="space-y-2.5 text-[13px]">
                        <p className="text-slate-600 dark:text-slate-300">
                          {language === 'sw'
                            ? `Tunashauri kukutana kwenye maeneo haya ya ${currentUniversity.shortName} mchana na mbele ya wanafunzi wengine:`
                            : `Recommended daytime pickup spots within ${currentUniversity.shortName}:`}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-medium text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t.safeSpotLibrary}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t.safeSpotGate}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <Coffee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t.safeSpotCafeteria}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{t.safeSpotStudentCenter}</span>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'pdpa-policy',
                    title: language === 'sw' ? 'Sheria ya Data (PDPA) & Vitu Vilivyopigwa Marufuku' : 'PDPA Privacy & Prohibited Items',
                    icon: <Lock className="w-4 h-4 text-blue-500" />,
                    content: (
                      <div className="space-y-2 text-[13px] text-slate-600 dark:text-slate-300">
                        <p>
                          {language === 'sw'
                            ? 'CampusSoko inalinda namba za simu na taarifa binafsi kulingana na Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania (PDPA 2022). Hatushiriki namba yako bila idhini yako.'
                            : 'CampusSoko safeguards student personal phone numbers and identities under Tanzania\'s Personal Data Protection Act (PDPA 2022).'}
                        </p>
                        <p className="text-red-600 dark:text-red-400 font-semibold text-[12px]">
                          {language === 'sw'
                            ? 'Marufuku kabisa: Mitihani, uvujishaji masomo, bidhaa haramu na silaha. Ukiukaji utapelekea kufungiwa akaunti mara moja.'
                            : 'Strictly prohibited: Exam papers, academic cheating services, weapons, or stolen goods. Violations lead to instant ban.'}
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Report Actions */}
            {!isOwner && (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openReportModal({
                      type: 'listing',
                      id: listing.id,
                      title: listing.title,
                      sellerId: listing.sellerId,
                    })
                  }
                  className="min-h-[44px] px-3.5 rounded-xl text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t.reportListing}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openReportModal({
                      type: 'user',
                      id: listing.sellerId,
                      title: listing.sellerName,
                      sellerId: listing.sellerId,
                    })
                  }
                  className="min-h-[44px] px-3.5 rounded-xl text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Shield className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Ripoti Muuzaji' : 'Report Seller'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Sticky Bottom Purchase & Contact Bar */}
          <div className="sticky bottom-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 border-t border-slate-200 dark:border-slate-800">
            {isOwner ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleSold}
                  className={`flex-1 h-12 rounded-2xl text-[14px] sm:text-[15px] font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    isSold
                      ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                      : 'bg-[#E67E22] hover:bg-[#D35400] text-white shadow-orange-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSold ? t.markAsActive : t.markAsSold}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveListingDetail(null)}
                  className="px-5 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[14px] sm:text-[15px] font-semibold cursor-pointer"
                >
                  {t.closeModal}
                </button>
              </div>
            ) : isSold ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.itemAlreadySold}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openChatWithSeller(listing)}
                  className="h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[14px] sm:text-[15px] font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Tuma Ujumbe' : 'Message Seller'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* WhatsApp Contact Button - Buttons: 14–16 px, Semibold (600) */}
                <button
                  type="button"
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] sm:text-[15px] font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.contactViaWhatsApp}</span>
                </button>

                {/* In-App Chat Button - High-converting Orange CTA */}
                <button
                  type="button"
                  onClick={() => openChatWithSeller(listing)}
                  className="w-full h-12 rounded-2xl bg-[#E67E22] hover:bg-[#D35400] text-white text-[14px] sm:text-[15px] font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.inAppChat}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* WhatsApp PDPA Privacy Consent Modal with Pre-filled Message */}
      {isWhatsAppModalOpen && (
        <WhatsAppPrivacyModal
          listing={listing}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}
    </>
  );
};
