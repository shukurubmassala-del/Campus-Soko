import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { X } from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

export const ReviewModal: React.FC = () => {
  const {
    language,
    t,
    reviewModalTarget,
    closeReviewModal,
    addReview,
    showToast,
  } = useCampusSoko();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!reviewModalTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast(language === 'sw' ? 'Tafadhali andika maoni yako' : 'Please provide a comment', 'error');
      return;
    }

    addReview(
      reviewModalTarget.userId,
      rating,
      comment.trim(),
      reviewModalTarget.listingTitle
    );
  };

  const ratingOptions = [
    { score: 1, label: language === 'sw' ? 'Mbaya' : 'Poor' },
    { score: 2, label: language === 'sw' ? 'Kawaida' : 'Fair' },
    { score: 3, label: language === 'sw' ? 'Wastani' : 'Good' },
    { score: 4, label: language === 'sw' ? 'Nzuri' : 'Great' },
    { score: 5, label: language === 'sw' ? 'Bora' : 'Excellent' },
  ];

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BackHomeButton variant="compact" onClick={closeReviewModal} />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {t.leaveReviewTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeReviewModal}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'sw' ? 'Tathmini kwa ajili ya:' : 'Reviewing:'}{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{reviewModalTarget.userName}</span>
          <span className="block text-[11px] text-slate-400 mt-0.5 truncate">
            {reviewModalTarget.listingTitle}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.ratingLabel} (1 - 5)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {ratingOptions.map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => setRating(item.score)}
                  className={`min-h-[48px] py-2 px-1 text-center rounded-xl border transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    rating === item.score
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                  aria-label={`${item.score} / 5 - ${item.label}`}
                >
                  <span className="block text-sm font-bold tabular-nums">{item.score}</span>
                  <span className="block text-[10px] mt-0.5 opacity-90">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'sw' ? 'Maoni Yako' : 'Your Comments'} *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.reviewPlaceholder}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={closeReviewModal}
              className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {t.submitReview}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
