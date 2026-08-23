// "Case Day" content — shared between the inline Calendar preview panel and the
// full-screen day/[date] route. Not a separate navigational concept, just one
// component embedded in two places (CALENDAR_TECH_SPEC section "Selected-day area").

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { GoldButton, OutlineButton } from '@/components/ui';
import * as Sharing from 'expo-sharing';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, priorityColors, priorityLabels, radius, spacing, typography } from '@/theme/tokens';
import { durationHours } from '@/utils/dates';

type Props = {
  date: string;
};

export function DayDetailPanel({ date }: Props) {
  const { getActivityByDate, deleteActivity } = useRelationship();
  const [noteRevealed, setNoteRevealed] = useState(false);

  const activity = getActivityByDate(date);
  const hours = activity ? durationHours(activity.startTime, activity.endTime) : 0;

  function handleDelete() {
    if (!activity) return;
    Alert.alert('Remove this incident?', 'History will not argue. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => deleteActivity(activity.id),
      },
    ]);
  }

  async function handleShare() {
    if (!activity) return;
    const canShare = await Sharing.isAvailableAsync();
    if (activity.photoUri && canShare) {
      await Sharing.shareAsync(activity.photoUri);
    } else {
      Alert.alert('Sharing', 'This device does not support sharing in this context.');
    }
  }

  if (!activity) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No incident recorded.</Text>
        <Text style={styles.emptySubtext}>This does not prove nothing happened.</Text>
        <GoldButton
          label="+ Add Activity"
          onPress={() => router.push({ pathname: '/add-activity', params: { date } })}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.glyphRow}>
        {activity.glyphIds.map((id) => (
          <View key={id} style={styles.glyphItem}>
            <GlyphIcon glyphId={id} size={36} />
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
        <View style={[styles.priorityBadge, { borderColor: priorityColors[activity.importance] }]}>
          <Text style={[styles.priorityLabel, { color: priorityColors[activity.importance] }]}>
            {priorityLabels[activity.importance]}
          </Text>
        </View>
      )}

      {activity.photoUri && <Image source={{ uri: activity.photoUri }} style={styles.photo} />}

      <View style={styles.noteBox}>
        <Text style={styles.noteBoxLabel}>REPORT</Text>
        {activity.note ? (
          noteRevealed ? (
            <Text style={styles.noteText}>{activity.note}</Text>
          ) : (
            <OutlineButton label="Reveal Report" onPress={() => setNoteRevealed(true)} />
          )
        ) : (
          <Text style={styles.noNote}>No written statement attached.</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 4,
  },
  glyphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
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
  priorityBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: spacing.sm,
  },
  priorityLabel: {
    ...typography.stamp,
    fontSize: 10,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  noteBox: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  noteBoxLabel: {
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
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
