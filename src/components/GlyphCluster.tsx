import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GlyphIcon } from '@/components/GlyphIcon';

type Props = {
  glyphIds: string[];
  size?: number;
  max?: number;
};

// Ligatura — wiele glifów jednego dnia grupowane wizualnie przez zachodzenie na
// siebie (sekcja 7). ZASADA GLOBALNA (v6): żadnego dodatkowego tła/aureoli w kodzie
// za grupą — teraz, gdy assety mają realną przezroczystość (sekcja 25), nakładające
// się ikony naturalnie mieszają własne, wypalone w pliku poświaty. Świadomie BEZ
// proceduralnego łączenia symboli w jeden znak (odrzucone w MVP).
export function GlyphCluster({ glyphIds, size = 20, max = 3 }: Props) {
  const shown = glyphIds.slice(0, max);
  const overflow = glyphIds.length - shown.length;

  return (
    <View style={styles.row}>
      {shown.map((id, idx) => (
        <View key={id} style={{ marginLeft: idx === 0 ? 0 : -size * 0.35, zIndex: shown.length - idx }}>
          <GlyphIcon glyphId={id} size={size} />
        </View>
      ))}
      {overflow > 0 && <View style={styles.overflowDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
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
