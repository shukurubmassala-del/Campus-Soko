import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { getUniversityBannerTheme } from '../../data/universityThemes';
import { ShieldCheck, X } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const { language, setIsSafetyModalOpen, currentUniversity } = useCampusSoko();
  const [isDismissed, setIsDismissed] = useState(false);
  const theme = getUniversityBannerTheme(currentUniversity.id);

  if (isDismissed) return null;

  return (
    <aside aria-label="Campus safety notice" className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-800/60 py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="truncate">
            <span className="font-semibold">
              {language === 'sw' ? 'Ushauri wa Usalama:' : 'Campus Safety:'}
            </span>{' '}
            {language === 'sw'
              ? `Kutana mchana ${currentUniversity.shortName} maeneo salama kama: ${theme.landmarkSpot.sw}. Kagua kabla ya kulipa M-Pesa.`
              : `Meet in daylight at ${currentUniversity.shortName} (${theme.landmarkSpot.en}). Always test before paying via M-Pesa.`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIsSafetyModalOpen(true)}
            className="min-h-[44px] px-2.5 py-1 flex items-center underline font-bold hover:text-emerald-700 dark:hover:text-emerald-300 whitespace-nowrap cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
          >
            {language === 'sw' ? 'Soma zaidi' : 'Learn more'}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-emerald-700 dark:text-emerald-300 hover:opacity-75 transition-opacity rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Funga tangazo / Dismiss safety banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
