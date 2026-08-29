// DAY DETAIL — full-screen route (deep-link target from Evidence Archive,
// Add Activity's post-save redirect, and Timeline's day tap). Rebuilt against
// the product owner's reference screen + asset pack (Aug 2026): a torn-paper
// date badge, a 6-category summary bar, side-by-side photo/priority cards,
// stacked TIME/EVIDENCE readouts, and an expandable REPORT card with its own
// favorite star. Previously a thin wrapper around DayDetailPanel's shared
// "non-fillReport" branch — that branch is now gone (DayDetailPanel is only
// ever used in its `fillReport` form, by Calendar's inline panel), and this
// screen owns its own layout + action handlers.
//
// One deliberate deviation: the reference mockup shows the 4-tab bottom nav
// on this screen. Day Detail is a top-level Stack.Screen (app/_layout.tsx),
// a sibling of the (tabs) group, not a tab itself — same as Add Activity and
// Settings, it's a pushed detail screen and correctly has no bottom nav. The
// reference's mockup frame likely included the nav for context the same way
// every other reference screen did; adding a second, route-local tab bar
// here would fight the single shared one instead of matching it.

import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GLYPH_MAP } from '@/data/glyphs';
import { Screen } from '@/components/ui';
import { dailyQuote } from '@/engine/quote';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, moodColors, priorityColors, priorityLabels, radius, spacing, typography } from '@/theme/tokens';
import { dateBadgeLabel, dayLabelFull, durationHours, fromDateKey } from '@/utils/dates';

type SummaryItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  count: number;
};

const CALL_IDS = new Set(['phone', 'video_call']);
const MESSAGE_IDS = new Set(['message', 'first_message', 'reconnect']);

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getActivityByDate, deleteActivity, toggleFavorite } = useRelationship();
  const insets = useSafeAreaInsets();
  const [noteRevealed, setNoteRevealed] = useState(false);

  const activity = getActivityByDate(date);

  function handleDelete() {
    if (!activity) return;
    Alert.alert('Remove this incident?', 'History will not argue. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { deleteActivity(activity.id); router.back(); } },
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

  const summary: SummaryItem[] = activity
    ? [
        {
          key: 'MEETING',
          label: 'MEETING',
          icon: 'people-outline',
          color: colors.olive,
          count: activity.glyphIds.filter((id) => GLYPH_MAP[id]?.category === 'MEETINGS').length,
        },
        {
          key: 'MESSAGE',
          label: 'MESSAGE',
          icon: 'chatbubble-outline',
          color: colors.purple,
          count: activity.glyphIds.filter((id) => MESSAGE_IDS.has(id)).length,
        },
        {
          key: 'CALL',
          label: 'CALL',
          icon: 'call-outline',
          color: colors.amber,
          count: activity.glyphIds.filter((id) => CALL_IDS.has(id)).length,
        },
        {
          key: 'GIFT',
          label: 'GIFT',
          icon: 'gift-outline',
          color: moodColors.NAMIETNOSC,
          count: activity.glyphIds.filter((id) => GLYPH_MAP[id]?.category === 'OBJECTS').length,
        },
        {
          key: 'NOTE',
          label: 'NOTE',
          icon: 'document-text-outline',
          color: colors.paper,
          count: activity.note ? 1 : 0,
        },
        {
          key: 'FAVORITE',
          label: 'FAVORITE',
          icon: 'star-outline',
          color: colors.gold,
          count: activity.favorite ? 1 : 0,
        },
      ]
    : [];

  return (
    <Screen>
      <Image
        source={require('../../assets/noir/day-detail/bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>DAY DETAIL</Text>
          <Text style={styles.headerMenu}>•••</Text>
        </View>

        <Image
          source={require('../../assets/noir/day-detail/compass.png')}
          style={styles.compass}
          resizeMode="contain"
        />

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>&ldquo;{dailyQuote(fromDateKey(date))}&rdquo;</Text>
          <Text style={styles.quoteAttribution}>— UNKNOWN WITNESS</Text>
        </View>

        <View style={styles.dateBadgeWrap}>
          <Image
            source={require('../../assets/noir/day-detail/date_badge.png')}
            style={styles.dateBadgeImg}
            resizeMode="stretch"
          />
          <View style={styles.dateBadgeSlot}>
            <Text style={styles.dateBadgeDate}>{dateBadgeLabel(date)}</Text>
            <Text style={styles.dateBadgeWeekday}>{dayLabelFull(date)}</Text>
          </View>
        </View>

        {!activity ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No incident recorded.</Text>
            <Text style={styles.emptySubtext}>This does not prove nothing happened.</Text>
            <Pressable
              style={styles.addBtn}
              onPress={() => router.push({ pathname: '/add-activity', params: { date } })}
            >
              <Text style={styles.addBtnLabel}>+ ADD ACTIVITY</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.summaryRow}>
              {summary.map((s) => (
                <View key={s.key} style={styles.summaryCard}>
                  <View style={styles.summaryIconWrap}>
                    <Ionicons name={s.icon} size={18} color={s.color} />
                    <View style={[styles.summaryDot, { backgroundColor: s.color }]} />
                  </View>
                  <Text style={styles.summaryValue}>{s.count}</Text>
                  <Text style={styles.summaryLabel} numberOfLines={1}>
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>

            {(activity.photoUri || activity.importance > 0) && (
              <View style={styles.photoPriorityRow}>
                {activity.photoUri && (
                  <View style={styles.photoFrameWrap}>
                    <Image source={{ uri: activity.photoUri }} style={styles.photoInner} />
                    <Image
                      source={require('../../assets/noir/day-detail/photo_frame.png')}
                      style={styles.photoFrameArt}
                    />
                  </View>
                )}
                {activity.importance > 0 && (
                  <View style={styles.priorityBadgeWrap}>
                    <Image
                      source={require('../../assets/noir/day-detail/priority_badge.png')}
                      style={styles.priorityBadgeImg}
                      resizeMode="stretch"
                    />
                    <View style={styles.priorityBadgeSlot}>
                      <Text style={[styles.priorityWord, { color: priorityColors[activity.importance] }]}>
                        PRIORITY
                      </Text>
                      <Text style={[styles.priorityLevel, { color: priorityColors[activity.importance] }]}>
                        {priorityLabels[activity.importance]}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={styles.timeBarWrap}>
              <Image
                source={require('../../assets/noir/day-detail/time_bar.png')}
                style={styles.timeBarImg}
                resizeMode="stretch"
              />
              <View style={styles.timeBarSlot}>
                <Text style={styles.readoutValue} numberOfLines={1}>
                  {durationHours(activity.startTime, activity.endTime) > 0
                    ? `${activity.startTime} - ${activity.endTime}`
                    : '—'}
                </Text>
              </View>
            </View>
            <View style={styles.evidenceBarWrap}>
              <Image
                source={require('../../assets/noir/day-detail/evidence_bar.png')}
                style={styles.evidenceBarImg}
                resizeMode="stretch"
              />
              <View style={styles.evidenceBarSlot}>
                <Text style={styles.readoutValue} numberOfLines={1}>
                  {String(activity.glyphIds.length).padStart(3, '0')}
                </Text>
              </View>
            </View>

            <View style={styles.reportCardWrap}>
              <Image
                source={require('../../assets/noir/day-detail/report_card.png')}
                style={styles.reportCardImg}
                resizeMode="stretch"
              />
              <Pressable style={styles.reportStarSlot} hitSlop={8} onPress={() => toggleFavorite(activity.id)}>
                {activity.favorite && <Ionicons name="star" size={16} color={colors.gold} />}
              </Pressable>
              <View style={styles.reportInner}>
                {activity.note ? (
                  noteRevealed ? (
                    <ScrollView style={styles.reportScroll}>
                      <Text style={styles.noteText}>{activity.note}</Text>
                    </ScrollView>
                  ) : (
                    <Pressable style={styles.revealBtn} onPress={() => setNoteRevealed(true)}>
                      <Text style={styles.revealBtnLabel}>Reveal Report</Text>
                    </Pressable>
                  )
                ) : (
                  <Text style={styles.noNote}>No written statement attached.</Text>
                )}
              </View>
            </View>

            <View style={styles.actionsRowWrap}>
              <Image
                source={require('../../assets/noir/day-detail/actions_row.png')}
                style={styles.actionsRowImg}
                resizeMode="stretch"
              />
              <View style={styles.actionsRowSlot}>
                <Pressable
                  style={styles.actionSlotThird}
                  onPress={() => router.push({ pathname: '/add-activity', params: { date } })}
                />
                <Pressable style={styles.actionSlotThird} onPress={handleDelete} />
                <Pressable style={styles.actionSlotThird} onPress={handleShare} />
              </View>
            </View>
          </>
        )}

        <View style={{ height: insets.bottom + spacing.xl }} />
      </ScrollView>
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
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerMenu: {
    color: colors.textFaint,
    fontSize: 16,
    letterSpacing: 1,
    width: 22,
    textAlign: 'right',
  },
  compass: {
    position: 'absolute',
    top: 44,
    right: spacing.lg,
    width: 46,
    height: 72,
    opacity: 0.85,
  },
  quoteBox: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: 'rgba(27, 22, 19, 0.6)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    maxWidth: '78%',
  },
  quoteText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
    textAlign: 'center',
  },
  quoteAttribution: {
    ...typography.caption,
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  dateBadgeWrap: {
    alignSelf: 'center',
    width: '58%',
    aspectRatio: 198 / 89,
    marginTop: spacing.lg,
  },
  dateBadgeImg: {
    width: '100%',
    height: '100%',
  },
  dateBadgeSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDate: {
    ...typography.stamp,
    color: colors.textOnPaper,
    fontSize: 15,
  },
  dateBadgeWeekday: {
    ...typography.stamp,
    color: colors.red,
    fontSize: 13,
    marginTop: 2,
  },
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
  addBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  addBtnLabel: {
    color: colors.background,
    fontWeight: '700',
    letterSpacing: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  summaryCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  summaryIconWrap: {
    position: 'relative',
  },
  summaryDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  summaryValue: {
    ...typography.stat,
    color: colors.textPrimary,
    fontSize: 16,
  },
  summaryLabel: {
    fontSize: 8,
    letterSpacing: 0.5,
    color: colors.textFaint,
  },
  photoPriorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  photoFrameWrap: {
    width: '48%',
    aspectRatio: 141 / 137,
    position: 'relative',
  },
  photoInner: {
    position: 'absolute',
    left: '9%',
    top: '10%',
    width: '82%',
    height: '80%',
    borderRadius: 2,
  },
  photoFrameArt: {
    width: '100%',
    height: '100%',
  },
  priorityBadgeWrap: {
    width: '48%',
    aspectRatio: 190 / 129,
    position: 'relative',
  },
  priorityBadgeImg: {
    width: '100%',
    height: '100%',
  },
  priorityBadgeSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityWord: {
    ...typography.stamp,
    fontSize: 13,
  },
  priorityLevel: {
    ...typography.stamp,
    fontSize: 12,
    marginTop: 2,
  },
  // TIME / EVIDENCE — real asset bars (icon + label baked into the pixels),
  // only the value is code, dropped into the dashed placeholder's exact spot.
  timeBarWrap: {
    marginTop: spacing.sm,
    width: '100%',
    aspectRatio: 239 / 68,
    position: 'relative',
  },
  timeBarImg: {
    width: '100%',
    height: '100%',
  },
  timeBarSlot: {
    position: 'absolute',
    left: '43.9%',
    top: '29.4%',
    width: '45.2%',
    height: '41.2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceBarWrap: {
    marginTop: spacing.sm,
    width: '100%',
    aspectRatio: 268 / 70,
    position: 'relative',
  },
  evidenceBarImg: {
    width: '100%',
    height: '100%',
  },
  evidenceBarSlot: {
    position: 'absolute',
    left: '48.5%',
    top: '32.9%',
    width: '24.6%',
    height: '34.3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readoutValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  // REPORT — real asset card (REPORT tab, corner brackets, tape and the
  // outline favorite star are all baked into report_card.png); only the
  // note text and the star's filled state are code.
  reportCardWrap: {
    marginTop: spacing.lg,
    width: '100%',
    aspectRatio: 532 / 212,
    position: 'relative',
  },
  reportCardImg: {
    width: '100%',
    height: '100%',
  },
  reportStarSlot: {
    position: 'absolute',
    left: '91%',
    top: '4%',
    width: '8%',
    height: '14%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportInner: {
    position: 'absolute',
    left: '6.6%',
    top: '21%',
    width: '86.5%',
    height: '67%',
    justifyContent: 'center',
  },
  reportScroll: {
    flex: 1,
  },
  noteText: {
    color: colors.textOnPaper,
    fontSize: 13,
    lineHeight: 18,
  },
  noNote: {
    color: colors.textOnPaper,
    opacity: 0.6,
    fontSize: 12,
  },
  revealBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.textOnPaper,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  revealBtnLabel: {
    color: colors.textOnPaper,
    fontWeight: '600',
    fontSize: 12,
  },
  // ACTIONS — single real asset for all three buttons; EDIT/DELETE/SHARE are
  // invisible equal-thirds Pressables laid on top of it.
  actionsRowWrap: {
    marginTop: spacing.lg,
    width: '100%',
    aspectRatio: 502 / 60,
    position: 'relative',
  },
  actionsRowImg: {
    width: '100%',
    height: '100%',
  },
  actionsRowSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  actionSlotThird: {
    flex: 1,
  },
});
