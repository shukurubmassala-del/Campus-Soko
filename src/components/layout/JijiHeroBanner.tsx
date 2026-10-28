import React, { useState, useEffect } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { getUniversityBannerTheme } from '../../data/universityThemes';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  ShieldCheck,
  Store,
  CheckCircle2,
  Lock,
  Zap,
  ExternalLink,
} from 'lucide-react';

export const JijiHeroBanner: React.FC = () => {
  const {
    language,
    currentUniversity,
    setIsCreateListingOpen,
    currentUser,
    setIsAuthModalOpen,
    setIsSafetyModalOpen,
    setActiveTab,
    setRoleView,
    setFilters,
  } = useCampusSoko();

  const [activeSlide, setActiveSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Observed official color codes & gradients & iconic building imagery for the current university
  const theme = getUniversityBannerTheme(currentUniversity.id);

  // Sliding banners customized with respective university iconic building photos and official colour codes
  const slides = [
    {
      id: 'slide_1',
      badgePrefix: `${currentUniversity.shortName} · `,
      badgeSegment: language === 'sw' ? 'Soko la wanafunzi' : 'Campus market',
      badgeIcon: Store,
      buildingImage: theme.iconicBuildingImageUrl,
      buildingLabel: theme.iconicBuildingName[language],
      title: language === 'sw'
        ? `Soko rasmi la wanafunzi wa ${currentUniversity.shortName}`
        : `Official marketplace for ${currentUniversity.shortName} students`,
      description: language === 'sw'
        ? `Nunua na uza vitabu vya masomo, laptop, simu na mahitaji ya chuo moja kwa moja kwa wanafunzi wa ${currentUniversity.shortName}.`
        : `Buy and sell textbooks, laptops, phones, and essentials directly with verified ${currentUniversity.shortName} students.`,
      primaryAction: {
        label: language === 'sw' ? 'Weka tangazo bure' : 'Post free ad',
        icon: Plus,
        onClick: () => {
          if (!currentUser) setIsAuthModalOpen(true);
          else setIsCreateListingOpen(true);
        },
      },
      secondaryAction: {
        label: language === 'sw' ? 'Tafuta vitu' : 'Explore items',
        icon: Search,
        onClick: () => setActiveTab('search'),
      },
      gradientOverlay: theme.slide1Gradient,
    },
    {
      id: 'slide_2',
      badgePrefix: '',
      badgeSegment: language === 'sw' ? 'Ushauri wa Usalama' : 'Campus Safety',
      badgeIcon: Lock,
      buildingImage: theme.iconicBuildingAltImageUrl || theme.iconicBuildingImageUrl,
      buildingLabel: theme.iconicBuildingName[language],
      title: language === 'sw'
        ? `Kutana maeneo salama ya ${currentUniversity.shortName}`
        : `Meet at verified safe spots at ${currentUniversity.shortName}`,
      description: language === 'sw'
        ? `Kutana maeneo ya wazi kama: ${theme.landmarkSpot.sw}. Kagua kifaa kabla ya kulipa M-Pesa.`
        : `Meet in daylight at locations like ${theme.landmarkSpot.en}. Always test items before paying via M-Pesa.`,
      primaryAction: {
        label: language === 'sw' ? 'Mwongozo wa Usalama' : 'Safety Guide',
        icon: ShieldCheck,
        onClick: () => setIsSafetyModalOpen(true),
      },
      secondaryAction: {
        label: language === 'sw' ? 'Wauzaji walioidhinishwa' : 'Verified sellers',
        icon: CheckCircle2,
        onClick: () => {
          setFilters((prev) => ({ ...prev, verifiedOnly: true }));
          const chipsEl = document.getElementById('campus-category-chips');
          if (chipsEl) chipsEl.scrollIntoView({ behavior: 'smooth' });
        },
      },
      gradientOverlay: theme.slide2Gradient,
    },
    {
      id: 'slide_3',
      badgePrefix: '',
      badgeSegment: language === 'sw' ? 'Pata pesa ya haraka' : 'Quick student cash',
      badgeIcon: Zap,
      buildingImage: theme.iconicBuildingImageUrl,
      buildingLabel: theme.iconicBuildingName[language],
      title: language === 'sw'
        ? `Una vifaa usivyotumia? Geuza kuwa pesa ${currentUniversity.shortName}!`
        : `Got unused campus gear? Turn it into cash at ${currentUniversity.shortName}!`,
      description: language === 'sw'
        ? `Weka tangazo bure kwa wanafunzi wa ${currentUniversity.shortName} na upokee ofa papo hapo kupitia Chat au WhatsApp.`
        : `Post free listings to ${currentUniversity.shortName} peers and receive instant chats and WhatsApp calls from campus buyers.`,
      primaryAction: {
        label: language === 'sw' ? 'Anza kuuza sasa' : 'Start selling now',
        icon: Store,
        onClick: () => {
          setRoleView('seller');
          setActiveTab('market');
        },
      },
      secondaryAction: {
        label: language === 'sw' ? 'Watu wanachotafuta' : 'Wanted requests',
        icon: Search,
        onClick: () => {
          setRoleView('buyer');
          setActiveTab('wanted');
        },
      },
      gradientOverlay: theme.slide3Gradient,
    },
  ];

  // Auto-advance banner every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide];
  const PrimaryIcon = slide.primaryAction.icon;
  const SecondaryIcon = slide.secondaryAction.icon;
  const BadgeIcon = slide.badgeIcon;

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-lg border transition-all duration-500 w-full max-w-full group"
      style={{ borderColor: theme.borderGlow }}
    >
      {/* Background Layer: Iconic University Building Picture fetched from official portals */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        <img
          key={`${currentUniversity.id}-${slide.id}`}
          src={slide.buildingImage}
          alt={`${currentUniversity.name} - ${slide.buildingLabel}`}
          className={`w-full h-full object-cover object-center filter saturate-110 brightness-95 transition-all duration-1000 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-70 scale-105'
          }`}
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Graceful fallback to secondary image or unsplash architecture
            if (theme.iconicBuildingAltImageUrl && e.currentTarget.src !== theme.iconicBuildingAltImageUrl) {
              e.currentTarget.src = theme.iconicBuildingAltImageUrl;
            } else {
              e.currentTarget.style.display = 'none';
            }
          }}
        />

        {/* Official University Color Brand Gradient Overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: slide.gradientOverlay,
          }}
        />

        {/* Ambient color gradient accents matching university official color */}
        <div
          className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ backgroundColor: theme.glowColor }}
        />

        {/* Subtle geometric background watermark with university short name */}
        <div className="absolute right-4 -bottom-6 text-white/10 font-black text-8xl sm:text-9xl select-none pointer-events-none tracking-tighter">
          {currentUniversity.shortName}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-9 text-white">
        <div className="max-w-2xl space-y-3.5">
          {/* Header Badges: Topic Segment & Iconic Building Attribution */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Topic Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[12px] border border-white/20 shadow-xs">
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0 shadow-xs ring-1 ring-white/50"
                style={{ backgroundColor: theme.badgeDot }}
              />
              <BadgeIcon className="w-3.5 h-3.5 text-white/90 shrink-0" />
              <span className="tracking-wide text-[12px]">
                {slide.badgePrefix && (
                  <span className="font-normal text-white/80">{slide.badgePrefix}</span>
                )}
                <span className="font-bold text-white">{slide.badgeSegment}</span>
              </span>
            </div>

            {/* Iconic Building Identifier Pill (Fetched from Official University Source) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] sm:text-[12px] text-white/90 border border-white/20 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="font-medium truncate max-w-[200px] sm:max-w-sm">
                {slide.buildingLabel}
              </span>
              {theme.sourceWebsite && (
                <a
                  href={theme.sourceWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-0.5 text-white/70 hover:text-white transition-colors"
                  title={
                    language === 'sw'
                      ? `Tembelea tovuti rasmi ya ${currentUniversity.shortName}`
                      : `Visit official ${currentUniversity.shortName} website`
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              )}
            </div>
          </div>

          {/* Screen title: 22–24px, Semibold (600) */}
          <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight leading-snug drop-shadow-sm">
            {slide.title}
          </h2>

          {/* Body text: 14–16px, Regular (400) */}
          <p className="text-[14px] sm:text-[15px] font-normal text-white/95 leading-relaxed max-w-xl drop-shadow-xs">
            {slide.description}
          </p>

          {/* Action Buttons: 14–16px, Semibold (600) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={slide.primaryAction.onClick}
              className="min-h-[44px] px-5 py-2.5 rounded-xl text-[14px] sm:text-[15px] font-semibold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer text-slate-950 hover:brightness-110"
              style={{ backgroundColor: theme.ctaBg }}
            >
              <PrimaryIcon className="w-4 h-4 stroke-[2.5]" />
              <span>{slide.primaryAction.label}</span>
            </button>

            <button
              type="button"
              onClick={slide.secondaryAction.onClick}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[14px] sm:text-[15px] font-semibold border border-white/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <SecondaryIcon className="w-4 h-4" />
              <span>{slide.secondaryAction.label}</span>
            </button>
          </div>
        </div>

        {/* Carousel Controls: Prev/Next Buttons & Progress Dots */}
        <div className="absolute right-4 bottom-4 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer backdrop-blur-xs"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 px-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx ? 'w-5' : 'w-1.5 bg-white/40'
                }`}
                style={activeSlide === idx ? { backgroundColor: theme.activeIndicator } : undefined}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer backdrop-blur-xs"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
