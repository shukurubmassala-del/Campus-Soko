import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  Building2,
  FileText,
  Home,
  LayoutGrid,
  MessageSquare,
  Package,
  Plus,
  Search,
  ShieldAlert,
  Megaphone,
  Store,
  User as UserIcon,
  Users,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    language,
    t,
    activeTab,
    setActiveTab,
    currentUser,
    setIsAuthModalOpen,
    setIsCreateListingOpen,
    conversations,
    roleView,
    setRoleView,
    setIsSellerRegistrationOpen,
    goHome,
    unreadNotificationsCount,
    colorTheme,
    filters,
  } = useCampusSoko();

  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    const unread = conv.messages.filter((m) => !m.read && m.senderId !== currentUser?.id).length;
    return acc + unread;
  }, 0);

  // SELLER NAVIGATION ADAPTATION (Floating with customized orange shadow)
  if (roleView === 'seller') {
    return (
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-40 md:hidden">
        <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-orange-200/70 dark:border-orange-900/50 rounded-full shadow-2xl shadow-orange-950/30 dark:shadow-black/80 px-2 py-1.5 transition-all">
          <div className="grid grid-cols-5 items-center max-w-md mx-auto">
            {/* Tab 1: Seller Studio / Inventory */}
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
                activeTab === 'market'
                  ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-500/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-orange-500'
              }`}
              aria-label="Seller Studio"
            >
              <Store className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Studio</span>
            </button>

            {/* Tab 2: Buyer Demands (Wanted Board) */}
            <button
              type="button"
              onClick={() => setActiveTab('wanted')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
                activeTab === 'wanted'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-amber-500'
              }`}
              aria-label="Buyer Demands"
            >
              <Megaphone className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
                {language === 'sw' ? 'Mahitaji' : 'Demand'}
              </span>
            </button>

            {/* Tab 3: Post Item (+) Floating Center Action */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    setIsSellerRegistrationOpen(true);
                  } else {
                    setIsCreateListingOpen(true);
                  }
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/50 active:scale-90 hover:scale-105 transition-all -mt-3.5 border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-[#E67E22] to-amber-500 text-white cursor-pointer"
                aria-label="Weka Bidhaa / Add Listing"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            {/* Tab 4: Buyer Leads / Chats */}
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 relative transition-all rounded-full ${
                activeTab === 'chats'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
              }`}
              aria-label="Wateja / Leads"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
                {language === 'sw' ? 'Wateja' : 'Leads'}
              </span>
            </button>

            {/* Tab 5: Profile / Wasifu */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setActiveTab('profile');
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
                activeTab === 'profile'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-950/30 dark:shadow-white/20 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-label={t.navProfile}
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
                {language === 'sw' ? 'Wasifu' : 'Profile'}
              </span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // ADMIN NAVIGATION ADAPTATION (Floating with customized crimson shadow)
  if (roleView === 'admin') {
    return (
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[420px] z-40 md:hidden">
        <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-red-200/70 dark:border-red-900/50 rounded-full shadow-2xl shadow-red-950/30 dark:shadow-black/80 px-2 py-1.5 transition-all">
          <div className="grid grid-cols-4 items-center max-w-md mx-auto">
            {/* Tab 1: Admin Console */}
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
                activeTab === 'market'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Admin</span>
            </button>

            {/* Tab 2: Buyer Demands (Wanted Board) */}
            <button
              type="button"
              onClick={() => setActiveTab('wanted')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
                activeTab === 'wanted'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
              }`}
              aria-label="Buyer Demands"
            >
              <Megaphone className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
                {language === 'sw' ? 'Mahitaji' : 'Demands'}
              </span>
            </button>

            {/* Tab 3: Messages & Inquiries */}
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 relative transition-all rounded-full ${
                activeTab === 'chats'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
              }`}
              aria-label="Messages"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
                {language === 'sw' ? 'Jumbe' : 'Messages'}
              </span>
            </button>

            {/* Tab 4: Profile */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
                activeTab === 'profile'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/40 font-bold -translate-y-0.5'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-semibold">{t.navProfile}</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // DEFAULT: BUYER NAVIGATION (Floating with customized emerald glow shadow)
  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-40 md:hidden">
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-200/70 dark:border-emerald-900/50 rounded-full shadow-2xl shadow-emerald-950/25 dark:shadow-black/80 px-2 py-1.5 transition-all">
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {/* Tab 1: Marketplace / Soko (Home) */}
          <button
            type="button"
            onClick={goHome}
            className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full ${
              activeTab === 'market' && roleView === 'buyer'
                ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 font-bold -translate-y-0.5'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
            }`}
            aria-label={t.navHome}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">{language === 'sw' ? 'Mwanzo' : 'Home'}</span>
          </button>

          {/* Tab 2: Categories / Makundi (Matches Anatomy Section 9) */}
          <button
            type="button"
            onClick={() => {
              setRoleView('buyer');
              if (activeTab !== 'market') {
                setActiveTab('market');
              }
              setTimeout(() => {
                const chipsEl = document.getElementById('campus-category-chips');
                if (chipsEl) {
                  chipsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }, 50);
            }}
            className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full cursor-pointer ${
              activeTab === 'market' && filters.category !== 'all'
                ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 font-bold -translate-y-0.5'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
            }`}
            aria-label={language === 'sw' ? 'Makundi' : 'Categories'}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
              {language === 'sw' ? 'Makundi' : 'Categories'}
            </span>
          </button>

          {/* Tab 3: Wanted Demands (Mahitaji) */}
          <button
            type="button"
            onClick={() => {
              setRoleView('buyer');
              setActiveTab('wanted');
            }}
            className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full cursor-pointer ${
              activeTab === 'wanted'
                ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 font-bold -translate-y-0.5'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
            }`}
            aria-label={language === 'sw' ? 'Mahitaji' : 'Wanted'}
          >
            <Megaphone className="w-4 h-4" />
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
              {language === 'sw' ? 'Mahitaji' : 'Wanted'}
            </span>
          </button>

          {/* Tab 4: Messages / Jumbe (Matches Anatomy Section 9) */}
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
            className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 relative transition-all rounded-full cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 font-bold -translate-y-0.5'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
            }`}
            aria-label={`${language === 'sw' ? 'Jumbe' : 'Messages'}${unreadMessagesCount > 0 ? ` (${unreadMessagesCount} unread)` : ''}`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                {unreadMessagesCount > 0 ? unreadMessagesCount : 2}
              </span>
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">
              {language === 'sw' ? 'Jumbe' : 'Messages'}
            </span>
          </button>

          {/* Tab 5: Profile / Wasifu (Matches Anatomy Section 9) */}
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
            className={`flex flex-col items-center justify-center min-h-[46px] py-1 px-1 transition-all rounded-full cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 font-bold -translate-y-0.5'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
            }`}
            aria-label={t.navProfile}
          >
            <div className="relative">
              <UserIcon className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-red-500" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">{language === 'sw' ? 'Wasifu' : 'Profile'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
