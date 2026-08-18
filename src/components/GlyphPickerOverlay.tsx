import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlyphPickerGrid } from '@/components/GlyphPickerGrid';
import { colors, spacing, typography } from '@/theme/tokens';

type Props = {
  selected: string[];
  onToggle: (glyphId: string) => void;
  onDone: () => void;
};

// Wybór glifu jako osobny, nakładany widok — sekcja 8 MD v6. Otwierany z jednego
// zwartego chipa w panelu Add Activity, nie stała siatka wewnątrz głównego panelu.
// Tu (i tylko tu) dozwolone są grupowanie kategoriami i podpisy tekstowe pod ikonami.
export function GlyphPickerOverlay({ selected, onToggle, onDone }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.overlay, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>WYBIERZ GLIFY</Text>
        <Pressable onPress={onDone} hitSlop={10} style={styles.doneBtn}>
          <Ionicons name="checkmark" size={16} color={colors.background} />
          <Text style={styles.doneLabel}>Gotowe</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <GlyphPickerGrid selected={selected} onToggle={onToggle} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.heading,
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  doneLabel: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
