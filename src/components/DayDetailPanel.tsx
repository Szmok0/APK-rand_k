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
import { DAY_BADGE_COLORS, DAY_BADGE_IMAGES, dayBadges } from '@/engine/dayBadges';
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
            <View key={key} style={styles.badge}>
              <Image source={DAY_BADGE_IMAGES[key]} style={styles.badgeImage} />
              <Text style={[styles.badgeLabel, { color: DAY_BADGE_COLORS[key] }]}>{key}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.timeFrameWrap}>
        <Image source={require('../../assets/noir/calendar/frame_time.png')} style={styles.readoutFrameImg} />
        <View style={styles.timeValueSlot}>
          <Text style={styles.readoutValueText} numberOfLines={1} adjustsFontSizeToFit>
            {hours > 0 ? `${activity.startTime} – ${activity.endTime}` : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.evidenceFrameWrap}>
        <Image source={require('../../assets/noir/calendar/frame_evidence.png')} style={styles.readoutFrameImg} />
        <View style={styles.evidenceValueSlot}>
          <Text style={styles.readoutValueText}>{activity.glyphIds.length}</Text>
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

      <View style={styles.reportFrameWrap}>
        <Image source={require('../../assets/noir/calendar/frame_report.png')} style={styles.readoutFrameImg} />
        <View style={styles.reportContentSlot}>
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
    alignItems: 'center',
    width: 52,
  },
  badgeImage: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
  },
  badgeLabel: {
    ...typography.stamp,
    fontSize: 8,
    marginTop: 3,
    textAlign: 'center',
  },
  // TIME / EVIDENCE / REPORT are the real steampunk-frame assets from the
  // pack — full-width bars, stacked (their own aspect ratio is a short wide
  // bar, not suited to sitting side by side in a narrow column). Each
  // wrap's aspectRatio matches its source PNG exactly so the value slot
  // (measured off the actual dark-red panel pixels) always lands inside
  // the frame's felt inset regardless of screen width — same rule as Home.
  readoutFrameImg: {
    width: '100%',
    height: '100%',
  },
  timeFrameWrap: {
    width: '100%',
    aspectRatio: 474 / 165,
    marginTop: spacing.md,
    position: 'relative',
  },
  timeValueSlot: {
    position: 'absolute',
    left: '50.6%',
    top: '43%',
    width: '44.5%',
    height: '39.4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceFrameWrap: {
    width: '100%',
    aspectRatio: 461 / 120,
    marginTop: spacing.sm,
    position: 'relative',
  },
  evidenceValueSlot: {
    position: 'absolute',
    left: '57.7%',
    top: '26.7%',
    width: '23%',
    height: '53.3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readoutValueText: {
    ...typography.stamp,
    color: colors.textPrimary,
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
  reportFrameWrap: {
    width: '100%',
    aspectRatio: 965 / 334,
    marginTop: spacing.lg,
    position: 'relative',
  },
  reportContentSlot: {
    position: 'absolute',
    left: '8.2%',
    top: '30.8%',
    width: '88%',
    height: '57.2%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  noteText: {
    color: colors.textPrimary,
    fontSize: 12,
    lineHeight: 17,
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
