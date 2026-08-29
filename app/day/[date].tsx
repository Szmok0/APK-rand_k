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
import React, { useMemo, useState } from 'react';
import { Alert, Image, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

// One consistent vertical gap between every section on this screen (quote,
// date badge, summary row, photo/priority, TIME, EVIDENCE, REPORT, actions)
// — product owner spec: "wszystkie ramki powinny być dokładnie w tej samej
// odległości" (every frame at exactly the same distance from the next).
// Reduced 10% per follow-up feedback (was 10).
const SECTION_GAP = 9;

// Real, unmodified aspect ratios of the actual asset files — used to derive
// exact pixel layout below instead of guessed percentages.
const PHOTO_FRAME_RATIO = 1389 / 822;
const PRIORITY_BADGE_RATIO = 1269 / 1043;
const TIME_BAR_RATIO = 239 / 68;
const EVIDENCE_BAR_RATIO = 268 / 70;
// Cap-height of the baked "TIME"/"EVIDENCE"/"ITEMS" label text, measured
// directly off the source pixels, as a fraction of each bar's full height
// (~10px of 68px / 70px tall) — the code-drawn value text is sized off this
// same ratio (with a cap-height→fontSize fudge factor) so it visually
// matches the baked label's size instead of being picked arbitrarily.
const TIME_LABEL_CAP_RATIO = 10 / 68;
const EVIDENCE_LABEL_CAP_RATIO = 10 / 70;
const CAP_TO_FONT_SIZE = 1.35;

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getActivityByDate, deleteActivity, toggleFavorite } = useRelationship();
  const insets = useSafeAreaInsets();
  const [noteRevealed, setNoteRevealed] = useState(false);
  // Measured once off the header (a plain full-width row, same width as
  // every other section below it) — real pixel width drives the photo/
  // priority/TIME/EVIDENCE math below instead of guessed percentages.
  const [contentWidth, setContentWidth] = useState(345);
  function onContentLayout(e: LayoutChangeEvent) {
    setContentWidth(e.nativeEvent.layout.width);
  }

  const activity = getActivityByDate(date);

  // Photo frame is 70% of the FULL row width (product owner spec, in those
  // words: "na szerokość ekranu ramka zdjęcia ma zajmować 70%"), kept at its
  // own real aspect ratio so its torn-paper border isn't distorted. Priority
  // takes the remaining ~30% and is stretched to match the photo's height so
  // the two sit on the same line — priority is the one asset the product
  // owner explicitly said to "dostosuj" (adjust/fit) next to the frame.
  const photoPriorityLayout = useMemo(() => {
    const available = contentWidth - spacing.sm;
    const photoWidth = available * 0.7;
    const priorityWidth = available * 0.3;
    const photoHeight = photoWidth / PHOTO_FRAME_RATIO;
    return { photoWidth, photoHeight, priorityWidth, priorityHeight: photoHeight };
  }, [contentWidth]);

  // TIME/EVIDENCE bars: full row width, each at its OWN native aspect ratio
  // (not stretched to a shared/different shape), with the value's font size
  // derived from the baked label's real cap-height so it visually matches.
  const barLayout = useMemo(() => {
    const timeHeight = contentWidth / TIME_BAR_RATIO;
    const evidenceHeight = contentWidth / EVIDENCE_BAR_RATIO;
    return {
      timeHeight,
      evidenceHeight,
      timeFontSize: timeHeight * TIME_LABEL_CAP_RATIO * CAP_TO_FONT_SIZE,
      evidenceFontSize: evidenceHeight * EVIDENCE_LABEL_CAP_RATIO * CAP_TO_FONT_SIZE,
    };
  }, [contentWidth]);

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

  // Only categories that actually apply to this activity are shown — this is
  // a derived read-out of what's in the data, not a fixed 6-slot template
  // (an activity with no gift-type glyph shows no GIFT card, same logic as
  // Calendar's dayBadges list). All shown items sit in a single row.
  const summary: SummaryItem[] = activity
    ? (
        [
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
        ] as SummaryItem[]
      ).filter((s) => s.count > 0)
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
        <View style={styles.header} onLayout={onContentLayout}>
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
          <View style={styles.dateBadgeDateSlot}>
            <Text style={styles.dateBadgeDate}>{dateBadgeLabel(date)}</Text>
          </View>
          <View style={styles.dateBadgeWeekdaySlot}>
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
            {summary.length > 0 && (
              <View style={styles.summaryRow}>
                {summary.map((s) => (
                  <View key={s.key} style={styles.summaryCard}>
                    <View style={styles.summaryIconWrap}>
                      <Ionicons name={s.icon} size={14} color={s.color} />
                      <View style={[styles.summaryDot, { backgroundColor: s.color }]} />
                    </View>
                    <Text style={styles.summaryValue}>{s.count}</Text>
                    <Text style={styles.summaryLabel} numberOfLines={1}>
                      {s.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {(activity.photoUri || activity.importance > 0) && (
              <View style={styles.photoPriorityRow}>
                {activity.photoUri && (
                  <View
                    style={[
                      styles.photoFrameWrap,
                      { width: photoPriorityLayout.photoWidth, height: photoPriorityLayout.photoHeight },
                    ]}
                  >
                    <Image source={{ uri: activity.photoUri }} style={styles.photoInner} />
                    <Image
                      source={require('../../assets/noir/day-detail/photo_frame.png')}
                      style={styles.photoFrameArt}
                    />
                  </View>
                )}
                {activity.importance > 0 && (
                  <View
                    style={[
                      styles.priorityBadgeWrap,
                      { width: photoPriorityLayout.priorityWidth, height: photoPriorityLayout.priorityHeight },
                    ]}
                  >
                    <Image
                      source={require('../../assets/noir/day-detail/priority_badge.png')}
                      style={styles.priorityBadgeImg}
                      resizeMode="stretch"
                    />
                    {/* "PRIORITY" is baked into the asset as a stamp — only the
                        level word (ROUTINE/NOTED/CRITICAL) is code, dropped
                        into the dashed placeholder below it. */}
                    <View style={styles.priorityLevelSlot}>
                      <Text style={[styles.priorityLevel, { color: priorityColors[activity.importance] }]}>
                        {priorityLabels[activity.importance]}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            <View style={[styles.timeBarWrap, { height: barLayout.timeHeight }]}>
              <Image
                source={require('../../assets/noir/day-detail/time_bar.png')}
                style={styles.timeBarImg}
                resizeMode="contain"
              />
              <View style={styles.timeBarSlot}>
                <Text
                  style={[styles.readoutValue, { fontSize: barLayout.timeFontSize }]}
                  numberOfLines={1}
                >
                  {durationHours(activity.startTime, activity.endTime) > 0
                    ? `${activity.startTime} - ${activity.endTime}`
                    : '—'}
                </Text>
              </View>
            </View>
            <View style={[styles.evidenceBarWrap, { height: barLayout.evidenceHeight }]}>
              <Image
                source={require('../../assets/noir/day-detail/evidence_bar.png')}
                style={styles.evidenceBarImg}
                resizeMode="contain"
              />
              <View style={styles.evidenceBarSlot}>
                <Text
                  style={[styles.readoutValue, { fontSize: barLayout.evidenceFontSize }]}
                  numberOfLines={1}
                >
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
    alignSelf: 'center',
    marginTop: SECTION_GAP,
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
    width: '70%',
    aspectRatio: 1661 / 707,
    marginTop: SECTION_GAP,
    position: 'relative',
  },
  dateBadgeImg: {
    width: '100%',
    height: '100%',
  },
  // Two separate slots (date on top, weekday below), matching the two
  // dashed placeholder regions actually drawn into date_badge.png.
  dateBadgeDateSlot: {
    position: 'absolute',
    left: '19.3%',
    top: '11.3%',
    width: '61.7%',
    height: '31.1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeWeekdaySlot: {
    position: 'absolute',
    left: '16.9%',
    top: '55.2%',
    width: '66.5%',
    height: '29.7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDate: {
    ...typography.stamp,
    color: colors.textOnPaper,
    fontSize: 14,
  },
  dateBadgeWeekday: {
    ...typography.stamp,
    color: colors.red,
    fontSize: 12,
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
  // Always ONE row — however many categories apply (1 to 6), they share the
  // row via flex:1 rather than wrapping to a second line.
  summaryRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: SECTION_GAP,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 1,
  },
  summaryIconWrap: {
    position: 'relative',
  },
  summaryDot: {
    position: 'absolute',
    top: -2,
    right: -5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  summaryValue: {
    ...typography.stat,
    color: colors.textPrimary,
    fontSize: 13,
  },
  summaryLabel: {
    fontSize: 6.5,
    letterSpacing: 0.3,
    color: colors.textFaint,
  },
  photoPriorityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: SECTION_GAP,
  },
  // Photo and priority each keep their own real asset's native aspect ratio
  // (they aren't the same shape — the photo frame is a wide vintage-print
  // border, the priority card is a taller lined-paper note). Exact pixel
  // width/height come from photoPriorityLayout (see component body): photo
  // is 70% of the row, priority sits at the same height beside it.
  photoFrameWrap: {
    position: 'relative',
  },
  photoInner: {
    position: 'absolute',
    left: '4%',
    top: '5%',
    width: '92%',
    height: '87%',
    borderRadius: 2,
  },
  photoFrameArt: {
    width: '100%',
    height: '100%',
  },
  priorityBadgeWrap: {
    position: 'relative',
  },
  priorityBadgeImg: {
    width: '100%',
    height: '100%',
  },
  priorityLevelSlot: {
    position: 'absolute',
    left: '15.4%',
    top: '48.4%',
    width: '71.7%',
    height: '33.1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityLevel: {
    ...typography.stamp,
    fontSize: 14,
  },
  // TIME / EVIDENCE — real asset bars (icon + label baked into the pixels),
  // rendered at their own real aspect ratio (full row width, height derived
  // from TIME_BAR_RATIO/EVIDENCE_BAR_RATIO — see barLayout) — not stretched
  // or forced to match each other's shape. Only the value text is code,
  // dropped into the dashed placeholder's exact spot, sized off the baked
  // label's own cap-height (see CAP_TO_FONT_SIZE) so it visually matches.
  timeBarWrap: {
    marginTop: SECTION_GAP,
    width: '100%',
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
    marginTop: SECTION_GAP,
    width: '100%',
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
    marginTop: SECTION_GAP,
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
    left: '8%',
    top: '23%',
    width: '82%',
    height: '62%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  reportScroll: {
    flex: 1,
  },
  noteText: {
    color: colors.textOnPaper,
    fontSize: 12,
    lineHeight: 16,
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
    marginTop: SECTION_GAP,
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
