import React, { useState, useEffect, useCallback } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { AppUpdateService, APP_CURRENT_VERSION } from '../../services/appUpdateService';
import { AppAmendment, AppVersionInfo } from '../../types';
import {
  RefreshCw,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Smartphone,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface AppUpdatePromptProps {
  // Allow manual inspection or modal trigger
  forceOpen?: boolean;
  onClose?: () => void;
}

export const AppUpdatePrompt: React.FC<AppUpdatePromptProps> = ({
  forceOpen,
  onClose,
}) => {
  const { language, t, showToast, colorTheme } = useCampusSoko();

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [activeAmendment, setActiveAmendment] = useState<AppAmendment | null>(null);
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isCheckingManually, setIsCheckingManually] = useState(false);

  // Check for updates
  const checkForUpdates = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsCheckingManually(true);
    }
    try {
      const result = await AppUpdateService.checkServerForUpdates();
      setLastChecked(new Date());

      if (result.hasUpdate && result.amendment) {
        setIsUpdateAvailable(true);
        setActiveAmendment(result.amendment);
        setVersionInfo(result.versionInfo || null);

        // If not dismissed before, show prompt
        const dismissed = AppUpdateService.isAmendmentDismissed(result.amendment.id);
        if (!dismissed) {
          setIsDismissed(false);
        }

        if (isManual) {
          showToast(
            language === 'sw'
              ? 'Maboresho mapya yamepatikana! Pakia upya kivinjari.'
              : 'New feature amendment detected! Refresh browser to apply.',
            'info'
          );
        }
      } else {
        if (isManual) {
          showToast(
            language === 'sw'
              ? 'Uko kwenye toleo jipya zaidi! Hakuna maboresho mapya.'
              : 'You are using the latest version of CampusSoko.',
            'success'
          );
        }
      }
    } catch (err) {
      console.warn('Version check error:', err);
    } finally {
      if (isManual) {
        setIsCheckingManually(false);
      }
    }
  }, [language, showToast]);

  // Initial check on mount
  useEffect(() => {
    // Run initial check
    checkForUpdates();

    // Check periodically every 50 seconds
    const interval = setInterval(() => {
      checkForUpdates();
    }, 50000);

    // Check whenever tab regains focus or visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    // Check when network comes online
    const handleOnline = () => {
      checkForUpdates();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [checkForUpdates]);

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    showToast(
      language === 'sw' ? t.updateRefreshing : 'Loading updated version...',
      'info'
    );
    // Execute browser cache purge and reload
    setTimeout(() => {
      AppUpdateService.refreshApp();
    }, 400);
  };

  // Handle dismiss
  const handleDismiss = () => {
    if (activeAmendment) {
      AppUpdateService.dismissAmendment(activeAmendment.id);
    }
    setIsDismissed(true);
    if (onClose) {
      onClose();
    }
  };

  // Handle reopen from persistent pill
  const handleReopen = () => {
    setIsDismissed(false);
    setIsExpanded(true);
  };

  // Don't render anything if no update and not forced
  if (!isUpdateAvailable && !forceOpen) {
    return null;
  }

  // If user dismissed, show a subtle floating reminder pill
  if (isDismissed && !forceOpen) {
    return (
      <aside aria-label={language === 'sw' ? 'Arifa ya toleo jipya' : 'New version alert'} className="fixed bottom-20 md:bottom-6 left-4 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <button
          type="button"
          onClick={handleReopen}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/50 dark:ring-slate-900"
          title={language === 'sw' ? 'Toleo jipya lipo tayari — Bofya kupakia upya' : 'New version available — Click to refresh'}
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{language === 'sw' ? 'Toleo Jipya (Pakia Upya)' : 'Update Available (Refresh)'}</span>
        </button>
      </aside>
    );
  }

  const amendmentTitle = language === 'sw'
    ? activeAmendment?.titleSw || t.updateAvailableTitle
    : activeAmendment?.titleEn || t.updateAvailableTitle;

  const amendmentDesc = language === 'sw'
    ? activeAmendment?.descriptionSw || t.updateAvailableSubtitle
    : activeAmendment?.descriptionEn || t.updateAvailableSubtitle;

  const highlights = language === 'sw'
    ? activeAmendment?.highlightsSw || []
    : activeAmendment?.highlightsEn || [];

  return (
    <aside aria-label={language === 'sw' ? 'Kidirisha cha toleo jipya' : 'App version update dialog'} className="fixed inset-x-3 bottom-20 md:bottom-6 md:left-auto md:right-6 md:max-w-md z-60 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500 shadow-2xl p-4 sm:p-5 text-slate-900 dark:text-white space-y-3 relative overflow-hidden backdrop-blur-md">
        
        {/* Decorative subtle ambient header glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500" />

        {/* Top Header Row with Icon and Close Button */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                  {language === 'sw' ? 'Maboresho Mapya' : 'New Amendment'}
                </span>
                <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                  v{activeAmendment?.version || APP_CURRENT_VERSION}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">
                {t.updateAvailableTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.updateLaterBtn}
            aria-label={t.updateLaterBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Explanation */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {t.updatePromptInstruction}
        </p>

        {/* Amendment Description & Highlights Container */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 p-3 space-y-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>{amendmentTitle}</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            )}
          </button>

          {isExpanded && (
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2 animate-in fade-in duration-150">
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                {amendmentDesc}
              </p>

              {highlights.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.updateHighlightsTitle}
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700">
                <span>{t.updateCurrentVersion}: v{APP_CURRENT_VERSION}</span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-slate-400" />
                  <span>PWA & Browser Ready</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isRefreshing}
            onClick={handleRefresh}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t.updateRefreshing : t.updateRefreshBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-3 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t.updateLaterBtn}
          </button>
        </div>

      </div>
    </aside>
  );
};
