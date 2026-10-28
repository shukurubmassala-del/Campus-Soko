import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { Plus } from 'lucide-react';

export const FloatingActionButton: React.FC = () => {
  const { currentUser, setIsAuthModalOpen, setIsCreateListingOpen, language } = useCampusSoko();

  const handleFabClick = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreateListingOpen(true);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-40">
      <button
        type="button"
        onClick={handleFabClick}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00B53F] to-emerald-400 hover:from-emerald-600 hover:to-emerald-400 text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-110 hover:-translate-y-1 cursor-pointer border-2 border-white dark:border-slate-900 group ring-4 ring-emerald-500/20"
        title={language === 'sw' ? 'Weka Tangazo / Uza' : 'Add Product / Sell'}
        aria-label={language === 'sw' ? 'Weka Tangazo' : 'Add Product'}
      >
        <Plus className="w-7 h-7 stroke-[2.8] group-hover:rotate-90 transition-transform duration-300 drop-shadow-sm" />
      </button>
    </div>
  );
};
