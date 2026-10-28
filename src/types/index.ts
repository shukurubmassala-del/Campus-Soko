export type Language = 'sw' | 'en';

export type Condition = 'new' | 'like_new' | 'good' | 'fair';

export type ListingStatus = 'active' | 'reserved' | 'sold';

export type CategoryId =
  | 'textbooks'
  | 'electronics'
  | 'phones_tablets'
  | 'hostel_essentials'
  | 'subletting'
  | 'fashion'
  | 'food_snacks'
  | 'services'
  | 'furniture'
  | 'beauty'
  | 'other'
  | (string & {});

export type RoleView = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  universityId: string;
  campusZone: string;
  isVerified: boolean;
  verificationMethod?: 'email' | 'student_id';
  verificationDocumentUrl?: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  avatarUrl: string;
  isAdmin?: boolean;
  role?: 'student' | 'admin' | 'moderator';
  isBanned?: boolean;
  showPhonePublicly?: boolean;
  isSellerRegistered?: boolean;
  declaredRole?: 'buyer' | 'seller';
  shopName?: string;
  sellerCategory?: string;
  fcmToken?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  zones: string[];
  safeMeetingPoints: string[];
  website?: string;
  iconicBuildingName?: string;
  iconicBuildingNameSw?: string;
  iconicBuildingImage?: string;
}

export interface Category {
  id: CategoryId | string;
  nameSw: string;
  nameEn: string;
  iconName: string;
  iconImage?: string;
  descriptionSw: string;
  descriptionEn: string;
  color?: string;
  iconBg?: string;
  count?: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerAvatar?: string;
  universityId: string;
  campusZone: string;
  safePickupPoint: string;
  title: string;
  description: string;
  category: CategoryId;
  price: number; // in TZS
  isNegotiable: boolean;
  condition: Condition;
  images: string[];
  status: ListingStatus;
  createdAt: string;
  viewsCount: number;
  isFeatured?: boolean;
}

export interface WantedPost {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerVerified: boolean;
  buyerAvatar?: string;
  universityId: string;
  campusZone: string;
  title: string;
  description: string;
  maxBudget: number; // in TZS
  category: CategoryId;
  status: 'open' | 'fulfilled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMeetingProposal?: boolean;
  meetingPoint?: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Review {
  id: string;
  targetUserId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  listingTitle: string;
  createdAt: string;
}

export type ReportReason =
  | 'prohibited_item'
  | 'exam_cheating'
  | 'fraud'
  | 'counterfeit'
  | 'stolen_goods'
  | 'harassment'
  | 'impersonation'
  | 'other';

export interface Report {
  id: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitleOrName: string;
  targetSubtitle?: string;
  reporterId: string;
  reporterName?: string;
  reason: ReportReason;
  notes: string;
  severity?: 'critical' | 'high' | 'medium';
  autoDetected?: boolean;
  matchedKeywords?: string[];
  status: 'pending' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  actionTaken?: 'dismiss' | 'delist' | 'ban_user' | 'warn_user';
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId | 'all';
  condition: Condition | 'all';
  minPrice?: number;
  maxPrice?: number;
  campusZone?: string;
  universityId?: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  verifiedOnly?: boolean;
}

export type NotificationType = 'new_message' | 'price_drop' | 'listing_sold' | 'safety_alert';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  titleSw: string;
  bodySw: string;
  titleEn: string;
  bodyEn: string;
  read: boolean;
  createdAt: string;
  timestamp: number;
  data?: {
    listingId?: string;
    listingTitle?: string;
    listingImage?: string;
    oldPrice?: number;
    newPrice?: number;
    conversationId?: string;
    senderId?: string;
    senderName?: string;
    url?: string;
  };
}

export interface NotificationPreferences {
  notifyNewMessages: boolean;
  notifyPriceDrops: boolean;
  notifyListingSold: boolean;
  notifySafetyAlerts: boolean;
  enablePushNotifications: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface AppAmendment {
  id: string;
  version: string;
  buildId: string;
  titleSw: string;
  titleEn: string;
  descriptionSw: string;
  descriptionEn: string;
  highlightsSw: string[];
  highlightsEn: string[];
  releaseDate: string;
  isImportant?: boolean;
}

export interface AppVersionInfo {
  version: string;
  buildId: string;
  releaseDate: string;
  hasUpdate?: boolean;
  amendment?: AppAmendment;
  amendmentHistory?: AppAmendment[];
}

