import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  PROHIBITED_CATEGORIES_INFO,
  checkProhibitedContent,
  KeywordMatchResult,
} from '../../data/prohibitedKeywords';
import {
  AlertTriangle,
  Banknote,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Lock,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

interface ProhibitedItemsPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTestTerm?: string;
}

export const ProhibitedItemsPolicyModal: React.FC<ProhibitedItemsPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTestTerm = '',
}) => {
  const { language, openReportModal } = useCampusSoko();

  const [searchTest, setSearchTest] = useState(initialTestTerm);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  if (!isOpen) return null;

  const testResult: KeywordMatchResult = checkProhibitedContent(searchTest);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 shrink-0" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 shrink-0" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 shrink-0" />;
      case 'Banknote':
        return <Banknote className="w-5 h-5 shrink-0" />;
      case 'Lock':
        return <Lock className="w-5 h-5 shrink-0" />;
      default:
        return <Shield className="w-5 h-5 shrink-0" />;
    }
  };

  const filteredCategories =
    activeCategoryTab === 'all'
      ? PROHIBITED_CATEGORIES_INFO
      : PROHIBITED_CATEGORIES_INFO.filter((c) => c.id === activeCategoryTab);

  return (
    <div className="fixed inset-0 z-70 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BackHomeButton variant="compact" onClick={onClose} />
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {language === 'sw'
                  ? 'Sera ya Bidhaa Zilizopigwa Marufuku & Usalama Chuoni'
                  : 'Prohibited Items & Academic Integrity Policy'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {language === 'sw'
                  ? 'Miongozo ya kisheria na kanuni za vyuo vikuu vya Tanzania (TCU, NECTA, BoT & Penal Code)'
                  : 'Legal compliance and campus safety standards for Tanzanian universities'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0"
            aria-label="Funga sera / Close policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Quick Compliance Tester Widget */}
          <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-emerald-500/5 via-blue-500/5 to-amber-500/5 border border-emerald-500/20 dark:border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'sw'
                    ? 'Kikagua Maneno cha Kiotomatiki (Live Keyword Checker)'
                    : 'Automated Keyword Compliance Screener'}
                </h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                {language === 'sw' ? 'Ukaguzi wa papo kwa papo' : 'Real-time screener'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'sw'
                ? 'Weka neno au jina la bidhaa ili uone iwapo inaruhusiwa sokoni au inakiuka kanuni za chuo na sheria za nchi:'
                : 'Type any item title or keywords to test if it complies with campus policies and Tanzanian criminal statutes:'}
            </p>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTest}
                onChange={(e) => setSearchTest(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Jaribu kuandika: "HP EliteBook", "Scientific Calculator", "leak mtihani", "bangi", au "bunduki"...'
                    : 'Try typing: "HP EliteBook", "Scientific Calculator", "exam leak", "weed", or "gun"...'
                }
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {searchTest && (
                <button
                  type="button"
                  onClick={() => setSearchTest('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Test Results Display */}
            {searchTest.trim().length > 0 && (
              <div
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                  testResult.isProhibited
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800/80 text-red-900 dark:text-red-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {testResult.isProhibited ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      <span>
                        {language === 'sw'
                          ? `Marufuku! Neno "${testResult.matchedTerm}" limepigwa marufuku.`
                          : `Prohibited! Keyword "${testResult.matchedTerm}" is strictly banned.`}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        {language === 'sw'
                          ? 'Inakubalika: Hakuna neno lililopigwa marufuku lililogunduliwa.'
                          : 'Compliant: No prohibited terms or contraband indicators found.'}
                      </span>
                    </>
                  )}
                </div>

                {testResult.isProhibited && (
                  <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                    <p className="font-semibold text-red-700 dark:text-red-300">
                      {language === 'sw' ? testResult.reasonSw : testResult.reasonEn}
                    </p>
                    <p className="text-red-600/90 dark:text-red-400 font-mono text-[10px] flex items-center gap-1">
                      <Scale className="w-3 h-3 shrink-0" />
                      <span>{language === 'sw' ? testResult.legalContextSw : testResult.legalContextEn}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setActiveCategoryTab('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  activeCategoryTab === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {language === 'sw' ? 'Sera Zote (5)' : 'All Policies (5)'}
              </button>
              {PROHIBITED_CATEGORIES_INFO.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    activeCategoryTab === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {language === 'sw' ? cat.titleSw.split('&')[0] : cat.titleEn.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Pillars Breakdown */}
          <div className="space-y-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${cat.bgColor}`}>
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {language === 'sw' ? cat.titleSw : cat.titleEn}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {language === 'sw' ? cat.summarySw : cat.summaryEn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specific Rules List */}
                <div className="space-y-1.5 pt-1">
                  {(language === 'sw' ? cat.rulesSw : cat.rulesEn).map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>

                {/* Legal Citation Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">
                    {language === 'sw' ? 'Msingi wa kisheria:' : 'Legal basis:'}{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'sw' ? cat.legalBasisSw : cat.legalBasisEn}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Framework & Tanzania Personal Data Protection Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'sw'
                  ? 'Ulinzi wa Mtoa Taarifa (Whistleblower Protection) chini ya PDPA 2022'
                  : 'Whistleblower Protection under Tanzania Personal Data Protection Act (PDPA 2022)'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {language === 'sw'
                ? 'Unaporipoti tangazo la vitu vilivyopigwa marufuku au mwanafunzi anayevunja sheria, utambulisho wako unalindwa kwa siri kali chini ya Sheria ya Kulinda Taarifa Binafsi ya Tanzania ya 2022. Wasimamizi wetu wanashirikiana na Idara za Ulinzi za vyuo vikuu na Jeshi la Polisi Tanzania kuchukua hatua za haraka bila kufichua jina lako.'
                : 'When reporting prohibited contraband, academic leaks, or fraudulent sellers, your identity remains strictly confidential under Tanzania’s Personal Data Protection Act (PDPA 2022). Our campus moderation team coordinates with university security and the Tanzania Police Force while keeping reporter identities encrypted.'}
            </p>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              openReportModal({
                type: 'listing',
                id: 'general_safety',
                title: language === 'sw' ? 'Ripoti ya Jumla ya Usalama' : 'General Safety Violation',
              });
            }}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'sw' ? 'Ripoti ukiukwaji wa sera sasa' : 'Report a violation now'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs transition-colors shadow-xs"
          >
            {language === 'sw' ? 'Nimeelewa Sera' : 'I Understand the Policy'}
          </button>
        </div>

      </div>
    </div>
  );
};
