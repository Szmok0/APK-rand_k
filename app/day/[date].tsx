// DAY DETAIL — full-screen route (deep-link target from Evidence Archive and
// Add Activity's post-save redirect — Timeline is gone, Evidence Archive is
// its functional replacement). Rebuilt against
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
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GLYPH_MAP } from '@/data/glyphs';
import { Screen } from '@/components/ui';
import { emptyStateFor } from '@/engine/emptyState';
import { dailyQuote } from '@/engine/quote';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, moodColors, priorityColors, priorityLabels, radius, spacing, typography } from '@/theme/tokens';
import { dateBadgeLabel, dayLabelFull, durationHours } from '@/utils/dates';

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
// TIME/EVIDENCE bars shrunk 20% per follow-up feedback ("ramki time i
// evidence są za duże, zmniejszyć o 20%") — they no longer span the full
// row, just this fraction of it, centered.
const BAR_SCALE = 0.8;

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getActivityByDate, deleteActivity, toggleFavorite } = useRelationship();
  const insets = useSafeAreaInsets();
  // Measured once off the header (a plain full-width row, same width as
  // every other section below it) — real pixel width drives the photo/
  // priority/TIME/EVIDENCE math below instead of guessed percentages.
  const [contentWidth, setContentWidth] = useState(345);
  function onContentLayout(e: LayoutChangeEvent) {
    setContentWidth(e.nativeEvent.layout.width);
  }

  const activity = getActivityByDate(date);
  // Picked once per visit (empty deps), not on every re-render — matches
  // "should change each time you enter the screen" without also reshuffling
  // mid-visit on unrelated state updates (e.g. toggling favorite).
  const quote = useMemo(() => dailyQuote(), []);
  // Same "picked once per visit" convention as the quote above — was
  // hardcoded to always show EMPTY_STATES id 4 verbatim, never the other 3
  // lines written for this exact group (found during the pre-handoff audit).
  const emptyState = useMemo(() => emptyStateFor('CALENDAR / EMPTY DAY'), []);
  // Same fix, different spot: the REPORT card's "no note yet" placeholder
  // (shown when the day HAS an activity but no note text) was also frozen on
  // one hardcoded line instead of rotating between the pool's 2 options.
  const noteEmptyState = useMemo(() => emptyStateFor('EVIDENCE / NO TEXT NOTE'), []);

  // Which of the activity's photos the frame's carousel is currently
  // showing (multi-photo support — was a single fixed photoUri). Reset
  // whenever the day changes so a new activity never opens mid-carousel.
  const photoUris = activity?.photoUris ?? [];
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => setPhotoIndex(0), [date]);
  function onPhotoScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const width = photoPriorityLayout.photoWidth;
    if (width > 0) setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  }

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
    const barWidth = contentWidth * BAR_SCALE;
    const timeHeight = barWidth / TIME_BAR_RATIO;
    const evidenceHeight = barWidth / EVIDENCE_BAR_RATIO;
    return {
      barWidth,
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
    const uri = activity.photoUris?.[photoIndex] ?? activity.photoUris?.[0];
    if (uri && canShare) {
      await Sharing.shareAsync(uri);
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
          <Text style={styles.quoteText}>&ldquo;{quote}&rdquo;</Text>
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
            <Text style={styles.emptyText}>{emptyState.main}</Text>
            <Text style={styles.emptySubtext}>{emptyState.sub}</Text>
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
                      {/* +10% per follow-up feedback ("ikony są za małe") */}
                      <Ionicons name={s.icon} size={16} color={s.color} />
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

            {(photoUris.length > 0 || activity.importance > 0) && (
              <View style={styles.photoPriorityRow}>
                {/* Always shown once this row renders at all — even with no
                    photo attached — so a lone priority card never sits next
                    to a jarring empty void ("jeśli nie ma zdjęcia musi
                    pojawić się ramka - nawet pusta żeby zachować strukturę"). */}
                <View
                  style={[
                    styles.photoFrameWrap,
                    { width: photoPriorityLayout.photoWidth, height: photoPriorityLayout.photoHeight },
                  ]}
                >
                  {photoUris.length > 0 ? (
                    // Was a single Image here (one photoUri) — multiple
                    // photos now page through the same fixed frame instead
                    // of needing a whole new layout, with dots below
                    // showing which one of how many is on screen. Each page
                    // is exactly one frame wide (for pagingEnabled to snap
                    // correctly); the inset image inside it reuses
                    // photoInner's original percentages, just resolved to
                    // pixels since a ScrollView page's own percentage sizing
                    // can't be trusted to resolve against its scroll content.
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onMomentumScrollEnd={onPhotoScrollEnd}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: photoPriorityLayout.photoWidth,
                        height: photoPriorityLayout.photoHeight,
                      }}
                    >
                      {photoUris.map((uri) => (
                        <View
                          key={uri}
                          style={{ width: photoPriorityLayout.photoWidth, height: photoPriorityLayout.photoHeight }}
                        >
                          <Image
                            source={{ uri }}
                            style={{
                              position: 'absolute',
                              left: photoPriorityLayout.photoWidth * 0.04,
                              top: photoPriorityLayout.photoHeight * 0.05,
                              width: photoPriorityLayout.photoWidth * 0.92,
                              height: photoPriorityLayout.photoHeight * 0.87,
                              borderRadius: 2,
                            }}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={styles.photoEmptySlot}>
                      <Ionicons name="image-outline" size={22} color={colors.textFaint} />
                    </View>
                  )}
                  <Image
                    source={require('../../assets/noir/day-detail/photo_frame.png')}
                    style={styles.photoFrameArt}
                  />
                  {photoUris.length > 1 && (
                    <View style={styles.photoDotsRow} pointerEvents="none">
                      {photoUris.map((uri, i) => (
                        <View key={uri} style={[styles.photoDot, i === photoIndex && styles.photoDotActive]} />
                      ))}
                    </View>
                  )}
                </View>
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

            <View style={[styles.timeBarWrap, { width: barLayout.barWidth, height: barLayout.timeHeight }]}>
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
            <View style={[styles.evidenceBarWrap, { width: barLayout.barWidth, height: barLayout.evidenceHeight }]}>
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
              {/* The card's own asset has a small, fixed inner area — too
                  small for a real report, and its nested scroll never
                  registered gestures on a real device anyway (outer
                  ScrollView always won). Tapping opens the note in its own
                  full screen instead. */}
              <Pressable
                style={styles.reportInner}
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
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
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
  photoEmptySlot: {
    position: 'absolute',
    left: '4%',
    top: '5%',
    width: '92%',
    height: '87%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Real bug, found on a real device: this had no explicit position, and
  // only "worked" by accident because its only sibling (photoInner /
  // photoEmptySlot) was itself absolute, leaving this the sole item in
  // normal flow — sized 100%/100% of a relative parent, which happens to
  // look like a correct overlay. Adding the photo carousel (also non-
  // absolute) broke that accident: two flow siblings stacked vertically
  // instead of overlapping, pushing this frame down and out of view.
  // Absolute here is the actual fix, not dependent on sibling count/order.
  photoFrameArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  photoDotsRow: {
    position: 'absolute',
    bottom: '6%',
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
    alignSelf: 'center',
    marginTop: SECTION_GAP,
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
    alignSelf: 'center',
    marginTop: SECTION_GAP,
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
