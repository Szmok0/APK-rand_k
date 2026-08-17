import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { moodColors } from '@/theme/tokens';

type Props = {
  glyphIds: string[];
  size?: number;
  max?: number;
};

// Ligatura — wspólny glow/aureola wokół kilku glifów jednego dnia (sekcja 7).
// Świadomie BEZ proceduralnego łączenia symboli w jeden znak (odrzucone w MVP).
export function GlyphCluster({ glyphIds, size = 20, max = 3 }: Props) {
  const shown = glyphIds.slice(0, max);
  const overflow = glyphIds.length - shown.length;
  const glowColor = shown[0] ? moodColors[GLYPH_MAP[shown[0]]?.moodTag ?? 'BLISKOSC'] : undefined;

  return (
    <View style={styles.wrap}>
      {shown.length > 1 && glowColor && (
        <View
          style={[
            styles.aura,
            {
              backgroundColor: glowColor,
              width: size * shown.length,
              height: size * 1.6,
              borderRadius: size,
            },
          ]}
        />
      )}
      <View style={styles.row}>
        {shown.map((id, idx) => (
          <View key={id} style={{ marginLeft: idx === 0 ? 0 : -size * 0.35 }}>
            <GlyphIcon glyphId={id} size={size} moodTag={GLYPH_MAP[id]?.moodTag} />
          </View>
        ))}
        {overflow > 0 && <View style={styles.overflowDot} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    opacity: 0.18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overflowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F3EFE6',
    marginLeft: 4,
    opacity: 0.6,
  },
});
