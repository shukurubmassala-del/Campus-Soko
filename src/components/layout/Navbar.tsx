import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  Bell,
  Building2,
  ChevronDown,
  Globe,
  Home,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Sun,
  User as UserIcon,
  X,
  Compass,
  SlidersHorizontal,
} from 'lucide-react';
import { RoleView } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { getUniversityColor } from '../../utils/universityColors';
import { getSafeAvatarUrl } from '../../utils/imageUtils';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    selectedUniversityId,
    setSelectedUniversityId,
    currentUniversity,
    universities,
    currentUser,
    setIsAuthModalOpen,
    setIsCreateListingOpen,
    setActiveTab,
    activeTab,
    setIsOnboardingOpen,
    roleView,
    setRoleView,
    filters,
    setFilters,
    conversations,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    goHome,
  } = useCampusSoko();

  const [isUnivDropdownOpen, setIsUnivDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(Boolean(filters.searchQuery));
  const mobileSearchInputRef = React.useRef<HTMLInputElement>(null);

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 60);
  };

  React.useEffect(() => {
    if (filters.searchQuery) {
      setIsMobileSearchOpen(true);
      setLocalSearch(filters.searchQuery);
    }
  }, [filters.searchQuery]);

  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    const unread = conv.messages.filter((m) => !m.read && m.senderId !== currentUser?.id).length;
    return acc + unread;
  }, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: localSearch }));
    if (roleView !== 'buyer') {
      setRoleView('buyer');
    }
    if (activeTab !== 'market') {
      setActiveTab('market');
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <header className="sticky top-0 z-30 bg-[#2C3E50] dark:bg-[#1A252F] text-white shadow-md transition-colors border-b border-white/10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        
        {/* Main App Bar Row: All items fit seamlessly without overflow */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-2.5">
          
          {/* Left Wing: Logo & Campus Selector + Return Home Button */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Brand Logo with Tanzania Flag (clicking returns home) */}
            <button
              onClick={goHome}
              className="flex items-center group shrink-0 cursor-pointer"
              title="CampusSoko - Soko la Wanafunzi Tanzania"
            >
              <BrandLogo size="md" textColorVariant="light" />
            </button>

            {/* University / Campus Selector Dropdown (Location Filter) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUnivDropdownOpen(!isUnivDropdownOpen)}
                className="min-h-[34px] sm:min-h-[38px] flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-xl text-[11px] sm:text-[13px] font-medium bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 max-w-[85px] xs:max-w-[125px] sm:max-w-[180px] focus-visible:ring-2 focus-visible:ring-[#E67E22] focus-visible:outline-none cursor-pointer"
                aria-label={`${t.selectUniversity}: ${currentUniversity.shortName}`}
                aria-expanded={isUnivDropdownOpen}
              >
                <span className={`w-2 h-2 rounded-full ${getUniversityColor(currentUniversity.id).dotColor} shrink-0 ring-1 ring-white/50`} />
                <span className="truncate font-semibold">{currentUniversity.shortName}</span>
                <ChevronDown className="w-3 h-3 text-slate-300 shrink-0" />
              </button>

              {isUnivDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-1.5 text-[12px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                    {t.selectUniversity} (Tanzania)
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {universities.map((univ) => {
                      const isSelected = selectedUniversityId === univ.id;
                      const univColor = getUniversityColor(univ.id);
                      return (
                        <button
                          key={univ.id}
                          type="button"
                          onClick={() => {
                            setSelectedUniversityId(univ.id);
                            setIsUnivDropdownOpen(false);
                          }}
                          className={`w-full min-h-[44px] px-3.5 py-2.5 text-left text-[13px] font-medium flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-[#E67E22] focus-visible:outline-none ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-slate-800 text-[#2C3E50] dark:text-white font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-2.5 h-2.5 rounded-full ${univColor.dotColor} shrink-0 ring-1 ring-black/10`} />
                            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${univColor.badgeBg} ${univColor.badgeText} ${univColor.badgeBorder}`}>
                              {univ.shortName}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 truncate">
                              · {univ.name} ({univ.city})
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#E67E22] shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUnivDropdownOpen(false);
                        setIsOnboardingOpen(true);
                      }}
                      className="w-full min-h-[40px] py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#2C3E50] dark:text-slate-200 text-[13px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Compass className="w-4 h-4 text-[#E67E22]" />
                      <span>{t.changeCampusSetup}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Home / Return to Market Button Icon (Highlighted when in any non-home app state) */}
            {(roleView !== 'buyer' || activeTab !== 'market') && (
              <button
                type="button"
                onClick={goHome}
                className="min-h-[34px] sm:min-h-[38px] px-2 sm:px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1 text-[11px] sm:text-xs font-bold shadow-sm shrink-0 border border-white/20 cursor-pointer active:scale-95 animate-in fade-in"
                title={language === 'sw' ? 'Rudi Sokoni / Return Home' : 'Back to Marketplace'}
                aria-label="Back to Marketplace"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden lg:inline">{language === 'sw' ? 'Sokoni' : 'Market'}</span>
              </button>
            )}
          </div>

          {/* Center: Desktop Search Bar (md and up, neatly flex-bounded) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg mx-2 relative items-center min-w-0"
          >
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2]" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={language === 'sw' ? 'Tafuta bidhaa, makundi...' : 'Search for products, categories...'}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-9 pr-20 py-2 rounded-xl text-[13px] font-normal border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-[#00B53F] shadow-inner"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setRoleView('buyer');
                    setActiveTab('search');
                  }}
                  className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title={language === 'sw' ? 'Tafuta kwa vigezo (Advanced Filters)' : 'Advanced Search & Filters'}
                  aria-label="Filter"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="submit"
                  className="bg-[#00B53F] hover:bg-[#009e37] text-white p-1 rounded-lg transition-colors flex items-center justify-center active:scale-95 cursor-pointer shadow-xs"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </form>

          {/* Right Wing: All Action Button Icons (Always visible across all app states and screen sizes) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 1. Mobile Search Icon Button (toggles mobile search input bar) */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`md:hidden min-w-[32px] min-h-[32px] w-8 h-8 flex items-center justify-center rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 ${
                isMobileSearchOpen
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-black/15 hover:bg-black/25 text-white'
              }`}
              title="Tafuta / Search"
              aria-label="Search toggle"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.4]" />
            </button>

            {/* 2. Messages / Chats Button Icon (Visible in any app state on mobile & desktop) */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setRoleView('buyer');
                  setActiveTab('chats');
                }
              }}
              className="relative min-w-[32px] min-h-[32px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-black/15 hover:bg-black/25 text-white transition-all cursor-pointer active:scale-95 shrink-0"
              title="Jumbe / Messages"
              aria-label="Messages"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* 3. Notifications Button Icon (Visible in any app state on mobile & desktop) */}
            <button
              type="button"
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative min-w-[32px] min-h-[32px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-black/15 hover:bg-black/25 text-white transition-all shrink-0 cursor-pointer active:scale-95"
              title={t.notificationsTitle}
              aria-label={t.notificationsTitle}
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotificationsCount > 0 ? unreadNotificationsCount : 3}
              </span>
            </button>

            {/* 4. Sell / Post Item Button Icon (Visible in any app state on mobile & desktop) */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsCreateListingOpen(true);
                }
              }}
              className="min-w-[32px] min-h-[32px] w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#E67E22] hover:bg-[#D35400] rounded-xl shadow-md shadow-orange-950/20 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shrink-0"
              title="Post Ad / Uza Kitu Chuo"
              aria-label="Sell Item"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
              <span className="hidden sm:inline font-bold">{language === 'sw' ? 'Uza' : 'Sell'}</span>
            </button>

            {/* 5. Language Toggle Icon (SW / EN, visible on mobile & desktop in any app state) */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
              className="min-w-[32px] min-h-[32px] w-8 h-8 sm:w-auto sm:px-2 sm:py-1.5 flex items-center justify-center gap-1 rounded-xl text-xs font-bold bg-black/15 hover:bg-black/25 text-white transition-all border border-white/15 uppercase shrink-0 cursor-pointer active:scale-95 shadow-xs"
              title="Badili Lugha / Switch Language"
              aria-label="Language switch"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-[10px] font-mono hidden xs:inline sm:inline">{language === 'sw' ? 'SW' : 'EN'}</span>
            </button>

            {/* 6. Theme Toggle Icon (Sun / Moon, visible on mobile & desktop in any app state) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="min-w-[32px] min-h-[32px] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-black/15 hover:bg-black/25 text-white transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
              title={theme === 'dark' ? (language === 'sw' ? 'Washa Mwonekano wa Nuru' : 'Switch to Light Mode') : (language === 'sw' ? 'Washa Mwonekano wa Giza' : 'Switch to Dark Mode')}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300/20" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white/10" />
              )}
            </button>

            {/* 7. User Profile Avatar Icon (Visible on mobile & desktop in any app state) */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setRoleView('buyer');
                  setActiveTab('profile');
                }
              }}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white/40 hover:border-emerald-400 bg-white/20 shrink-0 cursor-pointer transition-all active:scale-95 flex items-center justify-center shadow-xs"
              aria-label={currentUser ? `Profile: ${currentUser.fullName}` : 'User Profile'}
              title={currentUser ? currentUser.fullName : 'Sign in / Profile'}
            >
              {currentUser ? (
                <img
                  src={getSafeAvatarUrl(currentUser.avatarUrl, currentUser.fullName)}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Dropdown Bar (when mobile search is open) */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-2.5 pt-1 animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full gap-1.5">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2]" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={language === 'sw' ? 'Tafuta bidhaa, makundi...' : 'Search for products, categories...'}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 pl-9 pr-16 py-2 rounded-xl text-[13px] font-normal border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-[#00B53F]"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {localSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClearSearch();
                        mobileSearchInputRef.current?.focus();
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#00B53F] hover:bg-[#009e37] text-white p-1 rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-all"
                    aria-label="Search"
                  >
                    <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRoleView('buyer');
                  setActiveTab('search');
                }}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-white/20 shadow-sm cursor-pointer transition-all active:scale-95"
                aria-label="Filter"
                title={language === 'sw' ? 'Tafuta kwa vigezo (Advanced Filters)' : 'Advanced Search & Filters'}
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>

              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer transition-all active:scale-95"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </header>
  );
};
