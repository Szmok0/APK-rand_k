// ADD ACTIVITY — sekcja 8 MD. Data wyłącznie przez tap, czas wyłącznie przez wheel,
// wiele glifów -> jedna Activity, zasada scalania przy kolizji dnia (sekcja 12).

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GLYPH_MAP } from '@/data/glyphs';
import { GlyphPickerGrid } from '@/components/GlyphPickerGrid';
import { ImportanceSelector } from '@/components/ImportanceSelector';
import { MiniCalendarPicker } from '@/components/MiniCalendarPicker';
import { TimeRangePicker } from '@/components/TimeRangePicker';
import { GoldButton, Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { todayKey } from '@/utils/dates';

export default function AddActivityScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const { getActivityByDate, upsertActivity } = useRelationship();

  const [selectedDate, setSelectedDate] = useState(params.date ?? todayKey());
  const [glyphIds, setGlyphIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('20:00');
  const [note, setNote] = useState('');
  const [importance, setImportance] = useState<0 | 1 | 2>(0);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const existing = getActivityByDate(selectedDate);

  // Kolizja dnia: jeśli dzień ma już Activity, wczytujemy jej stan do formularza,
  // żeby użytkownik widział, co już zapisano, zanim dogra kolejne glify (sekcja 12).
  useEffect(() => {
    if (existing) {
      setGlyphIds(existing.glyphIds);
      setStartTime(existing.startTime ?? '18:00');
      setEndTime(existing.endTime ?? '20:00');
      setNote(existing.note ?? '');
      setImportance(existing.importance);
      setPhotoUri(existing.photoUri);
    } else {
      setGlyphIds([]);
      setStartTime('18:00');
      setEndTime('20:00');
      setNote('');
      setImportance(0);
      setPhotoUri(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const needsDuration = glyphIds.some((id) => GLYPH_MAP[id]?.requiresDuration);

  function toggleGlyph(id: string) {
    setGlyphIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function pickPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  }

  function handleSave() {
    if (glyphIds.length === 0) return;
    upsertActivity({
      date: selectedDate,
      glyphIds,
      startTime: needsDuration ? startTime : undefined,
      endTime: needsDuration ? endTime : undefined,
      note: note.trim() || undefined,
      importance,
      photoUri,
    });
    router.replace({ pathname: '/day/[date]', params: { date: selectedDate } });
  }

  return (
    <Screen>
      <Header title="DODAJ AKTYWNOŚĆ" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Dzień</Text>
        <MiniCalendarPicker
          selected={selectedDate}
          hasActivity={(key) => !!getActivityByDate(key)}
          onSelect={setSelectedDate}
        />
        {existing && (
          <Text style={styles.hint}>
            Ten dzień ma już zapisaną aktywność — dogrywasz kolejne glify do tego samego wpisu.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Glify</Text>
        <GlyphPickerGrid selected={glyphIds} onToggle={toggleGlyph} />

        {needsDuration && (
          <>
            <Text style={styles.sectionTitle}>Czas</Text>
            <TimeRangePicker
              startTime={startTime}
              endTime={endTime}
              onChange={({ startTime: s, endTime: e }) => {
                setStartTime(s);
                setEndTime(e);
              }}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Ważność</Text>
        <ImportanceSelector value={importance} onChange={setImportance} />

        <Text style={styles.sectionTitle}>Notatka (opcjonalna)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Zapisz, co warto zapamiętać z tego dnia…"
          placeholderTextColor={colors.textFaint}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <Text style={styles.sectionTitle}>Zdjęcie (opcjonalne)</Text>
        {photoUri ? (
          <Pressable onPress={pickPhoto} style={styles.photoPreviewWrap}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          </Pressable>
        ) : (
          <Pressable onPress={pickPhoto} style={styles.photoPicker}>
            <Ionicons name="image-outline" size={22} color={colors.textFaint} />
            <Text style={styles.photoPickerLabel}>Wybierz z galerii</Text>
          </Pressable>
        )}

        <GoldButton
          label="Zapisz"
          icon="checkmark"
          onPress={handleSave}
          disabled={glyphIds.length === 0}
          style={styles.save}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 12,
    color: colors.textFaint,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
  },
  hint: {
    color: colors.gold,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  noteInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    padding: spacing.md,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  photoPicker: {
    height: 100,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoPickerLabel: {
    color: colors.textFaint,
    fontSize: 12,
  },
  photoPreviewWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 160,
  },
  save: {
    marginTop: spacing.xl,
  },
});
