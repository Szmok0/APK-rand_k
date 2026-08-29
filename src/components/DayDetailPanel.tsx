// "Case Day" content — the inline Calendar preview panel (product owner spec,
// Aug 2026): bordered-square badge icons, code-drawn TIME/EVIDENCE boxes side
// by side, and a compact REPORT card — no glyph list, priority badge or photo
// (no room left, see app/day/[date].tsx for the full-screen version of a day).
// REPORT no longer scrolls its note inline: it's a Pressable that opens the
// note in its own full screen (app/note/[date].tsx). A nested ScrollView here
// never registered scroll gestures on a real Android device (the outer
// Calendar screen's scroll always won the touch), so any note longer than the
// card's fixed height was simply unreachable — this sidesteps that instead of
// re-fighting it.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { GoldButton } from '@/components/ui';
import { DAY_BADGE_COLORS, DAY_BADGE_ICON_NAMES, dayBadges } from '@/engine/dayBadges';
import * as Sharing from 'expo-sharing';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { durationHours } from '@/utils/dates';

type Props = {
  date: string;
};

export function DayDetailPanel({ date }: Props) {
  const { getActivityByDate, deleteActivity } = useRelationship();

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
        <Pressable
          style={styles.reportBody}
          onPress={() => router.push({ pathname: '/note/[date]', params: { date } })}
        >
          {activity.note ? (
            <Text style={styles.noteText} numberOfLines={3}>
              {activity.note}
            </Text>
          ) : (
            <Text style={styles.noNote}>No written statement attached. Tap to add one.</Text>
          )}
        </Pressable>
        <Image
          source={require('../../assets/noir/calendar/tape_piece.png')}
          style={styles.reportTape}
          resizeMode="contain"
        />
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
    // No longer flex:1 — REPORT sizes to its content now instead of trying
    // to fill all remaining space for an internal scroll, so this panel
    // can't overflow past the tab bar regardless of how tall the grid/
    // ticket above it render on a given device.
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
  reportBody: {
    minHeight: 44,
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
});
