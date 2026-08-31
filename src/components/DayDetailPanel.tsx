// "Case Day" content — the inline Calendar preview panel (product owner spec,
// Aug 2026): bordered-square badge icons, code-drawn TIME/EVIDENCE boxes side
// by side, a compact photo row, and a compact REPORT card — no glyph list or
// priority badge (no room left, see app/day/[date].tsx for the full-screen
// version of a day with those). REPORT no longer scrolls its note inline:
// it's a Pressable that opens the note in its own full screen
// (app/note/[date].tsx). A nested ScrollView here never registered scroll
// gestures on a real Android device (the outer Calendar screen's scroll
// always won the touch), so any note longer than the card's fixed height
// was simply unreachable — this sidesteps that instead of re-fighting it.
//
// Photo frame: real-usage report — a real photo IS meant to show here, big
// and prominent (this is the primary place a real gift-build tester
// actually looked at photos day-to-day, tapping a day straight off the
// Calendar grid — product owner: "wstaw normalną ramkę, jest masa
// miejsca"). No baked frame asset exists for this compact context (unlike
// the full Day Detail screen's photo_frame.png), so a plain bordered box —
// same "no matching asset, use a plain code-styled tile" pattern already
// used for the LID PREVIEW stats card. Shows every real photo (not a
// type-photo fallback — this is one of the two places, alongside Day
// Detail's own frame, where the user's own photo is meant to be visible;
// Evidence's list thumbnail stays type-photo-only). Multiple photos cycle
// via explicit prev/next arrows, not a swipeable ScrollView — swiping
// never reliably advanced past the first photo in real-usage testing (web);
// a tap always works, on every platform.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { GoldButton } from '@/components/ui';
import { DAY_BADGE_COLORS, DAY_BADGE_ICON_NAMES, dayBadges } from '@/engine/dayBadges';
import { emptyStateFor } from '@/engine/emptyState';
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
  // This component stays mounted while the user taps between days on
  // Calendar (only `date` changes) — keyed on date so different empty days
  // can show different lines instead of one pick frozen for the whole
  // session (found alongside the same hardcoded-line issue in day/[date].tsx).
  const emptyState = useMemo(() => emptyStateFor('CALENDAR / EMPTY DAY'), [date]);
  // Same fix, different spot: the REPORT card's "no note yet" placeholder
  // (shown when the day HAS an activity but no note text) was also frozen on
  // one hardcoded line instead of rotating between the pool's 2 options.
  const noteEmptyState = useMemo(() => emptyStateFor('EVIDENCE / NO TEXT NOTE'), [date]);

  // Which of the activity's photos the frame is currently showing. Reset
  // whenever the day changes so a new activity never opens mid-cycle.
  const photoUris = activity?.photoUris ?? [];
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => setPhotoIndex(0), [date]);
  function showPrevPhoto() {
    setPhotoIndex((i) => (i - 1 + photoUris.length) % photoUris.length);
  }
  function showNextPhoto() {
    setPhotoIndex((i) => (i + 1) % photoUris.length);
  }

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
    const uri = photoUris[photoIndex] ?? photoUris[0];
    if (uri && canShare) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Sharing', 'This device does not support sharing in this context.');
    }
  }

  if (!activity) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyState.main}</Text>
        <Text style={styles.emptySubtext}>{emptyState.sub}</Text>
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

      {photoUris.length > 0 && (
        <View style={styles.photoFrame}>
          <Image
            key={photoUris[photoIndex]}
            source={{ uri: photoUris[photoIndex] }}
            style={styles.photoFrameImage}
            resizeMode="cover"
          />
          {photoUris.length > 1 && (
            <>
              <Pressable style={styles.photoArrowLeft} onPress={showPrevPhoto} hitSlop={8}>
                <Ionicons name="chevron-back" size={16} color={colors.textPrimary} />
              </Pressable>
              <Pressable style={styles.photoArrowRight} onPress={showNextPhoto} hitSlop={8}>
                <Ionicons name="chevron-forward" size={16} color={colors.textPrimary} />
              </Pressable>
              <View style={styles.photoDotsRow} pointerEvents="none">
                {photoUris.map((uri, i) => (
                  <View key={uri} style={[styles.photoDot, i === photoIndex && styles.photoDotActive]} />
                ))}
              </View>
            </>
          )}
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
            <Text style={styles.noNote}>{noteEmptyState.main} Tap to add one.</Text>
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
  // Big and prominent on purpose ("wstaw normalną ramkę, jest masa
  // miejsca") — a real photo frame, not a row of small thumbnails.
  photoFrame: {
    marginTop: spacing.sm,
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
    position: 'relative',
  },
  photoFrameImage: {
    width: '100%',
    height: '100%',
  },
  photoArrowLeft: {
    position: 'absolute',
    left: 6,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(12, 10, 8, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoArrowRight: {
    position: 'absolute',
    right: 6,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(12, 10, 8, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoDotsRow: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  photoDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(241, 231, 210, 0.4)',
  },
  photoDotActive: {
    backgroundColor: colors.gold,
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
