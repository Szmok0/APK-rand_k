import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme/tokens';

const LABELS: Record<0 | 1 | 2, string> = {
  0: 'zwykłe',
  1: 'ważne',
  2: 'bardzo ważne',
};

// Ważność — 3 poziomy, ustawiane ręcznie, bez automatyki (sekcja 8/12).
export function ImportanceSelector({
  value,
  onChange,
}: {
  value: 0 | 1 | 2;
  onChange: (v: 0 | 1 | 2) => void;
}) {
  return (
    <View>
      <View style={styles.dots}>
        {([0, 1, 2] as const).map((level) => (
          <Pressable key={level} onPress={() => onChange(level)} style={styles.dotHit}>
            <View
              style={[
                styles.dot,
                { width: 10 + level * 5, height: 10 + level * 5, borderRadius: 10 },
                value === level ? styles.dotActive : styles.dotInactive,
              ]}
            />
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>{LABELS[value]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  dotHit: {
    padding: spacing.xs,
  },
  dot: {
    borderWidth: 1.5,
  },
  dotActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  dotInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.borderStrong,
  },
  label: {
    color: colors.textFaint,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
