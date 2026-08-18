import React from 'react';
import { Image, View } from 'react-native';

import { GLYPH_ICONS } from '@/data/glyphs';
import type { MoodTag } from '@/types/models';

type Props = {
  glyphId: string;
  size?: number;
  moodTag?: MoodTag | null;
  dim?: boolean;
};

// Glify (Poziom 2) — cienkie, świecące linie w kolorze tagu nastroju (sekcja 13).
// ZASADA GLOBALNA (v6): ikona siedzi bezpośrednio na tle ekranu, otoczona wyłącznie
// WŁASNĄ poświatą wypaloną w pliku graficznym (sekcja 25 — assety mają teraz realną
// przezroczystość) — nigdy dodatkowym kołem/prostokątem w kodzie.
export function GlyphIcon({ glyphId, size = 28, dim }: Props) {
  const source = GLYPH_ICONS[glyphId];
  if (!source) return <View style={{ width: size, height: size }} />;
  return (
    <Image
      source={source}
      style={{ width: size, height: size, opacity: dim ? 0.35 : 1 }}
      resizeMode="contain"
    />
  );
}
