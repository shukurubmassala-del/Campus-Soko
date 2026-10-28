import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types';
import { LayoutGrid } from 'lucide-react';

export const CategoryChipsBar: React.FC = () => {
  const { language, filters, setFilters } = useCampusSoko();
  const activeCategory = filters.category;

  const handleSelectCategory = (id: CategoryId | 'all') => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === id ? 'all' : id,
    }));
  };

  return (
    <div className="w-full">
      {/* All Category Buttons & Icons Directly Visible Upon Opening */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5">
        {/* All Button with Drafted Square Box Icon */}
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`min-h-[40px] px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 select-none flex items-center gap-1.5 ${
            activeCategory === 'all'
              ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 -translate-y-0.5 font-bold scale-[1.02]'
              : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{language === 'sw' ? 'Yote' : 'All'}</span>
        </button>

        {/* All 11 Campus Categories Visible */}
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`min-h-[40px] px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 select-none flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 -translate-y-0.5 font-bold scale-[1.02]'
                  : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <span>{language === 'sw' ? cat.nameSw.split(' ')[0] : cat.nameEn.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
