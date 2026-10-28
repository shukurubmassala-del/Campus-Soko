import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import { compressImage } from '../../services/imageCompressor';
import {
  Bell,
  Camera,
  Check,
  CheckCircle2,
  Compass,
  Edit3,
  Heart,
  Lock,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  PackageCheck,
  Phone,
  Radio,
  Scale,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  TrendingDown,
  Upload,
  UserCheck,
  X,
  Sparkles,
  RefreshCw,
  Layers,
  Globe,
  Smartphone,
} from 'lucide-react';
import { ListingCard } from '../listings/ListingCard';
import { BackHomeButton } from '../common/BackHomeButton';
import { ProgressBar } from '../common/ProgressBar';
import { ColorPreferencePicker } from '../common/ColorPreferencePicker';
import { Palette } from 'lucide-react';
import { getSafeAvatarUrl, getSafeListingImageUrl } from '../../utils/imageUtils';
import { AppUpdateService, APP_CURRENT_VERSION, APP_BUILD_ID } from '../../services/appUpdateService';
import { AppAmendment } from '../../types';

// Authentic preset avatar seeds for students
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Baraka&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Amina&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Shukuru&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Neema&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Juma&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zawadi&backgroundColor=b6e3f4',
];

export const ProfileView: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    logout,
    updateUserProfile,
    listings,
    favorites,
    reviews,
    currentUniversity,
    setIsVerificationModalOpen,
    setIsOnboardingOpen,
    markListingStatus,
    deleteListing,
    setIsAuthModalOpen,
    setIsCreateListingOpen,
    setActiveTab,
    showToast,
    openProhibitedPolicyModal,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    setIsNotificationSettingsOpen,
    notificationPreferences,
    updateNotificationPreferences,
    requestPushPermission,
    triggerTestNotification,
    colorTheme,
    userColorPreference,
  } = useCampusSoko();

  const [activeTab, setProfileTab] = useState<'listings' | 'saved' | 'reviews' | 'notifications' | 'appearance' | 'version'>('listings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCheckingVersion, setIsCheckingVersion] = useState(false);
  const [versionStatusMessage, setVersionStatusMessage] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editCampusZone, setEditCampusZone] = useState(currentUser?.campusZone || currentUniversity.zones[0]);
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || PRESET_AVATARS[0]);
  const [editShowPhone, setEditShowPhone] = useState(currentUser?.showPhonePublicly || false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-8 space-y-4 animate-in fade-in">
        <div className="flex items-center justify-start">
          <BackHomeButton />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.signInOrRegister}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'sw'
                ? 'Ingia uweze kuona matangazo yako, vitu ulivyohifadhi na maoni ya wenzako.'
                : 'Sign in to manage your listings, saved wishlist and peer ratings.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            {t.signInOrRegister}
          </button>
        </div>
      </div>
    );
  }

  const myListings = listings.filter((l) => l.sellerId === currentUser.id);
  const mySaved = listings.filter((l) => favorites.includes(l.id));
  const myReviews = reviews.filter((r) => r.targetUserId === currentUser.id);

  const startEditing = () => {
    setEditName(currentUser.fullName);
    setEditCampusZone(currentUser.campusZone);
    setEditAvatarUrl(currentUser.avatarUrl);
    setEditShowPhone(Boolean(currentUser.showPhonePublicly));
    setIsEditingProfile(true);
  };

  const handleCustomPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // Client-side canvas compression under 150KB
      const compressed = await compressImage(file, 400, 0.85);
      setEditAvatarUrl(compressed);
      showToast(
        language === 'sw'
          ? 'Picha imeboreshwa na kupakiwa!'
          : 'Profile photo compressed and ready!'
      );
    } catch {
      showToast(
        language === 'sw' ? 'Hitilafu ya kupakia picha' : 'Failed to process photo',
        'error'
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast(
        language === 'sw' ? 'Tafadhali weka jina lako' : 'Please provide your name',
        'error'
      );
      return;
    }

    updateUserProfile({
      fullName: editName.trim(),
      campusZone: editCampusZone,
      avatarUrl: editAvatarUrl,
      showPhonePublicly: editShowPhone,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Back Home Bar */}
      <div className="flex items-center justify-between">
        <BackHomeButton />
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={getSafeAvatarUrl(currentUser.avatarUrl, currentUser.fullName)}
              alt={currentUser.fullName}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 object-cover border-2 border-emerald-500/30 shadow-xs"
            />
            {currentUser.isVerified ? (
              <span
                title={t.verifiedStudentBadge}
                className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-1 rounded-full shadow-xs"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
              </span>
            ) : null}

            <button
              type="button"
              onClick={startEditing}
              className="absolute inset-0 bg-slate-950/40 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title={t.changePhotoDesc}
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 dark:text-white">
                {currentUser.fullName}
              </h1>

              {/* Verified Badge pill - Labels / metadata: 12–13 px */}
              {currentUser.isVerified ? (
                <span
                  title={language === 'sw' ? 'Mwanafunzi Aliyethibitishwa Chuo Rasmi' : 'Official Verified Student Account'}
                  className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold text-[12px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.verifiedStudentBadge}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-semibold text-[12px] flex items-center gap-1 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'sw' ? 'Omba Uthibitisho (+)' : 'Get Verified (+)'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {currentUniversity.shortName} · {currentUser.campusZone}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentUser.rating.toFixed(1)}</span>
              </span>
              <span>
                ({currentUser.reviewCount} {language === 'sw' ? 'tathmini' : 'reviews'})
              </span>
            </div>

            <div className="flex items-center gap-3 text-[12px] text-slate-400 font-normal">
              <span>{language === 'sw' ? 'Simu:' : 'Phone:'} {currentUser.phone}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>
                  {currentUser.showPhonePublicly
                    ? (language === 'sw' ? 'Namba inaonekana' : 'Public number')
                    : (language === 'sw' ? 'Namba imefichwa (PDPA)' : 'Private number (PDPA)')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls - Buttons: 14–16 px, Semibold (600) */}
        <div className="flex items-center gap-2 sm:self-center flex-wrap">
          {currentUser.isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[14px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-red-600/20 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.navAdmin}</span>
            </button>
          )}

          <button
            type="button"
            onClick={startEditing}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-[14px] font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t.editProfile}</span>
          </button>

          <ColorPreferencePicker variant="compact" />

          <button
            type="button"
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-white cursor-pointer"
            title={t.notificationsTitle}
            aria-label={t.notificationsTitle}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${colorTheme.dotBg} ring-2 ring-white dark:ring-slate-900`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-white"
            title={t.changeCampusSetup}
            aria-label={t.changeCampusSetup}
          >
            <Compass className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={logout}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500"
            title={t.logout}
            aria-label={t.logout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* VERIFIED STUDENT BADGE SHOWCASE & STATUS CARD */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl shrink-0 ${
              currentUser.isVerified
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {currentUser.isVerified ? (
                <ShieldCheck className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white">
                  {t.verifiedStudentBadge}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-[12px] font-medium uppercase tracking-wider ${
                  currentUser.isVerified
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {currentUser.isVerified
                    ? t.verifiedStudentStatusActive
                    : t.verifiedStudentStatusPending}
                </span>
              </div>

              <p className="text-[14px] sm:text-[15px] font-normal text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                {currentUser.isVerified ? (
                  <span>
                    {language === 'sw'
                      ? `Hongera! Akaunti yako imethibitishwa kuwa mwanafunzi halisi wa ${currentUniversity.name}. Beji hii inaonekana kwa wanunuzi wote chuoni.`
                      : `Congratulations! Your account is verified as an active student at ${currentUniversity.name}. This badge is visible on all your listings.`}
                  </span>
                ) : (
                  <span>
                    {language === 'sw'
                      ? 'Wanafunzi wanaoaminika huuza mara 3 haraka na kujenga uaminifu wa papo hapo. Thibitisha akaunti yako kwa kutumia barua pepe ya chuo (.ac.tz) au kitambulisho.'
                      : 'Verified students close sales up to 3x faster and establish immediate credibility. Verify using your university email (.ac.tz) or student ID.'}
                  </span>
                )}
              </p>

              {/* Method tag if verified */}
              {currentUser.isVerified && (
                <p className="text-[12px] sm:text-[13px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {currentUser.verificationMethod === 'email'
                      ? t.verifiedViaEmail
                      : t.verifiedViaId}
                  </span>
                </p>
              )}
            </div>
          </div>

          {!currentUser.isVerified && (
            <div className="shrink-0 sm:self-center">
              <button
                type="button"
                onClick={() => setIsVerificationModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.verifyNowBtn}</span>
              </button>
            </div>
          )}

        </div>

        {/* CareerFoundry Progress Bar: Student Verification & Profile Strength */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <ProgressBar
            value={currentUser.isVerified ? 100 : 65}
            max={100}
            variant={currentUser.isVerified ? 'emerald' : 'amber'}
            size="sm"
            showPercentage={true}
            label={language === 'sw' ? 'Nguvu ya Wasifu & Uthibitisho' : 'Profile Strength & Verification Meter'}
            sublabel={
              currentUser.isVerified
                ? (language === 'sw' ? 'Uthibitisho Umekamilika 100%' : '100% Student Verified')
                : (language === 'sw' ? 'Kitambulisho kinasubiriwa (+35%)' : 'Student ID pending (+35%)')
            }
          />
        </div>

        {/* Benefits Checklist */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px] sm:text-[13px]">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.verifiedPerk1}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.verifiedPerk2}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.verifiedPerk3}</span>
          </div>
        </div>
      </div>

      {/* PROHIBITED ITEMS POLICY & COMMUNITY SAFETY CARD */}
      <div className="rounded-3xl border border-red-200/80 dark:border-red-900/50 p-4 sm:p-5 bg-linear-to-r from-red-500/5 via-amber-500/5 to-transparent dark:from-red-950/20 dark:via-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[16px] sm:text-[18px] font-semibold text-slate-900 dark:text-white">
              {language === 'sw' ? 'Sera ya Bidhaa Zilizopigwa Marufuku Chuoni' : 'Campus Prohibited Items & Safety Policy'}
            </h4>
            <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Jukwaa hili haliruhusu silaha, dawa za kulevya, mitihani iliyovuja ya NECTA/chuo, au huduma za kuandikiwa dissertation.'
                : 'Zero tolerance for weapons, narcotics, exam leaks, and dissertation ghostwriting.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openProhibitedPolicyModal}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-[14px] font-semibold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>{language === 'sw' ? 'Soma Sera Kamili' : 'Read Full Policy'}</span>
        </button>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.editProfile}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {currentUniversity.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label={t.closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Campus Area / Hostel */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.campusZoneLabel}</span>
                </label>
                <select
                  value={editCampusZone}
                  onChange={(e) => setEditCampusZone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                >
                  {currentUniversity.zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Selector & Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  {t.avatarTitle}
                </label>
                
                {/* Current Avatar preview */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <img
                    src={getSafeAvatarUrl(editAvatarUrl, currentUser.fullName)}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover bg-slate-200 border-2 border-emerald-500/40"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                      {language === 'sw' ? 'Picha Iliyochaguliwa' : 'Selected Avatar'}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {t.changePhotoDesc}
                    </p>
                  </div>
                </div>

                {/* Preset Options */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {t.choosePresetAvatar}:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {PRESET_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatarUrl(avatar)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 shrink-0 transition-transform active:scale-95 ${
                          editAvatarUrl === avatar
                            ? 'border-emerald-500 scale-105 shadow-xs'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={avatar} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Custom Photo Input */}
                <div className="pt-1">
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 cursor-pointer text-slate-600 dark:text-slate-300 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-[11px]">
                      {isUploadingPhoto
                        ? (language === 'sw' ? 'Inaboresha picha...' : 'Optimizing photo...')
                        : t.uploadCustomPhoto}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingPhoto}
                      onChange={handleCustomPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Phone Visibility Toggle (Tanzania PDPA Compliance) */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.phoneVisibilitySection}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.phoneVisibilityDesc}
                    </p>
                  </div>

                  {/* Accessible switch toggle */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={editShowPhone}
                      onChange={(e) => setEditShowPhone(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="pt-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  {editShowPhone ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.showPhonePubliclyLabel}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t.hidePhonePubliclyLabel}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{t.phonePrivacyGuaranteed}</span>
                </div>
              </div>

              {/* Save / Cancel buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancelEdit}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.saveProfileChanges}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating Rounded Navigation Pill Dock with Customized Colored Shadows */}
      <div className="p-1.5 rounded-full bg-slate-100/90 dark:bg-slate-850/90 border border-slate-200/80 dark:border-slate-700/80 shadow-md shadow-slate-900/5 flex flex-wrap items-center gap-1 sm:gap-1.5 text-[13px] sm:text-[14px] font-semibold backdrop-blur-md">
        <button
          type="button"
          onClick={() => setProfileTab('listings')}
          className={`min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus} shrink-0 cursor-pointer ${
            activeTab === 'listings'
              ? `bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold shadow-md ${colorTheme.tabGlowShadow} -translate-y-0.5 scale-[1.02]`
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.myListings.replace('{count}', String(myListings.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setProfileTab('saved')}
          className={`min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus} shrink-0 cursor-pointer ${
            activeTab === 'saved'
              ? `bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold shadow-md shadow-red-500/30 -translate-y-0.5 scale-[1.02]`
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'saved' ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{t.savedListings.replace('{count}', String(mySaved.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setProfileTab('reviews')}
          className={`min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus} shrink-0 cursor-pointer ${
            activeTab === 'reviews'
              ? `bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold shadow-md shadow-amber-500/30 -translate-y-0.5 scale-[1.02]`
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.myReviews.replace('{count}', String(myReviews.length))}</span>
        </button>

        <button
          type="button"
          onClick={() => setProfileTab('notifications')}
          className={`min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus} shrink-0 cursor-pointer ${
            activeTab === 'notifications'
              ? `bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold shadow-md ${colorTheme.tabGlowShadow} -translate-y-0.5 scale-[1.02]`
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t.notificationsTitle}</span>
          {unreadNotificationsCount > 0 && (
            <span className={`w-4 h-4 rounded-full ${colorTheme.badgeActive} text-[11px] font-bold flex items-center justify-center`}>
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setProfileTab('appearance')}
          className={`min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus} shrink-0 cursor-pointer ${
            activeTab === 'appearance'
              ? `bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold shadow-md shadow-purple-500/30 -translate-y-0.5 scale-[1.02]`
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{language === 'sw' ? 'Rangi & Mwonekano' : 'Color & Theme'}</span>
        </button>

        <button
          type="button"
          onClick={() => setProfileTab('version')}
          className={`min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus} shrink-0 cursor-pointer ${
            activeTab === 'version'
              ? `bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-bold shadow-md shadow-emerald-500/30 -translate-y-0.5 scale-[1.02]`
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>{language === 'sw' ? 'Toleo & Maboresho' : 'Version & Updates'}</span>
        </button>
      </div>

      {/* TAB 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          {myListings.length > 0 ? (
            myListings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getSafeListingImageUrl(item.images?.[0])}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-[14px] sm:text-[15px] font-medium text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[16px] sm:text-[18px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatTZS(item.price)}
                    </span>
                    <span className="text-slate-400 block text-[12px] font-normal">
                      {item.campusZone} · {item.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => markListingStatus(item.id, 'sold')}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[14px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                    >
                      {t.markAsSold}
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[12px] font-medium uppercase">
                      {item.status}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteListing(item.id)}
                    className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                    title={t.deleteListing}
                    aria-label={`${t.deleteListing}: ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[16px] sm:text-[18px] font-semibold text-slate-900 dark:text-white">
                  {language === 'sw' ? 'Bado haujaweka tangazo lolote' : 'No listings posted yet'}
                </h4>
                <p className="text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'sw'
                    ? 'Uza vitu au huduma zako kwa wanafunzi wenzako chuoni bila ada yoyote.'
                    : 'Sell your items or services to fellow students on campus with zero fees.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateListingOpen(true)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-semibold transition-all shadow-xs"
              >
                {t.navSell}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Saved Wishlist */}
      {activeTab === 'saved' && (
        mySaved.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {mySaved.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.noSavedItems}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'sw'
                  ? 'Gonga alama ya moyo kwenye tangazo lolote sokoni kulihifadhi hapa.'
                  : 'Tap the heart icon on any marketplace item to bookmark it here for later.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs"
            >
              {language === 'sw' ? 'Tazama Vitu Sokoni' : 'Browse Marketplace'}
            </button>
          </div>
        )
      )}

      {/* TAB 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {myReviews.length > 0 ? (
            myReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {rev.reviewerName}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating} / 5</span>
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-slate-400 block">
                  {rev.listingTitle} · {rev.createdAt}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Bado hujapata maoni ya miamala' : 'No peer reviews yet'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'sw'
                  ? 'Wanafunzi unaonunua au kuwauzia vitu watatoa tathmini na maoni yao hapa baada ya makabidhiano.'
                  : 'Students you trade with will leave verified ratings and reviews here after completed exchanges.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Notifications & Opt-Out Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Action Card */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{t.notificationsTitle}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                      {unreadNotificationsCount} {language === 'sw' ? 'mpya' : 'new'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {t.notificationsSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsNotificationCenterOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#00b53f] hover:bg-[#009c36] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>{language === 'sw' ? 'Tazama Taarifa Zote' : 'View In-App Alerts'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNotificationSettingsOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>{language === 'sw' ? 'Mipangilio ya Simu' : 'Device Settings'}</span>
              </button>
            </div>
          </div>

          {/* Direct Push (FCM) Card */}
          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-linear-to-r from-emerald-500/5 via-amber-500/5 to-transparent dark:from-emerald-950/20 dark:via-amber-950/10 space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.fcmPushTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t.fcmPushDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={requestPushPermission}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>{t.enablePushBtn}</span>
              </button>
            </div>
          </div>

          {/* Opt-Out Category Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'sw' ? 'Chagua taarifa unazotaka au jitoe (Opt-Out)' : 'Category Opt-In / Opt-Out Controls'}
            </h4>

            {/* 1. Messages */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {t.optNotifyMessages}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t.optNotifyMessagesDesc}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notificationPreferences.notifyNewMessages}
                  onChange={() => updateNotificationPreferences({ notifyNewMessages: !notificationPreferences.notifyNewMessages })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* 2. Price Drops */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {t.optNotifyPriceDrops}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t.optNotifyPriceDropsDesc}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notificationPreferences.notifyPriceDrops}
                  onChange={() => updateNotificationPreferences({ notifyPriceDrops: !notificationPreferences.notifyPriceDrops })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* 3. Sold Items */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {t.optNotifySold}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t.optNotifySoldDesc}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notificationPreferences.notifyListingSold}
                  onChange={() => updateNotificationPreferences({ notifyListingSold: !notificationPreferences.notifyListingSold })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* 4. Campus Safety Bulletins */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {t.optNotifySafety}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t.optNotifySafetyDesc}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notificationPreferences.notifySafetyAlerts}
                  onChange={() => updateNotificationPreferences({ notifySafetyAlerts: !notificationPreferences.notifySafetyAlerts })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* 5. Device Push Opt-Out */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Washa/Zima Taarifa za Push kwenye kifaa hiki' : 'Enable device push alerts'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {language === 'sw'
                      ? 'Ukizima hapa, hakuna taarifa yoyote itakayotokea kwenye simu au desktop yako.'
                      : 'Opt out of all device-level push banners across this browser.'}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={notificationPreferences.enablePushNotifications}
                  onChange={() => updateNotificationPreferences({ enablePushNotifications: !notificationPreferences.enablePushNotifications })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Tester Simulation Controls */}
          <div className="p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Jaribu Taarifa za Moja kwa Moja (Interactive Tester)' : 'Test Real-Time Notifications'}
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'sw'
                ? 'Bofya vitufe vifuatavyo kutuma taarifa za majaribio na kuona jinsi zinavyoonekana:'
                : 'Click any trigger below to test simulated push alerts and observe real-time in-app delivery:'}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => triggerTestNotification('new_message')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Tuma Ujumbe wa Majaribio' : 'Test New Message'}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerTestNotification('price_drop')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Tuma Punguzo la Bei' : 'Test Price Drop'}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerTestNotification('listing_sold')}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Tuma Bidhaa Imeuzwa' : 'Test Item Sold'}</span>
              </button>
            </div>
          </div>

          {/* Privacy statement */}
          <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'sw'
                ? 'Data yako inalindwa chini ya Sheria ya Ulinzi wa Taarifa Binafsi (PDPA). Namba yako ya simu haitolewi bila ridhaa yako.'
                : 'Protected under Tanzania Personal Data Protection Act (PDPA). Your mobile credentials are never exposed without explicit consent.'}
            </span>
          </div>

        </div>
      )}

      {/* TAB 5: Appearance & User Color Preference */}
      {activeTab === 'appearance' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <ColorPreferencePicker variant="card" />
        </div>
      )}

      {/* TAB 6: Version & Feature Amendments */}
      {activeTab === 'version' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Version Header Card */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    CampusSoko Web App & Link Sync
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] tabular-nums">
                    v{APP_CURRENT_VERSION}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {language === 'sw'
                    ? 'Programu imeunganishwa moja kwa moja na kiungo https://campussoko-tanzanian-campus-marketplace.ai.studio. Maboresho mapya ya vipengele yatakupa taarifa ya kupakia upya kivinjari.'
                    : 'The app is dynamically synchronized with https://campussoko-tanzanian-campus-marketplace.ai.studio. Any published feature amendments prompt you to refresh browser for instant updates.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                  <span className="font-mono">{APP_BUILD_ID}</span>
                  <span>·</span>
                  <span>PWA & Browser Sync Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={isCheckingVersion}
                onClick={async () => {
                  setIsCheckingVersion(true);
                  setVersionStatusMessage(null);
                  try {
                    const result = await AppUpdateService.checkServerForUpdates();
                    if (result.hasUpdate) {
                      setVersionStatusMessage(
                        language === 'sw'
                          ? 'Toleo jipya lipo tayari! Bofya "Pakia Upya Kivinjari" hapa chini.'
                          : 'New amendment ready! Click "Refresh Browser Now" below.'
                      );
                      showToast(
                        language === 'sw'
                          ? 'Maboresho mapya yamepatikana! Pakia upya ukurasa.'
                          : 'New feature amendment detected! Refresh browser.',
                        'info'
                      );
                    } else {
                      setVersionStatusMessage(
                        language === 'sw'
                          ? 'Unatumia toleo jipya zaidi! Hakuna maboresho mapya kwa sasa.'
                          : 'You are running the latest version! No pending updates.'
                      );
                      showToast(
                        language === 'sw'
                          ? 'Uko kwenye toleo jipya zaidi.'
                          : 'You are on the latest version.',
                        'success'
                      );
                    }
                  } catch {
                    setVersionStatusMessage(
                      language === 'sw' ? 'Hitilafu ya kukagua toleo' : 'Version check failed'
                    );
                  } finally {
                    setIsCheckingVersion(false);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingVersion ? 'animate-spin' : ''}`} />
                <span>{isCheckingVersion ? t.updateChecking : t.updateCheckNowBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  AppUpdateService.refreshApp();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'sw' ? 'Pakia Upya Sasa' : 'Force Refresh Now'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Tester Card */}
          <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-linear-to-r from-amber-500/10 via-emerald-500/5 to-transparent space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Jaribu Arifa ya Maboresho (Interactive Simulation)' : 'Simulate Feature Amendment Notification'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {language === 'sw'
                      ? 'Bofya kitufe hiki kujaribu jinsi arifa ya maboresho inavyojitokeza kiotomatiki kwa mtu anayetumia kiungo, na jinsi kivinjari kinavyopakia upya toleo la sasa.'
                      : 'Click this button to simulate how the app feature amendment prompt automatically alerts anyone accessing via link and asks them to refresh.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  AppUpdateService.simulateUpdateAmendment();
                  showToast(
                    language === 'sw'
                      ? 'Arifa ya maboresho imezinduliwa! Angalia kidirisha cha chini.'
                      : 'Feature amendment simulated! Look at bottom prompt.',
                    'info'
                  );
                  // Trigger reload check
                  window.dispatchEvent(new Event('focus'));
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.updateSimulateBtn}</span>
              </button>
            </div>

            {versionStatusMessage && (
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{versionStatusMessage}</span>
              </div>
            )}
          </div>

          {/* System Amendments Changelog History */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.updateChangelogTitle}
              </h4>
            </div>

            {/* Amendment 1 */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
                    v1.3.4 (Toleo la Sasa)
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Upatanishi wa Menyu ya Juu & Uteuzi wa Wajibu wa Akaunti' : 'Top App Bar Layout & Account Role Routing Amendment'}
                  </h5>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Leo, 2026-10-25</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {language === 'sw'
                  ? 'Vitufe vyote vya menyu ya juu sasa vinakaa kwenye safu moja bila kufichika au kupitiliza upana wa ukurasa. Wanafunzi sasa wanachagua wajibu wa Mnunuzi au Muuzaji wanapojiandikisha na kuelekezwa kwenye miingiliano husika moja kwa moja.'
                  : 'All app bar icons fit on a single row without displacement or overflow across all mobile screens. Role declaration during registration routes buyers and sellers directly to their respective interface.'}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Vitufe vyote 7 vya app bar vipo safu moja</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Uteuzi wa Mnunuzi / Muuzaji wakati wa kujiunga</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kuzuia maandishi kuvuka kingo za ukurasa</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Arifa ya kupakia upya kivinjari kupata toleo jipya</span>
                </li>
              </ul>
            </div>

            {/* Amendment 2 */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
                    v1.3.3
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Maboresho ya Ufungashaji wa Maandishi kwenye Dashibodi ya Wauzaji' : 'Seller Studio Text Overflow Containment'}
                  </h5>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">2026-10-25</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {language === 'sw'
                  ? 'Kuweka mipaka maalum ya maandishi kwenye kurasa za usimamizi wa bidhaa na maulizo ya wanunuzi ili maandishi yasipitishe ukingo wa ukurasa.'
                  : 'Added word containment rules to ensure all titles and incoming inquiries remain strictly within device boundaries.'}
              </p>
            </div>

            {/* Amendment 3 */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
                    v1.3.0
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Arifa za Push (FCM) & Sera ya Bidhaa Zilizopigwa Marufuku' : 'FCM Push Notifications & Prohibited Items Policy'}
                  </h5>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">2026-10-24</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {language === 'sw'
                  ? 'Ujumuishaji wa huduma ya Firebase Cloud Messaging na udhibiti wa maneno yaliyopigwa marufuku kwa mujibu wa sheria za vyuo vikuu na nchi.'
                  : 'FCM push notifications integration and automated server prohibited keyword moderation engine.'}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
