import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { validateTanzanianPhone } from '../../utils/tanzaniaPhone';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Tag,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { BackHomeButton } from '../common/BackHomeButton';

interface SellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellerRegistrationModal: React.FC<SellerRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    language,
    currentUniversity,
    universities,
    currentUser,
    registerAsSeller,
    showToast,
  } = useCampusSoko();

  // Form Fields
  const [shopName, setShopName] = useState(currentUser?.shopName || currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedUnivId, setSelectedUnivId] = useState(currentUser?.universityId || currentUniversity.id);
  const [campusZone, setCampusZone] = useState(currentUser?.campusZone || currentUniversity.zones[0]);
  const [sellerCategory, setSellerCategory] = useState('textbooks');
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || '');
  const [hasAgreedTerms, setHasAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const activeUniv = universities.find((u) => u.id === selectedUnivId) || currentUniversity;
  const phoneValidation = validateTanzanianPhone(phone);

  const handleSendOtp = () => {
    if (!phoneValidation.isValid) {
      setErrorMsg(language === 'sw' ? 'Tafadhali weka namba sahihi ya simu ya Tanzania (+255)' : 'Please enter a valid Tanzanian phone number (+255)');
      return;
    }
    setErrorMsg('');
    setIsOtpSent(true);
    setOtpCode('1234');
    showToast(
      language === 'sw'
        ? `Nambari ya uthibitisho (OTP: 1234) imetumwa kwa ${phoneValidation.formattedDisplay}`
        : `Verification code (OTP: 1234) sent to ${phoneValidation.formattedDisplay}`,
      'info'
    );
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setErrorMsg(language === 'sw' ? 'Tafadhali weka jina la duka au jina lako' : 'Please enter a shop or seller name');
      return;
    }

    if (!hasAgreedTerms) {
      setErrorMsg(language === 'sw' ? 'Lazima ukubali kanuni na miongozo ya usalama chuoni' : 'You must accept the campus marketplace rules');
      return;
    }

    registerAsSeller({
      shopName: shopName.trim(),
      phone: phoneValidation.formattedE164 || phone,
      universityId: selectedUnivId,
      campusZone,
      email: studentEmail.trim() || undefined,
      sellerCategory,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto overflow-x-hidden">
      <div className="relative w-full sm:max-w-xl rounded-none sm:rounded-3xl bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col my-0 sm:my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Sticky Header */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex items-center justify-between border-b border-emerald-800 shrink-0 sticky top-0 z-20 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <BackHomeButton variant="navbar" onClick={onClose} />
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 hidden sm:flex items-center justify-center border border-emerald-400/30 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                {language === 'sw' ? 'Usajili wa Duka la Mwanafunzi' : 'Student Seller Registration'}
              </h2>
              <span className="text-[11px] text-emerald-200/80 block truncate">
                {language === 'sw' ? 'Fomu moja kwa moja bila kurasa nyingi' : 'Single-page registration'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/50 transition-colors shrink-0"
            aria-label="Funga / Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body - Single Page Vertical Form: Scroll Downward or Upward ONLY */}
        <form
          onSubmit={handleCompleteRegistration}
          className="p-5 sm:p-6 space-y-6 text-xs overflow-y-auto overflow-x-hidden flex-1"
        >
          {/* SECTION 1: SHOP & SELLER DETAILS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Taarifa za Duka Lako' : 'Shop Details'}
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'sw' ? 'Jina la Duka / Muuzaji' : 'Shop or Vendor Display Name'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder={language === 'sw' ? 'Mfano: Baraka Campus Tech & Books' : 'E.g., Baraka Campus Tech & Books'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'sw' ? 'Kategoria Kuu ya Vitu Unavyouza' : 'Primary Category You Sell'}
              </label>
              <select
                value={sellerCategory}
                onChange={(e) => setSellerCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'sw' ? c.nameSw : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'sw' ? 'Namba ya Simu (+255)' : 'Tanzanian Phone Number (+255)'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0714223344 au 0754889900"
                  className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  {isOtpSent ? (language === 'sw' ? 'Tuma Tena' : 'Resend') : (language === 'sw' ? 'Thibitisha' : 'Verify')}
                </button>
              </div>
              {phoneValidation.isValid && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  Mtandao: {phoneValidation.carrier} • {phoneValidation.formattedDisplay}
                </span>
              )}
            </div>

            {isOtpSent && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in">
                <label className="block font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">
                  {language === 'sw' ? 'Nambari ya OTP (Tumia 1234 kwa Jaribio)' : 'OTP Code (Use 1234 for testing)'}
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-center font-mono font-bold text-sm tracking-widest text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* SECTION 2: CAMPUS & HOSTEL LOCATION */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Eneo la Chuo & Bweni' : 'Campus Base'}
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'sw' ? 'Chuo Unachosoma' : 'University Campus'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={selectedUnivId}
                  onChange={(e) => {
                    setSelectedUnivId(e.target.value);
                    const univ = universities.find((u) => u.id === e.target.value);
                    if (univ) setCampusZone(univ.zones[0]);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.shortName} - {u.name} ({u.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'sw' ? 'Eneo la Chuo / Hosteli Unayoishi' : 'Hostel or Campus Zone'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={campusZone}
                  onChange={(e) => setCampusZone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {activeUniv.zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                {language === 'sw' ? 'Maeneo Salama Yaliyoidhinishwa Chuoni:' : 'Designated Safe Campus Pickup Points:'}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeUniv.safeMeetingPoints.map((spot) => (
                  <span
                    key={spot}
                    className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold"
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: STUDENT VERIFICATION */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Uthibitisho wa Mwanafunzi' : 'Student Verification'}
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  {language === 'sw' ? 'Pata Beji ya "Verified Student Seller"' : 'Earn the "Verified Student Seller" Badge'}
                </span>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed mt-0.5">
                  {language === 'sw'
                    ? 'Wauzaji wenye beji wanauza mara 3 zaidi! Weka barua pepe yako ya chuo (.ac.tz) kupata uthibitisho wa papo hapo.'
                    : 'Verified sellers get 3x more buyer inquiries! Provide your student email (.ac.tz) for instant verification.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'sw' ? 'Barua Pepe ya Chuo (.ac.tz) - Hiari' : 'University Student Email (.ac.tz) - Optional'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder={`mwanafunzi@${activeUniv.id}.ac.tz`}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: RULES AGREEMENT & SUBMIT */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'sw' ? 'Kanuni za Soko & Makubaliano' : 'Rules & Seller Pledge'}
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === 'sw'
                      ? 'Bidhaa Halisi Pekee: Marufuku kuuza bidhaa za wizi, ghushi au kutoa huduma za mitihani.'
                      : 'Authentic items only: Strictly no stolen goods or exam cheating services.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === 'sw'
                      ? 'Kukutana Maeneo ya Chuo: Daima kutana mchana maeneo salama kama maktaba au getini.'
                      : 'Safe Campus Meetups: Meet buyers in designated campus locations during daylight.'}
                  </span>
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={hasAgreedTerms}
                onChange={(e) => setHasAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-[11px] text-slate-700 dark:text-slate-200">
                {language === 'sw'
                  ? 'Ninakubali kufuata kanuni zote za uuzaji na sheria za usalama chuoni.'
                  : 'I agree to uphold campus marketplace safety and selling guidelines.'}
              </span>
            </label>

            {/* ACTION BUTTONS ON SAME PAGE */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={!hasAgreedTerms}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{language === 'sw' ? 'Sajili Duka Langu Sasa' : 'Register My Shop Now'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
