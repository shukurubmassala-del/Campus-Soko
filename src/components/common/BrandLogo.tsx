import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColorVariant?: 'light' | 'dark' | 'auto';
  className?: string;
  harmonized?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textColorVariant = 'light',
  className = '',
  harmonized = true,
  layout = 'vertical',
}) => {
  const sizeMap = {
    sm: {
      box: 'w-6 h-6 rounded-md',
      img: 'w-6 h-6',
    },
    md: {
      box: 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg',
      img: 'w-7 h-7 sm:w-8 sm:h-8',
    },
    lg: {
      box: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl',
      img: 'w-9 h-9 sm:w-10 sm:h-10',
    },
    xl: {
      box: 'w-12 h-12 rounded-2xl',
      img: 'w-12 h-12',
    },
  };

  const currentSize = sizeMap[size];
  // Select harmonized app green logo by default, or original photo asset
  const logoSrc = harmonized ? '/logo-icon-appgreen.png' : '/logo-icon.png';

  const textClasses =
    textColorVariant === 'light'
      ? { campus: 'text-white', soko: 'text-[#E67E22]' }
      : textColorVariant === 'dark'
      ? { campus: 'text-[#2C3E50] dark:text-white', soko: 'text-[#E67E22]' }
      : { campus: 'text-[#2C3E50] dark:text-white', soko: 'text-[#E67E22]' };

  return (
    <div
      className={`${
        layout === 'vertical'
          ? 'flex flex-col items-center justify-center gap-0.5'
          : 'flex items-center gap-2'
      } ${className}`}
    >
      {/* Official Graduation Cap & Shopping Cart Logo Icon */}
      <div
        className={`${currentSize.box} bg-white p-0.5 flex items-center justify-center shadow-xs border border-white/30 overflow-hidden shrink-0 group-hover:scale-105 transition-transform`}
      >
        <img
          src={logoSrc}
          alt="CampusSoko"
          className="w-full h-full object-contain rounded-md"
          loading="eager"
        />
      </div>

      {/* Brand Wordmark (CampusSoko positioned below the logo with font size 14) */}
      {showText && (
        <div className="leading-none text-center flex items-center justify-center">
          <span className="font-bold tracking-tight flex items-center text-[14px] leading-tight select-none">
            <span className={textClasses.campus}>Campus</span>
            <span className={textClasses.soko}>Soko</span>
          </span>
        </div>
      )}
    </div>
  );
};
