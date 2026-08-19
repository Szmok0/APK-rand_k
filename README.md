# Zu'z Diary

Implementacja aplikacji „Relacyjny Kalendarz Piktograficzny”. Spec: `docs/MVP_relacyjny_kalendarz_v6.md`
(obowiązująca — patrz też `AGENTS.md`). Expo (React Native) + TypeScript + expo-router.

## Uruchomienie — podgląd przez Expo Go (najszybsze)

```bash
npm install
npx expo start          # zeskanuj kod QR aparatem / appką Expo Go na telefonie
npx expo start --tunnel # jeśli telefon i komputer nie są w tej samej sieci Wi-Fi
```

Ograniczenie: Expo Go pokazuje appkę pod swoją ikoną i nie honoruje w pełni
natywnego boot-splasha (`expo-splash-screen`) — do tego potrzebny jest build
poniżej.

## Prawdziwy, instalowalny build (EAS Build)

Wymaga darmowego konta na [expo.dev](https://expo.dev) i `eas-cli`:

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview   # buduje .apk, link do pobrania na koniec
```

`eas.json` (profil `preview`, buduje `.apk` do instalacji bezpośrednio na
telefonie, bez sklepu) i `android.package`/`ios.bundleIdentifier` w
`app.json` (`com.zuzdiary.app`) są już przygotowane — pierwsze uruchomienie
`eas build` może jeszcze zapytać o utworzenie/połączenie projektu na Twoim
koncie Expo (`eas init`), potem już nie.

## Struktura

```
app/                  ekrany (expo-router, file-based)
  index.tsx           SPLASH
  start.tsx           START — "Zu'z Diary" (DNA jako statyczny obraz, v5)
  calendar.tsx         KALENDARZ (minimalna komórka + zintegrowany panel dnia, v6)
  timeline.tsx          TIMELINE
  day/[date].tsx        route używany przez Timeline ("tap → detail"); w Kalendarzu
                        ten sam widok jest osadzony inline, nie jako nawigacja (v6)
  add-activity.tsx      ADD ACTIVITY — panel, wszystko zwijane do chipów (v6)
  settings/             USTAWIENIA, Archiwum, O aplikacji
src/
  types/models.ts       Activity / Glyph / Relationship
  data/glyphs.ts         27 glifów + 5 run emocji, zamknięty zestaw (sekcja 13)
  data/quotes.ts          baza cytatów (sekcja 14)
  engine/                 Summary Engine + specyfikacja Emotional Tone Layer
                          (kod gotowy, ale nieużywany na START — DNA jest
                          statycznym obrazem, sekcja 6/4 MD v6: ETL odłożone)
  store/RelationshipStore.tsx   jeden store (AsyncStorage/JSON), CRUD + archiwum
  components/
    DayDetailPanel.tsx    treść "day detail", współdzielona przez Kalendarz i route
    CollapsibleField.tsx  pole zwijane do chipa (Add Activity)
    GlyphPickerOverlay.tsx  pełnoekranowy wybór glifów (Add Activity)
    GlyphIcon.tsx / GlyphCluster.tsx  renderują glif BEZ żadnego tła/kontenera
                                      w kodzie — cała poświata jest w pliku PNG
assets/
  glyphs/*_transparent.png   27 glifów, tło naprawione algorytmicznie (luma-key)
  runes/*_transparent.png    5 run emocji, jw.
  dna_background.png         statyczny obraz galaktyki DNA (ekran START, v5)
  splash-dino.jpg             grafika splash
```

## Kluczowe decyzje z MD v6 (skrót — pełny kontekst w dokumencie)

- **DNA/galaktyka jest statycznym obrazem** (`assets/dna_background.png`), nie
  wektorem renderowanym w kodzie — po kilku nieudanych próbach SVG/Skia klient
  zaakceptował gotową grafikę AI. Emotional Tone Layer (dynamiczne podświetlenie
  danymi) jest świadomie odłożone; silnik (`engine/emotionalTone.ts`) zostaje
  w kodzie jako gotowa specyfikacja na przyszłość, ale START go nie używa.
- **Zasada globalna**: żaden glif/runa nie ma tła/kontenera w kodzie (kwadratu
  ani koła) — tylko własna, wypalona w pliku poświata. Jedyny wyjątek: obrys
  (nie wypełnienie) wokół zaznaczonego glifu w Add Activity.
- **Assety naprawione** — oryginalne pliki od klienta miały kanał alfa w 100%
  nieprzezroczysty (czarne kwadraty zamiast przezroczystości). Naprawione
  algorytmicznie (luma-key: `alpha = max(r,g,b)`) — obowiązują pliki
  `*_transparent.png`. Rysunek i kolorystyka oryginałów były od początku
  poprawne, zgodne z sekcją 13.
- **Dwa różne złote**: `colors.gold` (`#D1A262`, stonowany akcent UI) vs
  `moodColors.BLISKOSC` (`#F7BA1E`, nasycony neonowy mood-kolor) — nigdy ten
  sam token.
- **Kalendarz**: komórka dnia jest minimalna (numer + kolorowy pasek nastroju +
  kropka notatki, bez ikony glifu). Tap na dzień wysuwa panel podglądu pod
  siatką (ten sam `DayDetailPanel`, którego używa też route `day/[date]` przy
  wejściu z Timeline) — nie nawiguje na osobny ekran.
- **Add Activity**: bottom sheet, gdzie data/czas/glif to domyślnie zwinięte
  chipy (tap → tymczasowe rozwinięcie → auto-zwinięcie po wyborze). Wybór glifu
  otwiera osobny, pełnoekranowy widok (`GlyphPickerOverlay`). Zapis = floating
  okrągły przycisk (FAB), nie pełnoszerokościowy pill.
- **Timeline**: linia ma gradient koloru wzdłuż długości (zależny od nastroju
  najbliższych wydarzeń), poświatę wokół węzłów i leader-line jednoznacznie
  łączący etykietę z punktem.

## Placeholdery / do weryfikacji z klientem

- **Baza cytatów** (`src/data/quotes.ts`) — ok. 140 własnych sentencji PL jako
  placeholder startowy (MD sugeruje 150–365).
- **Wariant glifu `drink`** — domyślnie `drink_OPTION_wine_transparent.png`;
  zmiana na `cocktail` to jedna linijka w `src/data/glyphs.ts`.
- Grubość kresek glifów nie była testowana w realnym rozmiarze komórki na
  fizycznym ekranie (sekcja 25 MD).

## Zweryfikowane

`tsc --noEmit` czysty, `expo export --platform android` bundluje bez błędów.
Zweryfikowane wizualnie przez `expo start --web` + zrzuty ekranu wszystkich
głównych widoków z realnymi danymi (splash, START, kalendarz z panelem dnia,
timeline, add activity — zwinięty/rozwinięty/overlay glifów). Przy tym
przeglądzie znaleziony i naprawiony błąd: formularz Add Activity nie
wczytywał istniejącej aktywności dnia, jeśli otwarto go zanim store
skończył asynchroniczne wczytywanie danych (web/AsyncStorage) — `useEffect`
synchronizujący formularz teraz zależy też od flagi `loading`.

Nie zweryfikowano jeszcze natywnie na iOS/Android (środowisko budowy nie miało
dostępu do symulatora/emulatora) — zalecany kolejny krok to `npm run android`/
`npm run ios` na prawdziwym urządzeniu.
