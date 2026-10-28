import React from 'react';
import { formatTZS } from '../../utils/currency';
import { Sparkles } from 'lucide-react';

interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
  className?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice = 0,
  maxPrice,
  minLimit = 0,
  maxLimit = 1000000,
  step = 5000,
  onChange,
  className = '',
}) => {
  const currentMax = maxPrice ?? maxLimit;
  const currentMin = minPrice ?? minLimit;

  // Preset budget chips for fast campus filtering
  const budgetPresets = [
    { label: 'All', min: undefined, max: undefined },
    { label: '< 15k', min: 0, max: 15000 },
    { label: '15k - 50k', min: 15000, max: 50000 },
    { label: '50k - 150k', min: 50000, max: 150000 },
    { label: '150k - 500k', min: 150000, max: 500000 },
    { label: '500k+', min: 500000, max: undefined },
  ];

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const newMin = Math.min(val, currentMax - step);
    onChange(newMin <= minLimit ? undefined : newMin, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const newMax = Math.max(val, currentMin + step);
    onChange(minPrice, newMax >= maxLimit ? undefined : newMax);
  };

  const minPercentage = Math.round(((currentMin - minLimit) / (maxLimit - minLimit)) * 100);
  const maxPercentage = Math.round(((currentMax - minLimit) / (maxLimit - minLimit)) * 100);

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Label and formatted range */}
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Price Range (TZS)
        </span>
        <span className="font-bold text-[#2C3E50] dark:text-orange-400 tabular-nums text-[12px] sm:text-[13px]">
          {formatTZS(currentMin)} – {maxPrice ? formatTZS(currentMax) : 'Max'}
        </span>
      </div>

      {/* Dual Slider Track */}
      <div className="relative pt-2 pb-2">
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full relative">
          <div
            className="absolute h-full bg-[#E67E22] rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${Math.max(0, maxPercentage - minPercentage)}%`,
            }}
          />
        </div>

        {/* Min Input Slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={currentMin}
          onChange={handleMinChange}
          aria-label="Minimum price in TZS"
          className="absolute top-1 left-0 w-full h-2 bg-transparent appearance-none pointer-events-none accent-[#E67E22] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E67E22] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />

        {/* Max Input Slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label="Maximum price in TZS"
          className="absolute top-1 left-0 w-full h-2 bg-transparent appearance-none pointer-events-none accent-[#E67E22] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E67E22] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {budgetPresets.map((preset, index) => {
          const isSelected =
            minPrice === preset.min &&
            maxPrice === preset.max;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(preset.min, preset.max)}
              className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-[12px] font-medium transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#E67E22] text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
