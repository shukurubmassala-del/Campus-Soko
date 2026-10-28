import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useCampusSoko } from '../../context/CampusSokoContext';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { goHome } = useCampusSoko();

  const handleHomeClick = () => {
    if (items[0]?.onClick) {
      items[0].onClick();
    } else {
      goHome();
    }
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`flex items-center text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 overflow-x-auto py-1.5 no-scrollbar ${className}`}
    >
      <ol className="flex items-center gap-1.5 flex-nowrap shrink-0">
        <li className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleHomeClick}
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-slate-600 dark:text-slate-400 font-medium"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 flex-nowrap">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer truncate max-w-[140px] sm:max-w-[200px] font-medium"
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={`truncate max-w-[150px] sm:max-w-[220px] ${
                    isLast
                      ? 'text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500 dark:text-slate-400 font-medium'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
