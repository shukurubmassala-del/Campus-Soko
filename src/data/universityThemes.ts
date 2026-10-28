export interface UniversityBannerTheme {
  primaryColor: string;
  secondaryColor: string;
  sourceWebsite: string;
  slide1Gradient: string;
  slide2Gradient: string;
  slide3Gradient: string;
  borderGlow: string;
  glowColor: string;
  badgeDot: string;
  ctaBg: string;
  ctaHoverBg: string;
  activeIndicator: string;
  iconicBuildingName: {
    sw: string;
    en: string;
  };
  iconicBuildingImageUrl: string;
  iconicBuildingAltImageUrl?: string;
  landmarkSpot: {
    sw: string;
    en: string;
  };
}

export const UNIVERSITY_BANNER_THEMES: Record<string, UniversityBannerTheme> = {
  // University of Dar es Salaam (udsm.ac.tz) - Official Royal Blue & Gold
  udsm: {
    primaryColor: '#0864af',
    secondaryColor: '#f59e0b',
    sourceWebsite: 'https://www.udsm.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(8, 100, 175, 0.92) 0%, rgba(3, 60, 109, 0.88) 55%, rgba(2, 28, 51, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(2, 26, 48, 0.94) 0%, rgba(8, 100, 175, 0.86) 60%, rgba(1, 15, 28, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(180, 83, 9, 0.92) 0%, rgba(8, 100, 175, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#0864af50',
    glowColor: '#0864af',
    badgeDot: '#f59e0b',
    ctaBg: '#f59e0b',
    ctaHoverBg: '#d97706',
    activeIndicator: '#f59e0b',
    iconicBuildingName: {
      sw: 'Maktaba Kuu ya UDSM (Mlimani Hill)',
      en: 'Dr. Wilbert Chagula & New Central Library',
    },
    iconicBuildingImageUrl: 'https://www.udsm.ac.tz/sites/default/files/gva-sliderlayer-upload/udsm-2.jpg',
    iconicBuildingAltImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Nkrumah.JPG',
    landmarkSpot: {
      sw: 'Ngazi za Maktaba Kuu ya Dr. Wilbert Chagula au Nkrumah Hall',
      en: 'Dr. Wilbert Chagula Library steps or Nkrumah Hall',
    },
  },

  // University of Dodoma (udom.ac.tz) - Official Brand Blue & Dodoma Gold
  udom: {
    primaryColor: '#165d9e',
    secondaryColor: '#eab308',
    sourceWebsite: 'https://www.udom.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(22, 93, 158, 0.92) 0%, rgba(32, 58, 95, 0.88) 55%, rgba(10, 23, 39, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(9, 26, 43, 0.94) 0%, rgba(22, 93, 158, 0.86) 60%, rgba(5, 14, 24, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(161, 98, 7, 0.92) 0%, rgba(22, 93, 158, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#165d9e50',
    glowColor: '#165d9e',
    badgeDot: '#eab308',
    ctaBg: '#eab308',
    ctaHoverBg: '#ca8a04',
    activeIndicator: '#eab308',
    iconicBuildingName: {
      sw: 'Jengo la CIVE & Viwanja vya Chimwaga',
      en: 'CIVE Concourse & Central Infrastructure',
    },
    iconicBuildingImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/University_of_Dodoma.jpg/1280px-University_of_Dodoma.jpg',
    iconicBuildingAltImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/UDOM_Dormitories.png',
    landmarkSpot: {
      sw: 'Eneo la Concourse ya CIVE au Maktaba Kuu',
      en: 'CIVE Concourse or Central Library front steps',
    },
  },

  // Sokoine University of Agriculture (sua.ac.tz) - Camarone Forest Green & Confetti Yellow
  sua: {
    primaryColor: '#006400',
    secondaryColor: '#e6db42',
    sourceWebsite: 'https://www.sua.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(0, 100, 0, 0.92) 0%, rgba(0, 77, 0, 0.88) 55%, rgba(2, 32, 5, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(3, 28, 7, 0.94) 0%, rgba(0, 100, 0, 0.86) 60%, rgba(1, 14, 3, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(133, 77, 14, 0.92) 0%, rgba(0, 100, 0, 0.85) 55%, rgba(2, 28, 7, 0.94) 100%)',
    borderGlow: '#00640050',
    glowColor: '#006400',
    badgeDot: '#facc15',
    ctaBg: '#facc15',
    ctaHoverBg: '#eab308',
    activeIndicator: '#facc15',
    iconicBuildingName: {
      sw: 'Jengo la CCBI & Maktaba ya Kilimo (SNAL)',
      en: 'CCBI Academic Complex & SNAL Library',
    },
    iconicBuildingImageUrl: 'https://www.sua.ac.tz/sites/default/files/styles/mt_teaser/public/images/Article/2026/CCBI%20building%20edited.jpg',
    iconicBuildingAltImageUrl: 'https://www.lib.sua.ac.tz/images/slider/register_with_usnew.jpg',
    landmarkSpot: {
      sw: 'Mbele ya Maktaba Kuu ya Kilimo (SNAL) au Jengo la Utawala',
      en: 'Sokoine National Agricultural Library (SNAL) entrance',
    },
  },

  // Muhimbili University of Health & Allied Sciences (muhas.ac.tz) - Deep Medical Blue & Healthcare Crimson
  muhas: {
    primaryColor: '#004080',
    secondaryColor: '#dc2626',
    sourceWebsite: 'https://www.muhas.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(0, 64, 128, 0.92) 0%, rgba(0, 40, 82, 0.88) 55%, rgba(1, 17, 36, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(2, 20, 41, 0.94) 0%, rgba(0, 64, 128, 0.86) 60%, rgba(1, 10, 20, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(153, 27, 27, 0.92) 0%, rgba(0, 64, 128, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#00408050',
    glowColor: '#004080',
    badgeDot: '#ef4444',
    ctaBg: '#ef4444',
    ctaHoverBg: '#dc2626',
    activeIndicator: '#ef4444',
    iconicBuildingName: {
      sw: 'Jengo la Taaluma na Tiba MUHAS Upanga',
      en: 'MUHAS Upanga Academic & Medical Complex',
    },
    iconicBuildingImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Muhimbili_University_of_Health_and_Allied_Sciences_2.jpg',
    landmarkSpot: {
      sw: 'Mapokezi ya Maktaba ya Upanga au Lango Kuu la UN Road',
      en: 'MUHAS Upanga Library reception or Main Gate (UN Rd)',
    },
  },

  // Ardhi University (aru.ac.tz) - Lochmara Blue & Sycamore Olive Gold
  ardhi: {
    primaryColor: '#0a7abe',
    secondaryColor: '#a09539',
    sourceWebsite: 'https://www.aru.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(10, 122, 190, 0.92) 0%, rgba(6, 78, 124, 0.88) 55%, rgba(2, 36, 61, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(3, 25, 43, 0.94) 0%, rgba(10, 122, 190, 0.86) 60%, rgba(1, 12, 23, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(133, 77, 14, 0.92) 0%, rgba(10, 122, 190, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#0a7abe50',
    glowColor: '#0a7abe',
    badgeDot: '#fbbf24',
    ctaBg: '#fbbf24',
    ctaHoverBg: '#f59e0b',
    activeIndicator: '#fbbf24',
    iconicBuildingName: {
      sw: 'Kitivo cha Usanifu Majengo (Observation Hill)',
      en: 'School of Architecture & Design Complex',
    },
    iconicBuildingImageUrl: 'https://www.aru.ac.tz/uploads/gallery/2d470305b3468422aa6b5a09310f0dd4.jpeg',
    landmarkSpot: {
      sw: 'Baraza la Maktaba ya Ardhi au Uwanja wa Usanifu',
      en: 'Ardhi University Library verandah or Architecture Courtyard',
    },
  },

  // Mzumbe University (mzumbe.ac.tz / mu.ac.tz) - Mzumbe Forest Green & Golden Yellow
  mzumbe: {
    primaryColor: '#005432',
    secondaryColor: '#f59e0b',
    sourceWebsite: 'https://www.mzumbe.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(0, 84, 50, 0.92) 0%, rgba(0, 51, 30, 0.88) 55%, rgba(1, 25, 14, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(1, 25, 14, 0.94) 0%, rgba(0, 84, 50, 0.86) 60%, rgba(0, 12, 6, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(180, 83, 9, 0.92) 0%, rgba(0, 84, 50, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#00543250',
    glowColor: '#005432',
    badgeDot: '#f59e0b',
    ctaBg: '#f59e0b',
    ctaHoverBg: '#d97706',
    activeIndicator: '#f59e0b',
    iconicBuildingName: {
      sw: 'Jengo Kuu la Kawawa & Uwanja wa Uhuru',
      en: 'Kawawa Administration Block & Freedom Square',
    },
    iconicBuildingImageUrl: 'https://mu.ac.tz/media/images/ABOUT-THE-UNIVERSITY_pvT4cXK.jpg',
    iconicBuildingAltImageUrl: 'https://mu.ac.tz/media/images/SLIDER-PAGE-WEBSITE-23_PPHQ0uu.jpg',
    landmarkSpot: {
      sw: 'Ngazi za Maktaba Kuu ya Mzumbe au Uwanja wa Uhuru (Mvomero)',
      en: 'Mzumbe Main Library steps or Freedom Square (Mvomero)',
    },
  },

  // St. Augustine University of Tanzania (saut.ac.tz) - Cardinal Red & Gold
  saut: {
    primaryColor: '#7a1221',
    secondaryColor: '#f59e0b',
    sourceWebsite: 'https://www.saut.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(122, 18, 33, 0.92) 0%, rgba(74, 9, 18, 0.88) 55%, rgba(34, 3, 7, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(34, 3, 7, 0.94) 0%, rgba(122, 18, 33, 0.86) 60%, rgba(17, 1, 3, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(180, 83, 9, 0.92) 0%, rgba(122, 18, 33, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#7a122150',
    glowColor: '#7a1221',
    badgeDot: '#facc15',
    ctaBg: '#facc15',
    ctaHoverBg: '#eab308',
    activeIndicator: '#facc15',
    iconicBuildingName: {
      sw: 'Majengo ya Mihadhara ya Fr. Mwanjonde (Nyegezi)',
      en: 'Fr. Mwanjonde Lecture Complex & Administration',
    },
    iconicBuildingImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/St._Augustine_University_of_Tanzania_02.jpg/1280px-St._Augustine_University_of_Tanzania_02.jpg',
    iconicBuildingAltImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/St._Augustine_University_of_Tanzania_02.jpg',
    landmarkSpot: {
      sw: 'Lango la Maktaba ya Nyegezi au Uwanja wa Chapel',
      en: 'SAUT Nyegezi Library entrance or St. Thomas Aquinas Chapel grounds',
    },
  },

  // College of Business Education (cbe.ac.tz) - CBE Deep Navy & Cyan/Sky Blue
  cbe: {
    primaryColor: '#002b49',
    secondaryColor: '#0284c7',
    sourceWebsite: 'https://www.cbe.ac.tz',
    slide1Gradient: 'linear-gradient(135deg, rgba(0, 43, 73, 0.92) 0%, rgba(0, 23, 38, 0.88) 55%, rgba(1, 13, 23, 0.94) 100%)',
    slide2Gradient: 'linear-gradient(135deg, rgba(1, 15, 28, 0.94) 0%, rgba(0, 43, 73, 0.86) 60%, rgba(0, 7, 13, 0.95) 100%)',
    slide3Gradient: 'linear-gradient(135deg, rgba(3, 105, 161, 0.92) 0%, rgba(0, 43, 73, 0.85) 55%, rgba(15, 23, 42, 0.94) 100%)',
    borderGlow: '#002b4950',
    glowColor: '#002b49',
    badgeDot: '#38bdf8',
    ctaBg: '#38bdf8',
    ctaHoverBg: '#0284c7',
    activeIndicator: '#38bdf8',
    iconicBuildingName: {
      sw: 'Jengo Kuu la Utawala CBE (Bibi Titi)',
      en: 'CBE Main Administration Tower (Bibi Titi)',
    },
    iconicBuildingImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/CBE_Administration_Block.jpg',
    landmarkSpot: {
      sw: 'Mapokezi ya Maktaba ya Bibi Titi au Cafeteria Kuu',
      en: 'CBE Bibi Titi Library Reception or Main Cafeteria',
    },
  },
};

// Fallback for custom added universities (Balanced Navy Blue #2C3E50 + Orange #E67E22)
const DEFAULT_BANNER_THEME: UniversityBannerTheme = {
  primaryColor: '#2C3E50',
  secondaryColor: '#E67E22',
  sourceWebsite: '',
  slide1Gradient: 'linear-gradient(135deg, rgba(44, 62, 80, 0.92) 0%, rgba(26, 37, 47, 0.88) 55%, rgba(16, 23, 30, 0.94) 100%)',
  slide2Gradient: 'linear-gradient(135deg, rgba(26, 37, 47, 0.94) 0%, rgba(44, 62, 80, 0.86) 60%, rgba(13, 19, 24, 0.95) 100%)',
  slide3Gradient: 'linear-gradient(135deg, rgba(230, 126, 34, 0.92) 0%, rgba(44, 62, 80, 0.85) 55%, rgba(16, 23, 30, 0.94) 100%)',
  borderGlow: '#2C3E5050',
  glowColor: '#2C3E50',
  badgeDot: '#E67E22',
  ctaBg: '#E67E22',
  ctaHoverBg: '#D35400',
  activeIndicator: '#E67E22',
  iconicBuildingName: {
    sw: 'Jengo Kuu la Chuo Kikuu',
    en: 'Main Campus Administration Complex',
  },
  iconicBuildingImageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1400&q=80',
  landmarkSpot: {
    sw: 'Mbele ya Maktaba Kuu ya Chuo au Lango Kuu',
    en: 'Main University Library entrance or Main Gate',
  },
};

export function getUniversityBannerTheme(universityId: string): UniversityBannerTheme {
  const normalizedId = universityId.toLowerCase().trim();
  return UNIVERSITY_BANNER_THEMES[normalizedId] || DEFAULT_BANNER_THEME;
}
