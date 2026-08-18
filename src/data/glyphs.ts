// Zamknięta, finalna lista 27 glifów — sekcja 13 MD.
// Reguła czasu jest per-kategoria (nie per-glif): MEETINGS zawsze TAK,
// z CONTACT tylko phone/video_call, cała reszta NIE.

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
  { id: 'first_message', name: 'Pierwsza wiadomość', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'message', name: 'Wiadomość', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'phone', name: 'Telefon', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'video_call', name: 'Rozmowa wideo', category: 'CONTACT', moodTag: 'TESKNOTA' },
  { id: 'ghosting', name: 'Ghosting', category: 'CONTACT', moodTag: 'NAPIECIE' },
  { id: 'reconnect', name: 'Powrót kontaktu', category: 'CONTACT', moodTag: 'TESKNOTA' },
  // DATING (neutralne, nie liczą się do nastroju)
  { id: 'swipe', name: 'Swipe', category: 'DATING', moodTag: null },
  { id: 'match', name: 'Match', category: 'DATING', moodTag: null },
  { id: 'tinder_installed', name: 'Instalacja aplikacji', category: 'DATING', moodTag: null },
  { id: 'invitation', name: 'Zaproszenie', category: 'DATING', moodTag: null },
  // MEETINGS
  { id: 'coffee', name: 'Kawa', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'dinner', name: 'Kolacja', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'drink', name: 'Drink', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'walk', name: 'Spacer', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'picnic', name: 'Piknik', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'cinema', name: 'Kino', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'concert', name: 'Koncert', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'trip', name: 'Wyjazd', category: 'MEETINGS', moodTag: 'BLISKOSC' },
  { id: 'night', name: 'Noc razem', category: 'MEETINGS', moodTag: 'NAMIETNOSC' },
  // EMOTION
  { id: 'important_talk', name: 'Ważna rozmowa', category: 'EMOTION', moodTag: 'NAPIECIE' },
  { id: 'argument', name: 'Kłótnia', category: 'EMOTION', moodTag: 'NAPIECIE' },
  { id: 'reconciliation', name: 'Pojednanie', category: 'EMOTION', moodTag: 'RADOSC' },
  { id: 'intimate_moment', name: 'Bliski moment', category: 'EMOTION', moodTag: 'NAMIETNOSC' },
  { id: 'breakup', name: 'Rozstanie', category: 'EMOTION', moodTag: 'NAPIECIE' },
  // OBJECTS
  { id: 'gift', name: 'Prezent', category: 'OBJECTS', moodTag: 'RADOSC' },
  { id: 'flowers', name: 'Kwiaty', category: 'OBJECTS', moodTag: 'RADOSC' },
  { id: 'surprise', name: 'Niespodzianka', category: 'OBJECTS', moodTag: 'RADOSC' },
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

export const GLYPH_CATEGORIES: { key: GlyphCategory; label: string }[] = [
  { key: 'CONTACT', label: 'Kontakt' },
  { key: 'DATING', label: 'Randkowanie' },
  { key: 'MEETINGS', label: 'Spotkania' },
  { key: 'EMOTION', label: 'Emocje' },
  { key: 'OBJECTS', label: 'Przedmioty' },
];

// Domyślny wariant graficzny dla `drink` to wine — patrz sekcja 25 MD (drugi wariant
// `drink_OPTION_cocktail` zostaje w assetach; podmiana to jedna linijka w mapie niżej).
//
// Pliki `*_transparent.png` — sekcja 25 MD v6: oryginalne assety klienta miały kanał
// alfa w 100% nieprzezroczysty (czarne kwadraty zamiast wtapiania się w tło). Naprawione
// algorytmicznie (luma-key: alpha = max(r,g,b), tło niemal-czarne staje się przezroczyste,
// świecąca linia zachowuje miękki, częściowo przezroczysty glow). Rysunek i kolor
// oryginałów były poprawne — problem dotyczył wyłącznie kanału alfa.
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

// Runy emocji (Poziom 1) — jedna na tag nastroju, widoczne wyłącznie na strukturze DNA.
export const RUNE_ICONS: Record<MoodTag, any> = {
  BLISKOSC: require('../../assets/runes/closeness_transparent.png'),
  TESKNOTA: require('../../assets/runes/longing_transparent.png'),
  NAMIETNOSC: require('../../assets/runes/passion_transparent.png'),
  RADOSC: require('../../assets/runes/joy_transparent.png'),
  NAPIECIE: require('../../assets/runes/tension_transparent.png'),
};
