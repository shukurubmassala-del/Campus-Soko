import React from 'react';

export const ListingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden animate-pulse">
      {/* Product Image Slot Skeleton */}
      <div className="relative aspect-4/3 w-full bg-slate-200 dark:bg-slate-800">
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700/60" />
      </div>

      {/* Card Content Body Skeleton */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Metadata: Condition and Zone */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-14 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>

          {/* Title Lines */}
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-emerald-100 dark:bg-emerald-950/60 rounded-md" />
            <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>

          {/* Footer Safe Spot */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3.5 w-10 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ListingGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
};
