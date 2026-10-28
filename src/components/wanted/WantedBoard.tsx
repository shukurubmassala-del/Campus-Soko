import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types';
import {
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  MessageSquare,
  Plus,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react';
import { checkProhibitedContent } from '../../data/prohibitedKeywords';
import { BackHomeButton } from '../common/BackHomeButton';
import { getSafeAvatarUrl } from '../../utils/imageUtils';

export const WantedBoard: React.FC = () => {
  const {
    language,
    t,
    wantedPosts,
    createWantedPost,
    fulfillWantedPost,
    currentUniversity,
    currentUser,
    setIsAuthModalOpen,
    showToast,
    openChatWithSeller,
  } = useCampusSoko();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [category, setCategory] = useState<CategoryId>('textbooks');

  const filteredPosts = wantedPosts.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!title.trim() || !description.trim() || !maxBudget) {
      showToast(language === 'sw' ? 'Jaza taarifa zote za hitaji lako' : 'Please fill all fields', 'error');
      return;
    }

    const check = checkProhibitedContent(title + ' ' + description);
    if (check.isProhibited) {
      showToast(`${t.prohibitedWarning} (${check.matchedTerm})`, 'error');
      return;
    }

    const numericBudget = parseInt(maxBudget.replace(/\D/g, ''), 10) || 0;

    const result = createWantedPost({
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      buyerPhone: currentUser.phone,
      buyerVerified: currentUser.isVerified,
      buyerAvatar: currentUser.avatarUrl,
      universityId: currentUniversity.id,
      campusZone: currentUser.campusZone || currentUniversity.zones[0],
      title: title.trim(),
      description: description.trim(),
      maxBudget: numericBudget,
      category,
    });

    if (result.success) {
      setTitle('');
      setDescription('');
      setMaxBudget('');
      setIsModalOpen(false);
    } else {
      showToast(result.error || 'Error', 'error');
    }
  };

  return (
    <section className="space-y-4">
      
      {/* Top Navigation Back Home Bar */}
      <div className="flex items-center justify-between">
        <BackHomeButton />
      </div>

      {/* Banner & Intro */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-white rounded-2xl p-6 sm:p-7 border border-emerald-800 dark:border-emerald-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-800/80 text-emerald-200 text-[12px] font-medium border border-emerald-700/60">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{currentUniversity.shortName} Campus</span>
            </div>
            {/* Screen title: 22–24px, Semibold (600) */}
            <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight">
              {t.wantedTitle}
            </h1>
            {/* Body text: 14–16px, Regular (400) */}
            <p className="text-[14px] sm:text-[15px] text-emerald-100/90 font-normal leading-relaxed">
              {t.wantedSubtitle}
            </p>
          </div>

          {/* Buttons: 14–16 px, Semibold (600) */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser) setIsAuthModalOpen(true);
              else setIsModalOpen(true);
            }}
            className="self-start sm:self-auto min-h-[44px] px-5 py-2.5 rounded-full bg-white text-emerald-800 font-bold text-[14px] sm:text-[15px] shadow-lg shadow-emerald-950/30 hover:shadow-xl hover:shadow-white/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.postWantedBtn}</span>
          </button>
        </div>

        {/* Category Filters: Floating Rounded Pills with Colored Shadows */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-emerald-900 font-bold shadow-md shadow-white/30 -translate-y-0.5 scale-[1.02]'
                : 'bg-white/15 text-white hover:bg-white/25 hover:-translate-y-0.5'
            }`}
          >
            {t.allCategories}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-emerald-900 font-bold shadow-md shadow-white/30 -translate-y-0.5 scale-[1.02]'
                  : 'bg-white/15 text-white hover:bg-white/25 hover:-translate-y-0.5'
              }`}
            >
              {language === 'sw' ? cat.nameSw : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Wanted Requests Feed */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {/* Labels / metadata: 12–13px, Regular (400–500) */}
                    <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 mb-1 font-normal">
                      <span>{post.campusZone}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.createdAt}</span>
                    </div>
                    {/* Section heading / request title: 18–20px, Semibold (600) */}
                    <h3 className="text-[18px] sm:text-[19px] font-semibold text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[12px] text-slate-400 font-normal">
                      {language === 'sw' ? 'Bajeti' : 'Max Budget'}
                    </span>
                    {/* Product price: 16–18px, Bold (700) */}
                    <span className="text-[16px] sm:text-[18px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatTZS(post.maxBudget)}
                    </span>
                  </div>
                </div>

                {/* Body text: 14–16px, Regular (400) */}
                <p className="text-[14px] sm:text-[15px] font-normal text-slate-600 dark:text-slate-300 leading-relaxed">
                  {post.description}
                </p>
              </div>

              {/* Buyer Contact Strip */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getSafeAvatarUrl(post.buyerAvatar, post.buyerName)}
                    alt={post.buyerName}
                    className="w-8 h-8 rounded-full bg-slate-200 object-cover"
                  />
                  <div className="text-[13px] truncate">
                    {/* Buyer name: Medium (500) */}
                    <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                      {post.buyerName}
                    </span>
                  </div>
                  {post.buyerVerified && (
                    <span title={t.verifiedStudent}>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  )}
                </div>

                {post.status === 'open' ? (
                  /* Buttons: 14–16 px, Semibold (600) */
                  <button
                    type="button"
                    onClick={() => {
                      const fakeListing = {
                        id: 'wanted_chat_' + post.id,
                        sellerId: post.buyerId,
                        sellerName: post.buyerName,
                        sellerPhone: post.buyerPhone,
                        sellerVerified: post.buyerVerified,
                        sellerRating: 5.0,
                        universityId: post.universityId,
                        campusZone: post.campusZone,
                        safePickupPoint: 'Maktaba ya Chuo / Campus Library',
                        title: 'Nahitaji: ' + post.title,
                        description: post.description,
                        category: post.category,
                        price: post.maxBudget,
                        isNegotiable: true,
                        condition: 'good' as const,
                        images: [],
                        status: 'active' as const,
                        createdAt: post.createdAt,
                        viewsCount: 1,
                      };
                      openChatWithSeller(fakeListing);
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[14px] font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                    aria-label={`${t.iHaveThisItem}: ${post.title}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.iHaveThisItem}</span>
                  </button>
                ) : (
                  <span className="text-[13px] text-slate-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'sw' ? 'Kimepatikana' : 'Fulfilled'}</span>
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {language === 'sw' ? 'Hakuna mahitaji kwenye kategoria hii' : 'No wanted requests found'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'sw'
                ? 'Kuwa wa kwanza kuweka kile unachokitafuta ili wanafunzi wengine wakusaidie.'
                : 'Be the first to post what you are looking for so fellow campus students can reach out.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                {t.allCategories}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsModalOpen(true);
              }}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.postWantedBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Wanted Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.postWantedBtn}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Funga dirisha / Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'sw' ? 'Unahitaji kitu gani?' : 'What do you need?'} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mfano: Medical Physiology Guyton & Hall au Pasi ya Umeme"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {language === 'sw' ? cat.nameSw : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.maxBudgetTZS} *
                  </label>
                  <input
                    type="number"
                    required
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder={t.budgetPlaceholder}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.wantedDescription} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Eleza sifa maalum, hali unayotaka (mpya/imetumika), na eneo unaloweza kupokelea..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
              >
                {t.postWantedBtn}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
