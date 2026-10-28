import React, { useState, useMemo, useEffect } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { checkProhibitedContent } from '../../data/prohibitedKeywords';
import { formatTZS } from '../../utils/currency';
import { Category, Listing, ListingStatus, University, User } from '../../types';
import { BackHomeButton } from '../common/BackHomeButton';
import { CategoryIcon } from '../common/CategoryIcon';
import { ColorPreferencePicker } from '../common/ColorPreferencePicker';
import { getSafeAvatarUrl, getSafeListingImageUrl } from '../../utils/imageUtils';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Edit2,
  ExternalLink,
  Eye,
  Filter,
  Lock,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AppUpdateService, APP_CURRENT_VERSION, APP_BUILD_ID } from '../../services/appUpdateService';

export const AdminDashboardModal: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    users,
    toggleUserVerification,
    toggleUserAdmin,
    toggleUserBan,
    deleteUser,
    addUser,
    listings,
    deleteListing,
    toggleListingFeatured,
    updateListingStatusByAdmin,
    reports,
    resolveReport,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    universities,
    addUniversity,
    updateUniversity,
    deleteUniversity,
    setActiveTab,
    serverAdminVerified,
    verifyServerAdminRole,
    loginAsDemo,
    setActiveListingDetail,
    colorTheme,
    showToast,
  } = useCampusSoko();

  // Active sub-navigation tab
  const [adminTab, setAdminTab] = useState<
    'analytics' | 'users' | 'listings' | 'reports' | 'categories' | 'universities' | 'audit' | 'amendments'
  >('analytics');

  // Amendment Publishing State
  const [amendTitleSw, setAmendTitleSw] = useState('');
  const [amendTitleEn, setAmendTitleEn] = useState('');
  const [amendDescSw, setAmendDescSw] = useState('');
  const [amendDescEn, setAmendDescEn] = useState('');
  const [amendVersion, setAmendVersion] = useState('1.4.0');
  const [amendHighlightsText, setAmendHighlightsText] = useState('');
  const [isPublishingAmendment, setIsPublishingAmendment] = useState(false);

  // Search & Filters state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'verified' | 'banned'>('all');
  const [userUnivFilter, setUserUnivFilter] = useState<string>('all');

  const [listingSearch, setListingSearch] = useState('');
  const [listingStatusFilter, setListingStatusFilter] = useState<'all' | 'active' | 'reserved' | 'sold'>('all');
  const [listingCategoryFilter, setListingCategoryFilter] = useState<string>('all');
  const [listingUnivFilter, setListingUnivFilter] = useState<string>('all');

  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');

  // Prohibited Keywords Test state
  const [auditText, setAuditText] = useState('');
  const [auditResult, setAuditResult] = useState<{
    isProhibited: boolean;
    matchedTerm?: string;
    reasonSw?: string;
    reasonEn?: string;
  } | null>(null);

  // Modal forms state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('0712345678');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUniv, setNewUserUniv] = useState(universities[0]?.id || 'udsm');
  const [newUserZone, setNewUserZone] = useState('');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [newUserIsVerified, setNewUserIsVerified] = useState(true);

  // Add/Edit University modal state
  const [isUnivModalOpen, setIsUnivModalOpen] = useState(false);
  const [editingUnivId, setEditingUnivId] = useState<string | null>(null);
  const [univName, setUnivName] = useState('');
  const [univShort, setUnivShort] = useState('');
  const [univCity, setUnivCity] = useState('');
  const [univZonesText, setUnivZonesText] = useState('');
  const [univSafePointsText, setUnivSafePointsText] = useState('');

  // Add/Edit Category modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catNameSw, setCatNameSw] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catDescSw, setCatDescSw] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catIcon, setCatIcon] = useState('Tag');

  // Server Analytics state
  const [serverAnalytics, setServerAnalytics] = useState<{
    weeklyUsersGrowth?: { week: string; count: number; verified: number }[];
    weeklyListingsVolume?: { week: string; active: number; sold: number }[];
    weeklyReportsVolume?: { week: string; count: number; resolved: number }[];
    resolutionRatePercent?: number;
    averageItemPriceTZS?: number;
    activeCampusesCount?: number;
    totalResolvedReports?: number;
  } | null>(null);

  // Re-verify server status on mount and load server-side computed analytics
  useEffect(() => {
    verifyServerAdminRole();
    if (currentUser?.isAdmin) {
      fetch('/api/admin/analytics', {
        headers: {
          'x-admin-role': 'admin',
          'Authorization': 'Bearer admin_token_demo',
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.analytics) setServerAnalytics(data.analytics);
        })
        .catch((err) => console.warn('Could not fetch server analytics:', err));
    }
  }, [currentUser, adminTab]);

  // ==========================================
  // CLIENT & SERVER SECURITY ROLE CHECK GATE
  // ==========================================
  if (!currentUser?.isAdmin) {
    const adminDemoAccount = users.find((u) => u.isAdmin);

    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/60 shadow-xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.accessDeniedTitle}
            </h2>
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">
              Role-Based Access Control (RBAC) Protection Active
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>{t.accessDeniedDesc}</p>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] pt-1">
            <Lock className="w-3.5 h-3.5 text-red-500" />
            <span>Server Endpoint: /api/admin/* requires Authorization: Bearer admin_token</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span>Firestore Rules: match /reports, /categories, /universities write: if isAdmin()</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {adminDemoAccount && (
            <button
              type="button"
              onClick={() => {
                loginAsDemo(adminDemoAccount);
                verifyServerAdminRole();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.switchToAdminDemo}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            {t.returnToMarket}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // ANALYTICS & COMPUTED AGGREGATIONS
  // ==========================================
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const resolvedReports = reports.filter((r) => r.status === 'resolved');
  const dismissedReports = reports.filter((r) => r.status === 'dismissed');

  const activeListingsCount = listings.filter((l) => l.status === 'active').length;
  const soldListingsCount = listings.filter((l) => l.status === 'sold').length;
  const reservedListingsCount = listings.filter((l) => l.status === 'reserved').length;

  const totalMarketplaceValue = listings
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + (l.price || 0), 0);

  const avgPrice = activeListingsCount > 0 ? Math.round(totalMarketplaceValue / activeListingsCount) : 0;

  const verifiedUsersCount = users.filter((u) => u.isVerified).length;
  const verifiedPercentage = users.length > 0 ? Math.round((verifiedUsersCount / users.length) * 100) : 0;

  const resolutionRate =
    reports.length > 0 ? Math.round(((resolvedReports.length + dismissedReports.length) / reports.length) * 100) : 100;

  // Weekly growth trends computed dynamically from server and active platform metrics
  const weeklyTrends = useMemo(() => {
    if (serverAnalytics?.weeklyUsersGrowth && serverAnalytics?.weeklyListingsVolume && serverAnalytics?.weeklyReportsVolume) {
      return serverAnalytics.weeklyUsersGrowth.map((ug, index) => {
        const lv = serverAnalytics.weeklyListingsVolume![index] || { active: 20, sold: 10 };
        const rv = serverAnalytics.weeklyReportsVolume![index] || { count: 2, resolved: 1 };
        const isCurrent = index === serverAnalytics.weeklyUsersGrowth!.length - 1;
        return {
          week: isCurrent ? `${ug.week}` : ug.week,
          users: isCurrent ? users.length : ug.count,
          listings: isCurrent ? listings.length : lv.active,
          reports: isCurrent ? reports.length : rv.count,
        };
      });
    }

    return [
      { week: 'W1', users: 18, listings: 22, reports: 4 },
      { week: 'W2', users: 26, listings: 35, reports: 6 },
      { week: 'W3', users: 34, listings: 48, reports: 3 },
      { week: 'W4 (Now)', users: users.length, listings: listings.length, reports: reports.length },
    ];
  }, [serverAnalytics, users.length, listings.length, reports.length]);

  // Listings count per category
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const count = listings.filter((l) => l.category === cat.id).length;
      const percent = listings.length > 0 ? Math.round((count / listings.length) * 100) : 0;
      return {
        ...cat,
        count,
        percent,
      };
    });
  }, [categories, listings]);

  // Users per University
  const universityStats = useMemo(() => {
    return universities.map((u) => {
      const count = users.filter((user) => user.universityId === u.id).length;
      const listingCount = listings.filter((l) => l.universityId === u.id).length;
      return {
        ...u,
        userCount: count,
        listingCount,
      };
    });
  }, [universities, users, listings]);

  // Report Reasons Breakdown
  const reportReasonStats = useMemo(() => {
    const reasons: Record<string, number> = {
      fraud: 0,
      prohibited_item: 0,
      counterfeit: 0,
      harassment: 0,
      other: 0,
    };
    reports.forEach((r) => {
      if (reasons[r.reason] !== undefined) reasons[r.reason]++;
      else reasons.other++;
    });
    return reasons;
  }, [reports]);

  // ==========================================
  // FILTERED DATA VIEWS
  // ==========================================
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phone.includes(userSearch) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()));

      const matchRole =
        userRoleFilter === 'all'
          ? true
          : userRoleFilter === 'admin'
          ? u.isAdmin
          : userRoleFilter === 'verified'
          ? u.isVerified
          : userRoleFilter === 'banned'
          ? u.isBanned
          : true;

      const matchUniv = userUnivFilter === 'all' || u.universityId === userUnivFilter;

      return matchSearch && matchRole && matchUniv;
    });
  }, [users, userSearch, userRoleFilter, userUnivFilter]);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchSearch =
        l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
        l.sellerName.toLowerCase().includes(listingSearch.toLowerCase());

      const matchStatus = listingStatusFilter === 'all' || l.status === listingStatusFilter;
      const matchCat = listingCategoryFilter === 'all' || l.category === listingCategoryFilter;
      const matchUniv = listingUnivFilter === 'all' || l.universityId === listingUnivFilter;

      return matchSearch && matchStatus && matchCat && matchUniv;
    });
  }, [listings, listingSearch, listingStatusFilter, listingCategoryFilter, listingUnivFilter]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (reportStatusFilter === 'all') return true;
      return r.status === reportStatusFilter;
    });
  }, [reports, reportStatusFilter]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkProhibitedContent(auditText);
    setAuditResult(res);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim()) return;

    addUser({
      fullName: newUserName.trim(),
      phone: newUserPhone.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@${newUserUniv}.ac.tz`,
      universityId: newUserUniv,
      campusZone: newUserZone.trim() || universities.find((u) => u.id === newUserUniv)?.zones[0] || 'Main Campus',
      isVerified: newUserIsVerified,
      verificationMethod: newUserIsVerified ? 'student_id' : undefined,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUserName)}&backgroundColor=b6e3f4`,
      isAdmin: newUserIsAdmin,
      role: newUserIsAdmin ? 'admin' : 'student',
    });

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserZone('');
  };

  const handleOpenUnivModal = (univ?: University) => {
    if (univ) {
      setEditingUnivId(univ.id);
      setUnivName(univ.name);
      setUnivShort(univ.shortName);
      setUnivCity(univ.city);
      setUnivZonesText(univ.zones.join(', '));
      setUnivSafePointsText(univ.safeMeetingPoints.join(', '));
    } else {
      setEditingUnivId(null);
      setUnivName('');
      setUnivShort('');
      setUnivCity('');
      setUnivZonesText('');
      setUnivSafePointsText('');
    }
    setIsUnivModalOpen(true);
  };

  const handleSaveUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!univName.trim() || !univShort.trim()) return;

    const zones = univZonesText
      .split(',')
      .map((z) => z.trim())
      .filter(Boolean);
    const safeMeetingPoints = univSafePointsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingUnivId) {
      updateUniversity(editingUnivId, {
        name: univName.trim(),
        shortName: univShort.trim(),
        city: univCity.trim(),
        zones: zones.length > 0 ? zones : ['Main Campus'],
        safeMeetingPoints: safeMeetingPoints.length > 0 ? safeMeetingPoints : ['Main Gate', 'Library'],
      });
    } else {
      const id = univShort.toLowerCase().replace(/[^a-z0-9]/g, '');
      const sName = univShort.trim().toUpperCase();
      addUniversity({
        id: id || 'univ_' + Date.now(),
        name: univName.trim(),
        shortName: sName,
        city: univCity.trim(),
        zones: zones.length > 0 ? zones : ['Main Campus', 'Hostels'],
        safeMeetingPoints: safeMeetingPoints.length > 0 ? safeMeetingPoints : ['Main Gate', 'Central Library', 'Student Cafeteria'],
      });
    }

    setIsUnivModalOpen(false);
  };

  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCatId(cat.id as string);
      setCatNameSw(cat.nameSw);
      setCatNameEn(cat.nameEn);
      setCatDescSw(cat.descriptionSw);
      setCatDescEn(cat.descriptionEn);
      setCatIcon(cat.iconName);
    } else {
      setEditingCatId(null);
      setCatNameSw('');
      setCatNameEn('');
      setCatDescSw('');
      setCatDescEn('');
      setCatIcon('Tag');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameSw.trim() || !catNameEn.trim()) return;

    if (editingCatId) {
      updateCategory(editingCatId, {
        nameSw: catNameSw.trim(),
        nameEn: catNameEn.trim(),
        descriptionSw: catDescSw.trim(),
        descriptionEn: catDescEn.trim(),
        iconName: catIcon.trim() || 'Tag',
      });
    } else {
      const id = catNameEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
      addCategory({
        id: id || 'cat_' + Date.now(),
        nameSw: catNameSw.trim(),
        nameEn: catNameEn.trim(),
        descriptionSw: catDescSw.trim(),
        descriptionEn: catDescEn.trim(),
        iconName: catIcon.trim() || 'Tag',
      });
    }

    setIsCatModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm max-w-7xl mx-auto space-y-6">
      
      {/* ==========================================
          HEADER STRIP
      ========================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.adminTitle}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.adminSubtitle}
            </p>
          </div>
        </div>

        {/* Server status & Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${
              serverAdminVerified
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverAdminVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{t.serverRoleCheckVerified}</span>
          </div>

          <ColorPreferencePicker variant="compact" />
          <BackHomeButton variant="compact" />
        </div>
      </div>

      {/* ==========================================
          NAV TABS STRIP - Floating Rounded Pill Dock with Colored Shadows
      ========================================== */}
      <div className="p-1.5 rounded-full bg-slate-100/90 dark:bg-slate-850/90 border border-slate-200/80 dark:border-slate-700/80 shadow-md shadow-slate-900/5 flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none text-xs font-semibold backdrop-blur-md">
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'analytics'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-md shadow-slate-900/30 dark:shadow-white/20 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>{t.adminTabOverview}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('users')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'users'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t.adminTabUsers.replace('{count}', String(users.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('listings')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'listings'
              ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{t.adminTabListings.replace('{count}', String(listings.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('reports')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'reports'
              ? 'bg-red-600 text-white font-bold shadow-md shadow-red-500/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-300" />
          <span>{t.adminTabReports.replace('{count}', String(pendingReports.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('categories')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'categories'
              ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>{t.adminTabCategories.replace('{count}', String(categories.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('universities')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'universities'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t.adminTabUniversities.replace('{count}', String(universities.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('audit')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'audit'
              ? 'bg-rose-700 text-white font-bold shadow-md shadow-rose-600/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{t.adminTabAudit}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('amendments')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-hidden shrink-0 cursor-pointer ${
            adminTab === 'amendments'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/40 -translate-y-0.5 scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{language === 'sw' ? 'Maboresho & Toleo' : 'Amendments & Releases'}</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ANALYTICS & OVERVIEW (NEW USERS, ACTIVE LISTINGS, REPORTS PER WEEK)
      ========================================================================= */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Top 4 Primary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* KPI 1: New Users / Students */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  {t.kpiNewUsers}
                </span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {users.length}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +28%
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{language === 'sw' ? 'Waliothibitishwa' : 'Verified'}:</span>
                <span className="font-bold text-emerald-600">{verifiedPercentage}% ({verifiedUsersCount})</span>
              </div>
            </div>

            {/* KPI 2: Active Listings */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-800/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  {t.kpiActiveListings}
                </span>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {activeListingsCount}
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  {listings.length} {language === 'sw' ? 'Jumla' : 'Total'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{language === 'sw' ? 'Imeuzwa' : 'Sold'}:</span>
                <span className="font-bold text-blue-600">{soldListingsCount} · {reservedListingsCount} res</span>
              </div>
            </div>

            {/* KPI 3: Reports per Week */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20 border border-red-200/80 dark:border-red-800/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold text-red-800 dark:text-red-300">
                  {t.kpiReportsPerWeek}
                </span>
                <ShieldAlert className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-red-600 dark:text-red-400 tabular-nums">
                  {reports.length}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {pendingReports.length} {language === 'sw' ? 'zinasubiri' : 'pending'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{t.kpiResolutionRate}:</span>
                <span className="font-bold text-emerald-600">{resolutionRate}%</span>
              </div>
            </div>

            {/* KPI 4: Total Inventory Volume in TZS */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border border-amber-200/80 dark:border-amber-800/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  {t.kpiTotalVolume}
                </span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {formatTZS(totalMarketplaceValue)}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{t.kpiAvgPrice}:</span>
                <span className="font-bold text-amber-600">{formatTZS(avgPrice)}</span>
              </div>
            </div>

          </div>

          {/* Weekly Growth Trend Visualizer (CSS Bars) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${colorTheme.accentText}`} />
                  <span>{t.chartWeeklyGrowth}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'sw'
                    ? 'Ulinganisho wa wanafunzi wapya, matangazo yaliyowekwa, na ripoti za usalama kwa wiki'
                    : 'Comparison of student signups, published listings, and safety reports per week'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded ${colorTheme.chartBarPrimary}`} />
                  <span>{language === 'sw' ? 'Wanafunzi' : 'Users'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded ${colorTheme.chartBarSecondary}`} />
                  <span>{language === 'sw' ? 'Matangazo' : 'Listings'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded ${colorTheme.chartBarTertiary}`} />
                  <span>{language === 'sw' ? 'Ripoti' : 'Reports'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              {weeklyTrends.map((tItem) => (
                <div key={tItem.week} className="text-center space-y-2">
                  <div className="h-32 flex items-end justify-center gap-1.5 sm:gap-2 px-1">
                    {/* Users bar */}
                    <div
                      style={{ height: `${Math.min(100, (tItem.users / 50) * 100)}%` }}
                      className={`w-3 sm:w-5 ${colorTheme.chartBarPrimary} rounded-t-md transition-all hover:opacity-80`}
                      title={`Wanafunzi: ${tItem.users}`}
                    />
                    {/* Listings bar */}
                    <div
                      style={{ height: `${Math.min(100, (tItem.listings / 50) * 100)}%` }}
                      className={`w-3 sm:w-5 ${colorTheme.chartBarSecondary} rounded-t-md transition-all hover:opacity-80`}
                      title={`Matangazo: ${tItem.listings}`}
                    />
                    {/* Reports bar */}
                    <div
                      style={{ height: `${Math.max(8, Math.min(100, (tItem.reports / 10) * 100))}%` }}
                      className={`w-3 sm:w-5 ${colorTheme.chartBarTertiary} rounded-t-md transition-all hover:opacity-80`}
                      title={`Ripoti: ${tItem.reports}`}
                    />
                  </div>
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {tItem.week}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {tItem.users}u · {tItem.listings}l · {tItem.reports}r
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Breakdown: Categories & Campus Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Category Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Tag className={`w-3.5 h-3.5 ${colorTheme.accentText}`} />
                <span>{t.chartCategoriesShare}</span>
              </h4>

              <div className="space-y-2.5">
                {categoryStats.map((c) => (
                  <div key={c.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {language === 'sw' ? c.nameSw : c.nameEn}
                      </span>
                      <span className="text-slate-500 tabular-nums font-bold">
                        {c.count} ({c.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        style={{ width: `${c.percent}%` }}
                        className={`h-full ${colorTheme.progressBarBg} rounded-full transition-all`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* University Distribution & Report Incidents */}
            <div className="space-y-4">
              
              {/* Campus Share */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.chartCampusShare}</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {universityStats.map((univ) => (
                    <div
                      key={univ.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {univ.shortName} · {univ.city}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {univ.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 block tabular-nums">
                          {univ.userCount} {language === 'sw' ? 'Wanafunzi' : 'Students'}
                        </span>
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {univ.listingCount} {language === 'sw' ? 'matangazo' : 'listings'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Breakdown */}
              <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 text-xs space-y-2">
                <span className="font-bold text-red-900 dark:text-red-300 block">
                  {t.chartReportsBreakdown}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-center">
                    <span className="text-lg font-bold text-red-600">{reportReasonStats.fraud}</span>
                    <span className="block text-[10px] text-slate-500">Fraud</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-center">
                    <span className="text-lg font-bold text-amber-600">{reportReasonStats.prohibited_item}</span>
                    <span className="block text-[10px] text-slate-500">Prohibited</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-center">
                    <span className="text-lg font-bold text-purple-600">{reportReasonStats.counterfeit}</span>
                    <span className="block text-[10px] text-slate-500">Counterfeit</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-center">
                    <span className="text-lg font-bold text-blue-600">{reportReasonStats.harassment}</span>
                    <span className="block text-[10px] text-slate-500">Harassment</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: USERS MANAGEMENT (STUDENTS, BADGES, ROLES, SUSPENSIONS)
      ========================================================================= */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          
          {/* Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={t.searchUsersPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">{t.filterAllRoles}</option>
                <option value="verified">{t.filterVerifiedOnly}</option>
                <option value="admin">{t.filterAdminsOnly}</option>
                <option value="banned">{t.filterBannedOnly}</option>
              </select>

              <select
                value={userUnivFilter}
                onChange={(e) => setUserUnivFilter(e.target.value)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">{t.allUniversities}</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsAddUserOpen(true)}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 ${colorTheme.primaryBtn}`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.addNewUserBtn}</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Student / User</th>
                  <th className="p-3">Campus & Zone</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status Badges</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                      u.isBanned ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeAvatarUrl(u.avatarUrl, u.fullName)}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full bg-slate-200 shrink-0 object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {u.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                            <span>{u.rating} ({u.reviewCount} reviews) · {u.joinedDate}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold block uppercase text-[11px] text-slate-800 dark:text-slate-200">
                        {u.universityId.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[10px] block truncate max-w-[150px]">
                        {u.campusZone}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-slate-700 dark:text-slate-300 block">
                        {u.phone}
                      </span>
                      <span className="text-slate-400 text-[10px] block truncate max-w-[150px]">
                        {u.email || '-'}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {u.isVerified ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px]">
                            Unverified
                          </span>
                        )}

                        {u.isAdmin && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 text-[10px] font-bold">
                            Admin
                          </span>
                        )}

                        {u.isBanned && (
                          <span className="px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-bold">
                            Banned
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Verification */}
                        <button
                          type="button"
                          onClick={() => toggleUserVerification(u.id)}
                          className={`min-w-[36px] min-h-[36px] p-2 rounded-xl border transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                            u.isVerified
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                              : 'border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title={u.isVerified ? t.actionRevokeVerifyBadge : t.actionVerifyBadge}
                          aria-label={u.isVerified ? `${t.actionRevokeVerifyBadge}: ${u.fullName}` : `${t.actionVerifyBadge}: ${u.fullName}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        {/* Toggle Admin */}
                        <button
                          type="button"
                          onClick={() => toggleUserAdmin(u.id)}
                          className={`min-w-[36px] min-h-[36px] p-2 rounded-xl border transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 ${
                            u.isAdmin
                              ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60'
                              : 'border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title={u.isAdmin ? t.actionRevokeAdmin : t.actionGrantAdmin}
                          aria-label={u.isAdmin ? `${t.actionRevokeAdmin}: ${u.fullName}` : `${t.actionGrantAdmin}: ${u.fullName}`}
                        >
                          <Shield className="w-4 h-4" />
                        </button>

                        {/* Toggle Ban */}
                        <button
                          type="button"
                          onClick={() => toggleUserBan(u.id)}
                          className={`min-w-[36px] min-h-[36px] p-2 rounded-xl border transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 ${
                            u.isBanned
                              ? 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                              : 'border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title={u.isBanned ? t.actionUnbanAccount : t.actionBanAccount}
                          aria-label={u.isBanned ? `${t.actionUnbanAccount}: ${u.fullName}` : `${t.actionBanAccount}: ${u.fullName}`}
                        >
                          <UserX className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(language === 'sw' ? 'Una uhakika unataka kufuta mwanafunzi huyu?' : 'Are you sure you want to delete this user?')) {
                              deleteUser(u.id);
                            }
                          }}
                          className="min-w-[36px] min-h-[36px] p-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
                          title={t.actionDeleteAccount}
                          aria-label={`${t.actionDeleteAccount}: ${u.fullName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State for Users Table */}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 px-4 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {language === 'sw' ? 'Hakuna wanafunzi waliopatikana' : 'No users match your search'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {language === 'sw' ? 'Jaribu kubadilisha maneno ya utafutaji au vichujio.' : 'Try adjusting your search terms or filters.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: LISTINGS MANAGEMENT (STATUS, FEATURED, MODERATION)
      ========================================================================= */}
      {adminTab === 'listings' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={listingStatusFilter}
                onChange={(e) => setListingStatusFilter(e.target.value as any)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>

              <select
                value={listingCategoryFilter}
                onChange={(e) => setListingCategoryFilter(e.target.value)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">{t.allCategories}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'sw' ? c.nameSw : c.nameEn}
                  </option>
                ))}
              </select>

              <select
                value={listingUnivFilter}
                onChange={(e) => setListingUnivFilter(e.target.value)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">{t.allUniversities}</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Listings Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Item & Photo</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Campus & Zone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredListings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeListingImageUrl(l.images?.[0])}
                          alt={l.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border"
                        />
                        <div className="max-w-[200px]">
                          <span className="font-bold text-slate-900 dark:text-white block truncate">
                            {l.title}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {l.category} · {l.condition}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {l.sellerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {l.sellerPhone}
                      </span>
                    </td>

                    <td className="p-3 font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {formatTZS(l.price)}
                    </td>

                    <td className="p-3">
                      <span className="font-semibold uppercase text-[11px] block text-slate-700 dark:text-slate-300">
                        {l.universityId.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[10px] block truncate max-w-[120px]">
                        {l.campusZone}
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={l.status}
                        onChange={(e) => updateListingStatusByAdmin(l.id, e.target.value as ListingStatus)}
                        aria-label={`Status for ${l.title}`}
                        className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1.5 border ${
                          l.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                            : l.status === 'reserved'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Featured */}
                        <button
                          type="button"
                          onClick={() => toggleListingFeatured(l.id)}
                          className={`min-w-[36px] min-h-[36px] p-2 rounded-xl border transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 ${
                            l.isFeatured
                              ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400'
                              : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:text-amber-500'
                          }`}
                          title="Toggle Featured"
                          aria-label={l.isFeatured ? `Ondoa ${l.title} kwenye matangazo maalum` : `Weka ${l.title} kwenye matangazo maalum`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        {/* View in Detail Modal */}
                        <button
                          type="button"
                          onClick={() => setActiveListingDetail(l)}
                          className="min-w-[36px] min-h-[36px] p-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                          title="View Details"
                          aria-label={`Tazama maelezo ya ${l.title}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Listing */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(language === 'sw' ? 'Futa tangazo hili sokoni?' : 'Delete this listing?')) {
                              deleteListing(l.id);
                            }
                          }}
                          className="min-w-[36px] min-h-[36px] p-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
                          title={t.deleteListing}
                          aria-label={`${t.deleteListing}: ${l.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Empty State for Listings Table */}
                {filteredListings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 px-4 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {language === 'sw' ? 'Hakuna matangazo yaliyopatikana' : 'No listings match your search'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {language === 'sw' ? 'Jaribu kubadilisha maneno ya utafutaji au vichujio.' : 'Try adjusting your search terms or status filter.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: SAFETY REPORTS (FRAUD, PROHIBITED ITEMS, DISMISS, DELIST, BAN)
      ========================================================================= */}
      {adminTab === 'reports' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              {(['all', 'pending', 'resolved', 'dismissed'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setReportStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                    reportStatusFilter === status
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              {filteredReports.length} {language === 'sw' ? 'ripoti' : 'reports'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 rounded-2xl border transition-all text-xs space-y-3 ${
                    report.severity === 'critical'
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 font-bold uppercase text-[10px]">
                        {report.reason.replace(/_/g, ' ')}
                      </span>

                      {report.severity && (
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                            report.severity === 'critical'
                              ? 'bg-red-600 text-white animate-pulse'
                              : report.severity === 'high'
                              ? 'bg-orange-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          {report.severity}
                        </span>
                      )}

                      {report.autoDetected && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          <span>Auto-detected keywords</span>
                        </span>
                      )}

                      <span className="text-slate-400">· {report.createdAt}</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        report.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-300'
                          : report.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 uppercase font-mono">[{report.targetType}]</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                          {report.targetTitleOrName}
                        </h4>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                        "{report.notes}"
                      </p>

                      {report.matchedKeywords && report.matchedKeywords.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-semibold">
                          <span>Flagged keywords:</span>
                          <span className="font-mono bg-red-100 dark:bg-red-950 px-1.5 py-0.2 rounded-md">
                            {report.matchedKeywords.join(', ')}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                        <span>Reporter: {report.reporterName || report.reporterId}</span>
                        <span>·</span>
                        <span>Target ID: {report.targetId}</span>
                      </div>

                      {report.resolutionNotes && (
                        <div className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2 rounded-lg text-emerald-800 dark:text-emerald-300">
                          <span className="font-bold">Resolution:</span> {report.resolutionNotes} (by {report.resolvedBy || 'Admin'})
                        </div>
                      )}
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => resolveReport(report.id, 'delist')}
                          className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.actionResolve}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveReport(report.id, 'ban_user')}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold hover:bg-black transition-colors flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{t.actionBanUser}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveReport(report.id, 'dismiss')}
                          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {t.actionDismiss}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold">
                  {language === 'sw' ? 'Hakuna ripoti zozote kwenye foleni hii!' : 'No reports found in this queue!'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 5: CATEGORIES MANAGEMENT (ADD, EDIT, DELETE)
      ========================================================================= */}
      {adminTab === 'categories' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.categoriesTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'sw'
                  ? 'Sanidi kategoria za soko la wanafunzi kwa Kiswahili na Kiingereza'
                  : 'Configure university marketplace categories in English and Swahili'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCatModal()}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 ${colorTheme.primaryBtn}`}
            >
              <Plus className="w-4 h-4" />
              <span>{t.addCategoryBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => {
              const activeCount = listings.filter((l) => l.category === c.id).length;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border">
                        {c.id}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">
                        {activeCount} items
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center p-0.5 border border-slate-200 dark:border-slate-600 shrink-0 overflow-hidden">
                        <CategoryIcon iconName={c.iconName} iconImage={c.iconImage} className="w-4 h-4 object-contain" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {c.nameSw} / {c.nameEn}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {language === 'sw' ? c.descriptionSw : c.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCatModal(c)}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{t.editCategory}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(language === 'sw' ? 'Futa kategoria hii?' : 'Delete this category?')) {
                          deleteCategory(c.id as string);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 6: UNIVERSITIES & SAFE MEETING POINTS (DYNAMIC CAMPUS REGISTRATION)
      ========================================================================= */}
      {adminTab === 'universities' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.universitiesTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'sw'
                  ? 'Sajili vyuo vikuu vipya Tanzania pamoja na maeneo salama ya miamala'
                  : 'Register universities and official safe campus meeting spots'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenUnivModal()}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 ${colorTheme.primaryBtn}`}
            >
              <Plus className="w-4 h-4" />
              <span>{t.addUniversityBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universities.map((u) => {
              const studentCount = users.filter((user) => user.universityId === u.id).length;
              const listingCount = listings.filter((l) => l.universityId === u.id).length;

              return (
                <div
                  key={u.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3 overflow-hidden"
                >
                  {u.iconicBuildingImage && (
                    <div className="relative -mx-5 -mt-5 h-28 overflow-hidden bg-slate-900 border-b border-slate-200/80 dark:border-slate-700 group">
                      <img
                        src={u.iconicBuildingImage}
                        alt={u.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3">
                        <div className="text-white text-xs w-full">
                          <span className="font-semibold block truncate">
                            {language === 'sw' ? (u.iconicBuildingNameSw || u.iconicBuildingName) : (u.iconicBuildingName || u.iconicBuildingNameSw)}
                          </span>
                          {u.website && (
                            <a
                              href={u.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{u.website.replace('https://', '')}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md font-mono font-extrabold text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {u.shortName}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {u.city}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                        {u.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenUnivModal(u)}
                        className="p-1.5 text-slate-500 hover:text-blue-600"
                        title={t.editUniversity}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(language === 'sw' ? 'Futa chuo kikuu hiki?' : 'Delete this university?')) {
                            deleteUniversity(u.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                        title={t.deleteUniversity}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px] mb-1">
                        {language === 'sw' ? 'Matawi & Hostels' : 'Campuses & Hostels'} ({u.zones.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {u.zones.map((zone) => (
                          <span
                            key={zone}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-[10px] text-slate-600 dark:text-slate-300"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 block text-[11px] mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'sw' ? 'Maeneo Salama ya Kukutana' : 'Safe Meeting Spots'} ({u.safeMeetingPoints.length}):</span>
                      </span>
                      <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {u.safeMeetingPoints.map((pt) => (
                          <li key={pt} className="truncate">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{studentCount} {language === 'sw' ? 'Wanafunzi' : 'Students'}</span>
                    <span>{listingCount} {language === 'sw' ? 'Matangazo' : 'Listings'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 7: PROHIBITED KEYWORD AUDIT TESTER
      ========================================================================= */}
      {adminTab === 'audit' && (
        <div className="space-y-4 max-w-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'sw' ? 'Kichungi cha Maudhui Haramu Chuoni' : 'Prohibited Academic & Safety Firewall'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'sw'
                ? 'Jaribu sentensi kama "leak mtihani wa chuo", "vyeti feki", "bangi", au "bastola" kuthibitisha ulinzi wa mfumo.'
                : 'Test phrases like "leak mtihani", "fake certificate", "weed", or "gun" to verify the compliance firewall.'}
            </p>
          </div>

          <form onSubmit={handleRunAudit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={auditText}
                onChange={(e) => setAuditText(e.target.value)}
                placeholder="Andika sentensi ya kupima..."
                className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl font-bold text-xs ${colorTheme.primaryBtn}`}
              >
                Pima / Scan
              </button>
            </div>
          </form>

          {auditResult && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                auditResult.isProhibited
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-800 dark:text-red-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              {auditResult.isProhibited ? (
                <div className="space-y-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-sm">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    IMEZUILIWA / VIOLATION DETECTED!
                  </span>
                  <p className="font-semibold">Neno lililogunduliwa: "{auditResult.matchedTerm}"</p>
                  <p className="italic">{language === 'sw' ? auditResult.reasonSw : auditResult.reasonEn}</p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Maudhui yapo salama / Clean content. Approved for campus trading.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 8: FEATURE AMENDMENTS & BROWSER UPDATE BROADCAST
      ========================================================================= */}
      {adminTab === 'amendments' && (
        <div className="space-y-6">
          {/* Header Status Card */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Usimamizi wa Maboresho ya Mfumo & Viungo vya Watumiaji' : 'Feature Amendments & Link Update Broadcasting'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] tabular-nums">
                    v{APP_CURRENT_VERSION}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {language === 'sw'
                    ? 'Watumiaji wote wanaotembelea https://campussoko-tanzanian-campus-marketplace.ai.studio wanapata arifa ya kiotomatiki inayowataka kupakia upya kivinjari (refresh browser) ili kupata toleo la sasa pale unapochapisha maboresho.'
                    : 'All users accessing the marketplace link receive an instant prompt asking them to refresh the browser whenever you publish an amendment or update.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-0.5">
                  <span>Current Build: {APP_BUILD_ID}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                AppUpdateService.simulateUpdateAmendment();
                showToast(
                  language === 'sw'
                    ? 'Arifa ya maboresho imezinduliwa! Angalia kidirisha cha chini cha kupakia upya.'
                    : 'Amendment notification triggered! Notice bottom prompt.',
                  'info'
                );
                window.dispatchEvent(new Event('focus'));
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'sw' ? 'Jaribu Arifa ya Refresh' : 'Test Refresh Prompt'}</span>
            </button>
          </div>

          {/* Form to Publish a New Feature Amendment */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Chapisha Maboresho Mapya (Publish Amendment)' : 'Broadcast New Feature Amendment'}
              </h4>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!amendTitleSw.trim() && !amendTitleEn.trim()) {
                  showToast(
                    language === 'sw' ? 'Weka jina la maboresho' : 'Please provide amendment title',
                    'error'
                  );
                  return;
                }

                setIsPublishingAmendment(true);
                try {
                  const highlights = amendHighlightsText
                    .split('\n')
                    .map((h) => h.trim())
                    .filter(Boolean);

                  const res = await fetch('/api/admin/publish-amendment', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-admin-role': 'admin',
                    },
                    body: JSON.stringify({
                      titleSw: amendTitleSw || 'Maboresho Mapya ya CampusSoko',
                      titleEn: amendTitleEn || 'New CampusSoko Feature Amendment',
                      descriptionSw: amendDescSw || 'Maboresho mapya yamechapishwa kwenye mfumo.',
                      descriptionEn: amendDescEn || 'New features amendment published.',
                      highlightsSw: highlights.length > 0 ? highlights : ['Maboresho ya mfumo wa mauzo na ununuzi chuoni.'],
                      highlightsEn: highlights.length > 0 ? highlights : ['Marketplace enhancements for campus trading.'],
                      version: amendVersion || '1.4.0',
                    }),
                  });

                  if (res.ok) {
                    showToast(
                      language === 'sw'
                        ? 'Maboresho yamechapishwa! Watumiaji wataombwa kupakia upya kivinjari.'
                        : 'Feature amendment published! Connected link users will be prompted to refresh.',
                      'success'
                    );
                    setAmendTitleSw('');
                    setAmendTitleEn('');
                    setAmendDescSw('');
                    setAmendDescEn('');
                    setAmendHighlightsText('');
                  } else {
                    showToast(
                      language === 'sw' ? 'Hitilafu ya kuchapisha maboresho' : 'Failed to publish amendment',
                      'error'
                    );
                  }
                } catch {
                  showToast(
                    language === 'sw' ? 'Hitilafu ya mtandao wa server' : 'Network error reaching server',
                    'error'
                  );
                } finally {
                  setIsPublishingAmendment(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {language === 'sw' ? 'Toleo Jipya (Version)' : 'Next Version'}
                  </label>
                  <input
                    type="text"
                    required
                    value={amendVersion}
                    onChange={(e) => setAmendVersion(e.target.value)}
                    placeholder="e.g. 1.4.0"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {language === 'sw' ? 'Kichwa cha Habari (Kiswahili)' : 'Title (Swahili)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={amendTitleSw}
                    onChange={(e) => setAmendTitleSw(e.target.value)}
                    placeholder="e.g. Maboresho ya Usimamizi wa Wauzaji"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {language === 'sw' ? 'Kichwa cha Habari (English)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={amendTitleEn}
                    onChange={(e) => setAmendTitleEn(e.target.value)}
                    placeholder="e.g. Seller Management & UI Enhancements"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {language === 'sw' ? 'Maelezo (Kiswahili)' : 'Description (Swahili)'}
                  </label>
                  <textarea
                    rows={2}
                    value={amendDescSw}
                    onChange={(e) => setAmendDescSw(e.target.value)}
                    placeholder="Maelezo mafupi ya maboresho yaliyofanywa..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {language === 'sw' ? 'Maelezo (English)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={amendDescEn}
                    onChange={(e) => setAmendDescEn(e.target.value)}
                    placeholder="Brief description of the amendment..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {language === 'sw' ? 'Mambo makuu yaliyoboreshwa (Mstari mmoja kila jambo)' : 'Bullet highlights (one per line)'}
                </label>
                <textarea
                  rows={3}
                  value={amendHighlightsText}
                  onChange={(e) => setAmendHighlightsText(e.target.value)}
                  placeholder="Mfano:&#10;Vitufe vya menyu vimeunganishwa kwenye safu moja&#10;Uchaguzi wa Mnunuzi na Muuzaji umeboreshwa&#10;Kasi ya kupakia kurasa imeongezeka"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishingAmendment}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 ${isPublishingAmendment ? 'animate-spin' : ''}`} />
                <span>{isPublishingAmendment ? 'Inachapisha...' : (language === 'sw' ? 'Tangaza na Sambaza Maboresho' : 'Broadcast & Publish Amendment')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD NEW STUDENT / USER
      ========================================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.addNewUserBtn}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Zawadi Mwita"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {language === 'sw' ? 'Namba ya Simu (+255)' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {language === 'sw' ? 'Chuo Kikuu' : 'University'}
                </label>
                <select
                  value={newUserUniv}
                  onChange={(e) => {
                    setNewUserUniv(e.target.value);
                    const targetUniv = universities.find((u) => u.id === e.target.value);
                    if (targetUniv) setNewUserZone(targetUniv.zones[0]);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                >
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.shortName} - {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.campusZoneLabel}
                </label>
                <input
                  type="text"
                  value={newUserZone}
                  onChange={(e) => setNewUserZone(e.target.value)}
                  placeholder="e.g. Mabibo Hostels"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserIsVerified}
                    onChange={(e) => setNewUserIsVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>Verified Student Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserIsAdmin}
                    onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span>Admin Role</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl font-bold ${colorTheme.primaryBtn}`}
                >
                  {language === 'sw' ? 'Hifadhi Mwanafunzi' : 'Register Student'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.cancelEdit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD / EDIT UNIVERSITY
      ========================================================================= */}
      {isUnivModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingUnivId ? t.editUniversity : t.addUniversityBtn}
              </h3>
              <button
                type="button"
                onClick={() => setIsUnivModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUniversity} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.univName}
                </label>
                <input
                  type="text"
                  required
                  value={univName}
                  onChange={(e) => setUnivName(e.target.value)}
                  placeholder="e.g. Mzumbe University"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {t.univShort}
                  </label>
                  <input
                    type="text"
                    required
                    value={univShort}
                    onChange={(e) => setUnivShort(e.target.value)}
                    placeholder="e.g. MU"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {t.univCity}
                  </label>
                  <input
                    type="text"
                    required
                    value={univCity}
                    onChange={(e) => setUnivCity(e.target.value)}
                    placeholder="e.g. Morogoro"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.univZones}
                </label>
                <textarea
                  rows={2}
                  value={univZonesText}
                  onChange={(e) => setUnivZonesText(e.target.value)}
                  placeholder="Main Campus, Forest Area, Mazimbu, Hostels..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.univSafePoints}
                </label>
                <textarea
                  rows={2}
                  value={univSafePointsText}
                  onChange={(e) => setUnivSafePointsText(e.target.value)}
                  placeholder="Central Library Entrance, Main Security Gate, Student Canteen..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl font-bold ${colorTheme.primaryBtn}`}
                >
                  {language === 'sw' ? 'Hifadhi Chuo' : 'Save University'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUnivModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.cancelEdit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD / EDIT CATEGORY
      ========================================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCatId ? t.editCategory : t.addCategoryBtn}
              </h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {t.categoryNameSw}
                  </label>
                  <input
                    type="text"
                    required
                    value={catNameSw}
                    onChange={(e) => setCatNameSw(e.target.value)}
                    placeholder="e.g. Vifaa vya Michezo"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {t.categoryNameEn}
                  </label>
                  <input
                    type="text"
                    required
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    placeholder="e.g. Sports & Fitness"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.categoryDescSw}
                </label>
                <input
                  type="text"
                  value={catDescSw}
                  onChange={(e) => setCatDescSw(e.target.value)}
                  placeholder="Maelezo ya Kiswahili..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.categoryDescEn}
                </label>
                <input
                  type="text"
                  value={catDescEn}
                  onChange={(e) => setCatDescEn(e.target.value)}
                  placeholder="English description..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  {t.categoryIcon}
                </label>
                <input
                  type="text"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  placeholder="e.g. BookOpen, Laptop, Tag, Home, Shirt..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl font-bold ${colorTheme.primaryBtn}`}
                >
                  {language === 'sw' ? 'Hifadhi Kategoria' : 'Save Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  {t.cancelEdit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
