// HOME — Case Overview.
//
// Course-corrected architecture (product owner, Aug 2026): the screen is ONE
// full-bleed static background image (assets/noir/home/home_bg.jpg — an exact
// crop of the approved layout map, status bar and bottom tab row removed).
// Every visual element that is NOT an actual dynamic value — title art, dino,
// photo frame + paperclips + "THE LID" caption, STATUS label, the bracket-
// cornered note card's border, the "CASE OVERVIEW" tag, the 4 stat cards'
// icons/borders/labels, the quote card's paper texture/quote-mark/signature —
// is baked into that one image. Code renders ONLY the actual dynamic values,
// absolutely positioned by percentage on top of it:
//   - the profile photo itself (the black rectangle is a real tappable slot)
//   - the rotating micro-status line (inside the blank bracket card)
//   - the first-contact date (inside the dashed box)
//   - the 4 stat numbers (inside their dashed boxes)
//   - the quote text (inside the blank paper area)
// No code-drawn cards, borders, brackets, tags or composited decorative PNGs
// — that was the previous (wrong) approach. See git history for the two
// earlier passes this replaces.
//
// The overlay container's aspectRatio matches home_bg.jpg's exact pixel ratio
// (853x1510) so the image and every percentage-positioned overlay child
// always scale together, with zero coordinate drift across screen sizes.

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { caseStatus } from '@/engine/caseStatus';
import { dailyQuote } from '@/engine/quote';
import { computeHomeStats } from '@/engine/summary';
import { useRelationship } from '@/store/RelationshipStore';
import { colors } from '@/theme/tokens';

// Exact pixel size of assets/noir/home/home_bg.jpg — keep in sync if it's
// ever re-cropped.
const BG_W = 853;
const BG_H = 1510;
const ASPECT = BG_W / BG_H;

// All percentages below were measured directly off the source composite
// (wireframe/wireframe.png, before the status-bar/tab-row crop) — pixel
// bounding boxes divided by BG_W/BG_H. Each maps to one red-marked zone in
// the approved layout map.
const ZONES = {
  photo: pct(74, 390, 313, 430),
  statusNote: pct(430, 537, 385, 243),
  firstContact: pct(515, 847, 277, 73),
  stat: [
    pct(71, 1108, 119, 96),
    pct(268, 1108, 119, 96),
    pct(465, 1108, 119, 96),
    pct(660, 1108, 120, 96),
  ],
  quote: pct(100, 1355, 690, 130),
};

function pct(x: number, y: number, w: number, h: number) {
  // Source pixel coords are relative to the full wireframe; home_bg.jpg was
  // cropped starting at y=90, so subtract that before converting to %.
  const CROP_TOP = 90;
  return {
    left: `${(x / BG_W) * 100}%`,
    top: `${((y - CROP_TOP) / BG_H) * 100}%`,
    width: `${(w / BG_W) * 100}%`,
    height: `${(h / BG_H) * 100}%`,
  } as const;
}

export default function HomeScreen() {
  const { activities, caseMeta, updateCaseMeta, loading } = useRelationship();
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => computeHomeStats(activities), [activities]);
  const microStatus = useMemo(() => caseStatus(), []);
  const quote = useMemo(() => dailyQuote(), []);

  if (loading) return <Screen />;

  const statValues = [
    String(stats.encounters + stats.dms), // ACTIVITIES
    `${stats.time}h`, // TIME TOGETHER
    String(stats.evidence), // EVIDENCE
    String(stats.incidents), // INCIDENTS
  ];

  async function pickProfilePhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      updateCaseMeta({ profilePhotoUri: result.assets[0].uri });
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={styles.bgContainer}>
          <Image
            source={require('../../assets/noir/home/home_bg.jpg')}
            style={styles.bgImage}
            resizeMode="cover"
          />

          <Pressable style={[styles.zone, ZONES.photo]} onPress={pickProfilePhoto}>
            {caseMeta.profilePhotoUri ? (
              <Image source={{ uri: caseMeta.profilePhotoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoEmpty}>
                <Ionicons name="camera-outline" size={22} color={colors.textFaint} />
              </View>
            )}
          </Pressable>

          <View style={[styles.zone, ZONES.statusNote]}>
            <Text style={styles.statusNoteText} numberOfLines={5}>
              {microStatus}
            </Text>
          </View>

          <View style={[styles.zone, ZONES.firstContact]}>
            <Text style={styles.dataText}>{caseMeta.firstContactDate}</Text>
          </View>

          {ZONES.stat.map((z, i) => (
            <View key={i} style={[styles.zone, z]}>
              <Text style={styles.dataText}>{statValues[i]}</Text>
            </View>
          ))}

          <View style={[styles.zone, ZONES.quote]}>
            <Text style={styles.quoteText} numberOfLines={5}>
              {quote}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={[styles.settingsBtn, { top: insets.top + 8 }]}
        onPress={() => router.push('/settings')}
        hitSlop={12}
      >
        <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    width: '100%',
    aspectRatio: ASPECT,
    position: 'relative',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  zone: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  photoEmpty: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusNoteText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: 8,
  },
  dataText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  quoteText: {
    color: colors.textOnPaper,
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: 4,
  },
  settingsBtn: {
    position: 'absolute',
    right: 16,
  },
});
