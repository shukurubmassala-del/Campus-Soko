import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  subtitle?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
  variant?: 'bordered' | 'separated' | 'minimal';
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
  variant = 'bordered',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    return items.filter((item) => item.defaultOpen).map((item) => item.id);
  });

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div
      className={`w-full ${
        variant === 'bordered'
          ? 'divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm'
          : variant === 'separated'
          ? 'space-y-3'
          : 'divide-y divide-slate-200 dark:divide-slate-800'
      } ${className}`}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`${
              variant === 'separated'
                ? 'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm'
                : ''
            } transition-colors`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-header-${item.id}`}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer min-h-[52px]"
            >
              <div className="flex items-center gap-3 pr-4 flex-1">
                {item.icon && (
                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                    {item.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] sm:text-[16px] font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div
                id={`accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
                className="px-4 sm:px-5 pb-5 pt-1 text-[14px] leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in-50 duration-150"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
