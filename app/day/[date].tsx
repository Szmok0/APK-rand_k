// DAY DETAIL — sekcja 4 (poziom 3, PAMIĘĆ) i sekcja 8 MD (dogrywanie/edycja).

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { GoldButton, Header, OutlineButton, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { durationHours, fromDateKey } from '@/utils/dates';

const MONTHS_GENITIVE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

function formatDate(dateKey: string) {
  const d = fromDateKey(dateKey);
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getActivityByDate, deleteActivity } = useRelationship();
  const [noteRevealed, setNoteRevealed] = useState(false);

  const activity = getActivityByDate(date);
  const hours = activity ? durationHours(activity.startTime, activity.endTime) : 0;

  function handleDelete() {
    if (!activity) return;
    Alert.alert('Usunąć wpis?', 'Tej operacji nie można cofnąć.', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          deleteActivity(activity.id);
          router.back();
        },
      },
    ]);
  }

  async function handleShare() {
    if (!activity) return;
    const canShare = await Sharing.isAvailableAsync();
    if (activity.photoUri && canShare) {
      await Sharing.shareAsync(activity.photoUri);
    } else {
      Alert.alert('Udostępnianie', 'To urządzenie nie obsługuje udostępniania w tym kontekście.');
    }
  }

  return (
    <Screen>
      <Header title={formatDate(date).toUpperCase()} />
      <ScrollView contentContainerStyle={styles.content}>
        {!activity ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Brak zapisanej aktywności tego dnia.</Text>
            <GoldButton
              label="+ Dodaj Aktywność"
              onPress={() => router.push({ pathname: '/add-activity', params: { date } })}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          <>
            <View style={styles.glyphRow}>
              {activity.glyphIds.map((id) => (
                <View key={id} style={styles.glyphItem}>
                  <GlyphIcon glyphId={id} size={36} moodTag={GLYPH_MAP[id]?.moodTag} />
                  <Text style={styles.glyphName}>{GLYPH_MAP[id]?.name}</Text>
                </View>
              ))}
            </View>

            {hours > 0 && (
              <Text style={styles.time}>
                {activity.startTime} — {activity.endTime}  ·  {hours}h
              </Text>
            )}

            {activity.importance > 0 && (
              <View style={styles.importanceRow}>
                {Array.from({ length: activity.importance }).map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color={colors.gold} />
                ))}
              </View>
            )}

            {activity.photoUri && (
              <Image source={{ uri: activity.photoUri }} style={styles.photo} />
            )}

            <View style={styles.noteBox}>
              {activity.note ? (
                noteRevealed ? (
                  <Text style={styles.noteText}>{activity.note}</Text>
                ) : (
                  <OutlineButton label="Odkryj notatkę" onPress={() => setNoteRevealed(true)} />
                )
              ) : (
                <Text style={styles.noNote}>Brak notatki tego dnia.</Text>
              )}
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => router.push({ pathname: '/add-activity', params: { date } })}
              >
                <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={handleShare}>
                <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    color: colors.textFaint,
  },
  glyphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  glyphItem: {
    alignItems: 'center',
    width: 64,
  },
  glyphName: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  time: {
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontSize: 13,
  },
  importanceRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.sm,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
  },
  noteBox: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  noteText: {
    color: colors.textPrimary,
    lineHeight: 20,
  },
  noNote: {
    color: colors.textFaint,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
