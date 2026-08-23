// Noir / case-file visual language (rebuild v2 — "Zuza's Diary: Case Log").
// Replaces the earlier gold-on-black "relationship calendar" theme entirely.
// Palette lifted from the client's own asset-pack color swatch (Evidence Room
// legend: cream/tan paper, dark brown, near-black, olive, amber, purple, red).

export const colors = {
  background: '#0C0A08',
  backgroundElevated: '#151210',
  surface: '#1B1613',
  surfaceAlt: '#242019',
  paper: '#D9C9A3', // aged-paper cards/stamps/tickets
  paperDark: '#BFAE86',
  border: 'rgba(217, 201, 163, 0.16)',
  borderStrong: 'rgba(217, 201, 163, 0.34)',
  textPrimary: '#F1E7D2',
  textSecondary: 'rgba(241, 231, 210, 0.66)',
  textFaint: 'rgba(241, 231, 210, 0.38)',
  textOnPaper: '#241D18',
  gold: '#C99A4A', // muted UI accent (borders, active tab, links)
  goldSoft: 'rgba(201, 154, 74, 0.22)',
  goldGlow: 'rgba(201, 154, 74, 0.5)',
  red: '#A6342E', // CONFIDENTIAL stamps, destructive actions, HIGH priority
  redSoft: 'rgba(166, 52, 46, 0.22)',
  olive: '#5C6B3F', // ROUTINE / LOW priority
  amber: '#D97B29', // NOTED / MEDIUM priority
  purple: '#6B4E9E',
} as const;

// Mood tags — still the only thing allowed to drive glyph/marker color, now
// against the noir chrome instead of a gold-on-black one. Calendar day
// markers and glyph clusters key off these (data-driven, not baked into art).
export type MoodTag = 'BLISKOSC' | 'TESKNOTA' | 'NAMIETNOSC' | 'RADOSC' | 'NAPIECIE';

export const moodColors: Record<MoodTag, string> = {
  BLISKOSC: '#D9A441', // warm amber — closeness
  TESKNOTA: '#4FA7AE', // muted teal — longing
  NAMIETNOSC: '#B23A55', // deep red-pink — passion
  RADOSC: '#7C8F4A', // olive-green — joy
  NAPIECIE: '#8A5A9E', // muted purple — tension
};

export const moodLabels: Record<MoodTag, string> = {
  BLISKOSC: 'Closeness',
  TESKNOTA: 'Longing',
  NAMIETNOSC: 'Passion',
  RADOSC: 'Joy',
  NAPIECIE: 'Tension',
};

// Case priority (was "importance") — sekcja 8 ADD_ACTIVITY_TECH_SPEC.
export const priorityColors: Record<0 | 1 | 2, string> = {
  0: colors.olive, // ROUTINE
  1: colors.amber, // NOTED
  2: colors.red, // CRITICAL
};

export const priorityLabels: Record<0 | 1 | 2, string> = {
  0: 'ROUTINE',
  1: 'NOTED',
  2: 'CRITICAL',
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
  sm: 4, // case-file paper elements are sharp-ish, not pill-rounded
  md: 8,
  lg: 14,
  pill: 999,
};

// No condensed display webfont is bundled (avoids adding a new dependency to a
// build the user has to install locally) — 'monospace' approximates the
// "typewriter / case-file stamp" feel using each platform's built-in font.
export const fonts = {
  display: 'monospace',
  body: undefined as string | undefined,
};

export const typography = {
  title: { fontSize: 18, fontWeight: '700' as const, letterSpacing: 2, fontFamily: fonts.display },
  heading: { fontSize: 14, fontWeight: '700' as const, letterSpacing: 1.5, fontFamily: fonts.display },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  stat: { fontSize: 20, fontWeight: '700' as const },
  stamp: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 1, fontFamily: fonts.display },
};
