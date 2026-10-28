import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types';
import { LayoutGrid } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';

export const JijiCategoryBar: React.FC = () => {
  const { language, filters, setFilters, listings } = useCampusSoko();

  const handleSelectCategory = (catId: CategoryId | 'all') => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId,
    }));
  };

  // Compute live count per category from actual active listings
  const getCategoryCount = (catId: string) => {
    return listings.filter((l) => l.status === 'active' && l.category === catId).length;
  };

  return (
    <div className="w-full">
      {/* Mobile Horizontal Category Icons Carousel (Jiji Mobile Style) */}
      <div className="lg:hidden">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-2 px-2">
          {/* All Categories Pill */}
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className="flex flex-col items-center gap-1.5 shrink-0 focus-visible:outline-none group"
          >
            <div
              className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
                filters.category === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
              }`}
            >
              <LayoutGrid className="w-6 h-6 stroke-[2]" />
            </div>
            <span
              className={`text-[10px] text-center max-w-[64px] line-clamp-1 ${
                filters.category === 'all'
                  ? 'font-bold text-emerald-600 dark:text-emerald-400'
                  : 'font-medium text-slate-600 dark:text-slate-400'
              }`}
            >
              {language === 'sw' ? 'Zote' : 'All'}
            </span>
          </button>

          {/* Individual Category Icons */}
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            const count = getCategoryCount(cat.id as string);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id as CategoryId)}
                className="flex flex-col items-center gap-1.5 shrink-0 focus-visible:outline-none group"
              >
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                      : `${cat.iconBg || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'} group-hover:scale-105`
                  }`}
                >
                  <CategoryIcon iconName={cat.iconName} iconImage={cat.iconImage} className="w-7 h-7 object-contain" />
                  {count > 0 && !isSelected && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[9px] font-bold">
                      {count}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] text-center max-w-[68px] line-clamp-1 ${
                    isSelected
                      ? 'font-bold text-emerald-600 dark:text-emerald-400'
                      : 'font-medium text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {language === 'sw' ? cat.nameSw : cat.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Category Sidebar (Jiji Desktop Style) */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-xs space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>{language === 'sw' ? 'Kategoria Kuu' : 'All Categories'}</span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {listings.filter((l) => l.status === 'active').length} ads
          </span>
        </div>

        {/* All Categories Option */}
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`w-full min-h-[42px] px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors ${
            filters.category === 'all'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4" />
            <span>{language === 'sw' ? 'Bidhaa Zote Chuoni' : 'All Campus Listings'}</span>
          </div>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-md ${
              filters.category === 'all' ? 'bg-emerald-700 text-white' : 'text-slate-400'
            }`}
          >
            {listings.filter((l) => l.status === 'active').length}
          </span>
        </button>

        {/* Category List */}
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            const count = getCategoryCount(cat.id as string) || (cat.count ?? 0);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id as CategoryId)}
                className={`w-full min-h-[42px] px-3 py-2 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${
                      isSelected ? 'bg-white/20 text-white' : cat.iconBg || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <CategoryIcon iconName={cat.iconName} iconImage={cat.iconImage} className="w-4 h-4 object-contain" />
                  </div>
                  <span className="truncate">{language === 'sw' ? cat.nameSw : cat.nameEn}</span>
                </div>

                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md tabular-nums shrink-0 ${
                    isSelected ? 'bg-emerald-700 text-white' : 'text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
