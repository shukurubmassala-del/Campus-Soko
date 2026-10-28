import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  AppNotification,
  Category,
  Conversation,
  FilterState,
  Language,
  Listing,
  ListingStatus,
  NotificationPreferences,
  NotificationType,
  Report,
  Review,
  RoleView,
  ToastNotification,
  University,
  User,
  WantedPost,
} from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { MOCK_USERS } from '../data/mockData';
import { checkProhibitedContent } from '../data/prohibitedKeywords';
import { validateTanzanianPhone } from '../utils/tanzaniaPhone';
import { useAuth } from './AuthContext';
import { dispatchPushNotification, requestFcmPushToken, setupFcmForegroundListener } from '../services/fcm';
import { UserColorPreference, getUserColorTheme, ColorThemeClasses } from '../utils/userColorTheme';
import { DEFAULT_LISTING_IMAGE, getSafeListingImageUrl } from '../utils/imageUtils';

interface CampusSokoContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.sw;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  userColorPreference: UserColorPreference;
  setUserColorPreference: (color: UserColorPreference) => void;
  colorTheme: ColorThemeClasses;

  selectedUniversityId: string;
  setSelectedUniversityId: (id: string) => void;
  currentUniversity: University;
  universities: University[];
  addUniversity: (univ: University) => void;
  updateUniversity: (id: string, partial: Partial<University>) => void;
  deleteUniversity: (id: string) => void;

  categories: Category[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, partial: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  currentUser: User | null;
  users: User[];
  toggleUserVerification: (userId: string) => void;
  toggleUserAdmin: (userId: string) => void;
  toggleUserBan: (userId: string) => void;
  deleteUser: (userId: string) => void;
  addUser: (userData: Omit<User, 'id' | 'joinedDate' | 'rating' | 'reviewCount'>) => void;
  serverAdminVerified: boolean;
  verifyServerAdminRole: () => Promise<boolean>;
  toggleListingFeatured: (listingId: string) => void;
  updateListingStatusByAdmin: (listingId: string, status: ListingStatus) => void;

  loginWithPhone: (phone: string, otp: string, declaredRole?: 'buyer' | 'seller') => boolean;
  loginWithEmail: (email: string, declaredRole?: 'buyer' | 'seller') => boolean;
  loginAsDemo: (user: User, declaredRole?: 'buyer' | 'seller') => void;
  logout: () => void;
  updateUserProfile: (partial: Partial<User>) => void;
  verifyStudent: (method: 'email' | 'student_id', docOrEmail: string) => void;

  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (data: { language: Language; universityId: string; campusZone: string; declaredRole?: 'buyer' | 'seller' }) => void;


  listings: Listing[];
  filteredListings: Listing[];
  createListing: (data: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'status'>) => { success: boolean; error?: string };
  updateListing: (id: string, partial: Partial<Listing>) => void;
  markListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;
  recordListingView: (id: string) => void;

  favorites: string[];
  toggleFavorite: (id: string) => void;

  wantedPosts: WantedPost[];
  createWantedPost: (data: Omit<WantedPost, 'id' | 'createdAt' | 'status'>) => { success: boolean; error?: string };
  fulfillWantedPost: (id: string) => void;

  conversations: Conversation[];
  activeConversation: Conversation | null;
  openChatWithSeller: (listing: Listing) => void;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (convId: string, text: string, proposal?: { isMeetingProposal?: boolean; meetingPoint?: string }) => void;

  reviews: Review[];
  addReview: (targetUserId: string, rating: number, comment: string, listingTitle: string) => void;

  reports: Report[];
  submitReport: (
    targetType: 'listing' | 'user',
    targetId: string,
    targetTitleOrName: string,
    reason: Report['reason'],
    notes: string,
    extra?: {
      autoDetectedViolation?: boolean;
      matchedKeywords?: string[];
      severity?: 'critical' | 'high' | 'medium';
    }
  ) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'delist' | 'ban_user') => void;

  blockedUsers: string[];
  blockUser: (userId: string) => void;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  activeTab: 'market' | 'search' | 'wanted' | 'chats' | 'profile' | 'admin';
  setActiveTab: (tab: 'market' | 'search' | 'wanted' | 'chats' | 'profile' | 'admin') => void;

  activeListingDetail: Listing | null;
  setActiveListingDetail: (listing: Listing | null) => void;

  isCreateListingOpen: boolean;
  setIsCreateListingOpen: (open: boolean) => void;
  isCreateWantedOpen: boolean;
  setIsCreateWantedOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;

  isReportModalOpen: boolean;
  reportTarget: { type: 'listing' | 'user'; id: string; title: string; sellerId?: string } | null;
  openReportModal: (target: { type: 'listing' | 'user'; id: string; title: string; sellerId?: string }) => void;
  closeReportModal: () => void;

  isProhibitedPolicyOpen: boolean;
  openProhibitedPolicyModal: () => void;
  closeProhibitedPolicyModal: () => void;

  reviewModalTarget: { userId: string; userName: string; listingTitle: string } | null;
  openReviewModal: (target: { userId: string; userName: string; listingTitle: string }) => void;
  closeReviewModal: () => void;

  roleView: RoleView;
  setRoleView: (role: RoleView) => void;
  registerAsSeller: (data: {
    shopName: string;
    phone: string;
    universityId: string;
    campusZone: string;
    email?: string;
    sellerCategory?: string;
  }) => void;
  loginAsAdmin: (passcode?: string) => boolean;
  isSellerRegistrationOpen: boolean;
  setIsSellerRegistrationOpen: (open: boolean) => void;

  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Firebase Cloud Messaging & Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'timestamp' | 'read'>) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  isNotificationSettingsOpen: boolean;
  setIsNotificationSettingsOpen: (open: boolean) => void;
  requestPushPermission: () => Promise<boolean>;
  triggerTestNotification: (type: NotificationType) => void;

  goHome: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  category: 'all',
  condition: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  campusZone: undefined,
  sortBy: 'newest',
};

const CampusSokoContext = createContext<CampusSokoContextType | null>(null);

export function CampusSokoProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  // Localization & Theme
  const [language, setLanguageState] = useState<Language>(() => StorageService.getLanguage());
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => StorageService.getTheme());
  const [userColorPreference, setUserColorPreferenceState] = useState<UserColorPreference>(() =>
    StorageService.getUserColorPreference()
  );

  const setUserColorPreference = useCallback((pref: UserColorPreference) => {
    setUserColorPreferenceState(pref);
    StorageService.saveUserColorPreference(pref);
  }, []);

  const colorTheme = useMemo(() => {
    return getUserColorTheme(userColorPreference);
  }, [userColorPreference]);

  // University & Category Selection (Dynamic Admin Configuration)
  const [universities, setUniversities] = useState<University[]>(() => StorageService.getUniversities());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [selectedUniversityId, setSelectedUniversityIdState] = useState<string>(() => StorageService.getSelectedUniversity());
  const [serverAdminVerified, setServerAdminVerified] = useState<boolean>(false);

  // App Data & Auth
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUserState] = useState<User | null>(() => auth.user ?? StorageService.getCurrentUser());

  // Keep currentUser synchronized with auth.user
  useEffect(() => {
    setCurrentUserState(auth.user);
  }, [auth.user]);

  const [listings, setListings] = useState<Listing[]>(() => StorageService.getListings());
  const [wantedPosts, setWantedPosts] = useState<WantedPost[]>(() => StorageService.getWantedPosts());
  const [conversations, setConversations] = useState<Conversation[]>(() => StorageService.getConversations());
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());
  const [reports, setReports] = useState<Report[]>(() => StorageService.getReports());
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => StorageService.getBlockedUsers());

  // UI Navigation & View State
  const [roleView, setRoleViewState] = useState<RoleView>(() => StorageService.getRoleView());
  const [isSellerRegistrationOpen, setIsSellerRegistrationOpen] = useState(false);

  const setRoleView = (role: RoleView) => {
    setRoleViewState(role);
    StorageService.saveRoleView(role);
  };

  const [activeTab, setActiveTab] = useState<'market' | 'search' | 'wanted' | 'chats' | 'profile' | 'admin'>('market');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeListingDetail, setActiveListingDetail] = useState<Listing | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Modals
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateWantedOpen, setIsCreateWantedOpen] = useState(false);
  const [isSokoModalOpen, setIsSokoModalOpen] = useState(false);
  const isAuthModalOpen = isSokoModalOpen || auth.isAuthModalOpen;

  const setIsAuthModalOpen = (open: boolean) => {
    setIsSokoModalOpen(open);
    auth.setIsAuthModalOpen(open);
    if (open) {
      auth.clearError();
      auth.resetOtpFlow();
    }
  };
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProhibitedPolicyOpen, setIsProhibitedPolicyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'listing' | 'user'; id: string; title: string; sellerId?: string } | null>(null);
  const [reviewModalTarget, setReviewModalTarget] = useState<{ userId: string; userName: string; listingTitle: string } | null>(null);

  // Auto trigger onboarding for first-time visitors
  useEffect(() => {
    if (!StorageService.hasCompletedOnboarding()) {
      setIsOnboardingOpen(true);
    }
  }, []);


  // Toast feedback
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Firebase Cloud Messaging & Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => StorageService.getNotifications());
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() =>
    StorageService.getNotificationPreferences()
  );
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const addNotification = useCallback(
    (data: Omit<AppNotification, 'id' | 'createdAt' | 'timestamp' | 'read'>) => {
      const newNotif: AppNotification = {
        ...data,
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        createdAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        StorageService.saveNotifications(updated);
        return updated;
      });

      // Check user preferences before showing push notification
      const prefs = StorageService.getNotificationPreferences();
      let shouldPush = false;
      if (data.type === 'new_message' && prefs.notifyNewMessages) shouldPush = true;
      if (data.type === 'price_drop' && prefs.notifyPriceDrops) shouldPush = true;
      if (data.type === 'listing_sold' && prefs.notifyListingSold) shouldPush = true;
      if (data.type === 'safety_alert' && prefs.notifySafetyAlerts) shouldPush = true;

      if (shouldPush && prefs.enablePushNotifications) {
        const title = language === 'sw' ? data.titleSw : data.titleEn;
        const body = language === 'sw' ? data.bodySw : data.bodyEn;
        dispatchPushNotification({
          type: data.type,
          title,
          body,
          data: data.data,
        });
      }
    },
    [language]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      StorageService.saveNotifications(updated);
      return updated;
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      StorageService.saveNotifications(updated);
      return updated;
    });
    showToast(language === 'sw' ? 'Taarifa zote zimewekwa zimesomwa' : 'All notifications marked as read');
  }, [language]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    StorageService.saveNotifications([]);
    showToast(language === 'sw' ? 'Taarifa zote zimefutwa' : 'All notifications cleared');
  }, [language]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      StorageService.saveNotifications(updated);
      return updated;
    });
  }, []);

  const updateNotificationPreferences = useCallback((partial: Partial<NotificationPreferences>) => {
    setNotificationPreferences((prev) => {
      const updated = { ...prev, ...partial };
      StorageService.saveNotificationPreferences(updated);
      return updated;
    });
    showToast(language === 'sw' ? 'Mipangilio ya taarifa imesasishwa' : 'Notification preferences updated');
  }, [language]);

  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    const res = await requestFcmPushToken();
    if (res.success) {
      updateNotificationPreferences({ enablePushNotifications: true });
      showToast(language === 'sw' ? 'Taarifa za moja kwa moja (Push) zimewashwa!' : 'Direct Push Notifications enabled!');
      return true;
    } else {
      showToast(
        language === 'sw'
          ? 'Haikuweza kuwasha taarifa za push (angalia ruhusa za kivinjari)'
          : 'Could not enable push (check browser permissions)',
        'error'
      );
      return false;
    }
  }, [language, updateNotificationPreferences]);

  const triggerTestNotification = useCallback(
    (type: NotificationType) => {
      if (type === 'new_message') {
        addNotification({
          userId: currentUser?.id || 'demo_user',
          type: 'new_message',
          titleSw: 'Ujumbe mpya: Baraka Mrema',
          bodySw: 'Habari! Bado una kitabu cha "Calculus"? Niko karibu na Nkrumah Hall.',
          titleEn: 'New message from Baraka Mrema',
          bodyEn: 'Hi! Do you still have the "Calculus" book? I am near Nkrumah Hall.',
          data: {
            listingId: listings[0]?.id || 'list_1',
            listingTitle: listings[0]?.title || 'Calculus 8th Edition',
            conversationId: conversations[0]?.id || 'conv_1',
            senderName: 'Baraka Mrema',
          },
        });
      } else if (type === 'price_drop') {
        const targetListing = listings[0] || { id: 'list_1', title: 'HP EliteBook 840 G5', price: 450000 };
        const oldPrice = targetListing.price;
        const newPrice = Math.round(targetListing.price * 0.85);
        addNotification({
          userId: currentUser?.id || 'demo_user',
          type: 'price_drop',
          titleSw: `Punguzo la bei! ${targetListing.title}`,
          bodySw: `Bei imeshuka kutoka TZS ${oldPrice.toLocaleString()} hadi TZS ${newPrice.toLocaleString()}! Umeokoa TZS ${(oldPrice - newPrice).toLocaleString()}.`,
          titleEn: `Price drop! ${targetListing.title}`,
          bodyEn: `Price dropped from TZS ${oldPrice.toLocaleString()} to TZS ${newPrice.toLocaleString()}! You save TZS ${(oldPrice - newPrice).toLocaleString()}.`,
          data: {
            listingId: targetListing.id,
            listingTitle: targetListing.title,
            oldPrice,
            newPrice,
          },
        });
      } else if (type === 'listing_sold') {
        const targetListing = listings[1] || listings[0] || { id: 'list_2', title: 'Jiko la Umeme' };
        addNotification({
          userId: currentUser?.id || 'demo_user',
          type: 'listing_sold',
          titleSw: 'Bidhaa uliyoiweka kwenye vipendwa imeuzwa',
          bodySw: `"${targetListing.title}" imeuzwa na mwanafunzi mwenzako.`,
          titleEn: 'Saved item marked as sold',
          bodyEn: `"${targetListing.title}" has just been marked as sold.`,
          data: {
            listingId: targetListing.id,
            listingTitle: targetListing.title,
          },
        });
      }
      showToast(language === 'sw' ? 'Taarifa ya jaribio imeundwa!' : 'Test notification generated!');
    },
    [addNotification, currentUser?.id, listings, conversations, language]
  );

  // Foreground FCM listener
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    setupFcmForegroundListener((payload) => {
      addNotification({
        userId: currentUser?.id || 'current_user',
        type: payload.type,
        titleSw: payload.title,
        bodySw: payload.body,
        titleEn: payload.title,
        bodyEn: payload.body,
        data: payload.data,
      });
    }).then((unsub) => {
      cleanup = unsub;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [addNotification, currentUser?.id]);

  // Sync theme to HTML root and body elements
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    showToast(
      language === 'sw'
        ? (newTheme === 'dark' ? 'Mwonekano wa giza umewashwa' : 'Mwonekano wa mchana umewashwa')
        : (newTheme === 'dark' ? 'Dark mode activated' : 'Light mode activated'),
      'info'
    );
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      showToast(
        language === 'sw'
          ? (next === 'dark' ? 'Mwonekano wa giza umewashwa' : 'Mwonekano wa mchana umewashwa')
          : (next === 'dark' ? 'Dark mode activated' : 'Light mode activated'),
        'info'
      );
      return next;
    });
  };

  const goHome = useCallback(() => {
    setRoleView('buyer');
    setActiveTab('market');
    setIsCreateListingOpen(false);
    setIsCreateWantedOpen(false);
    setIsAuthModalOpen(false);
    setIsVerificationModalOpen(false);
    setIsSafetyModalOpen(false);
    setIsReportModalOpen(false);
    setReviewModalTarget(null);
    setActiveListingDetail(null);
    setIsSellerRegistrationOpen(false);
    setIsOnboardingOpen(false);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // fallback
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    StorageService.saveLanguage(lang);
    document.documentElement.lang = lang;
  };

  const setSelectedUniversityId = (id: string) => {
    setSelectedUniversityIdState(id);
    StorageService.saveSelectedUniversity(id);
    // Reset campus zone filter when university changes
    setFilters((prev) => ({ ...prev, campusZone: undefined }));
  };

  const currentUniversity = useMemo(() => {
    return (
      universities.find((u) => u.id === selectedUniversityId) || universities[0]
    );
  }, [universities, selectedUniversityId]);

  // Server-side admin verification check
  const verifyServerAdminRole = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: {
          'x-admin-role': currentUser?.isAdmin ? 'admin' : 'student',
          'Authorization': currentUser?.isAdmin ? 'Bearer admin_token_demo' : '',
        },
      });
      const data = await res.json();
      const isAuth = Boolean(data.authorized);
      setServerAdminVerified(isAuth);
      return isAuth;
    } catch {
      const isAuth = Boolean(currentUser?.isAdmin);
      setServerAdminVerified(isAuth);
      return isAuth;
    }
  };

  useEffect(() => {
    verifyServerAdminRole();
  }, [currentUser]);

  const t = translations[language];

  // Auth Operations
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    auth.setUser(user);
    StorageService.saveCurrentUser(user);
  };

  const loginWithPhone = (phone: string, otp: string, declaredRole: 'buyer' | 'seller' = 'buyer'): boolean => {
    const validation = validateTanzanianPhone(phone);
    if (!validation.isValid) {
      showToast(
        language === 'sw'
          ? (validation.errorSw || 'Nambari ya simu sio sahihi')
          : (validation.errorEn || 'Invalid Tanzanian phone number'),
        'error'
      );
      return false;
    }

    if (otp !== '1234' && otp.length !== 4) {
      showToast(language === 'sw' ? 'Nambari ya OTP sio sahihi (Tumia 1234 kujaribu)' : 'Invalid OTP code (Use 1234 to test)', 'error');
      return false;
    }
    const currentUsers = StorageService.getUsers();
    const cleanTargetPhone = validation.formattedE164.replace(/\D/g, '').slice(-9);
    // Check if phone matches any known user, or create new student
    const existing = currentUsers.find((u) => u.phone.replace(/\D/g, '').endsWith(cleanTargetPhone));
    const roleToSet: 'buyer' | 'seller' = declaredRole || 'buyer';

    if (existing) {
      const updatedUser: User = {
        ...existing,
        declaredRole: roleToSet,
        isSellerRegistered: roleToSet === 'seller' ? true : existing.isSellerRegistered,
      };
      const updatedList = currentUsers.map((u) => (u.id === existing.id ? updatedUser : u));
      setUsers(updatedList);
      StorageService.saveUsers(updatedList);
      setCurrentUser(updatedUser);
      StorageService.saveCurrentUser(updatedUser);
      setRoleView(roleToSet);
      setActiveTab('market');
      showToast(
        roleToSet === 'seller'
          ? (language === 'sw' ? `Karibu tena ${existing.fullName}! Umeingia kwenye Seller Studio.` : `Welcome back, ${existing.fullName}! Opened Seller Studio.`)
          : (language === 'sw' ? `Karibu tena ${existing.fullName}! Umeingia Sokoni.` : `Welcome back, ${existing.fullName}! Opened Marketplace.`)
      );
    } else {
      const newUser: User = {
        id: 'user_' + Date.now(),
        fullName: `Mwanafunzi (${validation.carrier})`,
        phone: validation.formattedDisplay,
        universityId: selectedUniversityId,
        campusZone: currentUniversity.zones[0],
        isVerified: false,
        isSellerRegistered: roleToSet === 'seller',
        declaredRole: roleToSet,
        rating: 5.0,
        reviewCount: 0,
        joinedDate: language === 'sw' ? 'Hivi sasa' : 'Just now',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${validation.formattedE164}&backgroundColor=b6e3f4`,
      };
      const updated = [...currentUsers, newUser];
      setUsers(updated);
      StorageService.saveUsers(updated);
      setCurrentUser(newUser);
      StorageService.saveCurrentUser(newUser);
      setRoleView(roleToSet);
      setActiveTab('market');
      showToast(
        roleToSet === 'seller'
          ? (language === 'sw' ? 'Akaunti yako ya Muuzaji imefunguliwa! Karibu Seller Studio.' : 'New Seller account created! Welcome to Seller Studio.')
          : (language === 'sw' ? 'Akaunti yako ya Mnunuzi imefunguliwa! Karibu Sokoni.' : 'New Buyer account created! Welcome to Marketplace.')
      );
    }
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithEmail = (email: string, declaredRole: 'buyer' | 'seller' = 'buyer'): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const currentUsers = StorageService.getUsers();
    const existing = currentUsers.find((u) => u.email?.toLowerCase() === cleanEmail);
    const roleToSet: 'buyer' | 'seller' = declaredRole || 'buyer';

    if (existing) {
      const updatedUser: User = {
        ...existing,
        declaredRole: roleToSet,
        isSellerRegistered: roleToSet === 'seller' ? true : existing.isSellerRegistered,
      };
      const updatedList = currentUsers.map((u) => (u.id === existing.id ? updatedUser : u));
      setUsers(updatedList);
      StorageService.saveUsers(updatedList);
      setCurrentUser(updatedUser);
      StorageService.saveCurrentUser(updatedUser);
      setRoleView(roleToSet);
      setActiveTab('market');
      showToast(
        roleToSet === 'seller'
          ? (language === 'sw' ? `Karibu tena ${existing.fullName}! Umeingia kwenye Seller Studio.` : `Welcome back, ${existing.fullName}! Opened Seller Studio.`)
          : (language === 'sw' ? `Karibu tena ${existing.fullName}! Umeingia Sokoni.` : `Welcome back, ${existing.fullName}! Opened Marketplace.`)
      );
    } else {
      const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = namePart
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const isAcademic = cleanEmail.endsWith('.ac.tz') || cleanEmail.endsWith('.edu');
      const newUser: User = {
        id: 'user_' + Date.now(),
        fullName: formattedName || 'Mwanafunzi wa Chuo',
        phone: '+255 700 000 000',
        email: cleanEmail,
        universityId: selectedUniversityId,
        campusZone: currentUniversity.zones[0],
        isVerified: isAcademic,
        verificationMethod: isAcademic ? 'email' : undefined,
        isSellerRegistered: roleToSet === 'seller',
        declaredRole: roleToSet,
        rating: 5.0,
        reviewCount: 0,
        joinedDate: language === 'sw' ? 'Hivi sasa' : 'Just now',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}&backgroundColor=d1d4f9`,
      };
      const updated = [...currentUsers, newUser];
      setUsers(updated);
      StorageService.saveUsers(updated);
      setCurrentUser(newUser);
      StorageService.saveCurrentUser(newUser);
      setRoleView(roleToSet);
      setActiveTab('market');
      showToast(
        roleToSet === 'seller'
          ? (language === 'sw' ? 'Akaunti yako ya Muuzaji imefunguliwa! Karibu Seller Studio.' : 'New Seller account created! Welcome to Seller Studio.')
          : (language === 'sw' ? 'Akaunti yako ya Mnunuzi imefunguliwa! Karibu Sokoni.' : 'New Buyer account created! Welcome to Marketplace.')
      );
    }
    setIsAuthModalOpen(false);
    return true;
  };

  const loginAsDemo = (user: User, declaredRole?: 'buyer' | 'seller') => {
    const roleToSet: 'buyer' | 'seller' = declaredRole || user.declaredRole || (user.isSellerRegistered ? 'seller' : 'buyer');
    const updatedUser: User = {
      ...user,
      declaredRole: roleToSet,
      isSellerRegistered: roleToSet === 'seller' ? true : user.isSellerRegistered,
    };
    auth.signInWithDemoUser(updatedUser, roleToSet);
    setCurrentUser(updatedUser);
    StorageService.saveCurrentUser(updatedUser);
    setSelectedUniversityId(user.universityId);
    setRoleView(roleToSet);
    setActiveTab('market');
    setIsAuthModalOpen(false);
    showToast(
      roleToSet === 'seller'
        ? (language === 'sw' ? `Umeingia kama ${user.fullName} (Muuzaji)! Karibu Studio.` : `Signed in as ${user.fullName} (Seller)! Welcome to Studio.`)
        : (language === 'sw' ? `Umeingia kama ${user.fullName} (Mnunuzi)! Karibu Sokoni.` : `Signed in as ${user.fullName} (Buyer)! Welcome to Marketplace.`)
    );
  };

  const logout = async () => {
    try {
      await auth.signOutUser();
    } catch {
      // fallback
    }
    setCurrentUserState(null);
    auth.setUser(null);
    StorageService.saveCurrentUser(null);
    auth.resetOtpFlow();
    auth.clearError();
    setActiveTab('market');
    showToast(language === 'sw' ? 'Umeondoka kwenye akaunti' : 'Logged out');
  };

  const registerAsSeller = (data: {
    shopName: string;
    phone: string;
    universityId: string;
    campusZone: string;
    email?: string;
    sellerCategory?: string;
  }) => {
    if (currentUser) {
      const updated: User = {
        ...currentUser,
        isSellerRegistered: true,
        shopName: data.shopName,
        phone: data.phone || currentUser.phone,
        universityId: data.universityId || currentUser.universityId,
        campusZone: data.campusZone || currentUser.campusZone,
        email: data.email || currentUser.email,
        sellerCategory: data.sellerCategory,
      };
      setCurrentUser(updated);
      const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
      setUsers(updatedUsers);
      StorageService.saveUsers(updatedUsers);
    } else {
      const newId = `user_${Date.now()}`;
      const isAcademic = !!data.email?.endsWith('.ac.tz');
      const newUser: User = {
        id: newId,
        fullName: data.shopName || 'Muuzaji Mpya',
        phone: data.phone,
        email: data.email,
        universityId: data.universityId,
        campusZone: data.campusZone,
        isVerified: isAcademic,
        verificationMethod: isAcademic ? 'email' : undefined,
        rating: 5.0,
        reviewCount: 0,
        joinedDate: language === 'sw' ? 'Hivi sasa' : 'Just now',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.shopName)}&backgroundColor=b6e3f4`,
        role: 'student',
        isSellerRegistered: true,
        shopName: data.shopName,
        sellerCategory: data.sellerCategory,
      };
      const updatedUsers = [newUser, ...users];
      setUsers(updatedUsers);
      StorageService.saveUsers(updatedUsers);
      setCurrentUser(newUser);
    }
    setRoleView('seller');
    setIsSellerRegistrationOpen(false);
    showToast(
      language === 'sw'
        ? 'Hongera! Usajili wa muuzaji umekamilika. Karibu kwenye Seller Studio.'
        : 'Congratulations! Seller registration complete. Welcome to Seller Studio.',
      'success'
    );
  };

  const loginAsAdmin = (passcode?: string): boolean => {
    const adminUser = users.find((u) => u.isAdmin || u.role === 'admin') || MOCK_USERS.find((u) => u.isAdmin);
    if (adminUser) {
      setCurrentUser(adminUser);
      setRoleView('admin');
      showToast(
        language === 'sw'
          ? 'Umeingia kama Msimamizi Mkuu wa CampusSoko.'
          : 'Authenticated as CampusSoko Platform Administrator.',
        'success'
      );
      return true;
    }
    return false;
  };

  const verifyStudent = (method: 'email' | 'student_id', docOrEmail: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      isVerified: true,
      verificationMethod: method,
      email: method === 'email' ? docOrEmail : currentUser.email,
      verificationDocumentUrl: method === 'student_id' ? docOrEmail : undefined,
    };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    setIsVerificationModalOpen(false);
    showToast(language === 'sw' ? 'Hongera! Beji ya Mwanafunzi Aliyethibitishwa imeidhinishwa!' : 'Congratulations! Verified Student Badge awarded!');
  };

  const updateUserProfile = (partial: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      ...partial,
    };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    // Synchronize seller details on all active listings and buyer details on wanted requests
    if (partial.fullName || partial.avatarUrl || partial.phone || partial.campusZone) {
      const updatedListings = listings.map((l) => {
        if (l.sellerId === currentUser.id) {
          return {
            ...l,
            sellerName: partial.fullName || l.sellerName,
            sellerPhone: partial.phone || l.sellerPhone,
            sellerAvatar: partial.avatarUrl || l.sellerAvatar,
            campusZone: partial.campusZone || l.campusZone,
          };
        }
        return l;
      });
      setListings(updatedListings);
      StorageService.saveListings(updatedListings);

      const updatedWanted = wantedPosts.map((w) => {
        if (w.buyerId === currentUser.id) {
          return {
            ...w,
            buyerName: partial.fullName || w.buyerName,
            buyerPhone: partial.phone || w.buyerPhone,
            buyerAvatar: partial.avatarUrl || w.buyerAvatar,
            campusZone: partial.campusZone || w.campusZone,
          };
        }
        return w;
      });
      setWantedPosts(updatedWanted);
      StorageService.saveWantedPosts(updatedWanted);
    }

    showToast(
      language === 'sw'
        ? 'Wasifu wako umesasishwa kikamilifu'
        : 'Your profile has been updated successfully'
    );
  };

  const completeOnboarding = (data: { language: Language; universityId: string; campusZone: string; declaredRole?: 'buyer' | 'seller' }) => {
    setLanguage(data.language);
    setSelectedUniversityId(data.universityId);
    if (data.declaredRole) {
      setRoleView(data.declaredRole);
      setActiveTab('market');
      StorageService.saveRoleView(data.declaredRole);
    }
    if (currentUser) {
      updateUserProfile({
        universityId: data.universityId,
        campusZone: data.campusZone,
        declaredRole: data.declaredRole || currentUser.declaredRole,
        isSellerRegistered: data.declaredRole === 'seller' ? true : currentUser.isSellerRegistered,
      });
    }
    StorageService.saveCompletedOnboarding(true);
    setIsOnboardingOpen(false);
    showToast(
      data.declaredRole === 'seller'
        ? (data.language === 'sw'
            ? 'Karibu sana CampusSoko! Seller Studio yako iko tayari.'
            : 'Welcome to CampusSoko! Your Seller Studio is ready.')
        : (data.language === 'sw'
            ? 'Karibu sana CampusSoko! Soko lako la chuo lipo tayari.'
            : 'Welcome to CampusSoko! Your campus marketplace is ready.'),
      'success'
    );
  };


  // Marketplace Listings
  const createListing = (data: Omit<Listing, 'id' | 'createdAt' | 'viewsCount' | 'status'>) => {
    // Prohibited content screener
    const check = checkProhibitedContent(data.title + ' ' + data.description);
    if (check.isProhibited) {
      const reason = language === 'sw' ? check.reasonSw : check.reasonEn;
      return { success: false, error: `${t.prohibitedWarning} (${check.matchedTerm}: ${reason})` };
    }

    const newListing: Listing = {
      ...data,
      id: 'list_' + Date.now(),
      createdAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
      viewsCount: 1,
      status: 'active',
    };

    const updated = [newListing, ...listings];
    setListings(updated);
    StorageService.saveListings(updated);
    setIsCreateListingOpen(false);
    showToast(language === 'sw' ? 'Tangazo lako limechapishwa chuoni!' : 'Your listing is now live on campus!');
    return { success: true };
  };

  const updateListing = (id: string, partial: Partial<Listing>) => {
    const existing = listings.find((l) => l.id === id);
    if (existing && partial.price !== undefined && partial.price < existing.price) {
      // Price drop detected!
      const oldPrice = existing.price;
      const newPrice = partial.price;
      const savings = oldPrice - newPrice;
      addNotification({
        userId: currentUser?.id || 'all',
        type: 'price_drop',
        titleSw: `Punguzo la bei! ${existing.title}`,
        bodySw: `Bei imeshuka kutoka TZS ${oldPrice.toLocaleString()} hadi TZS ${newPrice.toLocaleString()}! Umeokoa TZS ${savings.toLocaleString()}.`,
        titleEn: `Price drop! ${existing.title}`,
        bodyEn: `Price dropped from TZS ${oldPrice.toLocaleString()} to TZS ${newPrice.toLocaleString()}! You save TZS ${savings.toLocaleString()}.`,
        data: {
          listingId: id,
          listingTitle: existing.title,
          listingImage: getSafeListingImageUrl(existing.images?.[0]),
          oldPrice,
          newPrice,
        },
      });
    }

    const updated = listings.map((l) => (l.id === id ? { ...l, ...partial } : l));
    setListings(updated);
    StorageService.saveListings(updated);
    showToast(language === 'sw' ? 'Tangazo limesasishwa' : 'Listing updated');
  };

  const markListingStatus = (id: string, status: ListingStatus) => {
    const existing = listings.find((l) => l.id === id);
    if (existing && status === 'sold' && existing.status !== 'sold') {
      // Item marked sold!
      addNotification({
        userId: currentUser?.id || 'all',
        type: 'listing_sold',
        titleSw: 'Bidhaa uliyoiweka kwenye vipendwa imeuzwa',
        bodySw: `"${existing.title}" imewekwa kuwa imeuzwa na muuzaji.`,
        titleEn: 'Saved item marked as sold',
        bodyEn: `"${existing.title}" was marked as sold by the seller.`,
        data: {
          listingId: id,
          listingTitle: existing.title,
          listingImage: getSafeListingImageUrl(existing.images?.[0]),
        },
      });
    }

    const updated = listings.map((l) => (l.id === id ? { ...l, status } : l));
    setListings(updated);
    StorageService.saveListings(updated);
    setActiveListingDetail((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    showToast(
      status === 'sold'
        ? (language === 'sw' ? 'Hongera kwa kuuza! Tangazo limewekwa kuwa kimeuzwa.' : 'Marked as Sold!')
        : (language === 'sw' ? 'Hali ya tangazo imesasishwa kuwa kipo sokoni' : 'Listing is active on campus')
    );
  };

  const deleteListing = (id: string) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);
    StorageService.saveListings(updated);
    if (activeListingDetail?.id === id) {
      setActiveListingDetail(null);
    }
    showToast(language === 'sw' ? 'Tangazo limefutwa' : 'Listing deleted');
  };

  const recordListingView = (id: string) => {
    const updated = listings.map((l) => (l.id === id ? { ...l, viewsCount: l.viewsCount + 1 } : l));
    setListings(updated);
    StorageService.saveListings(updated);
  };

  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
      showToast(language === 'sw' ? 'Imeondolewa kwenye vitu vilivyopendwa' : 'Removed from saved wishlist', 'info');
    } else {
      updated = [...favorites, id];
      showToast(language === 'sw' ? 'Imehifadhiwa kwenye vitu vilivyopendwa' : 'Saved to wishlist!');
    }
    setFavorites(updated);
    StorageService.saveFavorites(updated);
  };

  // Wanted Board ("Nahitaji")
  const createWantedPost = (data: Omit<WantedPost, 'id' | 'createdAt' | 'status'>) => {
    const check = checkProhibitedContent(data.title + ' ' + data.description);
    if (check.isProhibited) {
      return { success: false, error: `${t.prohibitedWarning} (${check.matchedTerm})` };
    }

    const newPost: WantedPost = {
      ...data,
      id: 'wanted_' + Date.now(),
      createdAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
      status: 'open',
    };

    const updated = [newPost, ...wantedPosts];
    setWantedPosts(updated);
    StorageService.saveWantedPosts(updated);
    setIsCreateWantedOpen(false);
    showToast(language === 'sw' ? 'Hitaji lako limewekwa kwenye ubao!' : 'Your wanted request is posted!');
    return { success: true };
  };

  const fulfillWantedPost = (id: string) => {
    const updated = wantedPosts.map((p) => (p.id === id ? { ...p, status: 'fulfilled' as const } : p));
    setWantedPosts(updated);
    StorageService.saveWantedPosts(updated);
    showToast(language === 'sw' ? 'Umeweka kuwa umepata hitaji hili' : 'Marked as fulfilled');
  };

  // Chat Operations
  const openChatWithSeller = (listing: Listing) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (currentUser.id === listing.sellerId) {
      showToast(language === 'sw' ? 'Hili ni tangazo lako mwenyewe!' : 'This is your own listing!', 'info');
      return;
    }

    // Find existing conversation or create new one
    const existing = conversations.find(
      (c) => c.listingId === listing.id && c.buyerId === currentUser.id && c.sellerId === listing.sellerId
    );

    if (existing) {
      setActiveConversation(existing);
    } else {
      const newConv: Conversation = {
        id: 'conv_' + Date.now(),
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: getSafeListingImageUrl(listing.images?.[0]),
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        updatedAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
        messages: [
          {
            id: 'm_' + Date.now(),
            senderId: currentUser.id,
            text: language === 'sw' ? `Habari! Nina nia na "${listing.title}". Je bado kipo?` : `Hi! I am interested in "${listing.title}". Is it still available?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true,
          },
        ],
      };
      const updated = [newConv, ...conversations];
      setConversations(updated);
      StorageService.saveConversations(updated);
      setActiveConversation(newConv);
    }
    setActiveTab('chats');
    setActiveListingDetail(null);
  };

  const sendMessage = (convId: string, text: string, proposal?: { isMeetingProposal?: boolean; meetingPoint?: string }) => {
    if (!currentUser) return;
    const newMsg = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMeetingProposal: proposal?.isMeetingProposal,
      meetingPoint: proposal?.meetingPoint,
      read: true,
    };

    const updated = conversations.map((c) => {
      if (c.id === convId) {
        return {
          ...c,
          updatedAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setConversations(updated);
    StorageService.saveConversations(updated);

    // Update active conversation in state
    const current = updated.find((c) => c.id === convId) || null;
    setActiveConversation(current);

    // Simulated automated seller response if messaging demo seller
    const otherParticipantId = current ? (current.sellerId === currentUser.id ? current.buyerId : current.sellerId) : null;
    if (otherParticipantId && otherParticipantId !== currentUser.id && Math.random() > 0.3) {
      setTimeout(() => {
        const replyTextsSw = [
          'Habari! Ndio kipo kiongozi. Tunaweza kukutana chuo mchana nikakuletea ukague.',
          'Niko maeneo ya maktaba hapa, unaweza kuja sasa hivi?',
          'Sawa kabisa, bei ninaweza kupunguza kidogo kwa ajili ya nauli yako.',
        ];
        const replyTextsEn = [
          'Hello! Yes it is still available. We can meet around campus this afternoon for inspection.',
          'I am around the library concourse right now, can you make it?',
          'Sounds good! I can offer a small discount for immediate pickup.',
        ];
        const replies = language === 'sw' ? replyTextsSw : replyTextsEn;
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const autoMsg = {
          id: 'auto_' + Date.now(),
          senderId: otherParticipantId,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };

        setConversations((prev) => {
          const synced = prev.map((item) => (item.id === convId ? { ...item, messages: [...item.messages, autoMsg] } : item));
          StorageService.saveConversations(synced);
          return synced;
        });

        setActiveConversation((prev) => {
          if (prev && prev.id === convId) {
            return { ...prev, messages: [...prev.messages, autoMsg] };
          }
          return prev;
        });

        // Trigger Notification for recipient if conversation found
        if (current) {
          const senderName = current.sellerId === currentUser.id ? current.buyerName : current.sellerName;
          addNotification({
            userId: currentUser.id,
            type: 'new_message',
            titleSw: `Ujumbe mpya kutoka kwa ${senderName}`,
            bodySw: randomReply,
            titleEn: `New message from ${senderName}`,
            bodyEn: randomReply,
            data: {
              conversationId: convId,
              listingId: current.listingId,
              listingTitle: current.listingTitle,
              senderName,
            },
          });
        }
      }, 1500);
    }
  };

  // Peer Reviews
  const addReview = (targetUserId: string, rating: number, comment: string, listingTitle: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: 'rev_' + Date.now(),
      targetUserId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.fullName,
      reviewerAvatar: currentUser.avatarUrl,
      rating,
      comment,
      listingTitle,
      createdAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    StorageService.saveReviews(updated);

    // Update target user's rating & review count
    const targetUser = users.find((u) => u.id === targetUserId);
    if (targetUser) {
      const newCount = targetUser.reviewCount + 1;
      const newRating = Number(((targetUser.rating * targetUser.reviewCount + rating) / newCount).toFixed(1));
      const updatedUsers = users.map((u) => (u.id === targetUserId ? { ...u, rating: newRating, reviewCount: newCount } : u));
      setUsers(updatedUsers);
      StorageService.saveUsers(updatedUsers);
    }

    closeReviewModal();
    showToast(language === 'sw' ? 'Asante! Maoni yako yamewasilishwa.' : 'Thank you! Your review was recorded.');
  };

  // Moderation & Reports
  const openProhibitedPolicyModal = () => setIsProhibitedPolicyOpen(true);
  const closeProhibitedPolicyModal = () => setIsProhibitedPolicyOpen(false);

  const openReportModal = (target: { type: 'listing' | 'user'; id: string; title: string; sellerId?: string }) => {
    setReportTarget(target);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setIsReportModalOpen(false);
  };

  const submitReport = (
    targetType: 'listing' | 'user',
    targetId: string,
    targetTitleOrName: string,
    reason: Report['reason'],
    notes: string,
    extra?: {
      autoDetectedViolation?: boolean;
      matchedKeywords?: string[];
      severity?: 'critical' | 'high' | 'medium';
    }
  ) => {
    const newReport: Report = {
      id: 'rep_' + Date.now(),
      targetType,
      targetId,
      targetTitleOrName,
      reporterId: currentUser?.id || 'anonymous',
      reporterName: currentUser?.fullName || (language === 'sw' ? 'Mwanafunzi' : 'Student'),
      reason,
      notes,
      severity: extra?.severity || (reason === 'prohibited_item' || reason === 'exam_cheating' ? 'critical' : 'high'),
      autoDetected: extra?.autoDetectedViolation,
      matchedKeywords: extra?.matchedKeywords,
      status: 'pending',
      createdAt: language === 'sw' ? 'Hivi sasa' : 'Just now',
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    StorageService.saveReports(updated);

    // Also dispatch to server endpoint
    fetch('/api/reports/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    }).catch((err) => console.log('[Server Report Dispatch]', err));

    closeReportModal();
    showToast(
      language === 'sw'
        ? 'Ripoti imepokelewa na wasimamizi wa chuo kwa ukaguzi wa haraka.'
        : 'Report received by campus moderation for urgent review.',
      'info'
    );
  };

  // Authenticated Admin Server-Side Dispatcher
  const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
    if (!currentUser?.isAdmin) return null;
    try {
      const res = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin',
          'Authorization': 'Bearer admin_token_demo',
          ...(options.headers || {}),
        },
      });
      if (!res.ok) {
        console.warn(`[Server Admin Check Failed] ${endpoint} returned ${res.status}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.warn(`[Server Admin Check Error] Failed to reach ${endpoint}:`, err);
      return null;
    }
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'delist' | 'ban_user') => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kushughulikia ripoti' : 'Admin role required to resolve reports', 'error');
      return;
    }

    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    // Send moderation action to server
    adminFetch(`/api/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action, targetId: report.targetId, targetType: report.targetType }),
    });

    if (action === 'delist' && report.targetType === 'listing') {
      const updatedListings = listings.filter((l) => l.id !== report.targetId);
      setListings(updatedListings);
      StorageService.saveListings(updatedListings);
      showToast(language === 'sw' ? 'Tangazo limeondolewa sokoni' : 'Listing delisted by administration');
    } else if (action === 'ban_user') {
      const userIdToBan = report.targetType === 'user' ? report.targetId : listings.find((l) => l.id === report.targetId)?.sellerId;
      if (userIdToBan) {
        const updatedUsers = users.map((u) => (u.id === userIdToBan ? { ...u, isBanned: true } : u));
        setUsers(updatedUsers);
        StorageService.saveUsers(updatedUsers);
        // Also delist all listings of that banned user
        const updatedListings = listings.filter((l) => l.sellerId !== userIdToBan);
        setListings(updatedListings);
        StorageService.saveListings(updatedListings);
        showToast(language === 'sw' ? 'Mtumiaji amezuiwa na matangazo yake yamefutwa' : 'User banned and all their listings removed');
      }
    } else {
      showToast(language === 'sw' ? 'Ripoti imetupiliwa mbali' : 'Report dismissed');
    }

    const updatedReports: Report[] = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status: action === 'dismiss' ? 'dismissed' as const : 'resolved' as const,
            actionTaken: action,
            resolvedAt: new Date().toISOString(),
            resolvedBy: currentUser.fullName || 'Campus Moderator',
            resolutionNotes:
              action === 'dismiss'
                ? 'Hakuna ushahidi wa kutosha / Insufficient evidence'
                : action === 'delist'
                ? 'Tangazo limefutwa kwa kukiuka sera / Delisted for policy violation'
                : 'Mtumiaji amezuiwa kwa usalama wa wanafunzi / Banned for campus community safety',
          }
        : r
    );
    setReports(updatedReports);
    StorageService.saveReports(updatedReports);
  };

  const blockUser = (userId: string) => {
    if (!blockedUsers.includes(userId)) {
      const updated = [...blockedUsers, userId];
      setBlockedUsers(updated);
      StorageService.saveBlockedUsers(updated);
      showToast(language === 'sw' ? 'Mtumiaji amezuiwa' : 'User blocked', 'info');
    }
  };

  const openReviewModal = (target: { userId: string; userName: string; listingTitle: string }) => {
    setReviewModalTarget(target);
  };

  const closeReviewModal = () => {
    setReviewModalTarget(null);
  };

  // Admin Operations - Protected on Client & Server
  const addUniversity = (univ: University) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kuongeza chuo kikuu' : 'Admin role required to add university', 'error');
      return;
    }
    // Server-side verification
    adminFetch('/api/admin/universities', {
      method: 'POST',
      body: JSON.stringify({ university: univ }),
    });

    const updated = [...universities, univ];
    setUniversities(updated);
    StorageService.saveUniversities(updated);
    showToast(language === 'sw' ? `Chuo kikuu cha ${univ.name} kimeongezwa kwa uthibitisho wa seva!` : `University ${univ.name} registered with server confirmation!`);
  };

  const updateUniversity = (id: string, partial: Partial<University>) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kubadili chuo' : 'Admin role required', 'error');
      return;
    }
    // Server-side verification
    adminFetch(`/api/admin/universities/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ university: partial }),
    });

    const updated = universities.map((u) => (u.id === id ? { ...u, ...partial } : u));
    setUniversities(updated);
    StorageService.saveUniversities(updated);
    showToast(language === 'sw' ? 'Mabadiliko ya chuo yamehifadhiwa' : 'University updated successfully');
  };

  const deleteUniversity = (id: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kufuta chuo' : 'Admin role required', 'error');
      return;
    }
    if (universities.length <= 1) {
      showToast(language === 'sw' ? 'Huwezi kufuta chuo pekee kilichopo' : 'Cannot delete the only campus', 'error');
      return;
    }
    // Server-side verification
    adminFetch(`/api/admin/universities/${id}`, { method: 'DELETE' });

    const updated = universities.filter((u) => u.id !== id);
    setUniversities(updated);
    StorageService.saveUniversities(updated);
    if (selectedUniversityId === id) {
      setSelectedUniversityId(updated[0].id);
    }
    showToast(language === 'sw' ? 'Chuo kimefutwa kwenye mfumo' : 'University removed');
  };

  const addCategory = (cat: Category) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kuongeza kategoria' : 'Admin role required to add category', 'error');
      return;
    }
    // Server-side verification
    adminFetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ category: cat }),
    });

    const updated = [...categories, cat];
    setCategories(updated);
    StorageService.saveCategories(updated);
    showToast(language === 'sw' ? `Kategoria ya "${cat.nameSw}" imeongezwa!` : `Category "${cat.nameEn}" added!`);
  };

  const updateCategory = (id: string, partial: Partial<Category>) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kubadili kategoria' : 'Admin role required', 'error');
      return;
    }
    // Server-side verification
    adminFetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ category: partial }),
    });

    const updated = categories.map((c) => (c.id === id ? { ...c, ...partial } : c));
    setCategories(updated);
    StorageService.saveCategories(updated);
    showToast(language === 'sw' ? 'Kategoria imesasishwa' : 'Category updated');
  };

  const deleteCategory = (id: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kufuta kategoria' : 'Admin role required', 'error');
      return;
    }
    // Server-side verification
    adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });

    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    StorageService.saveCategories(updated);
    showToast(language === 'sw' ? 'Kategoria imeondolewa' : 'Category deleted');
  };

  const toggleUserVerification = (userId: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kubadili uthibitisho' : 'Admin role required', 'error');
      return;
    }
    const target = users.find((u) => u.id === userId);
    const nextState = !target?.isVerified;

    // Server-side verification check
    adminFetch(`/api/admin/users/${userId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ isVerified: nextState, verificationMethod: 'student_id' }),
    });

    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          isVerified: nextState,
          verificationMethod: nextState ? ('student_id' as const) : undefined,
        };
      }
      return u;
    });
    setUsers(updated);
    StorageService.saveUsers(updated);
    if (currentUser.id === userId) {
      const self = updated.find((u) => u.id === userId)!;
      setCurrentUser(self);
    }
    showToast(language === 'sw' ? 'Hali ya beji ya mwanafunzi imesasishwa na seva' : 'Verification status updated via server');
  };

  const toggleUserAdmin = (userId: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kubadili cheo cha msimamizi' : 'Admin role required', 'error');
      return;
    }
    const target = users.find((u) => u.id === userId);
    const nextAdmin = !target?.isAdmin;

    // Server-side authorization check
    adminFetch(`/api/admin/users/${userId}/role`, {
      method: 'POST',
      body: JSON.stringify({ role: nextAdmin ? 'admin' : 'student', isAdmin: nextAdmin }),
    });

    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          isAdmin: nextAdmin,
          role: nextAdmin ? ('admin' as const) : ('student' as const),
        };
      }
      return u;
    });
    setUsers(updated);
    StorageService.saveUsers(updated);
    if (currentUser.id === userId) {
      const self = updated.find((u) => u.id === userId)!;
      setCurrentUser(self);
    }
    showToast(language === 'sw' ? 'Mamlaka ya msimamizi yamesasishwa na seva' : 'Admin privileges updated via server');
  };

  const toggleUserBan = (userId: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kuzuia mtumiaji' : 'Admin role required', 'error');
      return;
    }
    const target = users.find((u) => u.id === userId);
    const nextBan = !target?.isBanned;

    // Server-side check
    adminFetch(`/api/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ isBanned: nextBan }),
    });

    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, isBanned: nextBan };
      }
      return u;
    });
    setUsers(updated);
    StorageService.saveUsers(updated);
    showToast(language === 'sw' ? 'Hali ya akaunti imesasishwa na seva' : 'User account suspension toggled via server');
  };

  const deleteUser = (userId: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kufuta akaunti hii' : 'Admin role required', 'error');
      return;
    }
    // Server-side check
    adminFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });

    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    StorageService.saveUsers(updated);
    showToast(language === 'sw' ? 'Akaunti ya mwanafunzi imefutwa' : 'User account deleted');
  };

  const addUser = (userData: Omit<User, 'id' | 'joinedDate' | 'rating' | 'reviewCount'>) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kusajili akaunti' : 'Admin role required', 'error');
      return;
    }
    const newId = 'user_' + Date.now();
    const newUser: User = {
      ...userData,
      id: newId,
      joinedDate: language === 'sw' ? 'Hivi sasa' : 'Just now',
      rating: 5.0,
      reviewCount: 0,
    };

    // Server-side check
    adminFetch('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    const updated = [newUser, ...users];
    setUsers(updated);
    StorageService.saveUsers(updated);
    showToast(language === 'sw' ? `Mwanafunzi ${newUser.fullName} amesajiliwa na seva!` : `User ${newUser.fullName} registered with server confirmation!`);
  };

  const toggleListingFeatured = (listingId: string) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka ya kubadili tangazo' : 'Admin role required', 'error');
      return;
    }
    const target = listings.find((l) => l.id === listingId);
    const nextFeatured = !target?.isFeatured;

    // Server-side check
    adminFetch(`/api/admin/listings/${listingId}/featured`, {
      method: 'POST',
      body: JSON.stringify({ isFeatured: nextFeatured }),
    });

    const updated = listings.map((l) => (l.id === listingId ? { ...l, isFeatured: nextFeatured } : l));
    setListings(updated);
    StorageService.saveListings(updated);
    showToast(language === 'sw' ? 'Hali ya tangazo maalum imebadilishwa' : 'Featured listing toggled');
  };

  const updateListingStatusByAdmin = (listingId: string, status: ListingStatus) => {
    if (!currentUser?.isAdmin) {
      showToast(language === 'sw' ? 'Huna mamlaka' : 'Admin role required', 'error');
      return;
    }

    // Server-side check
    adminFetch(`/api/admin/listings/${listingId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });

    markListingStatus(listingId, status);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Filter listings based on active campus, blocked users, category, price, and bilingual search
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Must not be from blocked users
      if (blockedUsers.includes(item.sellerId)) return false;

      // University filter: respect filter override if provided, else respect global selected university
      const effectiveUni = filters.universityId !== undefined ? filters.universityId : selectedUniversityId;
      if (effectiveUni && effectiveUni !== 'all') {
        if (item.universityId !== effectiveUni) return false;
      }

      // Campus zone filter
      if (filters.campusZone && filters.campusZone !== 'all') {
        if (item.campusZone !== filters.campusZone) return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (item.category !== filters.category) return false;
      }

      // Condition filter
      if (filters.condition && filters.condition !== 'all') {
        if (item.condition !== filters.condition) return false;
      }

      // Verified seller filter
      if (filters.verifiedOnly && !item.sellerVerified) {
        return false;
      }

      // Price filter
      if (filters.minPrice !== undefined && item.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && item.price > filters.maxPrice) return false;

      // Bilingual Search keyword filter (matches title, description, category, campus location, or common Swahili/English synonyms)
      if (filters.searchQuery.trim()) {
        const rawQ = filters.searchQuery.toLowerCase().trim();
        const synonymsMap: Record<string, string[]> = {
          pasi: ['iron', 'pasi', 'steam'],
          iron: ['iron', 'pasi'],
          godoro: ['mattress', 'godoro', 'bed'],
          mattress: ['godoro', 'mattress'],
          kitabu: ['book', 'textbook', 'notisi', 'notes'],
          vitabu: ['books', 'textbooks', 'vitabu', 'notisi'],
          book: ['kitabu', 'textbook', 'book'],
          books: ['vitabu', 'textbooks', 'books'],
          textbook: ['kitabu', 'textbook', 'engineering', 'calculus'],
          kalkuleta: ['calculator', 'kalkuleta', 'casio'],
          calculator: ['kalkuleta', 'calculator', 'casio'],
          simu: ['phone', 'smartphone', 'simu', 'iphone', 'samsung'],
          phone: ['simu', 'phone', 'smartphone', 'iphone', 'samsung', 'redmi'],
          nguo: ['clothes', 'shirt', 'dress', 'fashion', 'nguo', 'hoodie'],
          viatu: ['shoes', 'sneakers', 'viatu', 'sandals'],
          kettle: ['kettle', 'birika', 'jiko'],
          jiko: ['jiko', 'kettle', 'cooker', 'plate'],
          feni: ['fan', 'feni'],
          fan: ['feni', 'fan'],
          laptop: ['laptop', 'kompyuta', 'hp', 'dell', 'lenovo', 'macbook'],
          kompyuta: ['laptop', 'computer', 'kompyuta', 'pc'],
        };

        const searchKeywords = [rawQ, ...(synonymsMap[rawQ] || [])];
        const itemBlob = `${item.title} ${item.description} ${item.category} ${item.campusZone} ${item.safePickupPoint}`.toLowerCase();

        const matches = searchKeywords.some((term) => itemBlob.includes(term));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'popular') return b.viewsCount - a.viewsCount;
      // default newest: featured first, then standard order
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [listings, blockedUsers, selectedUniversityId, filters]);

  return (
    <CampusSokoContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        toggleTheme,
        userColorPreference,
        setUserColorPreference,
        colorTheme,
        selectedUniversityId,
        setSelectedUniversityId,
        currentUniversity,
        universities,
        addUniversity,
        updateUniversity,
        deleteUniversity,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleUserVerification,
        toggleUserAdmin,
        toggleUserBan,
        deleteUser,
        addUser,
        serverAdminVerified,
        verifyServerAdminRole,
        toggleListingFeatured,
        updateListingStatusByAdmin,
        currentUser,
        users,
        loginWithPhone,
        loginWithEmail,
        loginAsDemo,
        logout,
        updateUserProfile,
        verifyStudent,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        listings,
        filteredListings,
        createListing,
        updateListing,
        markListingStatus,
        deleteListing,
        recordListingView,
        favorites,
        toggleFavorite,
        wantedPosts,
        createWantedPost,
        fulfillWantedPost,
        conversations,
        activeConversation,
        openChatWithSeller,
        setActiveConversation,
        sendMessage,
        reviews,
        addReview,
        reports,
        submitReport,
        resolveReport,
        blockedUsers,
        blockUser,
        filters,
        setFilters,
        resetFilters,
        activeTab,
        setActiveTab,
        activeListingDetail,
        setActiveListingDetail,
        isCreateListingOpen,
        setIsCreateListingOpen,
        isCreateWantedOpen,
        setIsCreateWantedOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        isReportModalOpen,
        reportTarget,
        openReportModal,
        closeReportModal,
        isProhibitedPolicyOpen,
        openProhibitedPolicyModal,
        closeProhibitedPolicyModal,
        reviewModalTarget,
        openReviewModal,
        closeReviewModal,
        roleView,
        setRoleView,
        registerAsSeller,
        loginAsAdmin,
        isSellerRegistrationOpen,
        setIsSellerRegistrationOpen,
        toasts,
        showToast,
        notifications,
        unreadNotificationsCount,
        notificationPreferences,
        updateNotificationPreferences,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        deleteNotification,
        addNotification,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        isNotificationSettingsOpen,
        setIsNotificationSettingsOpen,
        requestPushPermission,
        triggerTestNotification,
        goHome,
      }}
    >
      {children}
    </CampusSokoContext.Provider>
  );
}

export function useCampusSoko() {
  const context = useContext(CampusSokoContext);
  if (!context) {
    throw new Error('useCampusSoko must be used within a CampusSokoProvider');
  }
  return context;
}
