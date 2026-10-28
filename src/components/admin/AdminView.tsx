import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { AdminDashboardModal } from './AdminDashboardModal';
import { ColorPreferencePicker } from '../common/ColorPreferencePicker';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';
import { ProfileView } from '../profile/ProfileView';
import { ChatDrawer } from '../chat/ChatDrawer';
import { WantedBoard } from '../wanted/WantedBoard';
import { SearchView } from '../search/SearchView';

export const AdminView: React.FC = () => {
  const {
    language,
    currentUser,
    users,
    loginAsAdmin,
    setRoleView,
    activeTab,
    setActiveTab,
    showToast,
    colorTheme,
  } = useCampusSoko();

  const [adminEmail, setAdminEmail] = useState('admin@campussoko.ac.tz');
  const [passcode, setPasscode] = useState('');
  const [adminRoleType, setAdminRoleType] = useState<'super_admin' | 'campus_moderator'>('super_admin');
  const [authError, setAuthError] = useState('');

  const isAdminOrModerator = currentUser?.isAdmin || currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      setAuthError(language === 'sw' ? 'Weka barua pepe ya msimamizi' : 'Please enter admin email');
      return;
    }

    // Default admin master passcodes or any verification
    if (passcode.trim() && passcode.trim() !== '2026' && passcode.trim() !== 'admin123' && passcode.trim() !== '1234') {
      setAuthError(
        language === 'sw'
          ? 'Nenosiri la msimamizi sio sahihi. (Tumia 2026 au 1234 kwa jaribio)'
          : 'Invalid admin security passcode. (Use 2026 or 1234 for testing)'
      );
      return;
    }

    setAuthError('');
    const success = loginAsAdmin(passcode);
    if (!success) {
      setAuthError(
        language === 'sw'
          ? 'Haikuweza kuthibitisha akaunti ya msimamizi.'
          : 'Could not verify admin credentials.'
      );
    }
  };

  const handleQuickDemoAdmin = () => {
    loginAsAdmin('2026');
  };

  if (!isAdminOrModerator) {
    return (
      <div className="max-w-xl mx-auto my-6 space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between">
          <BackHomeButton />
          <ColorPreferencePicker variant="compact" />
        </div>
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Creator / Admin Portal Gate Header - Screen title: 22–24 px, Semibold (600) */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shrink-0 border border-slate-800 dark:border-slate-200 shadow-md">
            <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 dark:text-white">
              {language === 'sw' ? 'Itifaki ya Kuingia Msimamizi / Muasisi' : 'Creator & Admin Log In Protocol'}
            </h1>
            <span className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'sw' ? 'Jopo Lililolindwa la Wasimamizi wa Vyuo' : 'Protected Campus Moderator & Admin Console'}
            </span>
          </div>
        </div>

        {/* Body text: 14–16 px, Regular (400) */}
        <p className="text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {language === 'sw'
            ? 'Sehemu hii imetengwa mahsusi kwa waasisi wa jukwaa, waratibu wa vyuo na wasimamizi wa maudhui kusimamia usalama, kuthibitisha vitambulisho vya wanafunzi, na kutatua migogoro.'
            : 'This interface is restricted to platform creators, campus coordinators, and moderators to oversee campus safety, review student seller verifications, and manage platform configurations.'}
        </p>

        {authError && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-[13px] text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[12px] sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-1">
              {language === 'sw' ? 'Barua Pepe ya Msimamizi (Staff Email)' : 'Administrator Staff Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@campussoko.ac.tz"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-normal text-[14px] ${colorTheme.ringFocus}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mb-1">
              {language === 'sw' ? 'Nenosiri la Usalama (Master PIN / Passcode)' : 'Security Passcode / Master PIN'}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="2026"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[14px] ${colorTheme.ringFocus}`}
              />
            </div>
            <span className="text-[12px] text-slate-400 mt-1 block">
              {language === 'sw' ? 'Nambari ya majaribio: 2026 au 1234' : 'Testing passcode: 2026 or 1234'}
            </span>
          </div>

          {/* Buttons: 14–16 px, Semibold (600) */}
          <button
            type="submit"
            className={`w-full min-h-[44px] px-5 py-2.5 rounded-xl text-[14px] sm:text-[15px] font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${colorTheme.primaryBtn}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'sw' ? 'Thibitisha na Uingie kama Msimamizi' : 'Authenticate Admin Protocol'}</span>
          </button>
        </form>

        {/* Fast-Track Testing Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white block">
            {language === 'sw' ? 'Kuingia kwa Bonyezo Moja (One-Tap Creator Access):' : 'One-Tap Creator Access (Evaluation Mode):'}
          </span>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-[13px] sm:text-[14px] font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>CampusSoko Chief Moderator (Admin Shukuru)</span>
            </div>
            <span className="text-[11px] font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-2.5 py-0.5 rounded-md">
              Full Super Admin
            </span>
          </button>
        </div>

        {/* Back to Marketplace */}
        <div className="pt-2 flex items-center justify-center text-xs">
          <BackHomeButton />
        </div>

        </div>
      </div>
    );
  }

  // Once authenticated as Admin / Creator, render the complete Admin Command Center
  return (
    <div className="space-y-6">
      {/* Top Back Home Bar */}
      <div className="flex items-center justify-between">
        <BackHomeButton />
        <ColorPreferencePicker variant="compact" />
      </div>

      {/* Admin Command Strip Banner */}
      <div className="p-4 rounded-2xl bg-slate-950 dark:bg-slate-900 border border-slate-800 dark:border-slate-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          </div>
          <div>
            <span className="font-bold text-white block">
              {language === 'sw' ? 'Uko kwenye Jopo Kuu la Msimamizi (Creator & Admin Mode)' : 'Creator & Admin Console Active'}
            </span>
            <span className="text-slate-300 text-[11px]">
              {language === 'sw'
                ? 'Una mamlaka kamili ya kuondoa matangazo hatarishi, kuthibitisha wauzaji, na kudhibiti vyuo.'
                : 'Full authority to moderate listings, approve student seller verification, and manage campus masters.'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Views for Admin Tabs */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'sw' ? 'Rudi Admin Console' : 'Back to Admin Console'}</span>
            </button>
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold">
              {language === 'sw' ? 'Wasifu wa Msimamizi' : 'Admin Profile'}
            </span>
          </div>
          <ProfileView />
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'sw' ? 'Rudi Admin Console' : 'Back to Admin Console'}</span>
            </button>
          </div>
          <ChatDrawer />
        </div>
      )}

      {activeTab === 'wanted' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'sw' ? 'Rudi Admin Console' : 'Back to Admin Console'}</span>
            </button>
          </div>
          <WantedBoard />
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'sw' ? 'Rudi Admin Console' : 'Back to Admin Console'}</span>
            </button>
          </div>
          <SearchView />
        </div>
      )}

      {/* Render the full comprehensive Admin Dashboard when activeTab is market */}
      {activeTab === 'market' && <AdminDashboardModal />}
    </div>
  );
};
