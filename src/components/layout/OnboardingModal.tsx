import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { UNIVERSITIES } from '../../data/universities';
import { Language } from '../../types';
import {
  Building2,
  Check,
  CheckCircle2,
  Compass,
  Globe,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

export const OnboardingModal: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    isOnboardingOpen,
    setIsOnboardingOpen,
    completeOnboarding,
    selectedUniversityId,
  } = useCampusSoko();

  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [selectedUnivId, setSelectedUnivId] = useState<string>(selectedUniversityId);
  const selectedUniv = UNIVERSITIES.find((u) => u.id === selectedUnivId) || UNIVERSITIES[0];
  const [selectedZone, setSelectedZone] = useState<string>(selectedUniv.zones[0]);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');

  if (!isOnboardingOpen) return null;

  const handleUniversityChange = (id: string) => {
    setSelectedUnivId(id);
    const univ = UNIVERSITIES.find((u) => u.id === id);
    if (univ && univ.zones.length > 0) {
      setSelectedZone(univ.zones[0]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      language: selectedLang,
      universityId: selectedUnivId,
      campusZone: selectedZone,
      declaredRole: selectedRole,
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-hidden my-0 sm:my-6 animate-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <BackHomeButton variant="compact" onClick={() => setIsOnboardingOpen(false)} />
            <img
              src="/logo-icon-appgreen.png"
              alt="CampusSoko"
              className="w-8 h-8 rounded-xl object-contain hidden sm:flex shrink-0 shadow-xs border border-emerald-500/20"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 block truncate">
                {language === 'sw' ? 'Karibu CampusSoko' : 'Welcome to CampusSoko'}
              </span>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">
                {t.onboardingTitle}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Funga / Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Single Page Body: Scroll Downward or Upward ONLY */}
        <div className="py-4 space-y-6 overflow-y-auto overflow-x-hidden flex-1">
          
          {/* SECTION 1: LANGUAGE SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{t.onboardingStep1Title}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Kiswahili Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedLang('sw');
                  setLanguage('sw');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedLang === 'sw'
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 text-slate-900 dark:text-white ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#e8f8ec] dark:bg-emerald-950 text-[#00872e] dark:text-emerald-300 font-mono font-bold text-[10px] uppercase">
                    SW · TZ
                  </span>
                  {selectedLang === 'sw' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Kiswahili
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Lugha ya taifa ya kufanya biashara chuoni.
                </p>
              </button>

              {/* English Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedLang('en');
                  setLanguage('en');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedLang === 'en'
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 text-slate-900 dark:text-white ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold text-[10px] uppercase">
                    EN · Global
                  </span>
                  {selectedLang === 'en' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  English
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Browse, trade, and chat in English.
                </p>
              </button>
            </div>
          </div>

          {/* SECTION 2: UNIVERSITY SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{t.onboardingStep2Title}</span>
              </h3>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {UNIVERSITIES.map((univ) => (
                <button
                  key={univ.id}
                  type="button"
                  onClick={() => handleUniversityChange(univ.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedUnivId === univ.id
                      ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {univ.shortName}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {univ.name}
                      </h4>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{univ.city}</span>
                      </div>
                    </div>
                  </div>

                  {selectedUnivId === univ.id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: HOSTEL / CAMPUS ZONE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{language === 'sw' ? 'Eneo / Hosteli Unayoishi' : 'Hostel or Campus Zone'}</span>
              </h3>
            </div>

            <div>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              >
                {selectedUniv.zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 4: ROLE DECLARATION (Buyer vs Seller) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>{language === 'sw' ? 'Wajibu Wako Chuoni (Chagua Moja)' : 'Your Campus Role (Choose One)'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Buyer Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('buyer')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedRole === 'buyer'
                    ? 'border-[#00B53F] bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedRole === 'buyer'
                        ? 'bg-[#00B53F] text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  {selectedRole === 'buyer' && (
                    <CheckCircle2 className="w-5 h-5 text-[#00B53F]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {language === 'sw' ? 'Mnunuzi' : 'Buyer'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {language === 'sw' ? 'Kununua bidhaa na kuweka mahitaji chuoni' : 'Browse listings & post wanted requests'}
                  </p>
                </div>
              </button>

              {/* Seller Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('seller')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  selectedRole === 'seller'
                    ? 'border-[#E67E22] bg-orange-50/70 dark:bg-orange-950/40 shadow-sm ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selectedRole === 'seller'
                        ? 'bg-[#E67E22] text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  {selectedRole === 'seller' && (
                    <CheckCircle2 className="w-5 h-5 text-[#E67E22]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {language === 'sw' ? 'Muuzaji' : 'Seller'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {language === 'sw' ? 'Kuuza vifaa & kusimamia Seller Studio' : 'Sell items & manage Seller Studio'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 5: SAFETY GUIDELINES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">5</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'sw' ? 'Miongozo ya Usalama Chuoni' : 'Campus Safety Standards'}</span>
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-emerald-900 dark:text-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'sw'
                    ? `Kutana maeneo ya wazi kama ${selectedUniv.safeMeetingPoints[0] || 'Maktaba Kuu'}.`
                    : `Meet at public daylight hubs like ${selectedUniv.safeMeetingPoints[0] || 'Main Library'}.`}
                </span>
              </div>
              <div className="flex items-start gap-2 text-emerald-900 dark:text-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'sw'
                    ? 'Kagua bidhaa au kifaa kwa mikono yako kabla ya kulipa kwa Cash au M-Pesa.'
                    : 'Inspect items before sending payment via Cash or M-Pesa.'}
                </span>
              </div>
            </div>
          </div>

          {/* SINGLE SUBMISSION BUTTON ON SAME PAGE */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#00b53f] hover:bg-[#00872e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t.onboardingFinish}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
