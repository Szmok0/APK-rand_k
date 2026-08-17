import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GLYPH_CATEGORIES, GLYPHS } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { colors, radius, spacing } from '@/theme/tokens';

type Props = {
  selected: string[];
  onToggle: (glyphId: string) => void;
};

// Glyph Picker — siatka zamkniętego zestawu 27 glifów, multi-select (sekcja 8/13).
// Bez "+" / własnych glifów (odrzucone jednoznacznie w MVP).
export function GlyphPickerGrid({ selected, onToggle }: Props) {
  return (
    <View>
      {GLYPH_CATEGORIES.map((cat) => {
        const glyphs = GLYPHS.filter((g) => g.category === cat.key);
        return (
          <View key={cat.key} style={styles.section}>
            <Text style={styles.sectionLabel}>{cat.label}</Text>
            <View style={styles.grid}>
              {glyphs.map((g) => {
                const active = selected.includes(g.id);
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => onToggle(g.id)}
                    style={[styles.item, active && styles.itemActive]}
                  >
                    <GlyphIcon glyphId={g.id} size={24} moodTag={g.moodTag} dim={!active && selected.length > 0} />
                    <Text style={styles.itemLabel} numberOfLines={1}>
                      {g.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    width: 70,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemActive: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.goldSoft,
  },
  itemLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
});
