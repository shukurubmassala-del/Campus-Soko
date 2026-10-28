import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  Camera,
  CheckCircle2,
  FileCheck,
  Lock,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

export const VerificationModal: React.FC = () => {
  const {
    language,
    t,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    verifyStudent,
    currentUniversity,
    currentUser,
    showToast,
  } = useCampusSoko();

  const [method, setMethod] = useState<'email' | 'student_id'>('email');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);

  if (!isVerificationModalOpen) return null;

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setIdCardPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'email') {
      if (!email.includes('@') || (!email.includes('.ac.tz') && !email.includes('.edu'))) {
        showToast(
          language === 'sw'
            ? 'Tafadhali tumia barua pepe ya chuo inayomalizika na .ac.tz'
            : 'Please enter a valid university email ending with .ac.tz',
          'error'
        );
        return;
      }
      verifyStudent('email', email.trim());
    } else {
      if (!idCardPreview) {
        showToast(language === 'sw' ? 'Pakia picha ya kitambulisho cha chuo' : 'Please upload your student ID photo', 'error');
        return;
      }
      verifyStudent('student_id', idCardPreview);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-4">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BackHomeButton variant="compact" onClick={() => setIsVerificationModalOpen(false)} />
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hidden sm:flex shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {t.getVerifiedTitle}
              </h3>
              <span className="text-[11px] text-slate-400 block truncate">
                {currentUniversity.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsVerificationModalOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.verificationDesc}
        </p>

        {/* Method Picker Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              method === 'email'
                ? 'bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email (.ac.tz)</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('student_id')}
            className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              method === 'student_id'
                ? 'bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Student ID Card</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {method === 'email' ? (
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                {t.enterCampusEmail}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`mwanafunzi@${currentUniversity.id}.ac.tz`}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 block">
                {language === 'sw'
                  ? 'Mfano: baraka.mrema@udsm.ac.tz au 2022-04-0123@udom.ac.tz'
                  : 'Example: yourname@udsm.ac.tz or student_id@udom.ac.tz'}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                {t.uploadIdCard}
              </label>
              <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center">
                <input
                  type="file"
                  id="id-upload"
                  accept="image/*"
                  onChange={handleIdUpload}
                  className="hidden"
                />
                <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  {idCardPreview && typeof idCardPreview === 'string' && idCardPreview.trim().length > 0 ? (
                    <img src={idCardPreview} alt="Student ID" className="h-28 object-contain rounded-lg" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">
                        {language === 'sw' ? 'Bofya kupakia picha ya ID yako' : 'Tap to upload ID card photo'}
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Privacy Note under Tanzania PDPA */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>{t.uploadIdDesc}</p>
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.submitVerification}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
