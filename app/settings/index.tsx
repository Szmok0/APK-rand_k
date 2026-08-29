// SETTINGS — functional content, not decoration (MD section 18). Reskinned
// against the same chrome every other rebuilt screen uses this round: a
// full-bleed background (the existing, previously-unused desk_bg.jpg — a
// "CONFIDENTIAL / CASE 001" folder shot, already on-theme, no new asset
// needed) and a custom header instead of the plain shared one.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsRow } from '@/components/SettingsRow';
import { Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing, typography } from '@/theme/tokens';
import { pickImportFile, shareExportFile } from '@/utils/fileIO';
import { todayKey } from '@/utils/dates';

export default function SettingsScreen() {
  const { exportCurrent, importRelationship, startNewStory } = useRelationship();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  // Single, permanent case — this clears activities and archives the closed
  // file, it does not create a "new case" (product decision: one fixed case).
  function handleClearCase() {
    Alert.alert(
      'Close & clear this case?',
      'The current case log will be archived automatically, and the calendar/evidence archive will start empty.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close & Clear',
          style: 'destructive',
          onPress: async () => {
            await startNewStory();
            Alert.alert('Done', 'The previous case log was moved to Archive.');
          },
        },
      ]
    );
  }

  async function handleExport() {
    setBusy(true);
    try {
      await shareExportFile(exportCurrent(), `zuza-case-${todayKey()}`);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleImport() {
    setBusy(true);
    try {
      const file = await pickImportFile();
      if (!file) return;
      Alert.alert('Import case file?', 'This will overwrite the current, active case log.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            await importRelationship(file);
            Alert.alert('Done', 'Case file imported.');
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Import failed', String(e));
    } finally {
      setBusy(false);
    }
  }

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
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Case</Text>
        <SettingsRow icon="refresh-outline" label="Close & Clear Case" onPress={handleClearCase} danger />
        <SettingsRow icon="archive-outline" label="Archive" onPress={() => router.push('/settings/archive')} />

        <Text style={styles.section}>Backup</Text>
        <SettingsRow icon="cloud-upload-outline" label="Export Case File" onPress={handleExport} disabled={busy} />
        <SettingsRow icon="cloud-download-outline" label="Import Case File" onPress={handleImport} disabled={busy} />

        <Text style={styles.section}>Information</Text>
        <SettingsRow icon="information-circle-outline" label="About" onPress={() => router.push('/settings/about')} />

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
    paddingBottom: spacing.xl,
  },
  section: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
});
