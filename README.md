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

- **Splash / motyw dinozaura** — `assets/splash-dino.jpg`, gotowa grafika
  dostarczona przez klienta (dino + tytuł "Zu'z Diary" wypalone w obrazie),
  użyta jako pełnoekranowy statyczny asset w `app/index.tsx` i jednocześnie
  jako natywny boot-splash (`expo-splash-screen` w `app.json`, `resizeMode:
  "contain"`, żeby tytuł nigdy nie był ucięty w poziomie) — dzięki temu obraz
  jest widoczny od pierwszej klatki, jeszcze zanim załaduje się JS, bez
  przebłysku.
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

## Ikona aplikacji

`assets/icon.png` / `android-icon-foreground.png` / `android-icon-background.png` /
`android-icon-monochrome.png` / `favicon.png` są wygenerowane z grafiki klienta
(dino + kokarda, wersja bez tytułu, dostarczona jako kwadrat). Adaptive icon na
Androidzie ma zachowaną strefę bezpieczną (~72% skali, wyśrodkowane).

## Zweryfikowane wizualnie

Uruchomiono `expo start --web` i przejrzano zrzuty ekranu wszystkich głównych
widoków (splash, START z realnymi danymi, kalendarz, timeline, add activity,
day detail, ustawienia) w rozdzielczości telefonu (414×896). Znalezione i
naprawione podczas tego przeglądu:

- Splash renderował się z `resizeMode="cover"`, co na typowych proporcjach
  telefonu ucinało tytuł "Zu'z Diary" w poziomie — zmienione na `"contain"`
  (patrz komentarz w `app/index.tsx`) w appce i w konfiguracji natywnego
  boot-splasha (`app.json`).
- `Image` na splashu nie rozciągał się do pełnego ekranu na web (react-native-web
  respektował wymiary intrinsic assetu zamiast `absoluteFill`) — dodane jawne
  `width/height: '100%'`.
- `TimelinePath` miał zahardkodowaną, wąską szerokość geometrii (nie skalował
  się do realnej szerokości ekranu), przez co etykiety dat po lewej stronie
  wychodziły poza widoczny obszar — geometria teraz przyjmuje realną szerokość
  kontenera jako prop.
- Day Detail pokazywał 1 gwiazdkę nawet dla ważności "zwykłe" (0) — poprawione,
  gwiazdki renderują się tylko dla ważności 1/2.

Nie zweryfikowano jeszcze natywnie na iOS/Android (środowisko budowy nie miało
dostępu do symulatora/emulatora) — zalecany kolejny krok to `npm run android`/
`npm run ios` na prawdziwym urządzeniu, szczególnie pod kątem wydajności
animacji rotacji galaktyki.

## Stan zgodności z Definition of Done (sekcja 24 MD)

Wszystkie 12 punktów DoD są zaimplementowane funkcjonalnie: splash → START z
galaktyką i Emotional Tone Layer → podsumowanie i cytat → Kalendarz/Timeline →
Add Activity (data/glify/czas warunkowy/ważność/notatka/zdjęcie) → Day Detail
(odkrywanie notatki, podgląd zdjęcia, edycja/usunięcie) → eksport/import JSON →
"Zacznij nową historię" z auto-archiwizacją.
