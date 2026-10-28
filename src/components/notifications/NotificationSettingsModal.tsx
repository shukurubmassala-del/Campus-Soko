import React, { useState, useEffect } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  getPushPermissionStatus,
  isPushNotificationSupported,
} from '../../services/fcm';
import { StorageService } from '../../services/storage';
import {
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  Lock,
  MessageSquare,
  PackageCheck,
  Radio,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Smartphone,
  TrendingDown,
  X,
} from 'lucide-react';

export const NotificationSettingsModal: React.FC = () => {
  const {
    language,
    t,
    isNotificationSettingsOpen,
    setIsNotificationSettingsOpen,
    setIsNotificationCenterOpen,
    notificationPreferences,
    updateNotificationPreferences,
    requestPushPermission,
    triggerTestNotification,
    showToast,
  } = useCampusSoko();

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [copiedToken, setCopiedToken] = useState(false);
  const [isRequestingPush, setIsRequestingPush] = useState(false);

  useEffect(() => {
    if (isNotificationSettingsOpen) {
      setPermissionStatus(getPushPermissionStatus());
    }
  }, [isNotificationSettingsOpen]);

  if (!isNotificationSettingsOpen) return null;

  const fcmToken = StorageService.getFcmToken();

  const handleToggle = (key: keyof typeof notificationPreferences) => {
    const updated = !notificationPreferences[key];
    updateNotificationPreferences({ [key]: updated });
  };

  const handleEnablePush = async () => {
    setIsRequestingPush(true);
    try {
      const granted = await requestPushPermission();
      setPermissionStatus(getPushPermissionStatus());
      if (granted) {
        showToast(language === 'sw' ? 'Taarifa za Push zimewashwa kikamilifu!' : 'Push Notifications enabled!');
      }
    } finally {
      setIsRequestingPush(false);
    }
  };

  const handleCopyToken = () => {
    if (!fcmToken) return;
    navigator.clipboard.writeText(fcmToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
    showToast(language === 'sw' ? 'Token ya FCM imenakiliwa!' : 'FCM token copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-emerald-500/10 via-amber-500/5 to-transparent flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shadow-sm shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {t.notificationSettingsTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {t.notificationSettingsDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNotificationSettingsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* FCM Push Status Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : permissionStatus === 'denied'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{t.fcmPushTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        permissionStatus === 'granted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : permissionStatus === 'denied'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {permissionStatus === 'granted'
                        ? (language === 'sw' ? 'Imewashwa (Active)' : 'Active')
                        : permissionStatus === 'denied'
                        ? (language === 'sw' ? 'Imezuiwa (Blocked)' : 'Blocked')
                        : (language === 'sw' ? 'Haijaunganishwa' : 'Not Connected')}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t.fcmPushDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Permission Action Button */}
            {permissionStatus !== 'granted' ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleEnablePush}
                  disabled={isRequestingPush}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00b53f] hover:bg-[#009c36] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <Bell className="w-4 h-4" />
                  <span>{isRequestingPush ? (language === 'sw' ? 'Inaunganisha...' : 'Connecting...') : t.enablePushBtn}</span>
                </button>
                {permissionStatus === 'denied' && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-2 text-center">
                    {language === 'sw'
                      ? 'Taarifa zimezuiwa na kivinjari chako. Bofya alama ya kufuli (lock) kwenye anwani ya web ili kuruhusu taarifa.'
                      : 'Notifications are blocked by your browser. Click the lock icon in the address bar to permit notifications.'}
                  </p>
                )}
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono truncate max-w-[240px]">
                    {fcmToken ? `${fcmToken.substring(0, 18)}...` : 'FCM device token active'}
                  </span>
                </div>
                {fcmToken && (
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    title="Copy FCM token"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? (language === 'sw' ? 'Imenakiliwa' : 'Copied') : (language === 'sw' ? 'Nakili' : 'Copy')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Opt-Out Controls Category by Category */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'sw' ? 'Chagua taarifa unazotaka (Opt-In / Opt-Out)' : 'Notification Category Preferences'}
            </h4>

            {/* Toggle 1: New Messages */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
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
                  onChange={() => handleToggle('notifyNewMessages')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Toggle 2: Price Drops */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
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
                  onChange={() => handleToggle('notifyPriceDrops')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Toggle 3: Listing Sold */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
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
                  onChange={() => handleToggle('notifyListingSold')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Toggle 4: Safety & Moderation Bulletins */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
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
                  onChange={() => handleToggle('notifySafetyAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Toggle 5: Device Push Alerts */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-start justify-between gap-4">
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
                  onChange={() => handleToggle('enablePushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Test Push Button */}
          <div className="p-3.5 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.testPushBtn}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'sw'
                    ? 'Tuma taarifa ya majaribio kwenye kivinjari chako kuthibitisha ufanyaji kazi.'
                    : 'Dispatch a sample push alert to your browser to verify delivery.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerTestNotification('new_message')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Jaribu Sasa' : 'Send Test'}</span>
            </button>
          </div>

          {/* Privacy & Legal Guarantee (Tanzania PDPA) */}
          <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{language === 'sw' ? 'Ulinzi wa Data & Sheria ya Faragha (Tanzania PDPA)' : 'Data Protection & Privacy Notice (PDPA)'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'sw'
                ? 'Namba yako ya simu haitolewi au kushirikiwa na mitandao ya matangazo. Taarifa zote hutumwa kupitia njia salama ya Firebase Cloud Messaging na una haki ya kujitoa (opt-out) wakati wowote.'
                : 'Your phone number and student credentials are never shared with advertising networks. Push alerts use encrypted FCM tokens and you have the statutory right to opt out at any time.'}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setIsNotificationSettingsOpen(false);
              setIsNotificationCenterOpen(true);
            }}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{t.notificationsTitle}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsNotificationSettingsOpen(false);
              showToast(t.notificationPrefsSaved);
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm hover:scale-102 active:scale-98 cursor-pointer"
          >
            {language === 'sw' ? 'Nimemaliza' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
