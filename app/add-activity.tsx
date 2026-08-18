// ADD ACTIVITY — sekcja 8 MD v6: PRZEPROJEKTOWANE, wszystko zwijane. Panel (bottom
// sheet), gdzie data/czas/glif to domyślnie zwinięte chipy, rozwijane tymczasowo.
// Wybór glifu to osobny, nakładany widok (GlyphPickerOverlay). Zasada scalania przy
// kolizji dnia — sekcja 12.

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GLYPH_MAP } from '@/data/glyphs';
import { CollapsibleField } from '@/components/CollapsibleField';
import { GlyphIcon } from '@/components/GlyphIcon';
import { GlyphPickerOverlay } from '@/components/GlyphPickerOverlay';
import { ImportanceSelector } from '@/components/ImportanceSelector';
import { MiniCalendarPicker } from '@/components/MiniCalendarPicker';
import { TimeRangePicker } from '@/components/TimeRangePicker';
import { Header, Screen } from '@/components/ui';
import { useRelationship } from '@/store/RelationshipStore';
import { colors, radius, spacing } from '@/theme/tokens';
import { fromDateKey, todayKey } from '@/utils/dates';

const MONTHS_GENITIVE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

function formatDateChip(dateKey: string) {
  const d = fromDateKey(dateKey);
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]}`;
}

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
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const [dateExpanded, setDateExpanded] = useState(false);
  const [timeExpanded, setTimeExpanded] = useState(false);
  const [moreExpanded, setMoreExpanded] = useState(false);
  const [glyphPickerOpen, setGlyphPickerOpen] = useState(false);

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
  }, [selectedDate, loading]);

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

  if (glyphPickerOpen) {
    return (
      <GlyphPickerOverlay
        selected={glyphIds}
        onToggle={toggleGlyph}
        onDone={() => setGlyphPickerOpen(false)}
      />
    );
  }

  return (
    <Screen>
      <Header title="DODAJ AKTYWNOŚĆ" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Data — zwinięta domyślnie do chipa (sekcja 8 v6) */}
        <CollapsibleField
          label={`📅  ${formatDateChip(selectedDate)}`}
          expanded={dateExpanded}
          onToggle={() => setDateExpanded((v) => !v)}
        >
          <MiniCalendarPicker
            selected={selectedDate}
            hasActivity={(key) => !!getActivityByDate(key)}
            onSelect={(key) => {
              setSelectedDate(key);
              setDateExpanded(false);
            }}
          />
        </CollapsibleField>
        {existing && (
          <Text style={styles.hint}>
            Ten dzień ma już zapisaną aktywność — dogrywasz kolejne glify do tego samego wpisu.
          </Text>
        )}

        {/* Czas — pojawia się TYLKO jeśli wybrany glif tego wymaga (kolejność: glif
            przed czasem, sekcja 8 v6) */}
        {needsDuration && (
          <CollapsibleField
            label={`🕐  OD ${startTime} — DO ${endTime}`}
            expanded={timeExpanded}
            onToggle={() => setTimeExpanded((v) => !v)}
          >
            <TimeRangePicker
              startTime={startTime}
              endTime={endTime}
              onChange={({ startTime: s, endTime: e }) => {
                setStartTime(s);
                setEndTime(e);
              }}
            />
            <Pressable style={styles.doneRow} onPress={() => setTimeExpanded(false)}>
              <Text style={styles.doneRowLabel}>Gotowe</Text>
            </Pressable>
          </CollapsibleField>
        )}

        {/* Glif — chip pokazuje podgląd już wybranych; tap otwiera osobny, nakładany
            widok wyboru (GlyphPickerOverlay), nie stałą siatkę w panelu (sekcja 8 v6) */}
        <Pressable style={styles.glyphChip} onPress={() => setGlyphPickerOpen(true)}>
          <View style={styles.glyphChipPreview}>
            {glyphIds.slice(0, 5).map((id, idx) => (
              <View key={id} style={{ marginLeft: idx === 0 ? 0 : -8 }}>
                <GlyphIcon glyphId={id} size={22} />
              </View>
            ))}
            <Text style={styles.glyphChipLabel}>
              {glyphIds.length === 0 ? 'Dodaj glif' : `+ Dodaj (${glyphIds.length})`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
        </Pressable>

        {/* Notatka — jedyne pole, które nie jest zwijane (samo jest już minimalne) */}
        <TextInput
          style={styles.noteInput}
          placeholder="Notatka (opcjonalna)"
          placeholderTextColor={colors.textFaint}
          value={note}
          onChangeText={setNote}
        />

        {/* Ważność i zdjęcie — zwijany segment "więcej opcji" (sekcja 8 v6) */}
        <CollapsibleField
          label="Więcej opcji (ważność, zdjęcie)"
          expanded={moreExpanded}
          onToggle={() => setMoreExpanded((v) => !v)}
        >
          <Text style={styles.moreLabel}>Ważność</Text>
          <ImportanceSelector value={importance} onChange={setImportance} />

          <Text style={[styles.moreLabel, { marginTop: spacing.md }]}>Zdjęcie</Text>
          {photoUri ? (
            <Pressable onPress={pickPhoto} style={styles.photoPreviewWrap}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            </Pressable>
          ) : (
            <Pressable onPress={pickPhoto} style={styles.photoPicker}>
              <Ionicons name="image-outline" size={20} color={colors.textFaint} />
              <Text style={styles.photoPickerLabel}>Wybierz z galerii</Text>
            </Pressable>
          )}
        </CollapsibleField>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Zapis — floating okrągły przycisk (FAB), nie pełnoszerokościowy pill (sekcja 8 v6) */}
      <Pressable
        testID="save-fab"
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }, glyphIds.length === 0 && styles.fabDisabled]}
        onPress={handleSave}
        disabled={glyphIds.length === 0}
      >
        <Ionicons name="checkmark" size={26} color={colors.background} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hint: {
    color: colors.gold,
    fontSize: 11,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  doneRow: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  doneRowLabel: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  glyphChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  glyphChipPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  glyphChipLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    marginLeft: spacing.sm,
  },
  noteInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.sm,
  },
  moreLabel: {
    color: colors.textFaint,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  photoPicker: {
    height: 80,
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
    height: 140,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabDisabled: {
    opacity: 0.4,
  },
});
