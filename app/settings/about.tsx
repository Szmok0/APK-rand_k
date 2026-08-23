// ABOUT — functional content screen (MD section 18). Author block and birthday
// dedication are copied verbatim from the approved master spec; not decoration,
// not shouted about anywhere else in the app.

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function AboutScreen() {
  return (
    <Screen>
      <Header title="ABOUT" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>Zuza's Diary</Text>
        <Text style={styles.version}>Case Log — v2.0</Text>

        <View style={styles.block}>
          <Text style={styles.text}>
            A private, offline relationship diary framed as a strange noir
            investigation. Activities become incidents, evidence and case notes —
            all built from the same local records, nothing invented after the fact.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Privacy</Text>
          <Text style={styles.text}>
            This application runs entirely locally — no account, no login, no data
            ever leaves this device. Offline by design.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.text}>
            This application is personalized and unique — created as a birthday
            present for Zuza's 25th birthday.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.creditName}>Jacek J.</Text>
          <Text style={styles.creditRole}>Office Dad. Unofficial investigator.{'\n'}Creator of questionable digital evidence.</Text>
          <Text style={styles.creditText}>
            Specialist in sarcasm, questionable ideas{'\n'}and maintaining a healthy
            distance from his own nonsense.
          </Text>
        </View>

        <Text style={styles.copyright}>© 2026 Jacek J. All rights reserved.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  appName: {
    ...typography.title,
    color: colors.gold,
    fontSize: 22,
    marginTop: spacing.md,
  },
  version: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  block: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  text: {
    color: colors.textSecondary,
    lineHeight: 20,
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  creditName: {
    ...typography.heading,
    color: colors.textPrimary,
    fontSize: 16,
  },
  creditRole: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  creditText: {
    color: colors.textFaint,
    fontSize: 11,
    marginTop: spacing.sm,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  copyright: {
    color: colors.textFaint,
    fontSize: 10,
    marginTop: spacing.lg,
  },
});
