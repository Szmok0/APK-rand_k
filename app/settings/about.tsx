// ABOUT — functional content screen (MD section 18). Author block and birthday
// dedication are copied verbatim from the approved master spec; not decoration,
// not shouted about anywhere else in the app. Same chrome pass as the rest of
// Settings: full-bleed desk_bg.jpg + custom header instead of the plain shared one.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { colors, spacing, typography } from '@/theme/tokens';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/backgrounds/desk_bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>ABOUT</Text>
        <View style={styles.headerSide} />
      </View>

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

        <View style={{ height: insets.bottom + spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    backgroundColor: 'rgba(12, 10, 8, 0.6)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerSide: {
    width: 22,
  },
  content: {
    paddingHorizontal: spacing.lg,
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
