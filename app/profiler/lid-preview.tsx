// THE LID PREVIEW — final classification screen (THE_LID_PREVIEW_LOGIC).
// Same "art is the layout, code only adds data" rule as the rest of
// Profiler: header, box frames, central photo, FIELD NOTE card and the
// "Remember:"/BACK TO DIARY chrome are all baked into
// assets/noir/profiler/lid_preview_bg.jpg; this file only measures where
// the empty boxes and text zones sit and fills them from
// src/engine/lid/lidPreview.ts's result — never inventing the scoring
// itself (that engine is the only thing that computes PRIMARY TYPE/THREAT
// LEVEL/etc., this screen just lays the numbers out).
//
// Two known gaps, both reported rather than invented (AGENTS.md):
// - Only one archetype photo was ever delivered (the sunglasses portrait
//   baked into the background) — the other 7 archetypes have no distinct
//   illustration yet, so the central photo does NOT change with the
//   result. See src/engine/lid/lidAssets.ts for the mapping that's ready
//   once real per-archetype art exists.
// - PROFILE CONFIDENCE and the relationship statistics (section 8/9 of the
//   spec) have no baked space in this reference image at all — added as a
//   plain code-styled card below the artwork instead of trying to invent a
//   matching torn-paper texture with no real asset for it.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, GoldButton, Screen } from '@/components/ui';
import { computeLidPreview, isLidComplete } from '@/engine/lid/lidPreview';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing, typography } from '@/theme/tokens';

// Exact pixel size of assets/noir/profiler/lid_preview_bg.jpg.
const BG_W = 843;
const BG_H = 1500;

// Real-device report: the stats card's bottom row was covered by the
// Android system gesture bar — insets.bottom alone wasn't enough (same
// belt-and-suspenders fallback the tab bar already uses for exactly this).
const MIN_BOTTOM_SAFE_PAD = 24;

function pct(px: number, of: number): `${number}%` {
  return `${Math.round((px / of) * 1000) / 10}%`;
}

// Every zone below measured off the source image's pixels (border/brightness
// scans), not eyeballed.
const PRIMARY_ZONE = { left: 31, right: 371, top: 362, bottom: 479 };
const SECONDARY_ZONE = { left: 31, right: 371, top: 572, bottom: 689 };
const THREAT_ZONE = { left: 110, right: 371, top: 758, bottom: 845 };
// left was 70 — real-device report: text started almost on top of the
// ruled paper's spiral-bound holes. Measured the actual hole column on a
// real screenshot and shifted right to clear it with real margin.
const FIELD_NOTE_ZONE = { left: 108, right: 600, top: 1020, bottom: 1210 };
const FINAL_REMARK_ZONE = { left: 95, right: 335, top: 1305, bottom: 1400 };
const BACK_TO_DIARY_HOTSPOT = { left: 470, right: 800, top: 1280, bottom: 1330 };
const FINAL_REMARK_COVER_COLOR = '#C39A7C';

function zoneStyle(z: { left: number; right: number; top: number; bottom: number }) {
  return {
    left: pct(z.left, BG_W),
    width: pct(z.right - z.left, BG_W),
    top: pct(z.top, BG_H),
    height: pct(z.bottom - z.top, BG_H),
  } as const;
}

const HIGH_THREAT: string[] = ['ELEVATED', 'UNEXPLAINED'];

export default function TheLidPreviewScreen() {
  const insets = useSafeAreaInsets();
  const { activities, caseMeta } = useRelationship();

  const complete = isLidComplete(caseMeta);
  const result = useMemo(
    () => (complete ? computeLidPreview(activities, caseMeta) : null),
    [complete, activities, caseMeta]
  );

  if (!result) {
    return (
      <Screen>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>THE LID PREVIEW</Text>
          <View style={styles.headerSide} />
        </View>
        <View style={styles.emptyContent}>
          <Ionicons name="lock-closed-outline" size={40} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>THE LID HAS NOT SPOKEN.</Text>
          <Text style={styles.emptySubtitle}>Assessment required.</Text>
          <GoldButton
            label="OPEN THE LID"
            icon="chevron-forward"
            onPress={() => router.push('/profiler/lid')}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </Screen>
    );
  }

  const threatColor = HIGH_THREAT.includes(result.threatLabel) ? colors.red : colors.textPrimary;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bgBox}>
          <Image
            source={require('../../assets/noir/profiler/lid_preview_bg.jpg')}
            style={styles.bgImage}
            resizeMode="cover"
          />

          <View style={[styles.boxZone, zoneStyle(PRIMARY_ZONE)]}>
            <Text style={styles.boxLabel} numberOfLines={2}>
              {result.primaryType}
            </Text>
            <Text style={styles.boxPercent}>{result.primaryScore}%</Text>
          </View>

          <View style={[styles.boxZone, zoneStyle(SECONDARY_ZONE)]}>
            {result.secondaryType ? (
              <>
                <Text style={styles.boxLabel} numberOfLines={2}>
                  {result.secondaryType}
                </Text>
                <Text style={styles.boxPercent}>{result.secondaryScore}%</Text>
              </>
            ) : (
              <Text style={styles.boxLabelMuted}>UNRESOLVED</Text>
            )}
          </View>

          <View style={[styles.boxZone, zoneStyle(THREAT_ZONE)]}>
            <Text style={[styles.threatLabel, { color: threatColor }]}>{result.threatLabel}</Text>
            <Text style={[styles.boxPercent, { color: threatColor }]}>{result.threatLevel}%</Text>
          </View>

          <Text style={[styles.fieldNoteText, zoneStyle(FIELD_NOTE_ZONE)]} numberOfLines={8}>
            {result.fieldNote}
          </Text>

          {/* The baked example ("Love is optional. The LID is forever.",
              in faint red script) shows through behind real text without
              this — same fix as the DNA/LID screens' baked placeholders. */}
          <View style={[styles.finalRemarkCover, zoneStyle(FINAL_REMARK_ZONE)]} />
          <Text style={[styles.finalRemarkText, zoneStyle(FINAL_REMARK_ZONE)]} numberOfLines={4}>
            {result.finalRemark}
          </Text>

          <Pressable
            style={[styles.backToDiaryHotspot, zoneStyle(BACK_TO_DIARY_HOTSPOT)]}
            onPress={() => router.push('/(tabs)/home')}
            accessibilityRole="button"
            accessibilityLabel="Back to diary"
          />
        </View>

        {/* No baked space exists for Profile Confidence / relationship
            statistics in this reference image (see file header) — this
            card is deliberately plain (the app's existing bordered Card,
            not a fabricated torn-paper texture) rather than guessing at a
            matching art style with no real asset to match. */}
        <Card style={styles.statsCard}>
          <View style={styles.statsHeaderRow}>
            <Text style={styles.statsHeading}>PROFILE CONFIDENCE</Text>
            <Text style={styles.statsConfidenceValue}>
              {result.profileConfidence}% · {result.profileConfidenceLabel}
            </Text>
          </View>
          <View style={styles.statsGrid}>
            <StatCell label="DAYS" value={result.statistics.totalDays} />
            <StatCell label="MEETINGS" value={result.statistics.meetings} />
            <StatCell label="CALLS" value={result.statistics.calls} />
            <StatCell label="DMS" value={result.statistics.messages} />
            <StatCell label="INCIDENTS" value={result.statistics.incidents} />
            <StatCell label="EVIDENCE" value={result.statistics.evidenceItems} />
          </View>
        </Card>

        <View style={{ height: Math.max(insets.bottom, MIN_BOTTOM_SAFE_PAD) + spacing.xl }} />
      </ScrollView>

      <Pressable
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => router.back()}
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
      </Pressable>
    </Screen>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.lg,
  },
  bgBox: {
    width: '100%',
    aspectRatio: BG_W / BG_H,
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  boxZone: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 8,
  },
  // Real-device report: the longest archetype labels ("THE GOLDEN
  // RETRIEVER") overflowed the frame at the sizes these shipped at
  // (12/20) — sized down with real headroom for that longest case, not
  // just the shorter name ("THE GENTLEMAN") that happened to fit fine.
  boxLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 10,
    textAlign: 'center',
  },
  boxLabelMuted: {
    color: colors.textFaint,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  boxPercent: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 17,
  },
  threatLabel: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  fieldNoteText: {
    position: 'absolute',
    color: '#000000',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
  finalRemarkCover: {
    position: 'absolute',
    backgroundColor: FINAL_REMARK_COVER_COLOR,
  },
  finalRemarkText: {
    position: 'absolute',
    color: '#000000',
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 16,
  },
  backToDiaryHotspot: {
    position: 'absolute',
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  statsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statsHeading: {
    ...typography.stamp,
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1,
  },
  statsConfidenceValue: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCell: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  statLabel: {
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(12, 10, 8, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerSide: {
    width: 22,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textFaint,
    fontSize: 13,
    textAlign: 'center',
  },
});
