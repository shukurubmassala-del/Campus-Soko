import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategoryId } from '../../types';
import { Grid } from 'lucide-react';

export const JijiMobileCategoryStrip: React.FC = () => {
  const {
    language,
    t,
    filters,
    setFilters,
  } = useCampusSoko();

  const activeCategory = filters.category;

  const handleSelectCategory = (catId: CategoryId | 'all') => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId,
    }));
  };

  return (
    <div className="lg:hidden bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black text-slate-900 dark:text-white tracking-wider">
          {language === 'sw' ? 'Makundi ya bidhaa' : 'Categories'}
        </span>
        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className="text-[11px] font-bold text-[#E67E22] hover:underline"
          >
            {language === 'sw' ? 'Onyesha zote' : 'Reset all'}
          </button>
        )}
      </div>

      {/* Category Grid - All category buttons on same page, NO sliding to left or right, scroll downward or upward only */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
        {/* All Categories Button - Floating Rounded Pill */}
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer border ${
            activeCategory === 'all'
              ? 'bg-orange-50 dark:bg-orange-950/60 border-[#E67E22] shadow-lg shadow-orange-500/30 -translate-y-0.5 scale-[1.03] ring-1 ring-orange-500/30'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm shadow-slate-900/5 hover:-translate-y-0.5'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeCategory === 'all'
                ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/40'
                : 'bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] font-bold text-center leading-tight line-clamp-1 truncate w-full mt-1.5 ${
              activeCategory === 'all' ? 'text-[#E67E22]' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.allCategories}
          </span>
        </button>

        {/* Category Buttons - Floating Rounded with Orange Shadows */}
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-orange-50 dark:bg-orange-950/60 border-[#E67E22] shadow-lg shadow-orange-500/30 -translate-y-0.5 scale-[1.03] ring-1 ring-orange-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm shadow-slate-900/5 hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                  isSelected
                    ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/40'
                    : `${cat.iconBg} shadow-xs`
                }`}
              >
                <CategoryIcon iconName={cat.iconName} iconImage={cat.iconImage} className="w-6 h-6 object-contain" />
              </div>
              <span
                className={`text-[10px] text-center leading-tight line-clamp-1 truncate w-full mt-1.5 ${
                  isSelected ? 'font-bold text-[#E67E22]' : 'font-medium text-slate-700 dark:text-slate-300'
                }`}
              >
                {language === 'sw' ? cat.nameSw.split(' ')[0] : cat.nameEn.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
