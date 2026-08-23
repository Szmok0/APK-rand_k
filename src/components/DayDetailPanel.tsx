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
import { DAY_BADGE_COLORS, DAY_BADGE_ICONS, dayBadges } from '@/engine/dayBadges';
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

  const badges = dayBadges(activity);

  return (
    <View>
      {badges.length > 0 && (
        <View style={styles.badgeRow}>
          {badges.map((key) => (
            <View key={key} style={[styles.badge, { borderColor: DAY_BADGE_COLORS[key] }]}>
              <Ionicons name={DAY_BADGE_ICONS[key]} size={13} color={DAY_BADGE_COLORS[key]} />
              <Text style={[styles.badgeLabel, { color: DAY_BADGE_COLORS[key] }]}>{key}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.readoutRow}>
        <View style={styles.readoutBox}>
          <Ionicons name="time-outline" size={14} color={colors.textFaint} />
          <Text style={styles.readoutLabel}>TIME</Text>
          <Text style={styles.readoutValue}>
            {hours > 0 ? `${activity.startTime} – ${activity.endTime}` : '—'}
          </Text>
        </View>
        <View style={styles.readoutBox}>
          <Ionicons name="folder-outline" size={14} color={colors.textFaint} />
          <Text style={styles.readoutLabel}>EVIDENCE</Text>
          <Text style={styles.readoutValue}>
            {activity.glyphIds.length} {activity.glyphIds.length === 1 ? 'ITEM' : 'ITEMS'}
          </Text>
        </View>
      </View>

      <View style={styles.glyphRow}>
        {activity.glyphIds.map((id) => (
          <View key={id} style={styles.glyphItem}>
            <GlyphIcon glyphId={id} size={36} />
            <Text style={styles.glyphName}>{GLYPH_MAP[id]?.name}</Text>
          </View>
        ))}
      </View>

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
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  badgeLabel: {
    ...typography.stamp,
    fontSize: 9,
  },
  readoutRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  readoutBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  readoutLabel: {
    ...typography.caption,
    color: colors.textFaint,
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 4,
  },
  readoutValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  glyphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
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
