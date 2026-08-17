// Dark, gold-accented visual language shared across every real screen of the app
// (splash is the one deliberate exception — see app/index.tsx).
// Colors are taken from the client mockups: near-black background, warm gold accents,
// and five mood colors used consistently for glyphs, runes, and the DNA glow.

export const colors = {
  background: '#05040A',
  backgroundElevated: '#0B0913',
  surface: '#12101C',
  surfaceAlt: '#181428',
  border: 'rgba(232, 196, 132, 0.16)',
  borderStrong: 'rgba(232, 196, 132, 0.32)',
  textPrimary: '#F3EFE6',
  textSecondary: 'rgba(243, 239, 230, 0.64)',
  textFaint: 'rgba(243, 239, 230, 0.36)',
  gold: '#E9B54D',
  goldSoft: 'rgba(233, 181, 77, 0.24)',
  goldGlow: 'rgba(233, 181, 77, 0.55)',
} as const;

// Mood tags — the only thing in the app that is allowed to drive color/glow.
export type MoodTag = 'BLISKOSC' | 'TESKNOTA' | 'NAMIETNOSC' | 'RADOSC' | 'NAPIECIE';

export const moodColors: Record<MoodTag, string> = {
  BLISKOSC: '#E9B54D', // złoty
  TESKNOTA: '#4DD8E0', // cyan / turkus
  NAMIETNOSC: '#E85FA6', // róż / magenta
  RADOSC: '#B07CF0', // fiolet
  NAPIECIE: '#D8593A', // rdzawa czerwień
};

export const moodLabels: Record<MoodTag, string> = {
  BLISKOSC: 'Bliskość',
  TESKNOTA: 'Tęsknota',
  NAMIETNOSC: 'Namiętność',
  RADOSC: 'Radość',
  NAPIECIE: 'Napięcie',
};

export const neutralColor = '#C9CDD6';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const typography = {
  title: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 2 },
  heading: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 1 },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  stat: { fontSize: 20, fontWeight: '700' as const },
};
