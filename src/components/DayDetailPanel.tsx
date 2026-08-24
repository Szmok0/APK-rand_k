// "Case Day" content — shared between the inline Calendar preview panel and the
// full-screen day/[date] route. Not a separate navigational concept, just one
// component embedded in two places (CALENDAR_TECH_SPEC section "Selected-day area").
//
// `fillReport` switches to the Calendar screen's compact scheme (product
// owner spec, Aug 2026): bordered-square badge icons (not the asset-pack
// tiles), code-drawn TIME/EVIDENCE boxes side by side, and a REPORT card
// that fills all remaining space down to the tab bar with its own internal
// scroll — no glyph list, priority badge or photo (no room left once REPORT
// takes the rest). The full-screen day/[date] route keeps the richer,
// non-`fillReport` layout with all of that detail.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { GoldButton, OutlineButton } from '@/components/ui';
import { DAY_BADGE_COLORS, DAY_BADGE_ICON_NAMES, DAY_BADGE_IMAGES, dayBadges } from '@/engine/dayBadges';
import * as Sharing from 'expo-sharing';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, priorityColors, priorityLabels, radius, spacing, typography } from '@/theme/tokens';
import { durationHours } from '@/utils/dates';

type Props = {
  date: string;
  fillReport?: boolean;
};

export function DayDetailPanel({ date, fillReport }: Props) {
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
  const timeValue = hours > 0 ? `${activity.startTime} – ${activity.endTime}` : '—';
  const evidenceValue = `${activity.glyphIds.length} ${activity.glyphIds.length === 1 ? 'ITEM' : 'ITEMS'}`;

  const reportBody = activity.note ? (
    noteRevealed ? (
      <Text style={styles.noteText}>{activity.note}</Text>
    ) : (
      <OutlineButton label="Reveal Report" onPress={() => setNoteRevealed(true)} />
    )
  ) : (
    <Text style={styles.noNote}>No written statement attached.</Text>
  );

  if (fillReport) {
    return (
      <View style={styles.fillRoot}>
        {badges.length > 0 && (
          <View style={styles.badgeRowCode}>
            {badges.map((key) => (
              <View key={key} style={styles.badgeItemCode}>
                <View style={[styles.badgeBox, { borderColor: DAY_BADGE_COLORS[key] }]}>
                  <Ionicons name={DAY_BADGE_ICON_NAMES[key]} size={22} color={DAY_BADGE_COLORS[key]} />
                </View>
                <Text style={[styles.badgeLabelCode, { color: DAY_BADGE_COLORS[key] }]}>{key}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.readoutRowCode}>
          <View style={styles.readoutBoxCode}>
            <View style={styles.readoutHeaderRow}>
              <Ionicons name="time-outline" size={14} color={colors.gold} />
              <Text style={styles.readoutBoxLabel}>TIME</Text>
            </View>
            <Text style={styles.readoutBoxValue} numberOfLines={1}>
              {timeValue}
            </Text>
          </View>
          <View style={styles.readoutBoxCode}>
            <View style={styles.readoutHeaderRow}>
              <Ionicons name="folder-outline" size={14} color={colors.gold} />
              <Text style={styles.readoutBoxLabel}>EVIDENCE</Text>
            </View>
            <Text style={styles.readoutBoxValue}>{evidenceValue}</Text>
          </View>
        </View>

        <View style={styles.reportCardFill}>
          <View style={styles.reportHeaderRowFill}>
            <Text style={styles.reportLabelFill}>REPORT</Text>
            <View style={styles.reportActionsInline}>
              <Pressable
                onPress={() => router.push({ pathname: '/add-activity', params: { date } })}
                hitSlop={8}
              >
                <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
              </Pressable>
              <Pressable onPress={handleDelete} hitSlop={8}>
                <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
              </Pressable>
              <Pressable onPress={handleShare} hitSlop={8}>
                <Ionicons name="share-outline" size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
          <ScrollView style={styles.reportScroll} contentContainerStyle={styles.reportScrollContent}>
            {reportBody}
          </ScrollView>
          <Image
            source={require('../../assets/noir/calendar/tape_piece.png')}
            style={styles.reportTape}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

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

      <View style={styles.readoutRow}>
        <View style={styles.timeFrameWrap}>
          <Image source={require('../../assets/noir/calendar/frame_time.png')} style={styles.readoutFrameImg} />
          <View style={styles.timeValueSlot}>
            <Text style={styles.readoutValueText} numberOfLines={1}>
              {hours > 0 ? `${activity.startTime}–${activity.endTime}` : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.evidenceFrameWrap}>
          <Image source={require('../../assets/noir/calendar/frame_evidence.png')} style={styles.readoutFrameImg} />
          <View style={styles.evidenceValueSlot}>
            <Text style={styles.readoutValueText}>{activity.glyphIds.length}</Text>
          </View>
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

      <View style={styles.reportCard}>
        <Text style={styles.reportLabel}>REPORT</Text>
        {reportBody}
        <Image
          source={require('../../assets/noir/calendar/tape_piece.png')}
          style={styles.reportTape}
          resizeMode="contain"
        />
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
  // --- fillReport (Calendar screen) styles ---
  fillRoot: {
    flex: 1,
    minHeight: 0,
  },
  badgeRowCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItemCode: {
    alignItems: 'center',
    flex: 1,
  },
  badgeBox: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  badgeLabelCode: {
    ...typography.caption,
    fontSize: 8,
    letterSpacing: 0.5,
    marginTop: 3,
    textAlign: 'center',
  },
  readoutRowCode: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  readoutBoxCode: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  readoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readoutBoxLabel: {
    ...typography.caption,
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1,
  },
  readoutBoxValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  reportCardFill: {
    flex: 1,
    // minHeight: 0 lets this actually shrink to the space left over instead
    // of overflowing past it (the standard flex-item-with-scrollable-child
    // pitfall) — without it the card (and the tab bar under it) could get
    // pushed past the screen bottom when the grid+ticket above are tall.
    minHeight: 0,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    padding: spacing.sm,
    position: 'relative',
  },
  reportHeaderRowFill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  reportLabelFill: {
    ...typography.stamp,
    color: colors.gold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  reportActionsInline: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  reportScroll: {
    flex: 1,
  },
  reportScrollContent: {
    paddingBottom: spacing.md,
  },
  // --- shared / non-fillReport (day/[date] route) styles ---
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
  readoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  readoutFrameImg: {
    width: '100%',
    height: '100%',
  },
  timeFrameWrap: {
    width: '48%',
    aspectRatio: 474 / 165,
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
    width: '48%',
    aspectRatio: 461 / 120,
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
    fontSize: 9,
    letterSpacing: 0,
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
  // Floating REPORT card — plain code, sized to its content (no fixed
  // aspectRatio) so it grows or shrinks with the actual note length,
  // instead of the frame_report.png asset it replaced.
  reportCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  reportLabel: {
    ...typography.stamp,
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  reportTape: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 56,
    height: 28,
    transform: [{ rotate: '-8deg' }],
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
