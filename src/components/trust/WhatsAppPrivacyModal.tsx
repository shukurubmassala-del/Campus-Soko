import React from 'react';
import { Listing } from '../../types';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { generateWhatsAppUrl } from '../../services/whatsapp';
import { Lock, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

interface WhatsAppPrivacyModalProps {
  listing: Listing;
  onClose: () => void;
}

export const WhatsAppPrivacyModal: React.FC<WhatsAppPrivacyModalProps> = ({
  listing,
  onClose,
}) => {
  const { language, t, currentUser } = useCampusSoko();

  const whatsappUrl = generateWhatsAppUrl(
    listing.sellerPhone,
    listing,
    currentUser?.fullName || (language === 'sw' ? 'Mwanafunzi' : 'Student'),
    language
  );

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BackHomeButton variant="compact" onClick={onClose} />
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hidden sm:flex shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {t.whatsappModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 shrink-0"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PDPA Privacy Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'sw' ? 'Ulinzi wa Taarifa (PDPA Tanzania)' : 'Data Privacy Protection'}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.whatsappDisclaimer}
          </p>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {language === 'sw' ? 'Hakikisho la Ujumbe Utakaotuma' : 'Pre-Filled Message Preview'}
          </span>
          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 italic">
            "{language === 'sw'
              ? `Habari! Naitwa ${currentUser?.fullName || 'Mwanafunzi'}, nimeona tangazo lako kwenye CampusSoko la "${listing.title}" kwa TZS ${listing.price.toLocaleString('en-US')}. Je bado kipo? Tunaweza kukutana ${listing.safePickupPoint}?`
              : `Hello! My name is ${currentUser?.fullName || 'Student'}, I found your listing on CampusSoko for "${listing.title}" priced at TZS ${listing.price.toLocaleString('en-US')}. Is it still available? Can we meet at ${listing.safePickupPoint}?`}"
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {t.cancel}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.proceedToWhatsApp}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
