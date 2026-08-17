// ARCHIWUM — sekcja 10/11 MD. Lista zamkniętych historii, tylko eksport pliku,
// bez wglądu w szczegóły w UI.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing } from '@/theme/tokens';
import { shareExportFile } from '@/utils/fileIO';

function formatClosedAt(iso: string) {
  const d = new Date(iso);
  return `Historia — zamknięta ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export default function ArchiveScreen() {
  const { archives } = useRelationship();

  async function handleExport(entryId: string) {
    const entry = archives.find((a) => a.id === entryId);
    if (!entry) return;
    try {
      await shareExportFile(
        { schema: 'zuz-diary/relationship', version: 1, exportedAt: new Date().toISOString(), relationship: entry.relationship },
        `zuz-diary-archiwum-${entry.id}`
      );
    } catch (e) {
      Alert.alert('Błąd eksportu', String(e));
    }
  }

  return (
    <Screen>
      <Header title="ARCHIWUM" />
      {archives.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Brak zarchiwizowanych historii.</Text>
        </View>
      ) : (
        <FlatList
          data={archives}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{formatClosedAt(item.closedAt)}</Text>
                <Text style={styles.meta}>{item.relationship.activities.length} zapisanych dni</Text>
              </View>
              <Pressable onPress={() => handleExport(item.id)} hitSlop={10}>
                <Ionicons name="share-outline" size={20} color={colors.gold} />
              </Pressable>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textFaint,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  meta: {
    color: colors.textFaint,
    fontSize: 11,
    marginTop: 2,
  },
});
