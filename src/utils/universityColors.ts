export interface UniversityColorIdentity {
  id: string;
  shortName: string;
  name: string;
  primary: string;
  secondary: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export const UNIVERSITY_COLORS: Record<string, UniversityColorIdentity> = {
  udsm: {
    id: 'udsm',
    shortName: 'UDSM',
    name: 'University of Dar es Salaam',
    primary: '#0B4F9C', // Royal Blue
    secondary: '#D4AF37', // Gold
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-200',
    badgeBorder: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-[#0B4F9C]',
  },
  udom: {
    id: 'udom',
    shortName: 'UDOM',
    name: 'University of Dodoma',
    primary: '#800020', // Maroon / Wine Red
    secondary: '#D4AC0D', // Yellow/Gold
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    dotColor: 'bg-[#800020]',
  },
  sua: {
    id: 'sua',
    shortName: 'SUA',
    name: 'Sokoine University of Agriculture',
    primary: '#1B5E20', // Agricultural Forest Green
    secondary: '#F1C40F', // Sun Yellow
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-[#1B5E20]',
  },
  muhas: {
    id: 'muhas',
    shortName: 'MUHAS',
    name: 'Muhimbili University of Health & Allied Sciences',
    primary: '#008080', // Medical Deep Teal
    secondary: '#48C9B0', // Light Teal
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    badgeText: 'text-teal-800 dark:text-teal-200',
    badgeBorder: 'border-teal-200 dark:border-teal-800',
    dotColor: 'bg-[#008080]',
  },
  ardhi: {
    id: 'ardhi',
    shortName: 'ARU',
    name: 'Ardhi University',
    primary: '#B23B23', // Terracotta / Earth Red
    secondary: '#D35400', // Ochre
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-900 dark:text-amber-200',
    badgeBorder: 'border-amber-300 dark:border-amber-800',
    dotColor: 'bg-[#B23B23]',
  },
  mzumbe: {
    id: 'mzumbe',
    shortName: 'MU',
    name: 'Mzumbe University',
    primary: '#5E2D79', // Plum Purple
    secondary: '#F39C12', // Gold
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-200',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    dotColor: 'bg-[#5E2D79]',
  },
  saut: {
    id: 'saut',
    shortName: 'SAUT',
    name: 'St. Augustine University of Tanzania',
    primary: '#154360', // Marian Cobalt Blue
    secondary: '#5DADE2', // Sky Blue
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-200',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    dotColor: 'bg-[#154360]',
  },
  cbe: {
    id: 'cbe',
    shortName: 'CBE',
    name: 'College of Business Education',
    primary: '#1A365D', // Deep Commerce Navy
    secondary: '#2980B9', // Bright Blue
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    dotColor: 'bg-[#1A365D]',
  },
};

export const getUniversityColor = (universityId?: string): UniversityColorIdentity => {
  if (!universityId) return UNIVERSITY_COLORS.udsm;
  const key = universityId.toLowerCase();
  return (
    UNIVERSITY_COLORS[key] || {
      id: key,
      shortName: universityId.toUpperCase(),
      name: universityId,
      primary: '#2C3E50',
      secondary: '#E67E22',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-800 dark:text-slate-200',
      badgeBorder: 'border-slate-300 dark:border-slate-700',
      dotColor: 'bg-[#2C3E50]',
    }
  );
};
