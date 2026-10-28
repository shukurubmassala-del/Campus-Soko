import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface KebabMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface KebabMenuProps {
  items: KebabMenuItem[];
  ariaLabel?: string;
  className?: string;
  align?: 'left' | 'right';
  buttonSize?: 'sm' | 'md';
}

export const KebabMenu: React.FC<KebabMenuProps> = ({
  items,
  ariaLabel = 'Options',
  className = '',
  align = 'right',
  buttonSize = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses =
    buttonSize === 'sm'
      ? 'w-7 h-7 text-xs'
      : 'w-8 h-8 text-sm';

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev)}
        }
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`${sizeClasses} rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-100`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              role="menuitem"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                item.onClick();
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium transition-colors cursor-pointer ${
                item.destructive
                  ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:text-red-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
