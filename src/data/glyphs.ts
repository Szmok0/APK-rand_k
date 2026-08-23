// Closed, final list of glyphs (icon set carried over from the previous build —
// "old icons stay" per product decision). These are now INCIDENT TYPES in the
// noir/case-file redesign, grouped under the same five categories as before,
// just relabelled in English. Duration rule is per-category (not per-glyph):
// MEETINGS always requires a time window; from CONTACT only phone/video_call do.

import type { Glyph, GlyphCategory, MoodTag } from '@/types/models';

type GlyphSeed = {
  id: string;
  name: string;
  category: GlyphCategory;
  moodTag: MoodTag | null;
};

const MEETINGS_ALWAYS_DURATION = new Set(['CONTACT_phone', 'CONTACT_video_call']);

const SEEDS: GlyphSeed[] = [
  // CONTACT
  { id: 'first_message', name: 'First Message', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'message', name: 'Message', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'phone', name: 'Phone Call', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'video_call', name: 'Video Call', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'ghosting', name: 'Ghosting', category: 'CONTACT', moodTag: 'NAPIECIE' },
  { id: 'reconnect', name: 'Return of Contact', category: 'CONTACT', moodTag: 'TESKNOTA' },
  // DATING (neutral, does not count toward mood)
  { id: 'swipe', name: 'Swipe', category: 'DATING', moodTag: null },
  { id: 'match', name: 'Match', category: 'DATING', moodTag: null },
  { id: 'tinder_installed', name: 'App Installed', category: 'DATING', moodTag: null },
  { id: 'invitation', name: 'Invitation', category: 'DATING', moodTag: null },
  // MEETINGS
  { id: 'coffee', name: 'Coffee', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'dinner', name: 'Dinner', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'drink', name: 'Drink', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'walk', name: 'Walk', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'picnic', name: 'Picnic', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'cinema', name: 'Cinema', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'concert', name: 'Concert', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'trip', name: 'Trip', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'night', name: 'Night Together', category: 'MEETINGS', moodTag: 'NAMIETNOSC' },
  // EMOTIONS
  { id: 'important_talk', name: 'Important Conversation', category: 'EMOTION', moodTag: 'NAPIECIE' },
  { id: 'argument', name: 'Argument', category: 'EMOTION', moodTag: 'NAPIECIE' },
  { id: 'reconciliation', name: 'Reconciliation', category: 'EMOTION', moodTag: 'RADOSC' },
  { id: 'intimate_moment', name: 'Close Moment', category: 'EMOTION', moodTag: 'NAMIETNOSC' },
  { id: 'breakup', name: 'Breakup', category: 'EMOTION', moodTag: 'NAPIECIE' },
  // OBJECTS
  { id: 'gift', name: 'Gift', category: 'OBJECTS', moodTag: 'RADOSC' },
  { id: 'flowers', name: 'Flowers', category: 'OBJECTS', moodTag: 'RADOSC' },
  { id: 'surprise', name: 'Surprise', category: 'OBJECTS', moodTag: 'RADOSC' },
];

function requiresDuration(category: GlyphCategory, id: string): boolean {
  if (category === 'MEETINGS') return true;
  if (MEETINGS_ALWAYS_DURATION.has(`CONTACT_${id}`)) return true;
  return false;
}

export const GLYPHS: Glyph[] = SEEDS.map((seed) => ({
  ...seed,
  requiresDuration: requiresDuration(seed.category, seed.id),
}));

export const GLYPH_MAP: Record<string, Glyph> = Object.fromEntries(
  GLYPHS.map((g) => [g.id, g])
);

// Category labels doubling as "incident type" section headers in New Entry / Add Activity.
export const GLYPH_CATEGORIES: { key: GlyphCategory; label: string }[] = [
  { key: 'CONTACT', label: 'Contact' },
  { key: 'DATING', label: 'Dating' },
  { key: 'MEETINGS', label: 'Meetings' },
  { key: 'EMOTION', label: 'Emotions' },
  { key: 'OBJECTS', label: 'Objects' },
];

// Default graphic variant for `drink` is wine (second variant `drink_OPTION_cocktail`
// stays in assets — swapping it is a one-line change in the map below).
//
// `*_transparent.png` files: the original client PNGs had a fully opaque alpha
// channel (black squares instead of blending into the background). Fixed
// algorithmically (luma-key: alpha = max(r,g,b) — the near-black background becomes
// transparent, the glowing line keeps its soft, partially transparent glow). The
// artwork and color of the originals were always correct — only the alpha was broken.
export const GLYPH_ICONS: Record<string, any> = {
  first_message: require('../../assets/glyphs/first_message_transparent.png'),
  message: require('../../assets/glyphs/message_transparent.png'),
  phone: require('../../assets/glyphs/phone_transparent.png'),
  video_call: require('../../assets/glyphs/video_call_transparent.png'),
  ghosting: require('../../assets/glyphs/ghosting_transparent.png'),
  reconnect: require('../../assets/glyphs/reconnect_transparent.png'),
  swipe: require('../../assets/glyphs/swipe_transparent.png'),
  match: require('../../assets/glyphs/match_transparent.png'),
  tinder_installed: require('../../assets/glyphs/tinder_installed_transparent.png'),
  invitation: require('../../assets/glyphs/invitation_transparent.png'),
  coffee: require('../../assets/glyphs/coffee_transparent.png'),
  dinner: require('../../assets/glyphs/dinner_transparent.png'),
  drink: require('../../assets/glyphs/drink_OPTION_wine_transparent.png'),
  walk: require('../../assets/glyphs/walk_transparent.png'),
  picnic: require('../../assets/glyphs/picnic_transparent.png'),
  cinema: require('../../assets/glyphs/cinema_transparent.png'),
  concert: require('../../assets/glyphs/concert_transparent.png'),
  trip: require('../../assets/glyphs/trip_transparent.png'),
  night: require('../../assets/glyphs/night_transparent.png'),
  important_talk: require('../../assets/glyphs/important_talk_transparent.png'),
  argument: require('../../assets/glyphs/argument_transparent.png'),
  reconciliation: require('../../assets/glyphs/reconciliation_transparent.png'),
  intimate_moment: require('../../assets/glyphs/intimate_moment_transparent.png'),
  breakup: require('../../assets/glyphs/breakup_transparent.png'),
  gift: require('../../assets/glyphs/gift_transparent.png'),
  flowers: require('../../assets/glyphs/flowers_transparent.png'),
  surprise: require('../../assets/glyphs/surprise_transparent.png'),
};

// Mood-tag runes — retained for compatibility with existing glyph-cluster code;
// no longer rendered on a DNA/galaxy visualization (that screen is gone), but the
// underlying mood-tag-to-color mapping is still used for calendar day markers.
export const RUNE_ICONS: Record<MoodTag, any> = {
  BLISKOSC: require('../../assets/runes/closeness_transparent.png'),
  TESKNOTA: require('../../assets/runes/longing_transparent.png'),
  NAMIETNOSC: require('../../assets/runes/passion_transparent.png'),
  RADOSC: require('../../assets/runes/joy_transparent.png'),
  NAPIECIE: require('../../assets/runes/tension_transparent.png'),
};
