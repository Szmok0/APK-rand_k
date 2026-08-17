// USTAWIENIA (⚙) — sekcja 11 MD. Jedna ikona zastępuje dawny podział ☰ / ⚙.

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SettingsRow } from '@/components/SettingsRow';
import { Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing } from '@/theme/tokens';
import { pickImportFile, shareExportFile } from '@/utils/fileIO';
import { todayKey } from '@/utils/dates';

export default function SettingsScreen() {
  const { exportCurrent, importRelationship, startNewStory } = useRelationship();
  const [busy, setBusy] = useState(false);

  function handleStartNewStory() {
    Alert.alert(
      'Czy na pewno chcesz zacząć od nowa?',
      'Bieżąca historia zostanie automatycznie zarchiwizowana, a galaktyka i wszystkie widoki zaczną się budować od zera.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zacznij od nowa',
          style: 'destructive',
          onPress: async () => {
            await startNewStory();
            Alert.alert('Gotowe', 'Poprzednia historia trafiła do Archiwum.');
          },
        },
      ]
    );
  }

  async function handleExport() {
    setBusy(true);
    try {
      await shareExportFile(exportCurrent(), `zuz-diary-${todayKey()}`);
    } catch (e) {
      Alert.alert('Błąd eksportu', String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleImport() {
    setBusy(true);
    try {
      const file = await pickImportFile();
      if (!file) return;
      Alert.alert('Zaimportować dane?', 'To nadpisze bieżącą, aktywną historię.', [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Importuj',
          onPress: async () => {
            await importRelationship(file);
            Alert.alert('Gotowe', 'Dane zostały zaimportowane.');
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Błąd importu', String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Header title="USTAWIENIA" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Relacja</Text>
        <SettingsRow icon="refresh-outline" label="Zacznij nową historię" onPress={handleStartNewStory} danger />
        <SettingsRow icon="archive-outline" label="Archiwum" onPress={() => router.push('/settings/archive')} />

        <Text style={styles.section}>Dane</Text>
        <SettingsRow icon="cloud-upload-outline" label="Eksportuj dane" onPress={handleExport} disabled={busy} />
        <SettingsRow icon="cloud-download-outline" label="Importuj dane" onPress={handleImport} disabled={busy} />

        <Text style={styles.section}>Inspiracje</Text>
        <SettingsRow
          icon="sparkles-outline"
          label="Źródło codziennego cytatu"
          sublabel="Statyczna baza lokalna (jedyna opcja w MVP)"
        />

        <Text style={styles.section}>Informacje</Text>
        <SettingsRow icon="information-circle-outline" label="O aplikacji" onPress={() => router.push('/settings/about')} />
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
