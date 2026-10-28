import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  HelpCircle,
  MapPin,
  MessageSquare,
  Plus,
  ShieldCheck,
  Megaphone,
  Store,
  Tag,
  UserCheck,
} from 'lucide-react';

export const JijiRightSidebar: React.FC = () => {
  const {
    language,
    t,
    currentUniversity,
    currentUser,
    setIsCreateListingOpen,
    setIsAuthModalOpen,
    setIsVerificationModalOpen,
    setIsCreateWantedOpen,
    wantedPosts,
    setActiveTab,
    setRoleView,
  } = useCampusSoko();

  // Active wanted posts for this university
  const activeDemands = wantedPosts
    .filter((w) => w.status === 'open' && (w.universityId === currentUniversity.id || !w.universityId))
    .slice(0, 3);

  return (
    <aside className="w-72 shrink-0 hidden xl:block space-y-4">
      

      {/* 2. Wanted on Campus (What Students Are Looking to Buy) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#E67E22]" />
            {/* Section heading: 18–20px, Semibold (600) */}
            <h3 className="font-semibold text-[18px] text-slate-900 dark:text-white">
              {language === 'sw' ? 'Wanunuzi chuoni' : 'Wanted requests'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('wanted')}
            className="text-[12px] font-semibold text-[#E67E22] hover:underline"
          >
            {language === 'sw' ? 'Ona zote' : 'View all'}
          </button>
        </div>

        <p className="text-[13px] font-normal text-slate-500 dark:text-slate-400">
          {language === 'sw'
            ? 'Wanafunzi wanaotafuta vifaa sasa hivi. Je unavyo?'
            : 'Fellow students actively looking for these items today:'}
        </p>

        <div className="space-y-2.5">
          {activeDemands.length > 0 ? (
            activeDemands.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => {
                  setRoleView('buyer');
                  setActiveTab('wanted');
                }}
                className="w-full text-left p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 hover:border-[#E67E22]/60 hover:bg-orange-50/20 dark:hover:bg-slate-800 transition-all cursor-pointer block group"
                title={language === 'sw' ? `Tazama ombi la ${post.title}` : `View wanted request for ${post.title}`}
              >
                <div className="flex items-start justify-between gap-1">
                  {/* Product name: 14–16px, Medium (500) */}
                  <span className="text-[14px] font-medium text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#E67E22] transition-colors">
                    {post.title}
                  </span>
                  {post.maxBudget && (
                    <span className="text-[13px] font-bold text-[#2C3E50] dark:text-orange-400 shrink-0">
                      ≤ {formatTZS(post.maxBudget)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-normal">
                  <MapPin className="w-3 h-3 text-[#E67E22]" />
                  <span className="truncate">{post.campusZone}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-3 text-[13px] text-slate-400">
              {language === 'sw' ? 'Hakuna maombi mapya kwa sasa.' : 'No open requests right now.'}
            </div>
          )}
        </div>

        {/* Buttons: 14–16 px, Semibold (600) */}
        <button
          type="button"
          onClick={() => {
            if (!currentUser) setIsAuthModalOpen(true);
            else setIsCreateWantedOpen(true);
          }}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[14px] font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#E67E22]" />
          <span>{language === 'sw' ? 'Weka unachotafuta' : 'Post wanted item'}</span>
        </button>
      </div>

      {/* 3. Student Verification Badge Promotion Card - Navy Blue Institutional Trust */}
      {(!currentUser || !currentUser.isVerified) && (
        <div className="bg-gradient-to-tr from-[#2C3E50] to-[#1A252F] text-white rounded-3xl p-4 shadow-xs space-y-3 border border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E67E22] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-[18px] block">
                {language === 'sw' ? 'Pata beji ya mwanafunzi' : 'Get verified badge'}
              </span>
              <span className="text-[12px] font-normal text-slate-300">
                {language === 'sw' ? 'Jenga uaminifu mara 3 zaidi' : 'Build 3x buyer trust'}
              </span>
            </div>
          </div>

          <p className="text-[13px] font-normal text-slate-200 leading-relaxed">
            {language === 'sw'
              ? 'Weka kitambulisho cha chuo au barua pepe ili upewe beji ya Verified Student kwenye matangazo yako.'
              : 'Verify your student ID or campus email to get the verified student badge displayed on all your listings.'}
          </p>

          <button
            type="button"
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setIsVerificationModalOpen(true);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#E67E22] hover:bg-[#D35400] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
          >
            <UserCheck className="w-4 h-4 text-white" />
            <span>{language === 'sw' ? 'Thibitisha sasa' : 'Verify now'}</span>
          </button>
        </div>
      )}

    </aside>
  );
};
