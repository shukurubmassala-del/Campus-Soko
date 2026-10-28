import React, { useState, useRef, useEffect } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  USER_COLOR_THEMES,
  UserColorPreference,
} from '../../utils/userColorTheme';
import { Check, Palette, RotateCcw, Sparkles, ChevronDown, Sun, Moon } from 'lucide-react';

interface ColorPreferencePickerProps {
  variant?: 'card' | 'compact' | 'inline-strip';
  className?: string;
  label?: string;
}

export const ColorPreferencePicker: React.FC<ColorPreferencePickerProps> = ({
  variant = 'compact',
  className = '',
  label,
}) => {
  const {
    language,
    userColorPreference,
    setUserColorPreference,
    colorTheme,
    showToast,
    theme,
    setTheme,
    toggleTheme,
  } = useCampusSoko();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themeList = Object.values(USER_COLOR_THEMES);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (id: UserColorPreference) => {
    setUserColorPreference(id);
    const selectedTheme = USER_COLOR_THEMES[id];
    const name = language === 'sw' ? selectedTheme.nameSw : selectedTheme.nameEn;
    showToast(
      language === 'sw'
        ? `Rangi ya mwonekano imebadilishwa: ${name}`
        : `Color preference updated: ${name}`,
      'info'
    );
    if (variant === 'compact') {
      setIsOpen(false);
    }
  };

  // 1. INLINE STRIP VARIANT (Simple horizontal dots)
  if (variant === 'inline-strip') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Palette className="w-3.5 h-3.5" />
          <span>{label || (language === 'sw' ? 'Rangi:' : 'Color:')}</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {themeList.map((t) => {
            const isSelected = userColorPreference === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id)}
                className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center relative cursor-pointer ${
                  t.dotBg
                } ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110 shadow-sm'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                title={language === 'sw' ? t.nameSw : t.nameEn}
                aria-label={language === 'sw' ? t.nameSw : t.nameEn}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 stroke-[3] ${
                      t.id === 'monochrome'
                        ? 'text-white dark:text-slate-950'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. COMPACT DROPDOWN TOOLBAR BUTTON
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-white cursor-pointer ${
            userColorPreference === 'monochrome'
              ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400'
              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
          }`}
          aria-expanded={isOpen}
          aria-label={language === 'sw' ? 'Badilisha rangi ya muonekano' : 'Change color preference'}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 ${colorTheme.dotBg}`}
            />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {userColorPreference === 'monochrome'
                ? language === 'sw'
                  ? 'B&W (Msingi)'
                  : 'B&W (Default)'
                : language === 'sw'
                ? colorTheme.nameSw.split(' ')[0]
                : colorTheme.nameEn.split(' ')[0]}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 space-y-2 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[12px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'sw' ? 'Chagua Rangi ya Mwonekano' : 'Color Preference'}</span>
              </span>
              {userColorPreference !== 'monochrome' && (
                <button
                  type="button"
                  onClick={() => handleSelect('monochrome')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  title={language === 'sw' ? 'Rudisha Nyeusi & Nyeupe' : 'Reset to Black & White'}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'sw' ? 'Msingi' : 'Reset'}</span>
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-0.5">
              {themeList.map((t) => {
                const isSelected = userColorPreference === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelect(t.id)}
                    className={`w-full px-2.5 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 border border-black/10 dark:border-white/20 ${t.dotBg}`}
                      />
                      <span className="truncate">
                        {language === 'sw' ? t.nameSw : t.nameEn}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
              {language === 'sw'
                ? 'Chaguo-msingi ni Nyeusi & Nyeupe (B&W)'
                : 'Default is Black & White (B&W)'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. FULL CARD VARIANT (For Profile View & Admin Settings)
  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{language === 'sw' ? 'Mwonekano & Rangi ya Mtumiaji' : 'Appearance & Color Preference'}</span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {userColorPreference === 'monochrome'
                  ? language === 'sw' ? 'Nyeusi & Nyeupe (Msingi)' : 'Black & White (Default)'
                  : language === 'sw' ? colorTheme.nameSw : colorTheme.nameEn}
              </span>
            </h3>
            <p className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400">
              {language === 'sw'
                ? 'Rangi chaguomsingi ni Nyeusi na Nyeupe. Unaweza kuchagua rangi unayopenda zaidi kwa ajili ya kurasa za Tafuta, Jumbe, Wasifu, Muuzaji, na Msimamizi.'
                : 'Default color is Black & White. You can customize your favorite accent color for Search, Chat, Profile, Seller, and Admin views.'}
            </p>
          </div>
        </div>

        {userColorPreference !== 'monochrome' && (
          <button
            type="button"
            onClick={() => handleSelect('monochrome')}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Rudisha B&W ya Msingi' : 'Reset to Default B&W'}</span>
          </button>
        )}
      </div>

      {/* Light vs Dark Mode Switcher */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Mwonekano: Nuru au Giza (Theme Mode)' : 'Display Theme: Light or Dark'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'sw'
                  ? 'Washa mwonekano wa giza (Dark mode) kwa ajili ya usiku na kuokoa betri ya simu chuoni.'
                  : 'Activate dark mode to ease eye strain in low-light hostels and save mobile battery.'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            {theme === 'dark' ? (language === 'sw' ? 'Giza (Dark)' : 'Dark') : (language === 'sw' ? 'Nuru (Light)' : 'Light')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>{language === 'sw' ? 'Mwonekano wa Nuru (Light)' : 'Light Mode'}</span>
            {theme === 'light' && <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-emerald-400 bg-slate-900 text-white shadow-xs ring-2 ring-emerald-400/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-300 fill-amber-300' : 'text-slate-400'}`} />
            <span>{language === 'sw' ? 'Mwonekano wa Giza (Dark)' : 'Dark Mode'}</span>
            {theme === 'dark' && <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Grid of Color Themes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {themeList.map((t) => {
          const isSelected = userColorPreference === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelect(t.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col gap-2 cursor-pointer ${
                isSelected
                  ? 'border-slate-900 dark:border-white ring-2 ring-slate-900/20 dark:ring-white/20 bg-slate-50/80 dark:bg-slate-800/80 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full border border-black/10 dark:border-white/20 ${t.dotBg}`}
                  />
                  <span className="text-[11px] font-mono font-medium text-slate-400">
                    {t.hex}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <span className="text-[13px] font-bold text-slate-900 dark:text-white block truncate">
                  {language === 'sw' ? t.nameSw : t.nameEn}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {t.id === 'monochrome'
                    ? language === 'sw' ? 'Chaguo-msingi (B&W)' : 'Default (B&W)'
                    : language === 'sw' ? 'Rangi ya ziada' : 'Custom accent'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Preview Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-slate-500" />
          <span className="font-semibold">
            {language === 'sw' ? 'Mwonekano wa moja kwa moja:' : 'Live Component Preview:'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${colorTheme.primaryBtn}`}
          >
            {language === 'sw' ? 'Kitufe Kikuu (CTA)' : 'Primary Button'}
          </button>
          <span className={`px-2.5 py-1 rounded-full text-xs ${colorTheme.badgeActive}`}>
            {language === 'sw' ? 'Kichungi Kinachotumika' : 'Active Chip'}
          </span>
          <span className={`text-xs ${colorTheme.accentText}`}>
            {language === 'sw' ? 'Maandishi ya Rangi' : 'Accent Text'}
          </span>
        </div>
      </div>
    </div>
  );
};
