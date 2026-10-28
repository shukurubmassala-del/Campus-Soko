import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'amber' | 'blue' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  size = 'md',
  variant = 'emerald',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const variantClasses = {
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    blue: 'bg-blue-600 dark:bg-blue-500',
    gradient: 'bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500',
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between gap-2 mb-1.5 text-[12px] sm:text-[13px]">
          <div className="flex items-center gap-1.5 truncate">
            {label && (
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {label}
              </span>
            )}
            {sublabel && (
              <span className="text-slate-500 dark:text-slate-400 font-normal hidden sm:inline truncate">
                ({sublabel})
              </span>
            )}
          </div>
          {showPercentage && (
            <span className="font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${sizeClasses}`}
      >
        <div
          className={`${sizeClasses} ${variantClasses} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
