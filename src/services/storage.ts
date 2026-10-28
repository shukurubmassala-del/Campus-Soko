import {
  AppNotification,
  Category,
  Conversation,
  Listing,
  NotificationPreferences,
  Report,
  Review,
  RoleView,
  University,
  User,
  WantedPost,
} from '../types';
import { MOCK_LISTINGS, MOCK_REVIEWS, MOCK_USERS, MOCK_WANTED_POSTS } from '../data/mockData';
import { UNIVERSITIES } from '../data/universities';
import { CATEGORIES } from '../data/categories';
import { UserColorPreference } from '../utils/userColorTheme';

const KEYS = {
  USERS: 'campussoko_users',
  CURRENT_USER: 'campussoko_current_user',
  LISTINGS: 'campussoko_listings',
  WANTED: 'campussoko_wanted',
  CONVERSATIONS: 'campussoko_conversations',
  REVIEWS: 'campussoko_reviews',
  REPORTS: 'campussoko_reports',
  FAVORITES: 'campussoko_favorites',
  BLOCKED: 'campussoko_blocked_users',
  UNIVERSITY: 'campussoko_selected_univ',
  UNIVERSITIES_LIST: 'campussoko_universities_list',
  CATEGORIES_LIST: 'campussoko_categories_list',
  LANG: 'campussoko_language',
  THEME: 'campussoko_theme',
  ONBOARDED: 'campussoko_onboarded',
  ROLE_VIEW: 'campussoko_role_view',
  NOTIFICATIONS: 'campussoko_notifications',
  NOTIFICATION_PREFS: 'campussoko_notification_prefs',
  FCM_TOKEN: 'campussoko_fcm_token',
  USER_COLOR_PREF: 'campussoko_user_color_pref',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${key}`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to set localStorage key ${key}`, err);
  }
}

export const StorageService = {
  getUsers(): User[] {
    return getItem<User[]>(KEYS.USERS, MOCK_USERS);
  },
  saveUsers(users: User[]): void {
    setItem(KEYS.USERS, users);
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(KEYS.CURRENT_USER);
      if (raw === null) {
        // First visit default
        return MOCK_USERS[0];
      }
      if (raw === 'null' || raw === 'undefined' || !raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  saveCurrentUser(user: User | null): void {
    if (user === null) {
      localStorage.setItem(KEYS.CURRENT_USER, 'null');
    } else {
      setItem(KEYS.CURRENT_USER, user);
    }
  },

  getListings(): Listing[] {
    return getItem<Listing[]>(KEYS.LISTINGS, MOCK_LISTINGS);
  },
  saveListings(listings: Listing[]): void {
    setItem(KEYS.LISTINGS, listings);
  },

  getWantedPosts(): WantedPost[] {
    return getItem<WantedPost[]>(KEYS.WANTED, MOCK_WANTED_POSTS);
  },
  saveWantedPosts(posts: WantedPost[]): void {
    setItem(KEYS.WANTED, posts);
  },

  getConversations(): Conversation[] {
    return getItem<Conversation[]>(KEYS.CONVERSATIONS, [
      {
        id: 'conv_sample_1',
        listingId: 'list_1',
        listingTitle: 'Engineering Mathematics (K.A. Stroud) 5th Edition',
        listingPrice: 35000,
        listingImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        buyerId: 'user_amina',
        buyerName: 'Amina Juma',
        sellerId: 'user_baraka',
        sellerName: 'Baraka Mrema',
        updatedAt: 'Masaa 2 yaliyopita',
        messages: [
          {
            id: 'm1',
            senderId: 'user_amina',
            text: 'Habari Baraka! Je hiki kitabu cha Engineering Mathematics bado kipo?',
            timestamp: '14:20',
            read: true,
          },
          {
            id: 'm2',
            senderId: 'user_baraka',
            text: 'Habari Amina, ndio bado kipo kimebaki safi sana bila makovu.',
            timestamp: '14:25',
            read: true,
          },
          {
            id: 'm3',
            senderId: 'user_baraka',
            text: 'Tunaweza kukutana maktaba kuu mchana ukikague?',
            timestamp: '14:26',
            isMeetingProposal: true,
            meetingPoint: 'Dr. Wilbert Chagula Library (Main Entrance)',
            read: true,
          },
        ],
      },
    ]);
  },
  saveConversations(conversations: Conversation[]): void {
    setItem(KEYS.CONVERSATIONS, conversations);
  },

  getReviews(): Review[] {
    return getItem<Review[]>(KEYS.REVIEWS, MOCK_REVIEWS);
  },
  saveReviews(reviews: Review[]): void {
    setItem(KEYS.REVIEWS, reviews);
  },

  getReports(): Report[] {
    return getItem<Report[]>(KEYS.REPORTS, []);
  },
  saveReports(reports: Report[]): void {
    setItem(KEYS.REPORTS, reports);
  },

  getFavorites(): string[] {
    return getItem<string[]>(KEYS.FAVORITES, ['list_2']);
  },
  saveFavorites(favorites: string[]): void {
    setItem(KEYS.FAVORITES, favorites);
  },

  getBlockedUsers(): string[] {
    return getItem<string[]>(KEYS.BLOCKED, []);
  },
  saveBlockedUsers(blocked: string[]): void {
    setItem(KEYS.BLOCKED, blocked);
  },

  getSelectedUniversity(): string {
    return getItem<string>(KEYS.UNIVERSITY, 'udsm');
  },
  saveSelectedUniversity(univId: string): void {
    setItem(KEYS.UNIVERSITY, univId);
  },

  getUniversities(): University[] {
    const list = getItem<University[]>(KEYS.UNIVERSITIES_LIST, UNIVERSITIES);
    return list.map((univ) => {
      const def = UNIVERSITIES.find((u) => u.id === univ.id);
      if (def) {
        return {
          ...univ,
          website: univ.website || def.website,
          iconicBuildingName: univ.iconicBuildingName || def.iconicBuildingName,
          iconicBuildingNameSw: univ.iconicBuildingNameSw || def.iconicBuildingNameSw,
          iconicBuildingImage: univ.iconicBuildingImage || def.iconicBuildingImage,
        };
      }
      return univ;
    });
  },
  saveUniversities(universities: University[]): void {
    setItem(KEYS.UNIVERSITIES_LIST, universities);
  },

  getCategories(): Category[] {
    const list = getItem<Category[]>(KEYS.CATEGORIES_LIST, CATEGORIES);
    return list.map((cat) => {
      const def = CATEGORIES.find((c) => c.id === cat.id);
      if (def?.iconImage && !cat.iconImage) {
        return { ...cat, iconImage: def.iconImage };
      }
      return cat;
    });
  },
  saveCategories(categories: Category[]): void {
    setItem(KEYS.CATEGORIES_LIST, categories);
  },

  getLanguage(): 'sw' | 'en' {
    return getItem<'sw' | 'en'>(KEYS.LANG, 'sw');
  },
  saveLanguage(lang: 'sw' | 'en'): void {
    setItem(KEYS.LANG, lang);
  },

  getTheme(): 'light' | 'dark' {
    const saved = getItem<'light' | 'dark' | null>(KEYS.THEME, null);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },
  saveTheme(theme: 'light' | 'dark'): void {
    setItem(KEYS.THEME, theme);
  },

  hasCompletedOnboarding(): boolean {
    return getItem<boolean>(KEYS.ONBOARDED, false);
  },
  saveCompletedOnboarding(completed: boolean): void {
    setItem(KEYS.ONBOARDED, completed);
  },

  getRoleView(): RoleView {
    return getItem<RoleView>(KEYS.ROLE_VIEW, 'buyer');
  },
  saveRoleView(role: RoleView): void {
    setItem(KEYS.ROLE_VIEW, role);
  },

  getNotificationPreferences(): NotificationPreferences {
    return getItem<NotificationPreferences>(KEYS.NOTIFICATION_PREFS, {
      notifyNewMessages: true,
      notifyPriceDrops: true,
      notifyListingSold: true,
      notifySafetyAlerts: true,
      enablePushNotifications: true,
    });
  },
  saveNotificationPreferences(prefs: NotificationPreferences): void {
    setItem(KEYS.NOTIFICATION_PREFS, prefs);
  },

  getNotifications(): AppNotification[] {
    const defaultNotifications: AppNotification[] = [
      {
        id: 'notif_1',
        userId: 'user_shukuru',
        type: 'new_message',
        titleSw: 'Ujumbe mpya kutoka kwa Baraka Mrema',
        bodySw: 'Habari! Bado una nia na "Engineering Mathematics"? Niko maktaba kuu mchana.',
        titleEn: 'New message from Baraka Mrema',
        bodyEn: 'Hi! Are you still interested in "Engineering Mathematics"? I am at the main library.',
        read: false,
        createdAt: 'Dakika 15 zilizopita',
        timestamp: Date.now() - 15 * 60 * 1000,
        data: {
          listingId: 'list_1',
          listingTitle: 'Engineering Mathematics 5th Edition (K.A. Stroud)',
          conversationId: 'conv_1',
          senderId: 'user_baraka',
          senderName: 'Baraka Mrema',
        },
      },
      {
        id: 'notif_2',
        userId: 'user_shukuru',
        type: 'price_drop',
        titleSw: 'Punguzo la bei! HP EliteBook 840 G5',
        bodySw: 'Bei imeshuka kutoka TZS 520,000 hadi TZS 460,000! Umeokoa TZS 60,000.',
        titleEn: 'Price drop! HP EliteBook 840 G5',
        bodyEn: 'Price dropped from TZS 520,000 to TZS 460,000! You save TZS 60,000.',
        read: false,
        createdAt: 'Saa 2 zilizopita',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        data: {
          listingId: 'list_2',
          listingTitle: 'HP EliteBook 840 G5 (Core i5 8th Gen, 16GB RAM)',
          oldPrice: 520000,
          newPrice: 460000,
        },
      },
      {
        id: 'notif_3',
        userId: 'user_shukuru',
        type: 'listing_sold',
        titleSw: 'Bidhaa uliyoiweka kwenye vipendwa imeuzwa',
        bodySw: 'Jiko la Umeme (Hotplate mbili) limeuzwa na mwanafunzi Amina Juma.',
        titleEn: 'Item on your favorites was marked as sold',
        bodyEn: 'Electric Hotplate Cooker was sold by student Amina Juma.',
        read: true,
        createdAt: 'Jana',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        data: {
          listingId: 'list_3',
          listingTitle: 'Jiko la Umeme (Hotplate Mbili)',
        },
      },
    ];
    return getItem<AppNotification[]>(KEYS.NOTIFICATIONS, defaultNotifications);
  },
  saveNotifications(notifications: AppNotification[]): void {
    setItem(KEYS.NOTIFICATIONS, notifications);
  },

  getFcmToken(): string | null {
    return getItem<string | null>(KEYS.FCM_TOKEN, null);
  },
  saveFcmToken(token: string | null): void {
    setItem(KEYS.FCM_TOKEN, token);
  },

  getUserColorPreference(): UserColorPreference {
    return getItem<UserColorPreference>(KEYS.USER_COLOR_PREF, 'monochrome');
  },
  saveUserColorPreference(pref: UserColorPreference): void {
    setItem(KEYS.USER_COLOR_PREF, pref);
  },
};

