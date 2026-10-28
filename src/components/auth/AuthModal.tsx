import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  X,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';
import { getSafeAvatarUrl } from '../../utils/imageUtils';

export const AuthModal: React.FC = () => {
  const {
    language,
    t,
    currentUniversity,
    setSelectedUniversityId,
    users,
    isAuthModalOpen: sokoModalOpen,
    setIsAuthModalOpen: setSokoModalOpen,
    setRoleView,
    setActiveTab,
    setIsSellerRegistrationOpen,
    showToast,
  } = useCampusSoko();

  const {
    isAuthModalOpen: authModalOpen,
    setIsAuthModalOpen: setAuthModalOpen,
    sendPhoneOtp,
    verifyPhoneOtp,
    signInWithUniversityEmail,
    signInWithDemoUser,
    isSendingOtp,
    isVerifyingOtp,
    isLoading,
    authError,
    clearError,
    phoneData,
    otpSent,
    resetOtpFlow,
  } = useAuth();

  const isModalOpen = sokoModalOpen || authModalOpen;

  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [declaredRole, setDeclaredRole] = useState<'buyer' | 'seller'>('buyer');
  const [phoneInput, setPhoneInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('1234'); // Pre-filled for test convenience
  const [emailInput, setEmailInput] = useState('');

  if (!isModalOpen) return null;

  const handleClose = () => {
    setSokoModalOpen(false);
    setAuthModalOpen(false);
    clearError();
    resetOtpFlow();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendPhoneOtp(phoneInput);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyPhoneOtp(otpCode, fullName, currentUniversity.id, declaredRole);
    if (success) {
      setRoleView(declaredRole);
      setActiveTab('market');
      handleClose();
      showToast(
        declaredRole === 'seller'
          ? (language === 'sw' ? 'Umeingia kama Muuzaji! Karibu kwenye Seller Studio.' : 'Signed in as Seller! Welcome to your Seller Studio.')
          : (language === 'sw' ? 'Umeingia kama Mnunuzi! Karibu kwenye Soko la Wanafunzi.' : 'Signed in as Buyer! Welcome to the Campus Marketplace.')
      );
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signInWithUniversityEmail(emailInput, currentUniversity.id, declaredRole);
    if (success) {
      setRoleView(declaredRole);
      setActiveTab('market');
      handleClose();
      showToast(
        declaredRole === 'seller'
          ? (language === 'sw' ? 'Umeingia kama Muuzaji! Karibu kwenye Seller Studio.' : 'Signed in as Seller! Welcome to your Seller Studio.')
          : (language === 'sw' ? 'Umeingia kama Mnunuzi! Karibu kwenye Soko la Wanafunzi.' : 'Signed in as Buyer! Welcome to the Campus Marketplace.')
      );
    }
  };

  const handleDemoSignIn = (u: any) => {
    signInWithDemoUser(u, declaredRole);
    setSelectedUniversityId(u.universityId);
    setRoleView(declaredRole);
    setActiveTab('market');
    handleClose();
    showToast(
      declaredRole === 'seller'
        ? (language === 'sw' ? `Umeingia kama ${u.fullName} (Muuzaji)! Karibu Studio.` : `Signed in as ${u.fullName} (Seller)! Welcome to Studio.`)
        : (language === 'sw' ? `Umeingia kama ${u.fullName} (Mnunuzi)! Karibu Sokoni.` : `Signed in as ${u.fullName} (Buyer)! Welcome to Marketplace.`)
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-4">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <BackHomeButton variant="compact" onClick={handleClose} />
            <img
              src="/logo-icon-appgreen.png"
              alt="CampusSoko"
              className="w-8 h-8 rounded-xl object-contain shadow-xs border border-emerald-500/20 shrink-0 hidden xs:block"
            />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {t.authTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentUniversity.shortName} · {t.authSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0 cursor-pointer"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MANDATORY ROLE DECLARATION (Buyer or Seller) */}
        <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>{language === 'sw' ? 'Wajibu Wako Chuoni:' : 'Declare Your Campus Role:'}</span>
            </label>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {language === 'sw' ? 'Inahitajika' : 'Required'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Option 1: Buyer (Mnunuzi) */}
            <button
              type="button"
              onClick={() => setDeclaredRole('buyer')}
              className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                declaredRole === 'buyer'
                  ? 'border-[#00B53F] bg-white dark:bg-slate-800 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-transparent bg-white/60 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    declaredRole === 'buyer'
                      ? 'bg-[#00B53F] text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                {declaredRole === 'buyer' && (
                  <CheckCircle2 className="w-4 h-4 text-[#00B53F]" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                  {language === 'sw' ? 'Mnunuzi' : 'Buyer'}
                </span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">
                  {language === 'sw' ? 'Kununua bidhaa & huduma' : 'Browse & buy goods'}
                </span>
              </div>
            </button>

            {/* Option 2: Seller (Muuzaji) */}
            <button
              type="button"
              onClick={() => setDeclaredRole('seller')}
              className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                declaredRole === 'seller'
                  ? 'border-[#E67E22] bg-white dark:bg-slate-800 shadow-md ring-2 ring-orange-500/20'
                  : 'border-transparent bg-white/60 dark:bg-slate-850/60 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    declaredRole === 'seller'
                      ? 'bg-[#E67E22] text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                </div>
                {declaredRole === 'seller' && (
                  <CheckCircle2 className="w-4 h-4 text-[#E67E22]" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                  {language === 'sw' ? 'Muuzaji' : 'Seller'}
                </span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">
                  {language === 'sw' ? 'Kuuza vitu & huduma' : 'Sell gear & services'}
                </span>
              </div>
            </button>
          </div>

          <div className="pt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${declaredRole === 'seller' ? 'bg-[#E67E22]' : 'bg-[#00B53F]'}`} />
            <span>
              {declaredRole === 'seller'
                ? (language === 'sw'
                    ? 'Utapangiwa moja kwa moja kwenye Seller Studio ya kusimamia bidhaa.'
                    : 'You will directly open into the Seller Studio & inventory workspace.')
                : (language === 'sw'
                    ? 'Utapangiwa moja kwa moja kwenye Soko Kuu la chuo (Marketplace).'
                    : 'You will directly open into the Campus Marketplace.')}
            </span>
          </div>
        </div>

        {/* Error Alert Box */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{language === 'sw' ? authError.sw : authError.en}</p>
          </div>
        )}

        {/* Auth Method Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              clearError();
            }}
            className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              authMode === 'phone'
                ? 'bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.phoneMethod}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              clearError();
            }}
            className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              authMode === 'email'
                ? 'bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email (.ac.tz)</span>
          </button>
        </div>

        {/* MODE 1: Tanzanian Phone (+255) with OTP */}
        {authMode === 'phone' ? (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.enterPhone} (+255)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +255
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(e.target.value);
                      clearError();
                    }}
                    placeholder={t.phonePlaceholder}
                    className="w-full pl-14 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Vodacom, Tigo, Airtel, Halotel</span>
                  <span>Format: 07XX / 06XX</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp || !phoneInput.trim()}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'sw' ? 'Inatuma OTP...' : 'Sending OTP...'}</span>
                  </>
                ) : (
                  <span>{t.sendOtp}</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {language === 'sw' ? 'Msimbo umetumwa kwa:' : 'Verification SMS sent to:'}
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {phoneData?.formattedDisplay} ({phoneData?.carrier})
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'sw' ? 'Jina Lako Kamili (kama ni mara ya kwanza)' : 'Your Full Name (if new account)'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Mfano: Juma Nassor"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.enterOtp}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full py-2.5 text-center tracking-widest text-lg font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1 text-center font-medium">
                  {language === 'sw' ? 'Msimbo wa majaribio: 1234' : 'Test verification code: 1234'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetOtpFlow}
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {language === 'sw' ? 'Badili Nambari' : 'Change Phone'}
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingOtp || !otpCode.trim()}
                  className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'sw' ? 'Inathibitisha...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <span>{t.verifyAndLogin}</span>
                  )}
                </button>
              </div>
            </form>
          )
        ) : (
          /* MODE 2: University Institutional Email (.ac.tz) */
          <form onSubmit={handleEmailSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.enterCampusEmail}
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  clearError();
                }}
                placeholder={`student@${currentUniversity.id}.ac.tz`}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex items-start gap-1.5 mt-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  {language === 'sw'
                    ? 'Barua pepe za chuo (.ac.tz) hupata beji ya "Verified Student" papo hapo.'
                    : 'Institutional emails (.ac.tz) automatically receive the Verified Student badge.'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailInput.trim()}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'sw' ? 'Inaingia...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{language === 'sw' ? 'Ingia na Barua Pepe ya Chuo' : 'Sign In with University Email'}</span>
              )}
            </button>
          </form>
        )}

        {/* Demo Fast Account Pickers */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.demoAccountsTitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-56 overflow-y-auto">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoSignIn(u)}
                className={`min-h-[48px] p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  u.isAdmin
                    ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 hover:bg-red-100/70'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <img
                  src={getSafeAvatarUrl(u.avatarUrl, u.fullName)}
                  alt={u.fullName}
                  className="w-8 h-8 rounded-full bg-slate-200 shrink-0 object-cover"
                />
                <div className="truncate flex-1 min-w-0">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {u.fullName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="uppercase font-semibold">{u.universityId}</span>
                    <span>·</span>
                    <span className="font-mono">{u.phone}</span>
                    {u.isAdmin && (
                      <span className="inline-flex items-center gap-0.5 text-red-500 font-bold font-mono">
                        · Admin
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Role Declaration Quick Switcher */}
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            {declaredRole === 'buyer' ? (
              <button
                type="button"
                onClick={() => setDeclaredRole('seller')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E67E22] hover:underline cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>
                  {language === 'sw'
                    ? 'Unataka kuuza vitu chuoni? Bofya kutangaza kama Muuzaji'
                    : 'Want to sell on campus? Click to declare as Seller'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDeclaredRole('buyer')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00b53f] hover:underline cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>
                  {language === 'sw'
                    ? 'Unataka kununua tu? Bofya kutangaza kama Mnunuzi'
                    : 'Just want to buy? Click to declare as Buyer'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
