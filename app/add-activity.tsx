// ADD ACTIVITY — rebuilt against the product owner's reference screen (Aug 2026):
// a single scrollable form on a static case-desk background, every field always
// visible (no collapsed chips, no separate glyph-picker overlay — the previous
// architecture). Sections: 1 Incident Date, 2 Incident Type, 3 Time Window,
// 4 Report, 5 Evidence (Photos), 6 Case Priority, then a full-width FILE REPORT
// button. Background + the photo-frame/CONFIDENTIAL-stamp art are the real
// asset-pack pieces (assets/noir/add-activity/); everything else is code, per
// the pack's own technical notes ("tło jest statyczne, wszystkie pola i
// selektory budowane w kodzie").
//
// The reference's "INCIDENT TYPE" grid shows 8 generic buttons (MEETING/CALL/
// DM/GIFT/ADVENTURE/TRAVEL/WATCHED/OTHER) — but AGENTS.md is explicit that the
// real 28-icon/5-category glyph set stays and is never replaced by a
// simplified set. This adopts the reference's BOX STYLE (bordered button,
// icon + label, highlighted when active) but keeps the real glyph list,
// grouped under its real 5 categories with a small header each.

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GLYPH_CATEGORIES, GLYPHS } from '@/data/glyphs';
import { GlyphIcon } from '@/components/GlyphIcon';
import { TimeRangePicker } from '@/components/TimeRangePicker';
import { MiniCalendarPicker } from '@/components/MiniCalendarPicker';
import { Screen } from '@/components/ui';
import { MAX_PHOTOS_PER_ACTIVITY } from '@/engine/photos';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, priorityColors, priorityLabels, radius, spacing, typography } from '@/theme/tokens';
import { dateLabelFull, todayKey } from '@/utils/dates';

const NOTE_MAX = 1000;

export default function AddActivityScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const { getActivityByDate, upsertActivity, loading } = useRelationship();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(params.date ?? todayKey());
  const [glyphIds, setGlyphIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [note, setNote] = useState('');
  const [importance, setImportance] = useState<0 | 1 | 2>(0);
  const [photoUris, setPhotoUris] = useState<string[]>([]);

  const [dateExpanded, setDateExpanded] = useState(false);

  const existing = getActivityByDate(selectedDate);

  // Kolizja dnia: jeśli dzień ma już Activity, wczytujemy jej stan do formularza,
  // żeby użytkownik widział, co już zapisano, zanim dogra kolejne glify (sekcja 12).
  // Zależność od `loading`: store wczytuje dane asynchronicznie (AsyncStorage/web),
  // więc przy montowaniu ekranu `existing` bywa chwilowo puste — bez tej zależności
  // formularz zostawał "zamrożony" na pustym stanie sprzed zakończenia wczytywania.
  useEffect(() => {
    if (existing) {
      setGlyphIds(existing.glyphIds);
      setStartTime(existing.startTime ?? '18:00');
      setEndTime(existing.endTime ?? '20:00');
      setNote(existing.note ?? '');
      setImportance(existing.importance);
      setPhotoUris(existing.photoUris ?? []);
    } else {
      setGlyphIds([]);
      setStartTime('18:00');
      setEndTime('20:00');
      setNote('');
      setImportance(0);
      setPhotoUris([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, loading]);

  function toggleGlyph(id: string) {
    setGlyphIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Was a single photoUri slot ("Single photo attachment area" per the
  // originally approved ADD_ACTIVITY_TECH_SPEC) — real-usage feedback after
  // the gift build shipped: one photo per day was too limiting. Now appends
  // up to MAX_PHOTOS_PER_ACTIVITY, picking as many as the remaining room
  // allows in one go (selectionLimit) instead of one-at-a-time.
  async function pickPhoto() {
    const remaining = MAX_PHOTOS_PER_ACTIVITY - photoUris.length;
    if (remaining <= 0) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: remaining > 1,
      selectionLimit: remaining,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUris((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, MAX_PHOTOS_PER_ACTIVITY));
    }
  }

  function removePhoto(index: number) {
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (glyphIds.length === 0) return;
    upsertActivity({
      date: selectedDate,
      glyphIds,
      startTime,
      endTime,
      note: note.trim() || undefined,
      importance,
      photoUris: photoUris.length > 0 ? photoUris : undefined,
    });
    router.replace({ pathname: '/day/[date]', params: { date: selectedDate } });
  }

  return (
    <Screen>
      <Image
        source={require('../assets/noir/add-activity/bg.jpg')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>ADD ACTIVITY</Text>
            <Text style={styles.headerSubtitle}>CASE 001</Text>
          </View>
          <View style={styles.headerSide} />
        </View>
        <Image
          source={require('../assets/noir/add-activity/confidential_stamp.png')}
          style={styles.confidentialStamp}
          resizeMode="contain"
        />

        <Text style={styles.sectionLabel}>1. INCIDENT DATE</Text>
        <Pressable style={styles.fieldBox} onPress={() => setDateExpanded((v) => !v)}>
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.fieldBoxText}>{dateLabelFull(selectedDate)}</Text>
          <Ionicons
            name={dateExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textFaint}
          />
        </Pressable>
        {dateExpanded && (
          <View style={styles.expandedBox}>
            <MiniCalendarPicker
              selected={selectedDate}
              hasActivity={(key) => !!getActivityByDate(key)}
              onSelect={(key) => {
                setSelectedDate(key);
                setDateExpanded(false);
              }}
            />
          </View>
        )}
        {existing && (
          <Text style={styles.hint}>
            This day already has a case file — you're adding more incident types to the same entry.
          </Text>
        )}

        <Text style={styles.sectionLabel}>2. INCIDENT TYPE</Text>
        {GLYPH_CATEGORIES.map((cat) => (
          <View key={cat.key} style={styles.categoryBlock}>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            <View style={styles.typeGrid}>
              {GLYPHS.filter((g) => g.category === cat.key).map((g) => {
                const active = glyphIds.includes(g.id);
                return (
                  <Pressable
                    key={g.id}
                    style={[styles.typeBox, active && styles.typeBoxActive]}
                    onPress={() => toggleGlyph(g.id)}
                  >
                    <GlyphIcon glyphId={g.id} style={styles.typeIcon} />
                    <Text style={[styles.typeLabel, active && styles.typeLabelActive]} numberOfLines={1}>
                      {g.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* Always visible, always expanded — this used to hide behind both a
            per-category "does this incident type need a time?" rule AND a
            tap-to-reveal chevron, and on a real device that read as "the time
            field disappeared" (picking the wrong incident type, or not
            tapping the chevron, meant no time picker ever showed at all).
            Time is useful on any incident type, so it's just always here. */}
        <Text style={styles.sectionLabel}>3. TIME WINDOW</Text>
        <View style={styles.timeBox}>
          <TimeRangePicker
            startTime={startTime}
            endTime={endTime}
            onChange={({ startTime: s, endTime: e }) => {
              setStartTime(s);
              setEndTime(e);
            }}
          />
        </View>

        <Text style={styles.sectionLabel}>4. REPORT</Text>
        <View style={styles.reportBox}>
          <TextInput
            style={styles.reportInput}
            placeholder="What happened? Details, context, observations, feelings..."
            placeholderTextColor={colors.textFaint}
            value={note}
            onChangeText={(t) => setNote(t.slice(0, NOTE_MAX))}
            multiline
            maxLength={NOTE_MAX}
          />
          <Text style={styles.reportCounter}>
            {note.length} / {NOTE_MAX}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>5. EVIDENCE (PHOTOS)</Text>
        <View style={styles.evidenceRow}>
          <Pressable style={styles.photoFrameWrap} onPress={pickPhoto}>
            {photoUris[0] && <Image source={{ uri: photoUris[0] }} style={styles.photoInner} />}
            <Image
              source={require('../assets/noir/add-activity/photo_frame.png')}
              style={styles.photoFrameArt}
            />
            {!photoUris[0] && (
              <Ionicons name="add" size={28} color={colors.textFaint} style={styles.photoPlus} />
            )}
            {photoUris[0] && (
              <Pressable style={styles.photoRemoveBadge} onPress={() => removePhoto(0)} hitSlop={8}>
                <Ionicons name="close" size={12} color={colors.textPrimary} />
              </Pressable>
            )}
          </Pressable>

          {photoUris.length === 0 ? (
            // First-time hint — same look as before multi-photo support.
            <Pressable style={styles.evidenceRight} onPress={pickPhoto}>
              <Ionicons name="finger-print-outline" size={22} color={colors.textFaint} />
              <Text style={styles.evidenceRightLabel}>ATTACH{'\n'}EVIDENCE</Text>
            </Pressable>
          ) : (
            // No baked asset exists for extra photo slots (the frame art was
            // built for exactly one) — plain bordered squares, same "no
            // matching asset, use a plain code-styled tile" pattern as the
            // LID PREVIEW stats card and Evidence Archive's empty-state card.
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.extraPhotosScroll}
              contentContainerStyle={styles.extraPhotosRow}
            >
              {photoUris.slice(1).map((uri, i) => {
                const index = i + 1;
                return (
                  <View key={uri} style={styles.extraPhotoWrap}>
                    <Image source={{ uri }} style={styles.extraPhotoImage} />
                    <Pressable style={styles.photoRemoveBadge} onPress={() => removePhoto(index)} hitSlop={8}>
                      <Ionicons name="close" size={12} color={colors.textPrimary} />
                    </Pressable>
                  </View>
                );
              })}
              {photoUris.length < MAX_PHOTOS_PER_ACTIVITY && (
                <Pressable style={styles.extraPhotoAddTile} onPress={pickPhoto}>
                  <Ionicons name="add" size={20} color={colors.textFaint} />
                </Pressable>
              )}
            </ScrollView>
          )}
        </View>
        <Text style={styles.evidenceCaption}>
          {photoUris.length > 0
            ? `${photoUris.length} / ${MAX_PHOTOS_PER_ACTIVITY} photos`
            : 'Add photos, screenshots, voice notes...'}
        </Text>

        <Text style={styles.sectionLabel}>6. CASE PRIORITY</Text>
        <View style={styles.priorityRow}>
          {([0, 1, 2] as const).map((level) => (
            <Pressable
              key={level}
              testID={`importance-${level}`}
              style={[
                styles.priorityBox,
                { borderColor: priorityColors[level] },
                importance === level && { backgroundColor: priorityColors[level] },
              ]}
              onPress={() => setImportance(level)}
            >
              <Text
                style={[
                  styles.priorityNumber,
                  { color: importance === level ? colors.background : priorityColors[level] },
                ]}
              >
                {level + 1}
              </Text>
              <Text
                style={[
                  styles.priorityLabel,
                  { color: importance === level ? colors.background : colors.textSecondary },
                ]}
              >
                {priorityLabels[level]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          testID="save-fab"
          style={[styles.fileReportBtn, glyphIds.length === 0 && styles.fileReportBtnDisabled]}
          onPress={handleSave}
          disabled={glyphIds.length === 0}
        >
          <Text style={styles.fileReportLabel}>FILE REPORT</Text>
          <Ionicons name="attach" size={18} color={colors.red} />
        </Pressable>

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
    backgroundColor: 'rgba(12, 10, 8, 0.55)',
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
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textFaint,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  headerSide: {
    width: 22,
  },
  confidentialStamp: {
    position: 'absolute',
    top: 4,
    right: 0,
    width: 120,
    height: 48,
    transform: [{ rotate: '6deg' }],
  },
  sectionLabel: {
    ...typography.stamp,
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  hint: {
    color: colors.gold,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  fieldBoxText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  timeDash: {
    color: colors.textFaint,
  },
  expandedBox: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
    padding: spacing.sm,
    marginTop: -1,
  },
  timeBox: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  categoryBlock: {
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textFaint,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  typeBox: {
    // Back to close-to-square (was briefly stretched to 0.68 while chasing
    // "bigger icon" the wrong way — see typeIcon below for the actual fix).
    width: '23%',
    aspectRatio: 0.92,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
  typeBoxActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  // The box itself stays square-ish; the icon fills ~70% of IT instead of the
  // box growing around a fixed-px icon (that just wasted space and turned
  // the box into a rectangle). Percentage-sized so it scales with the box
  // on any screen width instead of a fixed px guess.
  typeIcon: {
    width: '70%',
    height: '70%',
  },
  // Bumped up from 8px/textFaint (38% opacity — read as "barely visible") to
  // a legible size and contrast; still one line, still fits under the icon
  // now that the box isn't stretched thin by a bigger fixed-px icon.
  typeLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: colors.gold,
    fontWeight: '700',
  },
  reportBox: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  reportInput: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  reportCounter: {
    alignSelf: 'flex-end',
    color: colors.textFaint,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  photoFrameWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFrameArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  photoInner: {
    position: 'absolute',
    top: '12%',
    left: '10%',
    width: '80%',
    height: '68%',
  },
  photoPlus: {
    marginBottom: '18%',
  },
  photoRemoveBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraPhotosScroll: {
    flex: 1,
  },
  extraPhotosRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  extraPhotoWrap: {
    width: 64,
    height: 64,
  },
  extraPhotoImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  extraPhotoAddTile: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceRight: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  evidenceRightLabel: {
    ...typography.stamp,
    color: colors.textFaint,
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  evidenceCaption: {
    color: colors.textFaint,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityBox: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  priorityNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  priorityLabel: {
    ...typography.caption,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  fileReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: radius.md,
    paddingVertical: 16,
    backgroundColor: colors.redSoft,
  },
  fileReportBtnDisabled: {
    opacity: 0.4,
  },
  fileReportLabel: {
    ...typography.title,
    color: colors.red,
    letterSpacing: 2,
  },
});
