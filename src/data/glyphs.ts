// Closed, final list of glyphs (icon set carried over from the previous build —
// "old icons stay" per product decision). These are now INCIDENT TYPES in the
// noir/case-file redesign. Duration rule is per-category (not per-glyph):
// MEETINGS always requires a time window; from CONTACT only phone/video_call do.
//
// 8 new packs (38 icons) added on top of the original 27 after real-usage
// feedback ("more activity icons"). Deliberately kept OUT of a new category
// taxonomy: `category` stays the same 5 values it always was, so every
// downstream engine (dayBadges → DNA scoring, LID PREVIEW stats, Evidence
// Archive's filter tabs) keeps working with zero changes — new icons just
// map onto whichever existing category fits. `pack` is a SEPARATE,
// UI-only field: it's what Add Activity groups icons under (can be as rich
// as the 8 new pack names), independent of what the engines see. Mapping
// agreed with the product owner:
// - "meeting-shaped" packs (At Home, Culture/Creative, Outdoor/Active,
//   Social/Events, Everyday Life) → category MEETINGS, forces a time
//   window, same as the original 9 MEETINGS glyphs.
// - "non-meeting" packs (Physical/Closeness, Relationship Events,
//   Zuza/Special) → category EMOTION, no forced time window (can happen
//   over text/call too, like the original 5 EMOTION glyphs).
//
// Icon art: no real custom-illustrated assets existed for these 38 (see
// AGENTS.md "missing assets get reported, not invented" — flagged to the
// product owner first). Generated programmatically instead: an Ionicons
// glyph (already an app dependency) rendered with the same mood-tag color +
// soft-glow + small sparkle-accent treatment as the original set, not
// pixel-identical bespoke art but visually consistent — see
// GLYPH_ICONS below and the generation approach documented there.

import type { Glyph, GlyphCategory, MoodTag } from '@/types/models';

type GlyphSeed = {
  id: string;
  name: string;
  category: GlyphCategory;
  moodTag: MoodTag | null;
  // Omitted for the original 27 — they fall back to their category's own
  // label (CATEGORY_LABELS below), keeping their existing Add Activity
  // section headers exactly as they were.
  pack?: string;
};

const MEETINGS_ALWAYS_DURATION = new Set(['CONTACT_phone', 'CONTACT_video_call']);

const CATEGORY_LABELS: Record<GlyphCategory, string> = {
  CONTACT: 'Contact',
  DATING: 'Dating',
  MEETINGS: 'Meetings',
  EMOTION: 'Emotions',
  OBJECTS: 'Objects',
};

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

  // --- 8 new packs (38 icons) ---

  // PACK 1 — Physical / Closeness (brief, intimate moments — not a separate
  // outing, same treatment as the existing "Close Moment" glyph)
  { id: 'kiss', name: 'Kiss', category: 'EMOTION', moodTag: 'NAMIETNOSC', pack: 'Physical / Closeness' },
  { id: 'hug', name: 'Hug', category: 'EMOTION', moodTag: 'BLISKOSC', pack: 'Physical / Closeness' },
  { id: 'hold_hands', name: 'Hold Hands', category: 'EMOTION', moodTag: 'BLISKOSC', pack: 'Physical / Closeness' },
  // PACK 2 — At Home (shared time, requires a time window)
  { id: 'watching', name: 'Watching', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'At Home' },
  { id: 'game_night', name: 'Game Night', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'At Home' },
  { id: 'reading', name: 'Reading', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'At Home' },
  // PACK 3 — Culture / Creative
  { id: 'museum', name: 'Museum', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Culture / Creative' },
  { id: 'exhibition', name: 'Exhibition', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Culture / Creative' },
  { id: 'theatre', name: 'Theatre', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Culture / Creative' },
  { id: 'karaoke', name: 'Karaoke', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Culture / Creative' },
  { id: 'dance', name: 'Dance', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Culture / Creative' },
  { id: 'creative_diy', name: 'Creative / DIY', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Culture / Creative' },
  // PACK 4 — Outdoor / Active
  { id: 'hike', name: 'Hike', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Outdoor / Active' },
  { id: 'bike', name: 'Bike', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Outdoor / Active' },
  { id: 'swimming', name: 'Swimming', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Outdoor / Active' },
  { id: 'sport', name: 'Sport', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Outdoor / Active' },
  { id: 'beach', name: 'Beach', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Outdoor / Active' },
  { id: 'stargazing', name: 'Stargazing', category: 'MEETINGS', moodTag: 'BLISKOSC', pack: 'Outdoor / Active' },
  // PACK 5 — Social / Events
  { id: 'party', name: 'Party', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Social / Events' },
  { id: 'birthday', name: 'Birthday', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Social / Events' },
  { id: 'family_event', name: 'Family Event', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Social / Events' },
  { id: 'friends', name: 'Friends', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Social / Events' },
  { id: 'celebration', name: 'Celebration', category: 'MEETINGS', moodTag: 'RADOSC', pack: 'Social / Events' },
  // PACK 6 — Relationship Events (can happen over text/call — no forced
  // time window, same treatment as the existing EMOTION glyphs)
  { id: 'apology', name: 'Apology', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Relationship Events' },
  { id: 'compliment', name: 'Compliment', category: 'EMOTION', moodTag: 'RADOSC', pack: 'Relationship Events' },
  { id: 'promise', name: 'Promise', category: 'EMOTION', moodTag: 'BLISKOSC', pack: 'Relationship Events' },
  { id: 'deep_talk', name: 'Deep Talk', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Relationship Events' },
  { id: 'confession', name: 'Confession', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Relationship Events' },
  { id: 'decision', name: 'Decision', category: 'EMOTION', moodTag: null, pack: 'Relationship Events' },
  // PACK 7 — Everyday Life (product owner: "done together", so MEETINGS —
  // requires a time window like the rest of that bucket — but mundane
  // enough that it doesn't carry a mood color, same null-mood precedent as
  // DATING's swipe/match)
  { id: 'shopping', name: 'Shopping', category: 'MEETINGS', moodTag: null, pack: 'Everyday Life' },
  { id: 'errands', name: 'Errands', category: 'MEETINGS', moodTag: null, pack: 'Everyday Life' },
  { id: 'chores', name: 'Chores', category: 'MEETINGS', moodTag: null, pack: 'Everyday Life' },
  // PACK 8 — Zuza / Special (no forced time window; red_flag/fight also
  // count toward INCIDENT — see SPECIAL_INCIDENT_GLYPH_IDS below)
  { id: 'jealousy', name: 'Jealousy', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Zuza / Special' },
  { id: 'red_flag', name: 'Red Flag', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Zuza / Special' },
  { id: 'green_flag', name: 'Green Flag', category: 'EMOTION', moodTag: 'RADOSC', pack: 'Zuza / Special' },
  { id: 'fight', name: 'Fight', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Zuza / Special' },
  { id: 'missed_moment', name: 'Missed Moment', category: 'EMOTION', moodTag: 'TESKNOTA', pack: 'Zuza / Special' },
  { id: 'unexpected', name: 'Unexpected', category: 'EMOTION', moodTag: 'NAPIECIE', pack: 'Zuza / Special' },
];

// Glyphs that count as an INCIDENT (dayBadges) purely by being present on an
// activity — independent of manually-set case priority. Kept small and
// explicit on purpose (product owner: "if it's cheap, let's do it" — this
// is the entire cost: one shared set, read by dayBadges.ts for the Calendar
// badge/DNA weight and by summary.ts's incidentCount() for LID PREVIEW's
// threat score).
export const SPECIAL_INCIDENT_GLYPH_IDS = new Set(['red_flag', 'fight']);

function requiresDuration(category: GlyphCategory, id: string): boolean {
  if (category === 'MEETINGS') return true;
  if (MEETINGS_ALWAYS_DURATION.has(`CONTACT_${id}`)) return true;
  return false;
}

export const GLYPHS: Glyph[] = SEEDS.map((seed) => ({
  ...seed,
  pack: seed.pack ?? CATEGORY_LABELS[seed.category],
  requiresDuration: requiresDuration(seed.category, seed.id),
}));

export const GLYPH_MAP: Record<string, Glyph> = Object.fromEntries(
  GLYPHS.map((g) => [g.id, g])
);

// Category labels doubling as "incident type" section headers in New Entry / Add Activity.
// Superseded for the UI grouping by GLYPH_PACKS below (kept — still used
// wherever code groups by the real 5-value category, e.g. nothing left
// today, but harmless to keep for that meaning).
export const GLYPH_CATEGORIES: { key: GlyphCategory; label: string }[] = [
  { key: 'CONTACT', label: 'Contact' },
  { key: 'DATING', label: 'Dating' },
  { key: 'MEETINGS', label: 'Meetings' },
  { key: 'EMOTION', label: 'Emotions' },
  { key: 'OBJECTS', label: 'Objects' },
];

// Add Activity's actual section order: the original 5 category headers
// first (unchanged), then the 8 new packs in the order they were designed.
// Purely a UI grouping — see the `pack` field comment above for why this
// is kept separate from `category`.
export const GLYPH_PACKS: string[] = [
  ...GLYPH_CATEGORIES.map((c) => c.label),
  'Physical / Closeness',
  'At Home',
  'Culture / Creative',
  'Outdoor / Active',
  'Social / Events',
  'Relationship Events',
  'Everyday Life',
  'Zuza / Special',
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

  // The 38 new-pack icons: no bespoke source art existed for these (see the
  // header comment above), so they're generated rather than hand-drawn —
  // an Ionicons glyph (already an app dependency) rendered at high
  // resolution, colored to the glyph's own moodTag, with a blurred glow
  // duplicate underneath and a small sparkle accent, matching the existing
  // set's look closely enough not to visually clash. Real bespoke
  // replacements can drop in later at the same file paths with zero code
  // changes.
  kiss: require('../../assets/glyphs/kiss_transparent.png'),
  hug: require('../../assets/glyphs/hug_transparent.png'),
  hold_hands: require('../../assets/glyphs/hold_hands_transparent.png'),
  watching: require('../../assets/glyphs/watching_transparent.png'),
  game_night: require('../../assets/glyphs/game_night_transparent.png'),
  reading: require('../../assets/glyphs/reading_transparent.png'),
  museum: require('../../assets/glyphs/museum_transparent.png'),
  exhibition: require('../../assets/glyphs/exhibition_transparent.png'),
  theatre: require('../../assets/glyphs/theatre_transparent.png'),
  karaoke: require('../../assets/glyphs/karaoke_transparent.png'),
  dance: require('../../assets/glyphs/dance_transparent.png'),
  creative_diy: require('../../assets/glyphs/creative_diy_transparent.png'),
  hike: require('../../assets/glyphs/hike_transparent.png'),
  bike: require('../../assets/glyphs/bike_transparent.png'),
  swimming: require('../../assets/glyphs/swimming_transparent.png'),
  sport: require('../../assets/glyphs/sport_transparent.png'),
  beach: require('../../assets/glyphs/beach_transparent.png'),
  stargazing: require('../../assets/glyphs/stargazing_transparent.png'),
  party: require('../../assets/glyphs/party_transparent.png'),
  birthday: require('../../assets/glyphs/birthday_transparent.png'),
  family_event: require('../../assets/glyphs/family_event_transparent.png'),
  friends: require('../../assets/glyphs/friends_transparent.png'),
  celebration: require('../../assets/glyphs/celebration_transparent.png'),
  apology: require('../../assets/glyphs/apology_transparent.png'),
  compliment: require('../../assets/glyphs/compliment_transparent.png'),
  promise: require('../../assets/glyphs/promise_transparent.png'),
  deep_talk: require('../../assets/glyphs/deep_talk_transparent.png'),
  confession: require('../../assets/glyphs/confession_transparent.png'),
  decision: require('../../assets/glyphs/decision_transparent.png'),
  shopping: require('../../assets/glyphs/shopping_transparent.png'),
  errands: require('../../assets/glyphs/errands_transparent.png'),
  chores: require('../../assets/glyphs/chores_transparent.png'),
  jealousy: require('../../assets/glyphs/jealousy_transparent.png'),
  red_flag: require('../../assets/glyphs/red_flag_transparent.png'),
  green_flag: require('../../assets/glyphs/green_flag_transparent.png'),
  fight: require('../../assets/glyphs/fight_transparent.png'),
  missed_moment: require('../../assets/glyphs/missed_moment_transparent.png'),
  unexpected: require('../../assets/glyphs/unexpected_transparent.png'),
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
