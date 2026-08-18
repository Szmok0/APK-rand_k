import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

type Props = {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  preview?: React.ReactNode; // np. małe podglądy wybranych glifów, obok labelki
};

// Pole zwijane — sekcja 8 MD v6: KAŻDE pole w Add Activity jest domyślnie zwinięte
// do jednowierszowego chipa. Tap → rozwija zawartość NA CHWILĘ (bezpośrednio pod
// chipem); wybór → wywołujący komponent sam zwija z powrotem (onToggle/setExpanded).
export function CollapsibleField({ label, expanded, onToggle, children, preview }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.chip} onPress={onToggle}>
        <View style={styles.chipLeft}>
          <Text style={styles.chipLabel}>{label}</Text>
          {preview}
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textFaint}
        />
      </Pressable>
      {expanded && <View style={styles.expanded}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  chipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  chipLabel: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  expanded: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
});
