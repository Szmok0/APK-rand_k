# Zu'z Diary

Implementacja MVP v2 aplikacji „Relacyjny Kalendarz Piktograficzny” opisanej w
`MVP_relacyjny_kalendarz_v2.md`. Expo (React Native) + TypeScript + expo-router.

## Uruchomienie

```bash
npm install
npm run start      # Expo Dev Tools — zeskanuj kod w Expo Go
npm run android     # emulator/urządzenie Android
npm run ios         # symulator iOS (macOS)
```

## Struktura

```
app/                  ekrany (expo-router, file-based)
  index.tsx           SPLASH
  start.tsx           START — "Zu'z Diary" (galaktyka DNA)
  calendar.tsx         KALENDARZ
  timeline.tsx          TIMELINE
  day/[date].tsx        DAY DETAIL
  add-activity.tsx      ADD ACTIVITY (modal)
  settings/             USTAWIENIA, Archiwum, O aplikacji
src/
  types/models.ts       Activity / Glyph / Relationship (sekcja 12 MD)
  data/glyphs.ts         27 glifów + 5 run emocji, zamknięty zestaw (sekcja 13)
  data/quotes.ts          baza cytatów (sekcja 14)
  engine/                 Summary Engine, Emotional Tone Layer, geometria DNA
  store/RelationshipStore.tsx   jeden store (AsyncStorage/JSON), CRUD + archiwum
  components/             komponenty UI współdzielone przez wszystkie ekrany
assets/
  glyphs/                 27 PNG dostarczonych przez klienta
  runes/                  5 PNG run emocji dostarczonych przez klienta
```

## Decyzje przyjęte podczas budowy (do weryfikacji z klientem)

Zgodnie z MD te elementy są świadomie odłożone/placeholderowe i łatwe do podmiany
bez zmian architektonicznych:

- **Splash / motyw dinozaura** — nie dostarczono grafiki klienta, więc `index.tsx`
  używa wektorowego placeholdera (`src/components/DinoPlaceholder.tsx`). Do
  podmiany na docelowy PNG/SVG od klienta.
- **Baza cytatów** (`src/data/quotes.ts`) — ok. 140 własnych sentencji PL jako
  placeholder startowy (MD sugeruje 150–365). Jedna lista, bez zmian w logice
  wyboru (`engine/quote.ts`, deterministyczne `dayOfYear % liczba`).
- **Wariant glifu `drink`** — użyto `drink_OPTION_wine.png` jako domyślnego.
  Zmiana na `drink_OPTION_cocktail.png` to jedna linijka w `src/data/glyphs.ts`
  (`GLYPH_ICONS.drink`).
- **Renderowanie DNA/galaktyki** — zaimplementowane w `react-native-svg` (wektor,
  zgodnie z wymogiem sekcji 4), zamiast bezpośrednio w React Native Skia jak
  sugeruje rekomendacja techniczna MD. Geometria jest w 100% stała
  (`src/engine/dnaLayout.ts`), a jedyną zmienną sterowaną danymi jest
  podświetlenie stref (`src/engine/emotionalTone.ts`). Migracja do Skia możliwa
  później, jeśli wydajność animacji rotacji tego wymaga na docelowych
  urządzeniach (MD przewiduje to ryzyko wprost, sekcja 4).
- Grubość kresek glifów (assety klienta) nie była jeszcze testowana w realnym
  rozmiarze komórki kalendarza na fizycznym ekranie — zgodnie z sekcją 25 MD,
  do weryfikacji na etapie testów wizualnych.

## Stan zgodności z Definition of Done (sekcja 24 MD)

Wszystkie 12 punktów DoD są zaimplementowane funkcjonalnie: splash → START z
galaktyką i Emotional Tone Layer → podsumowanie i cytat → Kalendarz/Timeline →
Add Activity (data/glify/czas warunkowy/ważność/notatka/zdjęcie) → Day Detail
(odkrywanie notatki, podgląd zdjęcia, edycja/usunięcie) → eksport/import JSON →
"Zacznij nową historię" z auto-archiwizacją.

Nie zweryfikowano jeszcze na fizycznym urządzeniu/emulatorze (środowisko
budowy nie miało dostępu do symulatora) — zalecany kolejny krok to
`npm run android`/`npm run ios` i przegląd wizualny względem mockupów klienta,
szczególnie animacji rotacji galaktyki pod kątem wydajności.
