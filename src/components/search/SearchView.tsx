import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { ListingCard } from '../listings/ListingCard';
import { ListingGridSkeleton } from '../listings/ListingCardSkeleton';
import { BackHomeButton } from '../common/BackHomeButton';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { PriceRangeSlider } from '../common/PriceRangeSlider';
import { ColorPreferencePicker } from '../common/ColorPreferencePicker';
import { CATEGORIES } from '../../data/categories';
import { formatTZS } from '../../utils/currency';
import { CategoryId, Condition, FilterState } from '../../types';
import {
  ArrowUpDown,
  Building2,
  Check,
  ChevronDown,
  Filter,
  HelpCircle,
  Loader2,
  MapPin,
  PackageOpen,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  X,
  BookOpen,
  Laptop,
  Home,
  Shirt,
  Coffee,
  Briefcase,
  Armchair,
  Tag,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export const SearchView: React.FC = () => {
  const {
    language,
    t,
    filteredListings,
    filters,
    setFilters,
    resetFilters,
    currentUniversity,
    universities,
    setSelectedUniversityId,
    selectedUniversityId,
    currentUser,
    setIsAuthModalOpen,
    setIsCreateListingOpen,
    setIsCreateWantedOpen,
    colorTheme,
    userColorPreference,
  } = useCampusSoko();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLowDataMode, setIsLowDataMode] = useState(false);

  // Intersection Observer Sentinel Ref
  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Quick Swahili/English keyword chips
  const quickSearchChips = useMemo(() => {
    return language === 'sw'
      ? [
          { label: 'Vitabu vya Chuo', query: 'kitabu' },
          { label: 'HP / Dell Laptop', query: 'laptop' },
          { label: 'Pasi ya Umeme', query: 'pasi' },
          { label: 'Godoro la Bweni', query: 'godoro' },
          { label: 'Kalkuleta Casio', query: 'kalkuleta' },
          { label: 'Simu za Wanafunzi', query: 'simu' },
          { label: 'Kettle / Jiko', query: 'kettle' },
          { label: 'Sneakers & Viatu', query: 'viatu' },
        ]
      : [
          { label: 'Engineering Books', query: 'book' },
          { label: 'Laptops & Mac', query: 'laptop' },
          { label: 'Electric Iron (Pasi)', query: 'iron' },
          { label: 'Hostel Mattress', query: 'mattress' },
          { label: 'Casio Calculator', query: 'calculator' },
          { label: 'Smartphones', query: 'phone' },
          { label: 'Electric Kettle', query: 'kettle' },
          { label: 'Campus Sneakers', query: 'shoes' },
        ];
  }, [language]);

  // Auto-focus search bar for typing when user clicks search button / navigates to search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Simulate fast debounced search loader when query changes
  useEffect(() => {
    setIsSearching(true);
    setDisplayedCount(ITEMS_PER_PAGE);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters.searchQuery, filters.category, filters.condition, filters.minPrice, filters.maxPrice, filters.campusZone, filters.universityId, filters.sortBy]);

  // Paginated listings for infinite scroll
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
          // Realistic network latency simulation (longer if low-data mode)
          const delay = isLowDataMode ? 600 : 350;
          setTimeout(() => {
            setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredListings.length));
            setIsLoadingMore(false);
          }, delay);
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, filteredListings.length, isLowDataMode]);

  // Manual Load More Handler
  const handleManualLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredListings.length));
      setIsLoadingMore(false);
    }, 300);
  };

  // Quick Price Preset handlers
  const handlePricePreset = (min?: number, max?: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Active filter count calculation
  const activeFiltersCount = [
    filters.category !== 'all',
    filters.condition !== 'all',
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
    filters.campusZone !== undefined && filters.campusZone !== 'all',
    filters.universityId !== undefined && filters.universityId !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Top Back Home & CareerFoundry Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            <BackHomeButton />
            <Breadcrumbs
              items={[
                {
                  label: currentUniversity.shortName,
                },
                {
                  label: language === 'sw' ? 'Tafuta' : 'Search',
                },
                ...(filters.category !== 'all'
                  ? [
                      {
                        label:
                          CATEGORIES.find((c) => c.id === filters.category)?.[
                            language === 'sw' ? 'nameSw' : 'nameEn'
                          ] || filters.category,
                        active: true,
                      },
                    ]
                  : []),
              ]}
            />
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Color Preference Switcher (Defaults to Black & White) */}
            <ColorPreferencePicker variant="compact" />

            {/* Low Data Mode Toggle (Essential for Tanzanian mobile networks) */}
            <button
              type="button"
              onClick={() => setIsLowDataMode(!isLowDataMode)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none shrink-0 ${
                isLowDataMode
                  ? colorTheme.subtleActiveBg
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
              title="Washa hali ya kuokoa bando la simu kwenye mtandao wa polepole"
              aria-pressed={isLowDataMode}
              aria-label={`${t.slowConnectionMode}: ${isLowDataMode ? 'Active' : 'Inactive'}`}
            >
              {isLowDataMode ? (
                <WifiOff className={`w-3.5 h-3.5 ${colorTheme.iconColor}`} />
              ) : (
                <Wifi className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{t.slowConnectionMode}</span>
            </button>
          </div>
        </div>

        {/* Top Title - Screen title: 22–24 px, Semibold (600) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className={`w-5 h-5 ${colorTheme.iconColor}`} />
              <span>{t.navSearch} CampusSoko</span>
            </h1>
            <p className="text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'sw'
                ? `Tafuta vitu vinavyouzwa na wanafunzi wa ${currentUniversity.shortName} au nchi nzima.`
                : `Search items from verified students at ${currentUniversity.shortName} or across Tanzania.`}
            </p>
          </div>
        </div>

        {/* Main Search Input Box */}
        <div className="relative">
          <label htmlFor="search-view-input" className="sr-only">
            {t.searchPlaceholder}
          </label>
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${colorTheme.iconColor}`} />
          <input
            id="search-view-input"
            ref={searchInputRef}
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className={`w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-[14px] sm:text-[15px] font-normal text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${colorTheme.ringFocus} focus:border-slate-900 dark:focus:border-white shadow-inner transition-all`}
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({ ...prev, searchQuery: '' }));
                searchInputRef.current?.focus();
              }}
              className={`absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none`}
              aria-label="Futa utafutaji / Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Synonym Chips (Swahili & English - Wrap on page, NO sliding) */}
        <div className="space-y-1.5">
          <span className="text-[12px] sm:text-[13px] font-medium text-slate-500 dark:text-slate-400">
            {t.searchSynonymsHint}
          </span>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {quickSearchChips.map((chip, idx) => {
              const isActive = filters.searchQuery.toLowerCase() === chip.query.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      searchQuery: isActive ? '' : chip.query,
                    }))
                  }
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors flex items-center justify-center focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none ${
                    isActive
                      ? colorTheme.badgeActive
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pill Strip (Wrap on page, NO sliding) */}
        <div className="flex flex-wrap items-center gap-2 pb-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all flex items-center justify-center focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none ${
              filters.category === 'all'
                ? colorTheme.badgeActive
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.allCategories}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    category: isSelected ? 'all' : cat.id,
                  }))
                }
                className={`min-h-[42px] px-4 py-2 rounded-xl text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none ${
                  isSelected
                    ? colorTheme.badgeActive
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{language === 'sw' ? cat.nameSw : cat.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[12px] sm:text-[13px]">
          
          {/* Results Summary */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              {t.resultsCount.replace('{count}', String(filteredListings.length))}
            </span>
            <span>·</span>
            <span className="truncate font-medium text-slate-700 dark:text-slate-300">
              {filters.universityId && filters.universityId !== 'all'
                ? universities.find((u) => u.id === filters.universityId)?.shortName
                : currentUniversity.shortName}
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Sorting Dropdown */}
            <div className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="search-sort-select" className="sr-only">
                {language === 'sw' ? 'Panga matokeo' : 'Sort search results'}
              </label>
              <select
                id="search-sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                className={`bg-transparent text-[13px] font-semibold text-slate-800 dark:text-slate-200 border-none outline-hidden cursor-pointer focus-visible:ring-2 ${colorTheme.ringFocus} rounded-md`}
              >
                <option value="newest">{t.sortNewest}</option>
                <option value="price_asc">{t.sortPriceLow}</option>
                <option value="price_desc">{t.sortPriceHigh}</option>
                <option value="popular">{t.sortPopular}</option>
              </select>
            </div>

            {/* Filter Drawer Toggle Button - Buttons: 14–16 px, Semibold (600) */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-colors font-semibold text-[13px] sm:text-[14px] focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none ${
                activeFiltersCount > 0
                  ? colorTheme.subtleActiveBg
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
              aria-expanded={isFilterDrawerOpen}
              aria-label="Vichungi / Advanced filters"
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${colorTheme.iconColor}`} />
              <span>{language === 'sw' ? 'Vichungi' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className={`w-5 h-5 rounded-full ${colorTheme.badgeActive} text-[11px] flex items-center justify-center font-bold`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Reset Filters button if any filter is active */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                title={t.clearAllFilters}
                aria-label={t.clearAllFilters}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {isFilterDrawerOpen && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* 1. University Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t.filterUniversity}
                </label>
                <select
                  value={filters.universityId || selectedUniversityId}
                  onChange={(e) => {
                    const uniId = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      universityId: uniId === 'all' ? 'all' : uniId,
                      campusZone: undefined,
                    }));
                  }}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="all">{t.allCampuses} (Tanzania)</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.shortName} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Campus Zone Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
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
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="all">{t.allZones}</option>
                  {currentUniversity.zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Condition Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
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
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="all">{t.allConditions}</option>
                  <option value="new">{t.conditionNew}</option>
                  <option value="like_new">{t.conditionLikeNew}</option>
                  <option value="good">{t.conditionGood}</option>
                  <option value="fair">{t.conditionFair}</option>
                </select>
              </div>

              {/* 4. CareerFoundry Price Range Slider */}
              <div className="sm:col-span-2 md:col-span-1">
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onChange={(min, max) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: min,
                      maxPrice: max,
                    }))
                  }
                />
              </div>

            </div>

            {/* Quick Price Presets */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">
                {language === 'sw' ? 'Mifano ya bajeti:' : 'Quick budget:'}
              </span>
              <button
                type="button"
                onClick={() => handlePricePreset(undefined, 20000)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none`}
              >
                {t.priceUnder20k}
              </button>
              <button
                type="button"
                onClick={() => handlePricePreset(20000, 50000)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none`}
              >
                {t.price20to50k}
              </button>
              <button
                type="button"
                onClick={() => handlePricePreset(50000, 150000)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none`}
              >
                {t.price50to150k}
              </button>
              <button
                type="button"
                onClick={() => handlePricePreset(150000, undefined)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none`}
              >
                {t.priceAbove150k}
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-[36px] px-3 py-1.5 rounded-xl text-slate-500 hover:text-red-500 dark:hover:text-red-400 text-xs font-semibold ml-auto focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              >
                {t.clearAllFilters}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-slate-400">
            {t.activeFiltersLabel}
          </span>

          {filters.category !== 'all' && (
            <span className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold ${colorTheme.subtleActiveBg}`}>
              <span>{filters.category}</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`Ondoa kichungi cha kategoria: ${filters.category}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.condition !== 'all' && (
            <span className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold ${colorTheme.subtleActiveBg}`}>
              <span>{filters.condition}</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, condition: 'all' }))}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`Ondoa kichungi cha hali: ${filters.condition}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.campusZone && (
            <span className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold ${colorTheme.subtleActiveBg}`}>
              <span>{filters.campusZone}</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, campusZone: undefined }))}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`Ondoa kichungi cha eneo: ${filters.campusZone}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <span className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold ${colorTheme.subtleActiveBg}`}>
              <span>
                {filters.minPrice ? formatTZS(filters.minPrice) : 'TZS 0'} -{' '}
                {filters.maxPrice ? formatTZS(filters.maxPrice) : 'Max'}
              </span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }))}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Ondoa kichungi cha bei"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[32px] px-2.5 py-1 text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 underline font-semibold focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            {t.clearAllFilters}
          </button>
        </div>
      )}

      {/* Product Listings Results */}
      {isSearching ? (
        /* Skeleton loaders while search query or filters are active */
        <ListingGridSkeleton count={8} />
      ) : visibleListings.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {visibleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Infinite Scroll Sentinel & Loading Indicator */}
          <div ref={sentinelRef} className="py-6 text-center">
            {isLoadingMore ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.loadingMore}</span>
                </div>
                {/* Secondary skeleton row for smooth loading */}
                <ListingGridSkeleton count={4} />
              </div>
            ) : hasMore ? (
              /* Fallback Manual Load More Button for devices with throttled observers - Buttons: 14–16 px, Semibold (600) */
              <button
                type="button"
                onClick={handleManualLoadMore}
                className="px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[14px] sm:text-[15px] font-semibold transition-all shadow-xs"
              >
                {t.loadMoreBtn} ({filteredListings.length - displayedCount} {language === 'sw' ? 'zilizobaki' : 'more'})
              </button>
            ) : (
              /* End of listings notice */
              <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[12px] sm:text-[13px] font-normal text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                <Check className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <p>
                  {t.endOfListings.replace('{university}', currentUniversity.shortName)}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto my-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <PackageOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white">
              {t.noListingsFound}
            </h3>
            <p className="text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              {t.tryDifferentFilters}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              {t.resetFilters}
            </button>

            {/* If not found, let student post to Wanted Board! */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsCreateWantedOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t.postWantedBtn}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
