// ARCHIVE — list of closed case files, export-only, no in-UI detail view.
// Same chrome pass as the rest of Settings: full-bleed desk_bg.jpg + custom
// header instead of the plain shared one.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { shareExportFile } from '@/utils/fileIO';

function formatClosedAt(iso: string) {
  const d = new Date(iso);
  return `Closed ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export default function ArchiveScreen() {
  const { archives } = useRelationship();
  const insets = useSafeAreaInsets();

  async function handleExport(entryId: string) {
    const entry = archives.find((a) => a.id === entryId);
    if (!entry) return;
    try {
      await shareExportFile(
        { schema: 'zuz-diary/relationship', version: 1, exportedAt: new Date().toISOString(), relationship: entry.relationship },
        `zuza-case-archive-${entry.id}`
      );
    } catch (e) {
      Alert.alert('Export failed', String(e));
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
        <Text style={styles.headerTitle}>ARCHIVE</Text>
        <View style={styles.headerSide} />
      </View>

      {archives.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No archived cases.</Text>
          <Text style={styles.emptySubtext}>The current one has not earned retirement yet.</Text>
        </View>
      ) : (
        <FlatList
          data={archives}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{formatClosedAt(item.closedAt)}</Text>
                <Text style={styles.meta}>{item.relationship.activities.length} recorded days</Text>
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    color: colors.textFaint,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: spacing.lg,
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
