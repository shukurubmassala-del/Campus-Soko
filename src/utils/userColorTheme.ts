export type UserColorPreference =
  | 'monochrome' // Default Black and White
  | 'orange'     // #E67E22 Sunset Orange
  | 'navy'       // #2C3E50 University Navy
  | 'emerald'    // #00B53F / #059669 Campus Emerald
  | 'sapphire'   // #2563EB Royal Sapphire
  | 'purple'     // #7C3AED Royal Purple
  | 'crimson';   // #E11D48 Crimson Rose

export interface ColorThemeClasses {
  id: UserColorPreference;
  nameEn: string;
  nameSw: string;
  hex: string;
  dotBg: string;
  previewBorder: string;
  // Primary CTA buttons (e.g. submit, post ad, send message)
  primaryBtn: string;
  // Secondary CTA buttons / subtle outlines
  secondaryBtn: string;
  // Active pill / tab / filter chip
  badgeActive: string;
  // Subtle active container background
  subtleActiveBg: string;
  // Accent text color
  accentText: string;
  // Icon color
  iconColor: string;
  // Border color when active or focused
  borderColor: string;
  // Focus outline ring
  ringFocus: string;
  // Outgoing chat bubble
  chatBubble: string;
  // Slider track / thumb accent
  sliderAccent: string;
  // Progress bar fill
  progressBarBg: string;
  // Active bottom nav text
  activeNav: string;
  // Floating action button (+)
  fab: string;
  // Active tab with bottom underline
  tabUnderline: string;
  // Analytics / chart primary bar
  chartBarPrimary: string;
  // Analytics / chart secondary bar
  chartBarSecondary: string;
  // Analytics / chart tertiary bar
  chartBarTertiary: string;
  // Floating container shadow
  floatingShadow: string;
  // Customized colored shadow for round active tabs and floating pills
  tabGlowShadow: string;
}

export const USER_COLOR_THEMES: Record<UserColorPreference, ColorThemeClasses> = {
  monochrome: {
    id: 'monochrome',
    nameEn: 'Black & White (Default)',
    nameSw: 'Nyeusi & Nyeupe (Msingi)',
    hex: '#0F172A',
    dotBg: 'bg-slate-950 dark:bg-white',
    previewBorder: 'border-slate-950 dark:border-white',
    primaryBtn:
      'bg-slate-950 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-sm border border-slate-900/10 dark:border-white/20 active:scale-95',
    secondaryBtn:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700',
    badgeActive:
      'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs font-semibold',
    subtleActiveBg:
      'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700',
    accentText: 'text-slate-950 dark:text-white font-bold',
    iconColor: 'text-slate-900 dark:text-white',
    borderColor: 'border-slate-950 dark:border-white',
    ringFocus: 'focus-visible:ring-slate-950 dark:focus-visible:ring-white',
    chatBubble: 'bg-slate-950 dark:bg-white text-white dark:text-slate-950',
    sliderAccent:
      'accent-slate-950 dark:accent-white [&::-webkit-slider-thumb]:bg-slate-950 dark:[&::-webkit-slider-thumb]:bg-white',
    progressBarBg: 'bg-slate-950 dark:bg-white',
    activeNav: 'text-slate-950 dark:text-white font-bold',
    fab: 'bg-slate-950 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-lg shadow-black/25 active:scale-90',
    tabUnderline: 'border-slate-950 text-slate-950 dark:border-white dark:text-white font-bold',
    chartBarPrimary: 'bg-slate-950 dark:bg-white',
    chartBarSecondary: 'bg-slate-600 dark:bg-slate-400',
    chartBarTertiary: 'bg-slate-350 dark:bg-slate-600',
    floatingShadow: 'shadow-xl shadow-slate-950/20 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-slate-900/35 dark:shadow-white/20',
  },
  emerald: {
    id: 'emerald',
    nameEn: 'Campus Emerald',
    nameSw: 'Kijani cha Chuo',
    hex: '#059669',
    dotBg: 'bg-emerald-600',
    previewBorder: 'border-emerald-600',
    primaryBtn:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95',
    secondaryBtn:
      'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    badgeActive:
      'bg-emerald-600 text-white shadow-xs font-semibold shadow-emerald-600/25',
    subtleActiveBg:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800',
    accentText: 'text-emerald-600 dark:text-emerald-400 font-bold',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-600',
    ringFocus: 'focus-visible:ring-emerald-600',
    chatBubble: 'bg-emerald-600 text-white',
    sliderAccent:
      'accent-emerald-600 [&::-webkit-slider-thumb]:bg-emerald-600',
    progressBarBg: 'bg-emerald-600',
    activeNav: 'text-emerald-600 dark:text-emerald-400 font-bold',
    fab: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/35 active:scale-90',
    tabUnderline: 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold',
    chartBarPrimary: 'bg-emerald-600 dark:bg-emerald-500',
    chartBarSecondary: 'bg-teal-500 dark:bg-teal-400',
    chartBarTertiary: 'bg-emerald-300 dark:bg-emerald-800',
    floatingShadow: 'shadow-xl shadow-emerald-950/25 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-emerald-500/40 dark:shadow-emerald-400/40',
  },
  sapphire: {
    id: 'sapphire',
    nameEn: 'Royal Sapphire',
    nameSw: 'Bluu ya Kifalme',
    hex: '#2563EB',
    dotBg: 'bg-blue-600',
    previewBorder: 'border-blue-600',
    primaryBtn:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95',
    secondaryBtn:
      'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60',
    badgeActive:
      'bg-blue-600 text-white shadow-xs font-semibold shadow-blue-500/25',
    subtleActiveBg:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800',
    accentText: 'text-blue-600 dark:text-blue-400 font-bold',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-600',
    ringFocus: 'focus-visible:ring-blue-600',
    chatBubble: 'bg-blue-600 text-white',
    sliderAccent:
      'accent-blue-600 [&::-webkit-slider-thumb]:bg-blue-600',
    progressBarBg: 'bg-blue-600',
    activeNav: 'text-blue-600 dark:text-blue-400 font-bold',
    fab: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/35 active:scale-90',
    tabUnderline: 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold',
    chartBarPrimary: 'bg-blue-600 dark:bg-blue-500',
    chartBarSecondary: 'bg-indigo-500 dark:bg-indigo-400',
    chartBarTertiary: 'bg-blue-300 dark:bg-blue-800',
    floatingShadow: 'shadow-xl shadow-blue-950/25 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-blue-500/40 dark:shadow-blue-400/40',
  },
  orange: {
    id: 'orange',
    nameEn: 'Sunset Orange',
    nameSw: 'Machweo ya Chungwa',
    hex: '#E67E22',
    dotBg: 'bg-[#E67E22]',
    previewBorder: 'border-[#E67E22]',
    primaryBtn:
      'bg-[#E67E22] hover:bg-[#D35400] text-white shadow-md shadow-orange-500/20 active:scale-95',
    secondaryBtn:
      'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-[#D35400] dark:text-orange-300 border border-orange-200 dark:border-orange-800/60',
    badgeActive:
      'bg-[#E67E22] text-white shadow-xs font-semibold shadow-orange-500/25',
    subtleActiveBg:
      'bg-orange-50 dark:bg-orange-950/60 text-[#D35400] dark:text-orange-200 border border-orange-300 dark:border-orange-800',
    accentText: 'text-[#E67E22] dark:text-orange-400 font-bold',
    iconColor: 'text-[#E67E22]',
    borderColor: 'border-[#E67E22]',
    ringFocus: 'focus-visible:ring-[#E67E22]',
    chatBubble: 'bg-[#E67E22] text-white',
    sliderAccent:
      'accent-[#E67E22] [&::-webkit-slider-thumb]:bg-[#E67E22]',
    progressBarBg: 'bg-[#E67E22]',
    activeNav: 'text-[#E67E22] dark:text-[#E67E22] font-bold',
    fab: 'bg-[#E67E22] hover:bg-[#D35400] text-white shadow-lg shadow-orange-500/35 active:scale-90',
    tabUnderline: 'border-[#E67E22] text-[#E67E22] dark:text-[#E67E22] font-bold',
    chartBarPrimary: 'bg-[#E67E22]',
    chartBarSecondary: 'bg-amber-500 dark:bg-amber-400',
    chartBarTertiary: 'bg-orange-300 dark:bg-orange-800',
    floatingShadow: 'shadow-xl shadow-orange-950/25 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-orange-500/40 dark:shadow-orange-400/40',
  },
  purple: {
    id: 'purple',
    nameEn: 'Plum Purple',
    nameSw: 'Zambarau ya Chuo',
    hex: '#7C3AED',
    dotBg: 'bg-purple-600',
    previewBorder: 'border-purple-600',
    primaryBtn:
      'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 active:scale-95',
    secondaryBtn:
      'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60',
    badgeActive:
      'bg-purple-600 text-white shadow-xs font-semibold shadow-purple-500/25',
    subtleActiveBg:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800',
    accentText: 'text-purple-600 dark:text-purple-400 font-bold',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-600',
    ringFocus: 'focus-visible:ring-purple-600',
    chatBubble: 'bg-purple-600 text-white',
    sliderAccent:
      'accent-purple-600 [&::-webkit-slider-thumb]:bg-purple-600',
    progressBarBg: 'bg-purple-600',
    activeNav: 'text-purple-600 dark:text-purple-400 font-bold',
    fab: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/35 active:scale-90',
    tabUnderline: 'border-purple-600 text-purple-600 dark:text-purple-400 font-bold',
    chartBarPrimary: 'bg-purple-600 dark:bg-purple-500',
    chartBarSecondary: 'bg-fuchsia-500 dark:bg-fuchsia-400',
    chartBarTertiary: 'bg-purple-300 dark:bg-purple-800',
    floatingShadow: 'shadow-xl shadow-purple-950/25 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-purple-500/40 dark:shadow-purple-400/40',
  },
  crimson: {
    id: 'crimson',
    nameEn: 'Crimson Red',
    nameSw: 'Nyekundu Tulivu',
    hex: '#E11D48',
    dotBg: 'bg-rose-600',
    previewBorder: 'border-rose-600',
    primaryBtn:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 active:scale-95',
    secondaryBtn:
      'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    badgeActive:
      'bg-rose-600 text-white shadow-xs font-semibold shadow-rose-500/25',
    subtleActiveBg:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800',
    accentText: 'text-rose-600 dark:text-rose-400 font-bold',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-600',
    ringFocus: 'focus-visible:ring-rose-600',
    chatBubble: 'bg-rose-600 text-white',
    sliderAccent:
      'accent-rose-600 [&::-webkit-slider-thumb]:bg-rose-600',
    progressBarBg: 'bg-rose-600',
    activeNav: 'text-rose-600 dark:text-rose-400 font-bold',
    fab: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/35 active:scale-90',
    tabUnderline: 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold',
    chartBarPrimary: 'bg-rose-600 dark:bg-rose-500',
    chartBarSecondary: 'bg-red-500 dark:bg-red-400',
    chartBarTertiary: 'bg-rose-300 dark:bg-rose-800',
    floatingShadow: 'shadow-xl shadow-rose-950/25 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-rose-500/40 dark:shadow-rose-400/40',
  },
  navy: {
    id: 'navy',
    nameEn: 'University Navy',
    nameSw: 'Bluu ya Chuo',
    hex: '#2C3E50',
    dotBg: 'bg-[#2C3E50]',
    previewBorder: 'border-[#2C3E50]',
    primaryBtn:
      'bg-[#2C3E50] hover:bg-[#1A252F] text-white shadow-md shadow-slate-950/20 active:scale-95',
    secondaryBtn:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#2C3E50] dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    badgeActive:
      'bg-[#2C3E50] text-white shadow-xs font-semibold shadow-slate-900/25',
    subtleActiveBg:
      'bg-blue-50/80 dark:bg-blue-950/50 text-[#2C3E50] dark:text-blue-200 border border-blue-200 dark:border-blue-900/50',
    accentText: 'text-[#2C3E50] dark:text-blue-300 font-bold',
    iconColor: 'text-[#2C3E50] dark:text-blue-400',
    borderColor: 'border-[#2C3E50]',
    ringFocus: 'focus-visible:ring-[#2C3E50]',
    chatBubble: 'bg-[#2C3E50] text-white',
    sliderAccent:
      'accent-[#2C3E50] [&::-webkit-slider-thumb]:bg-[#2C3E50]',
    progressBarBg: 'bg-[#2C3E50]',
    activeNav: 'text-[#2C3E50] dark:text-blue-300 font-bold',
    fab: 'bg-[#2C3E50] hover:bg-[#1A252F] text-white shadow-lg shadow-slate-950/35 active:scale-90',
    tabUnderline: 'border-[#2C3E50] text-[#2C3E50] dark:text-blue-300 font-bold',
    chartBarPrimary: 'bg-[#2C3E50]',
    chartBarSecondary: 'bg-slate-600 dark:bg-slate-400',
    chartBarTertiary: 'bg-slate-400 dark:bg-slate-700',
    floatingShadow: 'shadow-xl shadow-slate-950/25 dark:shadow-black/70',
    tabGlowShadow: 'shadow-lg shadow-blue-900/40 dark:shadow-blue-400/30',
  },
};

export const getUserColorTheme = (pref?: UserColorPreference): ColorThemeClasses => {
  if (!pref || !USER_COLOR_THEMES[pref]) {
    return USER_COLOR_THEMES.monochrome; // Default Black & White
  }
  return USER_COLOR_THEMES[pref];
};
