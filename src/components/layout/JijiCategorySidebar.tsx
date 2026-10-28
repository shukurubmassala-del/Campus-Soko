import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { CategoryId } from '../../types';
import {
  Grid,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Building2,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const JijiCategorySidebar: React.FC = () => {
  const {
    language,
    t,
    filters,
    setFilters,
    currentUniversity,
    setIsSafetyModalOpen,
    openProhibitedPolicyModal,
    listings,
  } = useCampusSoko();

  const activeCategory = filters.category;

  const handleSelectCategory = (catId: CategoryId | 'all') => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId,
    }));
  };

  // Compute live count of listings per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of listings) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [listings]);

  return (
    <aside className="w-64 shrink-0 hidden lg:block space-y-4">
      
      {/* Category Navigation Card (Jiji Left Sidebar) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Header - Section heading: 18–20px, Semibold (600) */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#E67E22]" />
            <h3 className="font-semibold text-[18px] text-slate-900 dark:text-white">
              {language === 'sw' ? 'Makundi ya bidhaa' : 'All categories'}
            </h3>
          </div>
          <span className="text-[12px] font-medium text-slate-400">
            {CATEGORIES.length}
          </span>
        </div>

        {/* All Items Button - Labels / metadata: 12–13px, Regular/Medium (400–500) */}
        <div className="p-1.5 space-y-0.5">
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer text-left ${
              activeCategory === 'all'
                ? 'bg-orange-50 text-[#D35400] dark:bg-orange-950/70 dark:text-orange-300 font-semibold border-l-4 border-[#E67E22]'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Grid className="w-3.5 h-3.5" />
              </div>
              <span>{t.allCategories}</span>
            </div>
            <span className="text-[12px] font-medium text-slate-400">
              {listings.length}
            </span>
          </button>

          {/* Individual Categories */}
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? cat.count ?? 0;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-orange-50 text-[#D35400] dark:bg-orange-950/70 dark:text-orange-300 font-semibold border-l-4 border-[#E67E22]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${cat.iconBg}`}>
                    <CategoryIcon iconName={cat.iconName} iconImage={cat.iconImage} className="w-4 h-4 object-contain" />
                  </div>
                  <span className="truncate">
                    {language === 'sw' ? cat.nameSw : cat.nameEn}
                  </span>
                </div>
                <span className={`text-[12px] font-medium shrink-0 ml-1.5 ${
                  isSelected ? 'text-[#E67E22] dark:text-orange-400 font-semibold' : 'text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Trust & Safe Meeting Spots Box (Jiji Left Box) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#2C3E50] dark:text-[#E67E22]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {/* Section heading: 18–20px, Semibold (600) */}
          <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white">
            {language === 'sw' ? 'Vituo salama chuoni' : 'Campus safe spots'}
          </h3>
        </div>

        <p className="text-[13px] font-normal text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'sw'
            ? `Wanafunzi wa ${currentUniversity.shortName} wanakutana maeneo salama kama Maktaba Kuu na Cafeteria mchana.`
            : `Students at ${currentUniversity.shortName} trade hand-to-hand at daylight safe spots like Main Library.`}
        </p>

        <div className="space-y-1.5 pt-1">
          {currentUniversity.safeMeetingPoints.slice(0, 3).map((spot) => (
            <div key={spot} className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00b53f] shrink-0" />
              <span className="truncate">{spot}</span>
            </div>
          ))}
        </div>

        {/* Buttons: 14–16 px, Semibold (600) */}
        <button
          type="button"
          onClick={() => setIsSafetyModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#e8f8ec] hover:text-[#00872e] text-slate-700 dark:text-slate-300 text-[14px] font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'sw' ? 'Miongozo ya usalama' : 'Safety guide'}</span>
        </button>
      </div>

      {/* Prohibited Items & PDPA Notice */}
      <button
        type="button"
        onClick={openProhibitedPolicyModal}
        className="w-full text-left p-3 rounded-2xl bg-slate-100/70 hover:bg-amber-50/80 dark:bg-slate-800/40 dark:hover:bg-amber-950/30 border border-slate-200/60 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-1 transition-all cursor-pointer group"
        title={language === 'sw' ? 'Soma sera rasmi ya vitu vilivyopigwa marufuku' : 'Read prohibited items policy'}
      >
        <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{language === 'sw' ? 'Sera ya vitu vilivyopigwa marufuku' : 'Prohibited items policy'}</span>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">PDPA</span>
        </div>
        <p className="line-clamp-2">
          {language === 'sw'
            ? 'Silaha, dawa zilizokatazwa, bidhaa za wizi au kughushi haziruhusiwi. Bofya kusoma sheria zote.'
            : 'Weapons, illegal drugs, cheating aids, and stolen items are prohibited. Tap to view full policy.'}
        </p>
      </button>

    </aside>
  );
};
