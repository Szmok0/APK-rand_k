// RELATIONSHIP DNA — placeholder. Concept doc section 4 defines this as an
// automatic profile computed from real Activity data (CONTACT/EFFORT/
// CHEMISTRY/CHAOS/MYSTERY/EVIDENCE, 0-100%, a "CASE EQUATION" of real counts),
// with the weighting per glyph explicitly left as "ustalone osobno" (decided
// separately) and normalization still on the "do dalszego dopracowania" list.
// That's real design work, not a missing file — this screen exists so the
// Hub's button goes somewhere real while that math gets designed, same
// reasoning as the old Profiler-tab placeholder it replaces.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function RelationshipDnaScreen() {
  return (
    <Screen>
      <Header title="RELATIONSHIP DNA" />
      <View style={styles.content}>
        <Ionicons name="analytics-outline" size={40} color={colors.textFaint} />
        <Text style={styles.title}>The equation isn't written yet.</Text>
        <Text style={styles.subtitle}>
          This will be an automatic read on the case — CONTACT, EFFORT, CHEMISTRY,
          CHAOS, MYSTERY, EVIDENCE — computed from what's actually logged in
          Calendar and Evidence Archive. The weights and normalization are still
          being designed, so nothing here is invented in the meantime.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
