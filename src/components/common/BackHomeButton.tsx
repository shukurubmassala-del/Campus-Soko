import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { useCampusSoko } from '../../context/CampusSokoContext';

interface BackHomeButtonProps {
  className?: string;
  variant?: 'pill' | 'header' | 'modal' | 'navbar' | 'compact';
  customLabel?: string;
  onClick?: () => void;
  showIcon?: boolean;
}

export const BackHomeButton: React.FC<BackHomeButtonProps> = ({
  className = '',
  variant = 'pill',
  customLabel,
  onClick,
  showIcon = true,
}) => {
  const { language, t, goHome } = useCampusSoko();

  const defaultLabel = t?.backHome || (language === 'sw' ? 'Rudi nyumbani' : 'Back home');
  const label = customLabel || defaultLabel;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    goHome();
  };

  if (variant === 'modal') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`min-h-[38px] px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-200/80 dark:border-slate-700/80 shadow-md shadow-slate-900/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 ${className}`}
        title={label}
        aria-label={label}
      >
        {showIcon && <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
        <span className="truncate">{label}</span>
      </button>
    );
  }

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`min-h-[36px] px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/40 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-md shadow-black/30 hover:shadow-emerald-400/30 hover:-translate-y-0.5 ${className}`}
        title={label}
        aria-label={label}
      >
        <ArrowLeft className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
        {showIcon && <Home className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
        <span className="truncate">{label}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`min-h-[36px] px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-200 dark:border-emerald-800 shadow-md shadow-emerald-950/15 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 ${className}`}
        title={label}
        aria-label={label}
      >
        <ArrowLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        {showIcon && <Home className="w-3.5 h-3.5 shrink-0" />}
        <span className="truncate">{label}</span>
      </button>
    );
  }

  // Default: prominent header / floating pill with emerald shadow
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`min-h-[40px] px-4 py-2 rounded-full bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 group ${className}`}
      title={label}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-x-0.5 transition-all shrink-0" />
      {showIcon && <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
      <span className="truncate">{label}</span>
    </button>
  );
};
