// THE LID — 9-attribute slider screen (THE LID slider spec, product-owner
// supplied). Same "art is the layout, code only adds data/interaction"
// rule as the rest of Profiler: the track line, its 5 dots and the "1 2 3 4
// 5" numerals are baked into assets/noir/profiler/lid_bg.jpg for all 9
// rows; this file only measures where each row's track and description
// zone sit and wires up src/components/TheLidSlider for the actual drag
// interaction (never a native/platform slider — spec is explicit that
// would visually break the design).
//
// Every zone below was measured directly off the source image's pixels
// (844x1500) via a brightness scan of the baked dots, not eyeballed.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { TheLidSlider } from '@/components/TheLidSlider';
import { LID_DEFAULT_VALUE, LID_TRAITS, type LidTraitId } from '@/data/theLidTraits';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, spacing } from '@/theme/tokens';

type LidValue = 1 | 2 | 3 | 4 | 5;

// Exact pixel size of assets/noir/profiler/lid_bg.jpg.
const BG_W = 844;
const BG_H = 1500;

// Dot-1 and dot-5 x — identical across all 9 rows (verified per row via the
// same brightness scan, all landed within 1-2px of these).
const TRACK_LEFT = 269;
const TRACK_RIGHT = 671;

// Each row's track y-center, measured individually (spacing isn't perfectly
// uniform row to row — this is the real measured value per attribute, in
// the same 1-9 order as LID_TRAITS).
const ROW_Y = [346, 465, 585, 708, 830, 953, 1072, 1190, 1306];
const SLIDER_HALF_HEIGHT = 26;

// The baked example description sits here for every row (verified on row 1:
// text bbox was x[718,807] y[341,366]). The available width is narrow
// (~64px on a real device) — real descriptions can wrap up to 3 lines even
// though the baked example only needed 2, so the height below is sized for
// 3 lines at descText's lineHeight, not the 2 the example happened to need
// (a too-short box clips the last line instead of wrapping around it).
const DESC_LEFT = 692;
const DESC_RIGHT = 830;
const DESC_TOP_OFFSET = -12;
const DESC_HEIGHT = 96;
const DESC_COVER_COLOR = '#0D0C0B';

function pct(px: number, of: number): `${number}%` {
  return `${Math.round((px / of) * 1000) / 10}%`;
}

export default function TheLidScreen() {
  const insets = useSafeAreaInsets();
  const { caseMeta, updateCaseMeta, loading } = useRelationship();

  const [values, setValues] = useState<Record<LidTraitId, LidValue>>(() =>
    Object.fromEntries(LID_TRAITS.map((t) => [t.id, LID_DEFAULT_VALUE])) as Record<LidTraitId, LidValue>
  );

  // Store hydrates asynchronously (AsyncStorage/web) — pull in any
  // previously-saved ratings once loading finishes, same pattern as
  // add-activity's existing-activity hydration.
  useEffect(() => {
    if (loading) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const trait of LID_TRAITS) {
        const saved = caseMeta.lidRatings?.[trait.id];
        if (saved) next[trait.id] = saved as LidValue;
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function handlePreview(id: LidTraitId, value: LidValue) {
    setValues((prev) => (prev[id] === value ? prev : { ...prev, [id]: value }));
  }

  function handleCommit(id: LidTraitId, value: LidValue) {
    setValues((prev) => ({ ...prev, [id]: value }));
    updateCaseMeta({ lidRatings: { ...caseMeta.lidRatings, [id]: value } });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bgBox}>
          <Image
            source={require('../../assets/noir/profiler/lid_bg.jpg')}
            style={styles.bgImage}
            resizeMode="cover"
          />

          {LID_TRAITS.map((trait, i) => {
            const rowY = ROW_Y[i];
            const value = values[trait.id];
            return (
              <React.Fragment key={trait.id}>
                <View
                  style={[
                    styles.sliderZone,
                    {
                      left: pct(TRACK_LEFT, BG_W),
                      width: pct(TRACK_RIGHT - TRACK_LEFT, BG_W),
                      top: pct(rowY - SLIDER_HALF_HEIGHT, BG_H),
                      height: pct(SLIDER_HALF_HEIGHT * 2, BG_H),
                    },
                  ]}
                >
                  <TheLidSlider
                    value={value}
                    onChange={(v) => handlePreview(trait.id, v)}
                    onChangeEnd={(v) => handleCommit(trait.id, v)}
                  />
                </View>

                <View
                  pointerEvents="none"
                  style={[
                    styles.descCover,
                    {
                      left: pct(DESC_LEFT, BG_W),
                      width: pct(DESC_RIGHT - DESC_LEFT, BG_W),
                      top: pct(rowY + DESC_TOP_OFFSET, BG_H),
                      height: pct(DESC_HEIGHT, BG_H),
                    },
                  ]}
                />
                <Text
                  pointerEvents="none"
                  numberOfLines={3}
                  style={[
                    styles.descText,
                    {
                      left: pct(DESC_LEFT, BG_W),
                      width: pct(DESC_RIGHT - DESC_LEFT, BG_W),
                      top: pct(rowY + DESC_TOP_OFFSET, BG_H),
                      height: pct(DESC_HEIGHT, BG_H),
                    },
                  ]}
                >
                  {trait.descriptions[value]}
                </Text>
              </React.Fragment>
            );
          })}
        </View>

        <Pressable
          style={styles.runButton}
          onPress={() => router.push('/profiler/lid-preview')}
        >
          <Text style={styles.runButtonLabel}>RUN THE ANALYSIS</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.background} />
        </Pressable>

        <View style={{ height: insets.bottom + spacing.xl }} />
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
  sliderZone: {
    position: 'absolute',
  },
  descCover: {
    position: 'absolute',
    backgroundColor: DESC_COVER_COLOR,
  },
  descText: {
    position: 'absolute',
    color: colors.textSecondary,
    fontSize: 10.5,
    lineHeight: 14,
    paddingTop: 2,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: colors.gold,
  },
  runButtonLabel: {
    color: colors.background,
    fontWeight: '700',
    letterSpacing: 1.5,
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
});
