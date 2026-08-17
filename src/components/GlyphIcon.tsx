import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { GLYPH_ICONS } from '@/data/glyphs';
import { colors, moodColors } from '@/theme/tokens';
import type { MoodTag } from '@/types/models';

type Props = {
  glyphId: string;
  size?: number;
  moodTag?: MoodTag | null;
  dim?: boolean;
};

// Glify (Poziom 2) — cienkie, świecące linie w kolorze tagu nastroju (sekcja 13).
// Renderowane jako tintowany raster: przygotowane assety są jasnymi liniami na
// przezroczystym tle, więc nakładamy delikatną poświatę koloru pod spodem.
export function GlyphIcon({ glyphId, size = 28, moodTag, dim }: Props) {
  const source = GLYPH_ICONS[glyphId];
  const glow = moodTag ? moodColors[moodTag] : colors.textFaint;
  if (!source) return <View style={{ width: size, height: size }} />;
  return (
    <View style={[styles.wrap, { width: size, height: size, opacity: dim ? 0.35 : 1 }]}>
      <View
        style={[
          styles.glow,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: size,
            backgroundColor: glow,
            opacity: 0.22,
          },
        ]}
      />
      <Image source={source} style={{ width: size, height: size }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
});
