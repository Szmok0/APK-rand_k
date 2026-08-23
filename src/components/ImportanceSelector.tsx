import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, priorityLabels, spacing } from '@/theme/tokens';

// CASE PRIORITY — 3 levels, set manually, no automation (ADD_ACTIVITY_TECH_SPEC).
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
          <Pressable
            key={level}
            testID={`importance-${level}`}
            onPress={() => onChange(level)}
            style={styles.dotHit}
          >
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
      <Text style={styles.label}>{priorityLabels[value]}</Text>
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
