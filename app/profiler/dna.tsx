// RELATIONSHIP DNA — Profiler concept doc section 4. Same "graphic is the
// layout, code only adds data" technique as the Profiler hub: the double
// helix, all 6 parameter icons/labels, the CASE EQUATION card and the
// SYSTEM COMMENT / FIELD NOTE cards are one baked background image
// (assets/noir/profiler/dna_bg.jpg); this file only measures where the
// "--%" placeholders and empty value boxes sit and overlays real numbers —
// see src/engine/dna.ts for the actual scoring (kept deliberately separate,
// per the product owner's instruction not to mix calculation and visuals).
//
// Every zone below was measured directly off the source image's pixels
// (853x1844), not eyeballed — see PLAN.md-style comments per group for the
// measured px this is derived from.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { computeCaseEquation, computeDnaScores } from '@/engine/dna';
import { pickFieldNote, pickSystemComment } from '@/engine/dnaFieldNote';
import { DNA_PARAMETERS } from '@/engine/dnaWeights';
import { useRelationship } from '@/store/RelationshipStore';
import { colors } from '@/theme/tokens';

// Exact pixel size of assets/noir/profiler/dna_bg.jpg.
const BG_W = 853;
const BG_H = 1844;

function pct(px: number, of: number): `${number}%` {
  return `${Math.round((px / of) * 1000) / 10}%`;
}

// The 6 "--%" boxes running down the helix (left=348, width=84, all in px;
// top/bottom measured per row via a border brightness scan).
const DNA_ROWS: { param: (typeof DNA_PARAMETERS)[number]; top: number; bottom: number }[] = [
  { param: 'CONTACT', top: 460, bottom: 525 },
  { param: 'EFFORT', top: 640, bottom: 705 },
  { param: 'CHEMISTRY', top: 814, bottom: 878 },
  { param: 'CHAOS', top: 998, bottom: 1062 },
  { param: 'MYSTERY', top: 1180, bottom: 1245 },
  { param: 'EVIDENCE', top: 1343, bottom: 1407 },
];
const DNA_BOX_LEFT = 348;
const DNA_BOX_WIDTH = 84;
// The box's own dashed "--%" border/frame stays baked in the art (it's the
// permanent slot, same idea as CASE EQUATION's boxes) — only the "--%" TEXT
// inside needs covering before the real number goes on top, so the patch is
// inset a few px from the measured box edges rather than matching them
// exactly (which would also paint over the border itself).
const DNA_COVER_INSET = 4;
const DNA_COVER_COLOR = '#0A0908';

// CASE EQUATION's 5 value boxes — each measured individually (left edge
// varies per row, right edge roughly aligned around x=800).
const CASE_EQ_ROWS = [
  { key: 'totalDays' as const, left: 714, right: 803, top: 563, bottom: 618 },
  { key: 'totalActivities' as const, left: 680, right: 803, top: 672, bottom: 718 },
  { key: 'evidenceItems' as const, left: 680, right: 798, top: 776, bottom: 826 },
  { key: 'incidents' as const, left: 660, right: 798, top: 868, bottom: 924 },
  { key: 'activitiesPerDay' as const, left: 630, right: 803, top: 985, bottom: 1035 },
];

// SYSTEM COMMENT's ruled note area, and the FIELD NOTE card's clear text
// area (left of the decorative claw mark on that card).
const SYSTEM_COMMENT_ZONE = { left: 490, right: 810, top: 1145, bottom: 1420 };
const FIELD_NOTE_ZONE = { left: 435, right: 595, top: 1600, bottom: 1740 };

export default function RelationshipDnaScreen() {
  const insets = useSafeAreaInsets();
  const { activities, caseMeta } = useRelationship();

  const scores = useMemo(() => computeDnaScores(activities), [activities]);
  const eq = useMemo(
    () => computeCaseEquation(activities, caseMeta.firstContactDate),
    [activities, caseMeta.firstContactDate]
  );
  const systemComment = useMemo(() => pickSystemComment(scores, eq), [scores, eq]);
  const fieldNote = useMemo(() => pickFieldNote(scores, eq, activities), [scores, eq, activities]);

  const caseEqValues: Record<(typeof CASE_EQ_ROWS)[number]['key'], string> = {
    totalDays: String(eq.totalDays),
    totalActivities: String(eq.totalActivities),
    evidenceItems: String(eq.evidenceItems),
    incidents: String(eq.incidents),
    activitiesPerDay: eq.activitiesPerDay.toFixed(1),
  };

  return (
    <Screen>
      <View style={styles.bgBox}>
        <Image
          source={require('../../assets/noir/profiler/dna_bg.jpg')}
          style={styles.bgImage}
          resizeMode="cover"
        />

        {DNA_ROWS.map((row) => (
          <React.Fragment key={row.param}>
            <View
              style={[
                styles.dnaValueCover,
                {
                  left: pct(DNA_BOX_LEFT + DNA_COVER_INSET, BG_W),
                  width: pct(DNA_BOX_WIDTH - DNA_COVER_INSET * 2, BG_W),
                  top: pct(row.top + DNA_COVER_INSET, BG_H),
                  height: pct(row.bottom - row.top - DNA_COVER_INSET * 2, BG_H),
                },
              ]}
            />
            <Text
              style={[
                styles.dnaValue,
                {
                  left: pct(DNA_BOX_LEFT, BG_W),
                  width: pct(DNA_BOX_WIDTH, BG_W),
                  top: pct(row.top, BG_H),
                  height: pct(row.bottom - row.top, BG_H),
                },
              ]}
            >
              {scores[row.param]}%
            </Text>
          </React.Fragment>
        ))}

        {CASE_EQ_ROWS.map((row) => (
          <Text
            key={row.key}
            style={[
              styles.caseEqValue,
              {
                left: pct(row.left, BG_W),
                width: pct(row.right - row.left, BG_W),
                top: pct(row.top, BG_H),
                height: pct(row.bottom - row.top, BG_H),
              },
            ]}
          >
            {caseEqValues[row.key]}
          </Text>
        ))}

        <Text
          style={[
            styles.systemComment,
            {
              left: pct(SYSTEM_COMMENT_ZONE.left, BG_W),
              width: pct(SYSTEM_COMMENT_ZONE.right - SYSTEM_COMMENT_ZONE.left, BG_W),
              top: pct(SYSTEM_COMMENT_ZONE.top, BG_H),
              height: pct(SYSTEM_COMMENT_ZONE.bottom - SYSTEM_COMMENT_ZONE.top, BG_H),
            },
          ]}
          numberOfLines={6}
        >
          {systemComment}
        </Text>

        <Text
          style={[
            styles.fieldNote,
            {
              left: pct(FIELD_NOTE_ZONE.left, BG_W),
              width: pct(FIELD_NOTE_ZONE.right - FIELD_NOTE_ZONE.left, BG_W),
              top: pct(FIELD_NOTE_ZONE.top, BG_H),
              height: pct(FIELD_NOTE_ZONE.bottom - FIELD_NOTE_ZONE.top, BG_H),
            },
          ]}
          numberOfLines={4}
        >
          {fieldNote}
        </Text>

        <Pressable
          style={[styles.backButton, { top: insets.top + 8 }]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bgBox: {
    width: '100%',
    aspectRatio: BG_W / BG_H,
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  // A small translucent backdrop, not just a bare icon — the art's own
  // "CASE #003 / THE LID" stamp sits close to this same top-left corner, and
  // a bare icon read as a collision with it rather than a distinct control.
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
  dnaValueCover: {
    position: 'absolute',
    backgroundColor: DNA_COVER_COLOR,
  },
  dnaValue: {
    position: 'absolute',
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  caseEqValue: {
    position: 'absolute',
    color: colors.textOnPaper,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  systemComment: {
    position: 'absolute',
    color: colors.textOnPaper,
    fontSize: 11,
    lineHeight: 15,
  },
  fieldNote: {
    position: 'absolute',
    color: colors.textOnPaper,
    fontSize: 10,
    lineHeight: 13,
    fontStyle: 'italic',
  },
});
