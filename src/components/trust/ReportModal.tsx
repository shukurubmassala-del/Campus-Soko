import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { ReportReason } from '../../types';
import { checkProhibitedContent } from '../../data/prohibitedKeywords';
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle2,
  FileQuestion,
  GraduationCap,
  HelpCircle,
  Lock,
  Scale,
  Shield,
  ShieldAlert,
  X,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

export const ReportModal: React.FC = () => {
  const {
    language,
    t,
    isReportModalOpen,
    closeReportModal,
    reportTarget,
    submitReport,
    blockUser,
    showToast,
    openProhibitedPolicyModal,
  } = useCampusSoko();

  const [reason, setReason] = useState<ReportReason>('prohibited_item');
  const [notes, setNotes] = useState('');
  const [shouldBlockUser, setShouldBlockUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReportModalOpen || !reportTarget) return null;

  // Real-time automated screener of notes to detect critical items
  const autoScreen = checkProhibitedContent(notes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      showToast(
        language === 'sw'
          ? 'Tafadhali toa maelezo mafupi kusaidia wasimamizi wa chuo'
          : 'Please provide brief details to assist campus moderators',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    // If student opted to block user
    if (shouldBlockUser && reportTarget.sellerId) {
      blockUser(reportTarget.sellerId);
    }

    submitReport(
      reportTarget.type,
      reportTarget.id,
      reportTarget.title,
      reason,
      notes.trim(),
      {
        autoDetectedViolation: autoScreen.isProhibited,
        matchedKeywords: autoScreen.matchedRules.map((r) => r.term),
        severity: autoScreen.severity || (reason === 'prohibited_item' || reason === 'exam_cheating' ? 'critical' : 'high'),
      }
    );

    setIsSubmitting(false);
  };

  const reasonOptions: {
    value: ReportReason;
    titleSw: string;
    titleEn: string;
    descSw: string;
    descEn: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      value: 'prohibited_item',
      titleSw: 'Silaha, vilipuzi, au dawa za kulevya',
      titleEn: 'Weapons, explosives, or illicit drugs',
      descSw: 'Bunduki, bastola, risasi, visu vya kivita, bangi, mirungi, au kemikali hatari.',
      descEn: 'Firearms, handguns, ammunition, combat blades, cannabis, khat, or hazardous items.',
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
      color: 'border-red-500/30',
    },
    {
      value: 'exam_cheating',
      titleSw: 'Mitihani iliyovuja, dissertation feki, au vyeti feki',
      titleEn: 'Exam leaks, ghostwriting, or fake degrees',
      descSw: 'Kuvujisha mitihani ya chuo/NECTA, kuandikiwa tafiti kwa malipo, au kughushi vyeti.',
      descEn: 'Leaked exams, assignment/dissertation ghostwriting, or forged academic credentials.',
      icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-500/30',
    },
    {
      value: 'fraud',
      titleSw: 'Utapeli wa malipo au kuomba fedha za nauli kwanza',
      titleEn: 'Payment scam or fake deposit request',
      descSw: 'Muuzaji kuomba utume nauli kabla ya kukutana, au kupokea pesa bila kutoa mzigo.',
      descEn: 'Demanding advance bus fare/deposits before daylight meeting, or non-delivery scam.',
      icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
      color: 'border-orange-500/30',
    },
    {
      value: 'counterfeit',
      titleSw: 'Fedha bandia au laini za simu bila NIDA',
      titleEn: 'Counterfeit notes or unverified SIM cards',
      descSw: 'Noti feki za Kitanzania au fedha za kigeni, laini zilizosajiliwa kinyume cha TCRA.',
      descEn: 'Counterfeit currency, forged notes, or pre-registered SIMs violating TCRA.',
      icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
      color: 'border-yellow-500/30',
    },
    {
      value: 'stolen_goods',
      titleSw: 'Kifaa cha wizi chuoni au iCloud iliyofungwa',
      titleEn: 'Stolen campus property or iCloud locked device',
      descSw: 'Laptop au simu ya mwanafunzi iliyoibwa, huduma za kubadili IMEI au kuvunja iCloud.',
      descEn: 'Stolen student electronics, IMEI alteration, or stolen device bypass services.',
      icon: <Lock className="w-4 h-4 text-purple-600" />,
      color: 'border-purple-500/30',
    },
    {
      value: 'harassment',
      titleSw: 'Lugha chafu, vitisho au usumbufu chumbani',
      titleEn: 'Harassment, threats, or offensive conduct',
      descSw: 'Ujumbe wa matusi kwenye chat, vitisho, au kutaka huduma zisizofaa hosteli.',
      descEn: 'Abusive language, intimidation, extortion, or unsolicited explicit requests.',
      icon: <Ban className="w-4 h-4 text-rose-600" />,
      color: 'border-rose-500/30',
    },
    {
      value: 'impersonation',
      titleSw: 'Akaunti feki au kujifanya kiongozi wa chuo/serekali',
      titleEn: 'Fake student identity or staff impersonation',
      descSw: 'Kujifanya mwanafunzi aliyethibitishwa wakati si mwanafunzi au kujifanya afisa wa chuo.',
      descEn: 'Posing as a verified student or impersonating university faculty/wardens.',
      icon: <HelpCircle className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-500/30',
    },
    {
      value: 'other',
      titleSw: 'Sababu nyingine ya usalama wa jamii ya chuo',
      titleEn: 'Other campus community safety violation',
      descSw: 'Ukiukwaji mwingine wowote wa kanuni za chuo au usalama wa mwanafunzi.',
      descEn: 'Any other violation of campus statutes or peer safety norms.',
      icon: <Shield className="w-4 h-4 text-slate-600" />,
      color: 'border-slate-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BackHomeButton variant="compact" onClick={closeReportModal} />
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {t.reportModalTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {reportTarget.type === 'listing'
                  ? language === 'sw'
                    ? 'Ripoti ya Tangazo la Sokoni'
                    : 'Marketplace Listing Report'
                  : language === 'sw'
                  ? 'Ripoti ya Mtumiaji / Muuzaji'
                  : 'Student Seller Report'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeReportModal}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Badge */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {language === 'sw' ? 'Kitu au Mtu anayeripotiwa:' : 'Reported Item or User:'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">
              {reportTarget.title}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border text-slate-500 shrink-0">
            {reportTarget.type}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800 dark:text-slate-200">
              {t.reportReasonLabel} <span className="text-red-500">*</span>
            </label>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {reasonOptions.map((opt) => {
                const isSelected = reason === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setReason(opt.value)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-slate-900 dark:text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700/50 shrink-0 mt-0.5">
                      {opt.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-bold text-xs ${isSelected ? 'text-red-700 dark:text-red-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {language === 'sw' ? opt.titleSw : opt.titleEn}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {language === 'sw' ? opt.descSw : opt.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Notes Field */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-800 dark:text-slate-200">
              {t.reportNotesLabel} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === 'sw'
                  ? 'Eleza kwa kifupi kile ulichoona (mfano: "Alitaka nitume fedha ya nauli kwanza", "Anauza mitihani ya NECTA/chuo", au "Alinifuata inbox na vitisho")...'
                  : 'Provide specific facts or evidence (e.g. "Asked for deposit money before meeting", "Selling past exam leaks", or "Sent abusive messages in chat")...'
              }
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Live Screener Alert on Notes if contraband terms detected */}
          {autoScreen.isProhibited && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {language === 'sw'
                    ? `Kichungi kimetambua maneno ya ukiukwaji: "${autoScreen.matchedTerm}"`
                    : `Automated filter flagged critical keyword: "${autoScreen.matchedTerm}"`}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300">
                {language === 'sw'
                  ? 'Ripoti hii itapewa kipaumbele cha juu zaidi (Critical Priority) kwa ukaguzi wa haraka wa wasimamizi wa chuo.'
                  : 'This report will be automatically escalated as Critical Priority to campus security & moderators.'}
              </p>
            </div>
          )}

          {/* Block User Checkbox */}
          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={shouldBlockUser}
              onChange={(e) => setShouldBlockUser(e.target.checked)}
              className="mt-0.5 rounded-sm text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                {t.blockUserCheckboxLabel}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                {language === 'sw'
                  ? 'Mtumiaji huyu hataweza kukutumia tena ujumbe wala kuona namba yako.'
                  : 'This user will no longer be able to message you or view transaction prompts.'}
              </span>
            </div>
          </label>

          {/* Policy Link & Privacy Assurance */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <button
              type="button"
              onClick={() => {
                closeReportModal();
                if (openProhibitedPolicyModal) openProhibitedPolicyModal();
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t.prohibitedPolicyNav}</span>
            </button>

            <span className="text-[10px] text-slate-400 font-mono">
              PDPA Tanzania 2022
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeReportModal}
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-red-500"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSubmitting ? (language === 'sw' ? 'Inatuma...' : 'Submitting...') : t.submitReport}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
