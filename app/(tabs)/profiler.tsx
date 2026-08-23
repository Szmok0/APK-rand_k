// PROFILER — placeholder. CASE_LOG_MASTER section 11 is explicit that the
// question bank and scoring model are a "Research TODO before implementation"
// — designing ~20-30 psychologically-grounded questions is real product work,
// not a missing file to fill in blindly (MD section 0.2/9.3: ask, don't invent
// a fake psychological system). This screen exists as the real nav destination
// so the tab bar isn't pointing at nothing; the actual assessment flow, report
// generation and comparison land once that question bank is designed.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function ProfilerScreen() {
  return (
    <Screen>
      <Header title="PROFILER" />
      <View style={styles.content}>
        <Ionicons name="finger-print-outline" size={40} color={colors.textFaint} />
        <Text style={styles.title}>No assessment has been completed.</Text>
        <Text style={styles.subtitle}>
          The profiler currently knows less than it would like. The question bank and
          scoring model are still being designed — this is not a diagnosis, and it
          won't be invented on the fly.
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
