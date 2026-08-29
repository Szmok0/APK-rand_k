// THE LID — placeholder. Concept doc section 5 defines this as a slider-based
// (1-5, no classic quiz) subjective read of him on a working trait list
// (ROMANTIC, CARING, HONEST, CONSISTENT, INITIATIVE, HUMOR, CONFIDENCE, DRAMA
// POTENTIAL, MYSTERY, CHEMISTRY — itself explicitly "may be shortened or
// changed"), ending in a "RUN THE ANALYSIS" button into THE LID PREVIEW
// (archetype + illustration + threat level). The trait list, archetype
// mapping and threat-level scoring are all still open design questions
// (section 14) — this screen exists so the Hub's button goes somewhere real
// while that gets designed, not a stand-in for the sliders themselves.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function TheLidScreen() {
  return (
    <Screen>
      <Header title="THE LID" />
      <View style={styles.content}>
        <Ionicons name="lock-open-outline" size={40} color={colors.textFaint} />
        <Text style={styles.title}>Not assessed yet.</Text>
        <Text style={styles.subtitle}>
          This will be a set of sliders — your own subjective read on him — that
          runs into THE LID PREVIEW: an archetype, an illustration and a threat
          level. The trait list and how they map to a result are still being
          designed, so there's nothing to slide yet.
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
