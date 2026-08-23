// SETTINGS — functional content, not decoration (MD section 18).

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { SettingsRow } from '@/components/SettingsRow';
import { Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing } from '@/theme/tokens';
import { pickImportFile, shareExportFile } from '@/utils/fileIO';
import { todayKey } from '@/utils/dates';

export default function SettingsScreen() {
  const { exportCurrent, importRelationship, startNewStory } = useRelationship();
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
      <Header title="SETTINGS" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Case</Text>
        <SettingsRow icon="refresh-outline" label="Close & Clear Case" onPress={handleClearCase} danger />
        <SettingsRow icon="archive-outline" label="Archive" onPress={() => router.push('/settings/archive')} />

        <Text style={styles.section}>Backup</Text>
        <SettingsRow icon="cloud-upload-outline" label="Export Case File" onPress={handleExport} disabled={busy} />
        <SettingsRow icon="cloud-download-outline" label="Import Case File" onPress={handleImport} disabled={busy} />

        <Text style={styles.section}>Information</Text>
        <SettingsRow icon="information-circle-outline" label="About" onPress={() => router.push('/settings/about')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
