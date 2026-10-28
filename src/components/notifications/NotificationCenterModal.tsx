import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import { NotificationType } from '../../types';
import {
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  PackageCheck,
  Settings,
  ShieldAlert,
  Send,
  Tag,
  Trash2,
  TrendingDown,
  X,
} from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const {
    language,
    t,
    notifications,
    unreadNotificationsCount,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    setIsNotificationSettingsOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    deleteNotification,
    triggerTestNotification,
    setActiveListingDetail,
    listings,
    conversations,
    setActiveConversation,
    setActiveTab,
    setRoleView,
    setIsSafetyModalOpen,
  } = useCampusSoko();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'messages' | 'price_drops' | 'sold'>('all');

  if (!isNotificationCenterOpen) return null;

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'messages') return notif.type === 'new_message';
    if (activeFilter === 'price_drops') return notif.type === 'price_drop';
    if (activeFilter === 'sold') return notif.type === 'listing_sold';
    return true;
  });

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);

    // Deep link action depending on notification type
    if (notif.type === 'new_message') {
      if (notif.data?.conversationId) {
        const conv = conversations.find((c) => c.id === notif.data?.conversationId);
        if (conv) {
          setActiveConversation(conv);
        }
      }
      setRoleView('buyer');
      setActiveTab('chats');
      setIsNotificationCenterOpen(false);
    } else if ((notif.type === 'price_drop' || notif.type === 'listing_sold') && notif.data?.listingId) {
      const listing = listings.find((l) => l.id === notif.data?.listingId);
      if (listing) {
        setActiveListingDetail(listing);
        setIsNotificationCenterOpen(false);
      } else {
        // Switch to market view
        setRoleView('buyer');
        setActiveTab('market');
        setIsNotificationCenterOpen(false);
      }
    } else if (notif.type === 'safety_alert') {
      setIsNotificationCenterOpen(false);
      setIsSafetyModalOpen(true);
    } else {
      setRoleView('buyer');
      setActiveTab('market');
      setIsNotificationCenterOpen(false);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_message':
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      case 'price_drop':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingDown className="w-5 h-5 stroke-[2.5]" />
          </div>
        );
      case 'listing_sold':
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
            <PackageCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'safety_alert':
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-emerald-500/10 via-amber-500/5 to-transparent flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00b53f] text-white flex items-center justify-center shadow-sm relative shrink-0">
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {t.notificationsTitle}
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    {unreadNotificationsCount} {language === 'sw' ? 'mpya' : 'new'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {t.notificationsSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setIsNotificationCenterOpen(false);
                setIsNotificationSettingsOpen(true);
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.notificationSettingsTitle}
              aria-label={t.notificationSettingsTitle}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsNotificationCenterOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Strip & Action Buttons */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t.notificationsAll} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t.notificationsUnread} ({unreadNotificationsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('messages')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'messages'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t.notificationsMessages}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('price_drops')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'price_drops'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t.notificationsPriceDrops}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('sold')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'sold'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t.notificationsSold}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t.markAllNotificationsRead}</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                title={t.clearAllNotifications}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notification List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t.noNotificationsTitle}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  {t.noNotificationsDesc}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const title = language === 'sw' ? notif.titleSw : notif.titleEn;
              const body = language === 'sw' ? notif.bodySw : notif.bodyEn;

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`pt-2.5 first:pt-0 group relative p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                    !notif.read
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Leading Icon */}
                  {getNotificationIcon(notif.type)}

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                          !notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {notif.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {body}
                    </p>

                    {/* Price Drop Highlight Pill */}
                    {notif.type === 'price_drop' && notif.data?.oldPrice && notif.data?.newPrice && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="line-through text-slate-400">
                          {formatTZS(notif.data.oldPrice)}
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          {formatTZS(notif.data.newPrice)}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-amber-100/70 dark:bg-amber-950/70 px-2 py-0.5 rounded-lg">
                          -{Math.round(((notif.data.oldPrice - notif.data.newPrice) / notif.data.oldPrice) * 100)}% {language === 'sw' ? 'Punguzo' : 'OFF'}
                        </span>
                      </div>
                    )}

                    {/* Quick navigation hint */}
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
                      <span>
                        {notif.type === 'new_message'
                          ? (language === 'sw' ? 'Bofya kujibu ujumbe huu' : 'Tap to open chat')
                          : (language === 'sw' ? 'Bofya kuona tangazo' : 'Tap to view item')}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Actions / Unread dot / Delete */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs ring-2 ring-white dark:ring-slate-900" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      title="Futa taarifa / Delete"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Quick Notification Simulator & Settings Shortcut */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'sw' ? 'Jaribu Taarifa:' : 'Test Notifications:'}</span>
            </span>

            <button
              type="button"
              onClick={() => triggerTestNotification('new_message')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{language === 'sw' ? '+ Ujumbe' : '+ Message'}</span>
            </button>

            <button
              type="button"
              onClick={() => triggerTestNotification('price_drop')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <TrendingDown className="w-3 h-3" />
              <span>{language === 'sw' ? '+ Punguzo la Bei' : '+ Price Drop'}</span>
            </button>

            <button
              type="button"
              onClick={() => triggerTestNotification('listing_sold')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <PackageCheck className="w-3 h-3" />
              <span>{language === 'sw' ? '+ Imeuzwa' : '+ Item Sold'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsNotificationCenterOpen(false);
              setIsNotificationSettingsOpen(true);
            }}
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.notificationSettingsTitle}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
