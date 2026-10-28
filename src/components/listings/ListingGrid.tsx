import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { ListingCard } from './ListingCard';
import { ListingGridSkeleton } from './ListingCardSkeleton';
import { CATEGORIES } from '../../data/categories';
import {
  ArrowUpDown,
  Check,
  Filter,
  Loader2,
  PackageOpen,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CategoryId, Condition, FilterState } from '../../types';

const ITEMS_PER_PAGE = 8;

export const ListingGrid: React.FC = () => {
  const {
    language,
    t,
    filteredListings,
    filters,
    setFilters,
    resetFilters,
    currentUniversity,
    setIsCreateListingOpen,
    currentUser,
    setIsAuthModalOpen,
  } = useCampusSoko();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Quick filter chip handlers
  const handleQuickChip = (type: 'all' | 'verified' | 'under25k' | 'new') => {
    if (type === 'all') {
      resetFilters();
    } else if (type === 'verified') {
      setFilters((prev) => ({ ...prev, condition: 'all' }));
    } else if (type === 'under25k') {
      setFilters((prev) => ({ ...prev, maxPrice: 25000 }));
    } else if (type === 'new') {
      setFilters((prev) => ({ ...prev, condition: 'new' }));
    }
  };

  // Brief loading skeleton animation on search/filter update
  useEffect(() => {
    setIsFiltering(true);
    setDisplayedCount(ITEMS_PER_PAGE);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [filters.searchQuery, filters.category, filters.condition, filters.minPrice, filters.maxPrice, filters.campusZone, filters.sortBy]);

  // Sliced listings for infinite scroll
  const visibleListings = useMemo(() => {
    return filteredListings.slice(0, displayedCount);
  }, [filteredListings, displayedCount]);

  const hasMore = displayedCount < filteredListings.length;

  // Infinite Scroll via Intersection Observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredListings.length));
            setIsLoadingMore(false);
          }, 350);
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, filteredListings.length]);

  const handleManualLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredListings.length));
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <section className="space-y-4">
      
      {/* Jiji Filter & Sorting Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        
        {/* Results Title & Quick Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00b53f] animate-pulse" />
            {/* Section heading: 18–20px, Semibold (600) */}
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'sw' ? 'Matangazo ya Chuo' : 'Campus Listings'}</span>
              <span className="text-slate-400 font-normal text-[13px]">
                ({filteredListings.length})
              </span>
            </h3>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline truncate max-w-[150px]">
              {currentUniversity.shortName}
            </span>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="relative min-h-[38px] flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label htmlFor="marketplace-sort-select" className="sr-only">
                {language === 'sw' ? 'Panga matokeo' : 'Sort listings'}
              </label>
              <select
                id="marketplace-sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                className="bg-transparent text-[12px] sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 border-none outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-md"
              >
                <option value="newest">{t.sortNewest}</option>
                <option value="price_asc">{t.sortPriceLow}</option>
                <option value="price_desc">{t.sortPriceHigh}</option>
                <option value="popular">{t.sortPopular}</option>
              </select>
            </div>

            {/* Filter Toggle Button: 14–16px, Semibold (600) */}
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors text-[14px] font-semibold cursor-pointer ${
                filters.condition !== 'all' || filters.campusZone || filters.minPrice || filters.maxPrice
                  ? 'border-[#00b53f] text-[#00872e] dark:text-emerald-300 bg-[#e8f8ec] dark:bg-emerald-950/40'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Filter by zone, condition, price"
              aria-expanded={showFilterDrawer}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00b53f]" />
              <span>{language === 'sw' ? 'Chuja' : 'Filters'}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Chips: 12–13px, Regular/Medium (400–500) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => handleQuickChip('all')}
            className="px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap transition-colors"
          >
            {language === 'sw' ? 'Yote' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => handleQuickChip('verified')}
            className="px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-[#00872e] dark:text-emerald-300 hover:bg-emerald-100 whitespace-nowrap transition-colors flex items-center gap-1 border border-emerald-200/50 dark:border-emerald-800/50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00b53f]" />
            <span>{language === 'sw' ? 'Wauzaji walioidhinishwa' : 'Verified sellers'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickChip('under25k')}
            className={`px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-colors ${
              filters.maxPrice === 25000
                ? 'bg-[#00b53f] text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            {language === 'sw' ? 'Chini ya TZS 25,000' : 'Under TZS 25,000'}
          </button>
          <button
            type="button"
            onClick={() => handleQuickChip('new')}
            className={`px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-colors ${
              filters.condition === 'new'
                ? 'bg-[#00b53f] text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            {language === 'sw' ? 'Vipya tu (brand new)' : 'Brand new only'}
          </button>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showFilterDrawer && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
            {/* Campus Zone Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t.campusZone}
              </label>
              <select
                value={filters.campusZone || 'all'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    campusZone: e.target.value === 'all' ? undefined : e.target.value,
                  }))
                }
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">{t.allZones}</option>
                {currentUniversity.zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t.filterByCondition}
              </label>
              <select
                value={filters.condition}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    condition: e.target.value as Condition | 'all',
                  }))
                }
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">{t.allConditions}</option>
                <option value="new">{t.conditionNew}</option>
                <option value="like_new">{t.conditionLikeNew}</option>
                <option value="good">{t.conditionGood}</option>
                <option value="fair">{t.conditionFair}</option>
              </select>
            </div>

            {/* Price Max Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {language === 'sw' ? 'Bei ya Juu (TZS)' : 'Max Price (TZS)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mfano: 50000"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2 text-xs font-medium text-slate-500 hover:text-red-500 whitespace-nowrap cursor-pointer"
                  title={t.resetFilters}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Product Listings Grid with Skeletons & Infinite Scroll (Jiji 2-col mobile, 3-col desktop) */}
      {isFiltering ? (
        <ListingGridSkeleton count={8} />
      ) : visibleListings.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {visibleListings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>

          {/* Infinite Scroll Sentinel and Load More indicator */}
          <div ref={sentinelRef} className="py-6 text-center">
            {isLoadingMore ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#00b53f]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.loadingMore}</span>
                </div>
                <ListingGridSkeleton count={4} />
              </div>
            ) : hasMore ? (
              <button
                type="button"
                onClick={handleManualLoadMore}
                className="px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#00b53f] text-slate-700 dark:text-slate-200 text-[14px] sm:text-[15px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                {t.loadMoreBtn} ({filteredListings.length - displayedCount} {language === 'sw' ? 'zilizobaki' : 'more'})
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[13px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                <Check className="w-4 h-4 text-[#00b53f] mx-auto mb-1" />
                <p>
                  {t.endOfListings.replace('{university}', currentUniversity.shortName)}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#e8f8ec] dark:bg-emerald-950/50 text-[#00b53f] flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            {/* Section heading: 18–20px, Semibold (600) */}
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white">
              {t.noListingsFound}
            </h3>
            {/* Body text: 14–16px, Regular (400) */}
            <p className="text-[14px] font-normal text-slate-500 dark:text-slate-400">
              {t.tryDifferentFilters}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {/* Buttons: 14–16px, Semibold (600) */}
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-[14px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {t.resetFilters}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsCreateListingOpen(true);
              }}
              className="px-5 py-2 text-[14px] font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.navSell || 'UZA'}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
