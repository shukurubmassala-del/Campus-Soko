import React, { useState, useMemo } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import { Listing, ListingStatus } from '../../types';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  DollarSign,
  Eye,
  Home,
  MessageSquare,
  Package,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Megaphone,
  Star,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { SellerRegistrationModal } from './SellerRegistrationModal';
import { BackHomeButton } from '../common/BackHomeButton';
import { ColorPreferencePicker } from '../common/ColorPreferencePicker';
import { WantedBoard } from '../wanted/WantedBoard';
import { ChatDrawer } from '../chat/ChatDrawer';
import { ProfileView } from '../profile/ProfileView';
import { SearchView } from '../search/SearchView';
import { getSafeAvatarUrl, getSafeListingImageUrl } from '../../utils/imageUtils';

export const SellerView: React.FC = () => {
  const {
    language,
    t,
    currentUniversity,
    currentUser,
    listings,
    markListingStatus,
    deleteListing,
    conversations,
    wantedPosts,
    setIsCreateListingOpen,
    setActiveListingDetail,
    setActiveConversation,
    activeTab,
    setActiveTab,
    setRoleView,
    setIsVerificationModalOpen,
    isSellerRegistrationOpen,
    setIsSellerRegistrationOpen,
    colorTheme,
    userColorPreference,
    goHome,
  } = useCampusSoko();

  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'active' | 'reserved' | 'sold'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Seller's specific listings
  const myListings = useMemo(() => {
    if (!currentUser) return [];
    return listings.filter((l) => l.sellerId === currentUser.id || l.sellerPhone === currentUser.phone);
  }, [listings, currentUser]);

  // Performance calculations
  const activeCount = myListings.filter((l) => l.status === 'active').length;
  const reservedCount = myListings.filter((l) => l.status === 'reserved').length;
  const soldCount = myListings.filter((l) => l.status === 'sold').length;
  const totalViews = myListings.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
  const grossSalesTZS = myListings
    .filter((l) => l.status === 'sold')
    .reduce((sum, l) => sum + l.price, 0);

  // Conversations where current user is the seller
  const sellerConversations = useMemo(() => {
    if (!currentUser) return [];
    return conversations.filter(
      (c) => c.sellerId === currentUser.id || myListings.some((l) => l.id === c.listingId)
    );
  }, [conversations, currentUser, myListings]);

  // Buyer opportunities in this campus (Wanted posts from other students)
  const campusBuyerDemands = useMemo(() => {
    return wantedPosts.filter(
      (p) => p.status === 'open' && (p.universityId === currentUniversity.id || !currentUser || p.buyerId !== currentUser.id)
    );
  }, [wantedPosts, currentUniversity, currentUser]);

  // Filtered Inventory items
  const filteredInventory = useMemo(() => {
    return myListings.filter((item) => {
      const matchesFilter = inventoryFilter === 'all' || item.status === inventoryFilter;
      const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [myListings, inventoryFilter, searchQuery]);

  const isSeller = currentUser && (currentUser.isSellerRegistered || myListings.length > 0);

  return (
    <div className="space-y-6">
      
      {/* Seller Navigation Strip: Floating Rounded Dock with Customized Coloured Shadow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-full border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-950/10 dark:shadow-black/60 overflow-x-auto no-scrollbar">
          {/* 1. Studio */}
          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'market'
                ? 'bg-[#00B53F] text-white shadow-lg shadow-emerald-500/40 font-bold -translate-y-0.5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <span>{language === 'sw' ? 'Seller Studio' : 'Studio'}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10 font-mono">
              {myListings.length}
            </span>
          </button>

          {/* 2. Demands */}
          <button
            type="button"
            onClick={() => setActiveTab('wanted')}
            className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'wanted'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 font-bold -translate-y-0.5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>{language === 'sw' ? 'Mahitaji (Demand)' : 'Demand'}</span>
            {campusBuyerDemands.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white font-mono font-bold animate-pulse">
                {campusBuyerDemands.length}
              </span>
            )}
          </button>

          {/* 3. Leads & Incoming Inquiries */}
          <button
            type="button"
            onClick={() => setActiveTab('chats')}
            className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'chats'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 font-bold -translate-y-0.5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>{language === 'sw' ? 'Wateja (Leads)' : 'Leads'}</span>
            {sellerConversations.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-white font-mono font-bold">
                {sellerConversations.length}
              </span>
            )}
          </button>

          {/* 4. Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg shadow-slate-950/30 dark:shadow-white/20 font-bold -translate-y-0.5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{language === 'sw' ? 'Wasifu' : 'Profile'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <BackHomeButton />
          <ColorPreferencePicker variant="compact" />
        </div>
      </div>

      {/* Sub-Views for Seller Tabs */}
      {activeTab === 'wanted' && <WantedBoard />}
      {activeTab === 'chats' && <ChatDrawer />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'search' && <SearchView />}

      {/* Primary Studio View */}
      {activeTab === 'market' && (
        <>
          {/* SELLER REGISTRATION PROTOCOL GATE (Shown if not yet registered as a seller) */}
      {!isSeller ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto space-y-6 animate-in fade-in">
          
          <div className={`w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 ${colorTheme.iconColor} flex items-center justify-center mx-auto shadow-inner`}>
            <Store className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            {/* Screen title: 22–24px, Semibold (600) */}
            <h2 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 dark:text-white">
              {language === 'sw' ? 'Karibu kwenye Seller Studio ya CampusSoko' : 'Welcome to CampusSoko Seller Studio'}
            </h2>
            {/* Body text: 14–16px, Regular (400) */}
            <p className="text-[14px] sm:text-[15px] font-normal text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              {language === 'sw'
                ? 'Anza kuuza vitabu, laptop, simu, vifaa vya hostel na huduma zako moja kwa moja kwa wanafunzi wa chuo chako bila madalali au ada za uorodheshaji.'
                : 'Start selling your textbooks, electronics, hostel gear, and campus services directly to student peers with zero listing fees.'}
            </p>
          </div>

          {/* Seller Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white text-[14px] block">
                {language === 'sw' ? '0% Ada ya Uuzaji' : 'Zero Listing Fees'}
              </span>
              <p className="text-[13px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'sw' ? 'Weka matangazo bila malipo yoyote na uhifadhi mapato yako yote.' : 'Post unlimited items completely free. Keep 100% of your earnings.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white text-[14px] block">
                {language === 'sw' ? 'Beji ya Uthibitisho' : 'Verified Student Trust'}
              </span>
              <p className="text-[13px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'sw' ? 'Thibitisha barua pepe ya chuo au ID ili wanunuzi wakuamini mara 3 zaidi.' : 'Verify your university ID or email to unlock instant buyer confidence.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white text-[14px] block">
                {language === 'sw' ? 'Kukutana Chuoni Salama' : 'Safe Campus Pickups'}
              </span>
              <p className="text-[13px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'sw' ? 'Kutana geti kuu, maktaba au cafeteria kwa usalama wa uhakika.' : 'Coordinate handoffs at campus gates, libraries, and hostels.'}
              </p>
            </div>
          </div>

          {/* Primary Registration Trigger CTA - Buttons: 14–16 px, Semibold (600) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsSellerRegistrationOpen(true)}
              className={`w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-2xl text-[14px] sm:text-[15px] font-semibold transition-all flex items-center justify-center gap-2 active:scale-98 ${colorTheme.primaryBtn}`}
            >
              <Store className="w-4 h-4" />
              <span>{language === 'sw' ? 'Anza Usajili wa Muuzaji (Seller Protocol)' : 'Start Seller Registration Protocol'}</span>
            </button>

            <button
              type="button"
              onClick={goHome}
              className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-[14px] sm:text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{language === 'sw' ? 'Rudi Sokoni' : 'Back to Marketplace'}</span>
            </button>
          </div>

        </div>
      ) : (
        /* REGISTERED SELLER WORKSPACE / STUDIO */
        <div className="space-y-6 animate-in fade-in">
          
          {/* Seller Header & Performance Strip */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={getSafeAvatarUrl(currentUser.avatarUrl, currentUser.fullName)}
                  alt={currentUser.fullName}
                  className={`w-13 h-13 rounded-2xl bg-slate-100 object-cover border-2 ${colorTheme.borderColor}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    {/* Screen title / Shop name: 22–24px, Semibold (600) */}
                    <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 dark:text-white">
                      {currentUser.shopName || currentUser.fullName}
                    </h1>
                    {currentUser.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Muuzaji Aliyethibitishwa' : 'Verified Student'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsVerificationModalOpen(true)}
                        className="text-[12px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md hover:underline"
                      >
                        {language === 'sw' ? 'Thibitisha ID Sasa' : 'Verify ID Now'}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      <span className={`w-1.5 h-1.5 rounded-full ${colorTheme.dotBg}`} />
                      <span>{currentUniversity.shortName}</span>
                    </span>
                    <span className="text-[12px] font-normal text-slate-500 dark:text-slate-400">
                      {currentUser.campusZone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Post Listing CTA - Buttons: 14–16 px, Semibold (600) */}
              <button
                type="button"
                onClick={() => setIsCreateListingOpen(true)}
                className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-[14px] sm:text-[15px] font-semibold transition-all flex items-center justify-center gap-2 active:scale-98 shrink-0 ${colorTheme.primaryBtn}`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{language === 'sw' ? 'Weka Tangazo Jipya' : 'Post New Listing'}</span>
              </button>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Package className={`w-3.5 h-3.5 ${colorTheme.iconColor}`} />
                  <span>{language === 'sw' ? 'Zinazouzwa' : 'Active'}</span>
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block tabular-nums">
                  {activeCount}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>{language === 'sw' ? 'Watazamaji' : 'Total Views'}</span>
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block tabular-nums">
                  {totalViews}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                  <span>{language === 'sw' ? 'Wateja (Chats)' : 'Inquiries'}</span>
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block tabular-nums">
                  {sellerConversations.length}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{language === 'sw' ? 'Zilizouzwa' : 'Sold Items'}</span>
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block tabular-nums">
                  {soldCount}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <DollarSign className={`w-3.5 h-3.5 ${colorTheme.iconColor}`} />
                  <span>{language === 'sw' ? 'Mauzo (TZS)' : 'Revenue'}</span>
                </span>
                <span className={`text-sm font-extrabold block tabular-nums truncate ${colorTheme.accentText}`}>
                  {formatTZS(grossSalesTZS)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{language === 'sw' ? 'Alama (Stars)' : 'Trust Score'}</span>
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block tabular-nums">
                  {currentUser.rating || 5.0} ({currentUser.reviewCount || 0})
                </span>
              </div>

            </div>
          </div>

          {/* Campus Buyer Demand Alerts ("Ninatafuta" Opportunities for Sellers) */}
          {campusBuyerDemands.length > 0 && (
            <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-[15px] sm:text-[16px] font-semibold text-slate-900 dark:text-white">
                    {language === 'sw'
                      ? `Wanafunzi wa ${currentUniversity.shortName} Wanatafuta Vitu Hivi Sasa Hivi:`
                      : `Live Buyer Demands from ${currentUniversity.shortName} Students:`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('wanted')}
                  className="text-[13px] font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  {language === 'sw' ? 'Tazama Zote' : 'View All'} ({campusBuyerDemands.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {campusBuyerDemands.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between gap-2.5"
                  >
                    <div>
                      <span className="text-[14px] sm:text-[15px] font-medium text-slate-900 dark:text-white block truncate">
                        {post.title}
                      </span>
                      <span className="text-[12px] font-normal text-slate-500 dark:text-slate-400 block line-clamp-1">
                        {post.buyerName} • {post.campusZone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[14px] sm:text-[15px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatTZS(post.maxBudget)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('wanted');
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[12px] sm:text-[13px] font-semibold hover:bg-amber-200 transition-colors"
                      >
                        {language === 'sw' ? 'Niko Nayo' : 'I Have It'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller Inventory Management - Section heading: 18–20 px, Semibold (600) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 overflow-hidden w-full max-w-full">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white truncate">
                  {language === 'sw' ? 'Usimamizi wa Bidhaa Zako' : 'Inventory Management'}
                </h2>
                <span className="text-[12px] sm:text-[13px] font-normal text-slate-500 dark:text-slate-400 block truncate">
                  {myListings.length} {language === 'sw' ? 'matangazo yaliyosajiliwa' : 'registered listings'}
                </span>
              </div>

              {/* Status Segmented Filter */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-full overflow-x-auto">
                {(['active', 'reserved', 'sold', 'all'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setInventoryFilter(st)}
                    className={`min-h-[36px] px-3 py-1.5 text-[12px] sm:text-[13px] font-semibold rounded-lg transition-colors capitalize whitespace-nowrap cursor-pointer ${
                      inventoryFilter === st
                        ? colorTheme.badgeActive
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st === 'active'
                      ? (language === 'sw' ? 'Zinazouzwa' : 'Active')
                      : st === 'reserved'
                      ? (language === 'sw' ? 'Akiba' : 'Reserved')
                      : st === 'sold'
                      ? (language === 'sw' ? 'Zilizouzwa' : 'Sold')
                      : (language === 'sw' ? 'Zote' : 'All')}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Inventory Search Box */}
            {myListings.length > 3 && (
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'sw' ? 'Tafuta kwenye bidhaa zako...' : 'Search your inventory...'}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Inventory List */}
            {filteredInventory.length > 0 ? (
              <div className="space-y-3">
                {filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-colors hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden w-full max-w-full"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 max-w-full">
                      <img
                        src={getSafeListingImageUrl(item.images?.[0])}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200/60"
                      />
                      <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setActiveListingDetail(item)}
                          className="text-[14px] sm:text-[15px] font-medium text-slate-900 dark:text-white hover:underline text-left block w-full truncate"
                        >
                          {item.title}
                        </button>
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className={`text-[15px] sm:text-[17px] font-bold tabular-nums shrink-0 ${colorTheme.accentText}`}>
                            {formatTZS(item.price)}
                          </span>
                          <span className="text-[12px] font-normal text-slate-400 shrink-0">
                            • {item.viewsCount || 0} {language === 'sw' ? 'watazamaji' : 'views'}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize font-medium shrink-0">
                            {item.status === 'active'
                              ? (language === 'sw' ? 'Inauzwa' : 'Active')
                              : item.status === 'reserved'
                              ? (language === 'sw' ? 'Imetengwa' : 'Reserved')
                              : (language === 'sw' ? 'Imeuzwa' : 'Sold')}
                          </span>
                        </div>
                        <span className="text-[12px] font-normal text-slate-500 dark:text-slate-400 block truncate max-w-full">
                          {item.campusZone} • {item.safePickupPoint}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons - wrapped nicely so they don't break viewport or overlap */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700/60 w-full md:w-auto">
                      {item.status === 'active' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => markListingStatus(item.id, 'sold')}
                            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-[13px] sm:text-[14px] font-semibold transition-colors shadow-xs cursor-pointer ${colorTheme.primaryBtn}`}
                          >
                            {language === 'sw' ? 'Weka Kimeuzwa' : 'Mark Sold'}
                          </button>
                          <button
                            type="button"
                            onClick={() => markListingStatus(item.id, 'reserved')}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[13px] sm:text-[14px] font-semibold border border-amber-300 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            {language === 'sw' ? 'Akiba' : 'Reserve'}
                          </button>
                        </>
                      ) : item.status === 'reserved' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => markListingStatus(item.id, 'sold')}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] sm:text-[14px] font-semibold transition-colors cursor-pointer"
                          >
                            {language === 'sw' ? 'Weka Kimeuzwa' : 'Mark Sold'}
                          </button>
                          <button
                            type="button"
                            onClick={() => markListingStatus(item.id, 'active')}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[13px] sm:text-[14px] font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
                          >
                            {language === 'sw' ? 'Rejesha Hewani' : 'Reactivate'}
                          </button>
                        </>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[12px] font-medium uppercase">
                          {language === 'sw' ? 'Kimeuzwa' : 'Sold'}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteListing(item.id)}
                        className="min-w-[38px] min-h-[38px] rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title={t.deleteListing}
                        aria-label={`${t.deleteListing}: ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-[14px] font-normal text-slate-500 dark:text-slate-400">
                  {language === 'sw'
                    ? 'Hakuna bidhaa kwenye kundi hili kwa sasa.'
                    : 'No listings found in this status.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateListingOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Weka Tangazo la Kwanza' : 'Post Your First Item'}
                </button>
              </div>
            )}

          </div>

          {/* Incoming Buyer Inquiries / Conversations Section - Section heading: 18–20 px, Semibold (600) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 overflow-hidden w-full max-w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white truncate">
                  {language === 'sw' ? 'Mawasiliano na Wanunuzi (Buyer Leads)' : 'Incoming Buyer Inquiries'}
                </h2>
                <span className="text-[12px] sm:text-[13px] font-normal text-slate-500 dark:text-slate-400 block truncate">
                  {sellerConversations.length} {language === 'sw' ? 'majadiliano ya bei na mahali pa kukutana' : 'active buyer discussions'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className="text-[13px] sm:text-[14px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 text-left sm:text-right"
              >
                {language === 'sw' ? 'Fungua Chat Zote' : 'View All Chats'}
              </button>
            </div>

            {sellerConversations.length > 0 ? (
              <div className="space-y-2.5">
                {sellerConversations.map((conv) => {
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConversation(conv);
                        setActiveTab('chats');
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-emerald-500/60 transition-colors overflow-hidden w-full max-w-full"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 max-w-full">
                        <img
                          src={getSafeListingImageUrl(conv.listingImage)}
                          alt={conv.listingTitle}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200/60 dark:border-slate-700"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
                          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                            <span className="text-[14px] font-semibold text-slate-900 dark:text-white shrink-0">
                              {conv.buyerName}
                            </span>
                            <span className="text-[12px] font-normal text-slate-400 truncate max-w-[200px] sm:max-w-[260px] md:max-w-[340px]">
                              kuhusu "{conv.listingTitle}"
                            </span>
                          </div>
                          <p className="text-[13px] font-normal text-slate-500 dark:text-slate-400 line-clamp-1 truncate block max-w-full">
                            {lastMsg?.text || (language === 'sw' ? 'Mawasiliano yamefunguliwa' : 'Conversation started')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto">
                        <span className="text-[14px] sm:text-[15px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                          {formatTZS(conv.listingPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveConversation(conv);
                            setActiveTab('chats');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[13px] sm:text-[14px] font-semibold transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          {language === 'sw' ? 'Jibu' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-[14px] font-normal text-slate-400">
                  {language === 'sw'
                    ? 'Bado haujapokea ujumbe kutoka kwa wanunuzi. Tangaza bidhaa zako kwa wanafunzi!'
                    : 'No buyer inquiries yet. Listings on campus typically receive inquiries within hours!'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('chats')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Fungua Kisanduku cha Ujumbe' : 'Open Messages Box'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}
        </>
      )}

      {/* Seller Registration Protocol Modal */}
      <SellerRegistrationModal
        isOpen={isSellerRegistrationOpen}
        onClose={() => setIsSellerRegistrationOpen(false)}
      />

    </div>
  );
};
