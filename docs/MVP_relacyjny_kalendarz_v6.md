# MVP — Relacyjny Kalendarz Piktograficzny ("Zu'z Diary")

## WERSJA 6 — priorytet: pozostałe ekrany, ETL formalnie odłożone

**Ustalenie**: Emotional Tone Layer (dynamiczne podświetlenie galaktyki danymi) zostaje
**opcją na przyszłość** — do wdrożenia, gdy znajdzie się narzędzie/technika radząca sobie
z wizualną złożonością, jakiej wymaga ta koncepcja (patrz sekcja 4 i 6). **To nie blokuje
niczego innego.** Priorytet tej rundy: Kalendarz, Timeline, Add Activity, Ustawienia,
Splash i ogólny layout (wypełnienie ekranu, zakaz teł za ikonami — sekcje z v4) muszą
działać poprawnie. Ekran START ma być kompletny według schematu — nagłówek, statyczna
galaktyka wypełniająca dostępne miejsce, statystyki, cytat, trzy przyciski, ikona ⚙ —
patrz sekcja 5, "Realizacja z obrazem statycznym (v6)".

## WERSJA 5 — DNA galaktyki jako statyczny obraz (decyzja praktyczna)

**Zmiana względem v4**: po kilku nieudanych próbach prototypu wektorowego (SVG/Canvas),
klient zaakceptował gotowy, wygenerowany obraz (AI) jako tło struktury DNA na ekranie
START. Szczegóły i konsekwencje tej decyzji — sekcja 4, podsekcja "Rekomendacja
techniczna renderowania — ZMIANA DECYZJI (v5)". W skrócie: **DNA nie jest już renderowane
jako wektor generowany w kodzie — jest statycznym plikiem graficznym**
(`assets/dna_background.png`), tak jak ekran Splash. Wszystkie poprawki z v4 dotyczące
KALENDARZA, TIMELINE i ADD ACTIVITY (przeprojektowanie, zakaz teł za ikonami, wypełnienie
ekranu) **zostają w mocy bez zmian** — v5 dotyczy wyłącznie sposobu renderowania
struktury DNA na ekranie START.

## WERSJA 4 — awaryjna poprawka po realnych zrzutach ekranu

Wersja 3 opisywała poprawki na podstawie tekstowego audytu Claude Code. Po zobaczeniu
**realnych zrzutów ekranu** okazało się, że rozbieżność z mockupem jest głębsza niż
tekstowy audyt sugerował — cztery z siedmiu ekranów (START, KALENDARZ, TIMELINE,
ADD ACTIVITY) wymagają w praktyce przeprojektowania, nie tylko doprecyzowania. Poniższe
poprawki (oznaczone **v4**) są nadrzędne wobec wcześniejszych opisów tych ekranów.

### GLOBALNA ZASADA (v4, nadrzędna dla całej aplikacji)

> **Żaden glif/runa nigdy nie ma widocznego kwadratowego lub kołowego kontenera/tła
> za sobą.** Ikona siedzi bezpośrednio na tle ekranu (czarnym/ciemnym), otoczona
> wyłącznie własną poświatą (glow) wynikającą z rysunku pliku graficznego — nigdy
> dodatkowym prostokątem, kartą, "chipem" czy kołem w innym kolorze/odcieniu tła.
>
> Jedyny dopuszczalny wyjątek: stan **zaznaczenia** w Add Activity (dodatkowa złota
> obwódka/poświata wokół zaznaczonego glifu — sekcja 8), która sama nie tworzy
> wypełnionego tła, tylko obrys.
>
> Jeśli po naprawieniu przezroczystości plików graficznych (sekcja 25) ikony wciąż
> wyglądają jak w kwadratowym/kołowym kontenerze — problem jest w kodzie (komponent
> renderujący glif ma własny `backgroundColor`/`View` z tłem), nie w assecie. To jest
> źródło "masakry" widocznej równolegle na Kalendarzu, Timeline i Add Activity.

### Rozstrzygnięcie: który mockup jest wiążący
niespójne między sobą:

- **Mockup A** ("OUR TRACE" — ekran START z pełnym złotym pill "+ DODAJ AKTYWNOŚĆ"
  i outline pill "KALENDARZ") — zgodny z decyzjami tekstowymi tego dokumentu
  (struktura stała, brak ☰).
- **Mockup B** ("RELACYJNY KALENDARZ – KONCEPT APLIKACJI", ekran podpisany "START",
  z ikoną ☰) — starsza koncepcja, zawiera element ("struktura generowana
  proceduralnie z danych", ikona ☰), które ten dokument świadomie odrzucił.

**Ustalenie wiążące**: **Mockup A jest jedynym obowiązującym źródłem wizualnym**
dla ekranów START, TIMELINE, KALENDARZ i ADD ACTIVITY. **Mockup B jest materiałem
historycznym/poglądowym i obowiązuje wyłącznie tam, gdzie Mockup A nie pokazuje
danego ekranu** — w praktyce tylko dla **DAY DETAIL** (który Mockup A w ogóle
nie zawiera), i tylko jako inspiracja ogólnego układu, nie dosłowny wzór (patrz
sekcja 9 — Day Detail, uwaga o układzie jednokolumnowym).

### Najważniejsza zasada

> **MOCKUP = VISUAL SOURCE OF TRUTH**

Aplikacja ma być implementacją **konkretnego mockupu** (obrazy referencyjne dostarczone przez klienta),
a nie aplikacją „w podobnym stylu”. Ekran START z galaktyką / Relationship DNA jest centralnym
elementem produktu i musi zachować charakter, kompozycję, język wizualny i sposób prezentacji danych
z mockupu.

### Kontekst projektu

Aplikacja jest **spersonalizowanym prezentem** — jednorazowym, dedykowanym konkretnej osobie
("Zuza"). Nie jest produktem masowym. To wpływa na kilka decyzji: brak wielu profili, brak
zabezpieczeń klasy "produkcyjnej", ekran powitalny z motywem dinozaura.

---

# 1. KONCEPCJA PRODUKTU

Aplikacja jest osobistym kalendarzem służącym do zapisywania wydarzeń związanych z relacją.
Zamiast klasycznych opisów wydarzenia użytkownik korzysta z autorskiego systemu glifów.

Kalendarz jest źródłem danych. Na podstawie tych samych danych aplikacja tworzy:

1. **SPLASH** — ekran powitalny, spersonalizowany, statyczny (nowość w v2).
2. **START / Relationship DNA ("Zu'z Diary")** — zbiorczy, abstrakcyjny obraz całej znajomości.
3. **TIMELINE** — wizualną historię wydarzeń (widok tygodniowy / miesięczny).
4. **KALENDARZ** — klasyczny kalendarz z glifami.
5. **DAY DETAIL** — szczegóły konkretnego dnia.

---

# 2. GŁÓWNA FILOZOFIA

Trzy poziomy, bez zmian względem v1:

- **Poziom 1 — ABSTRAKCJA (START)** — „Jaki kształt ma ta znajomość?”
- **Poziom 2 — FAKTY (KALENDARZ / TIMELINE)** — „Kiedy i co się wydarzyło?”
- **Poziom 3 — PAMIĘĆ (DAY DETAIL)** — „Co dokładnie pamiętam z tego dnia?”

START, TIMELINE i CALENDAR to **trzy tryby jednego dashboardu**, oparte na tym samym silniku
danych (`Activity[]`). Nie są trzema osobnymi funkcjami — architektura kodu musi to odzwierciedlać
(jeden store, kilka rendererów).

---

# 3. EKRAN SPLASH (NOWY — v2)

## Cel

Pierwszy ekran po otknięciu ikony aplikacji. Czysto dekoracyjny, spersonalizowany,
statyczny — nie zależy od żadnych danych użytkownika.

## Zawartość

- Statyczny obraz (PNG lub SVG), przygotowany poza aplikacją (np. w generatorze grafiki),
  zawierający: motyw dinozaura (Spinozaur / Ankylozaur — do wyboru przez klienta) +
  napis powitalny (np. „Hej Zuza”), zajmujący ok. 70% ekranu.
- Jeden przycisk pod obrazem, z klimatycznym, tajemniczym hasłem (np. „Wejdź do galaktyki”,
  „Otwórz portal”, „Przekrocz próg”) — treść do dopracowania w fazie tekstów.
- Tap w przycisk → przejście do ekranu START.

## Ważne decyzje

- **Brak PIN-u.** Po analizie ryzyka (telefon prywatny, aplikacja offline, brak zagrożenia
  kradzieży danych) PIN został usunięty z MVP całkowicie. Nie ma logowania, weryfikacji,
  ani żadnej bramki bezpieczeństwa.
- **Brak automatycznego przejścia (timer).** Przejście następuje wyłącznie po tapnięciu
  przycisku — użytkownik decyduje, kiedy chce przejść dalej.
- **Brak generatywności.** Ten ekran nie jest renderowany przez żaden silnik wizualizacji —
  to jeden gotowy plik graficzny wstawiony jako statyczny asset aplikacji.
- **Motyw dinozaura występuje wyłącznie na tym ekranie.** Właściwe ekrany aplikacji
  (galaktyka, timeline, kalendarz) pozostają w 100% zgodne z oryginalnym mockupem,
  bez motywów dinozaura w tle.
- Paleta obrazu splash powinna być zbliżona do reszty aplikacji (ciemne tło, złote /
  świecące akcenty), żeby przejście splash → START było płynne stylistycznie.

---

# 4. EKRAN START — NAJWAŻNIEJSZY EKRAN

## Nazwa karty głównej

Zamiast napisu „START” na karcie głównej wyświetlany jest napis **„Zu'z Diary”**.

## Cel

Podsumowanie całej znajomości. Nie jest klasycznym dashboardem, nie wygląda jak analytics app.
Ma wyglądać jak galaktyka / mapa gwiazd / biologiczny organizm / molekuła / sieć neuronowa —
zgodnie z mockupem.

## Centralny element — RELATIONSHIP DNA / GALAKTYKA

**Kluczowa decyzja v2, upraszczająca największe ryzyko techniczne projektu:**

> Struktura (geometria) galaktyki jest **stała i niezmienna** dla każdej relacji.
> Nie generujemy jej proceduralnie z danych. Jest to jeden, zaprojektowany raz układ wizualny
> (orbity, spirala, rdzeń, rozmieszczenie stref).
>
> **Jedyną zmienną sterowaną danymi jest podświetlenie (glow) i kolor poszczególnych stref
> struktury** — odzwierciedlające nastrój relacji (patrz sekcja 6 — Emotional Tone Layer).

Konsekwencje tej decyzji:

- Nie potrzebujemy algorytmu deterministycznego rozmieszczania węzłów na podstawie hashowania
  danych (ryzyko z v1, sekcja 35, zostaje w praktyce wyeliminowane).
- Nie potrzebujemy mechanizmu normalizacji/agregacji przy dużej liczbie danych (nie renderujemy
  osobnych węzłów per aktywność na strukturze DNA).
- Struktura ma z góry zaprojektowane strefy (np. 5, odpowiadające 5 tagom nastroju — sekcja 6),
  każda niezależnie kolorowalna/podświetlana.
- Elementy „ważne chwile” z podsumowania (summary, sekcja 18) są liczone i wyświetlane jako
  statystyka tekstowa, NIE jako osobne węzły na strukturze DNA.

## Wymagana geometria — doprecyzowanie (v3) — NIEAKTUALNE PO DECYZJI v5

**Ta podsekcja (i notatka o kształcie hubów v3.1 poniżej) opisywała wymagania dla
struktury generowanej programistycznie. Po decyzji v5 (statyczny obraz) ten opis nie
jest już wdrażany w kodzie** — zachowany w dokumencie wyłącznie jako zapis historyczny
i punkt odniesienia, gdyby aplikacja wróciła do renderowania wektorowego w przyszłości.

**Ważne rozstrzygnięcie po pierwszej implementacji**: "stała struktura" nie znaczy
"uboga struktura". Pierwsza wersja zredukowała galaktykę do 5 węzłów na szprychach
z prostego pięciokąta — to jest zbyt daleko od Mockupu A. Poniższy opis jest wiążący
i zastępuje jakiekolwiek uproszczenie:

- **Rdzeń centralny**: gęsto upakowane, wąskie koncentryczne pierścienie — rząd wielkości
  kilkanaście–dwadzieścia, nie 3–4 — dające efekt głębi i jasnego punktu centralnego.
- **4–5 dużych łuków/orbit, ZACHODZĄCYCH NA SIEBIE** (okręgi o różnych promieniach,
  środki przesunięte względem środka rdzenia — efekt "spirografu"/zazębiających się
  kręgów, nie współśrodkowe orbity). Każdy łuk odpowiada jednej strefie/tagowi nastroju
  i ma swój kolor dominujący. Łuki się **przecinają**, nie są to odrębne "szprychy"
  z jednego centrum.
- Na każdym łuku: gęsty sznur małych kropek różnej wielkości (rząd wielkości kilkanaście
  na łuk), a w kilku miejscach większe "huby" — małe kółka z cienkim symbolem-runą
  w środku (miniaturowe, ok. 5–8% szerokości ekranu), z których promieniście odchodzą
  cienkie "kolce" (jak rozbłysk gwiazdy) — nie goła poświata bez kolców.
- Dodatkowa warstwa dekoracyjna: pojedyncze, niepodłączone do struktury małe
  symbole/kształty (romby, plusy, drobne ikonki) rozrzucone w tle, poza generycznym
  starfieldem.
- Całość ma być gęsta i "żywa", z płynnym przechodzeniem jednego koloru w drugi przez
  nakładanie się łuków — unikać efektu "5 odrębnych planet na szprychach".
- **Kształt hubów/węzłów (potwierdzone na realnych zrzutach implementacji — v3.1)**:
  huby muszą być **okrągłe** (kółko z symbolem-runą w środku i promienistymi kolcami),
  **nigdy zaokrąglone kwadraty/karty w stylu ikony aplikacji**. Pierwsza implementacja
  renderowała węzły jako kwadratowe kontenery z ikoną — to jest wizualnie odmienne od
  organicznego, kosmicznego charakteru wymaganego w sekcji 4, nawet przy poprawnej
  bogatszej geometrii łuków.

To wciąż jest **jedna, ręcznie zaprojektowana, niezmienna geometria** (zgodnie z zasadą
wyżej) — tylko bogatsza niż pierwsza wersja. Zmienną sterowaną danymi jest wyłącznie
podświetlenie/kolor (Emotional Tone Layer), nigdy liczba czy rozmieszczenie elementów.

## Rekomendacja techniczna renderowania — ZMIANA DECYZJI (v5)

**Decyzja praktyczna po kilku nieudanych próbach prototypu wektorowego**: wielokrotne
próby odtworzenia klimatu mockupu jako żywej struktury SVG/Skia nie dały satysfakcjonującego
efektu wizualnego. Klient dostarczył gotowy, wygenerowany obraz (AI), który wizualnie
trafia w sedno koncepcji (spiralna galaktyka, kolorowe sektory nastroju, gęstość, mgławice,
symbole). **W MVP ekran START używa tego obrazu jako statycznego tła** —
`assets/dna_background.png` — analogicznie do ekranu Splash (sekcja 3).

**Konsekwencja do zaakceptowania świadomie**: statyczny obraz rastrowy nie pozwala na
programistyczne przekolorowanie poszczególnych stref w zależności od danych (Emotional
Tone Layer, sekcja 6) — kolory są "wypalone" w pikselach. W MVP **struktura DNA jest
w 100% statyczna, bez dynamicznego podświetlenia nastroju**. Statystyki liczbowe pod
galaktyką (sekcja 8) pozostają w pełni dynamiczne i liczone z danych — zmienia się
tylko to, że sama grafika galaktyki nie reaguje wizualnie na te dane w MVP.

### Ścieżki na przyszłość (V2, nie blokują MVP)

Trzy opcje do rozważenia later, jeśli podświetlenie zależne od danych ma wrócić:

1. **Zostaje czysto statyczne** — zero dodatkowej pracy, najprostsze.
2. **Kilka wariantów statycznych obrazu** (np. 5–6 wersji z innym dominującym
   kolorem/sektorem podświetlonym mocniej, wygenerowanych tym samym promptem/stylem) —
   aplikacja przełącza się między gotowymi obrazami w zależności od dominującego
   nastroju z ostatnich 7 dni. Nie w pełni płynne, ale reaguje na dane bez pisania
   silnika graficznego.
3. **Statyczny obraz + programistyczna nakładka blend-mode** — baza jak jest, plus
   kolorowe kształty w kodzie (np. `mix-blend-mode: screen`/`color-dodge`) precyzyjnie
   umieszczone nad odpowiadającymi sektorami obrazu (wymaga ręcznego ustalenia w
   edytorze grafiki, które współrzędne/obszar odpowiadają któremu sektorowi — jednorazowa
   praca przygotowawcza, potem sterowane danymi jak w oryginalnej koncepcji).

Żadna z tych opcji nie jest wymagana do domknięcia MVP — decyzja odłożona do momentu,
gdy reszta aplikacji będzie działać.

## Animacja — ZMIANA (v5)

Skoro tło jest statycznym obrazem, animacja obrotu całej struktury (opisana w v2-v4)
nie ma zastosowania w tej samej formie. Dopuszczalna, opcjonalna animacja w MVP:
bardzo subtelny, wolny **zoom/pan** (parallax) całego statycznego obrazu, albo prosty
CSS/Reanimated `opacity`/`scale` pulse — bez zmiany treści obrazu. Nie jest to wymagane
do Definition of Done (sekcja 24).

## Runy emocji (rdzenne symbole DNA)

Struktura zawiera zestaw unikalnych, autorskich symboli (nie emoji, nie generyczne ikony) —
**dostarczonych osobno przez klienta** po zaprojektowaniu ich w osobnym procesie graficznym.
Jeden symbol na każdy z 5 tagów nastroju (sekcja 6). Do czasu dostarczenia własnych symboli,
w prototypie można używać placeholderów.

---

# 5. START — UI I NAWIGACJA

```text
┌─────────────────────────┐
│      Zu'z Diary          │              ⚙ (ustawienia)
│                         │
│       GALAKTYKA         │
│    (struktura stała,    │
│   podświetlenie danymi) │
│                         │
│ ─────────────────────── │
│ 127h  14  486  5  23   │
│  razem spotk. wiad.     │
│  prez. ważne chwile     │
│                         │
│ ┌────────┐┌─────┐┌────┐ │
│ │+ DODAJ ││KALEN││TIME│ │
│ │AKTYWN. ││DARZ ││LINE│ │
│ └────────┘└─────┘└────┘ │
└─────────────────────────┘
```

- **Brak ikony menu (☰).** Usunięta w v2 — aplikacja obsługuje jedną relację (sekcja 10),
  więc przełącznik relacji nie jest potrzebny.
- **Jedna ikona ⚙ (ustawienia)**, w niej: Ustawienia właściwe, Archiwum, O aplikacji
  (pełny opis — sekcja 11).
- **Trzy równorzędne CTA**: Dodaj Aktywność (główna akcja, wizualnie wyróżniona),
  Kalendarz, Timeline (dodany w v2 — w v1 nie był widoczny na ekranie START).

## Wypełnienie ekranu — poprawka (v4)

**Potwierdzone na realnym zrzucie ekranu**: layout nie wypełnia wysokości ekranu —
treść (tytuł, galaktyka, statystyki, cytat, przyciski) jest ściśnięta w górnej części,
a pod przyciskami zostaje duży pusty obszar do samego dołu ekranu. To jest błąd
layoutu (np. brak `flex: 1` na kontenerze głównym, ScrollView z nadmiarową wysokością
zamiast widoku o stałej, wypełnionej wysokości), nie kwestia stylu. **Wymóg wiążący**:
zawartość ekranu START ma wypełniać całą dostępną wysokość ekranu (od bezpiecznego
obszaru pod paskiem statusu do bezpiecznego obszaru nad dolną krawędzią), bez
pozostawiania nieużytej przestrzeni — galaktyka może/powinna być największym,
elastycznym elementem, który wypełnia miejsce pozostałe po nagłówku, statystykach,
cytacie i przyciskach.

## Realizacja z obrazem statycznym (v6) — kompletny schemat ekranu

**Priorytet w tej rundzie implementacji: sześć pozostałych ekranów (Kalendarz, Timeline,
Add Activity, Ustawienia, Splash, i layout w ogóle) muszą działać poprawnie zgodnie z
poprawkami v4/v5. Emotional Tone Layer (dynamiczne podświetlenie galaktyki) jest
świadomie odłożone — patrz sekcja 4, "Ścieżki na przyszłość" — i nie blokuje odbioru
tej rundy pracy.**

Ekran START, z galaktyką jako statycznym obrazem (`assets/dna_background.png`, sekcja 4),
składa się z tych samych elementów co dotychczas, w tej kolejności, wypełniając całą
wysokość ekranu (reguła wyżej):

1. **Nagłówek**: "Zu'z Diary" (tytuł) + ikona ⚙ w prawym rogu.
2. **Galaktyka**: obraz `dna_background.png`, jako elastyczny element wypełniający
   największą część pozostałego miejsca (`flex: 1` lub odpowiednik) — obraz skalowany
   proporcjonalnie (`resizeMode: contain` lub `cover`, do wyboru graficznego, ale bez
   zniekształcenia proporcji), wycentrowany.
3. **Statystyki** (razem/spotkania/wiadomości/prezenty/ważne chwile) — liczone
   dynamicznie z danych (bez zmian, sekcja 8/18).
4. **Codzienny cytat** — statyczna baza (sekcja 14).
5. **Trzy przyciski**: Dodaj Aktywność (główny), Kalendarz, Timeline.

Brak dynamicznego podświetlenia obrazu nie zmienia niczego w punktach 1, 3, 4, 5 —
te elementy działają w pełni funkcjonalnie, tak jak opisano od v2.

---

# 6. EMOTIONAL TONE LAYER (NOWOŚĆ — v2, status: ODŁOŻONE — v6)

**Status w tej rundzie implementacji**: mechanizm opisany w tej sekcji pozostaje
**opcją na przyszłość**, do wdrożenia gdy znajdziemy narzędzie/technikę zdolną
wygenerować strukturę DNA na poziomie wizualnym, jaki klient akceptuje (patrz sekcja 4,
decyzja v5). Do tego czasu obraz galaktyki jest statyczny i nie reaguje na dane. Poniższy
opis zostaje w dokumencie jako gotowa specyfikacja mechanizmu, nie jako zadanie
do wykonania teraz.

## Cel

Osobna, dodatkowa warstwa nad strukturą DNA, sterująca jej podświetleniem/kolorem na
podstawie **udziału procentowego kategorii emocjonalnych** aktywności w danym oknie czasowym.
Nie wpływa na geometrię struktury (patrz sekcja 4) — tylko na kolor/intensywność.

## Tagi nastroju i przypisane glify

| Tag nastroju | Kolor (orientacyjnie) | Glify przypisane |
|---|---|---|
| **BLISKOŚĆ** | złoty | coffee, dinner, drink, walk, picnic, cinema, concert, trip, sleepover, hug |
| **TĘSKNOTA** | cyan / turkus | message, first message, phone, video call, reconnect |
| **NAMIĘTNOŚĆ** | róż / magenta | kiss, romantic moment, night, important talk |
| **RADOŚĆ** | fiolet | gift, flowers, letter, photo, surprise, reconciliation |
| **NAPIĘCIE** | rdzawa czerwień | argument, ghosting, breakup, Tinder removed |

Neutralne (nie liczą się do nastroju — administracyjne, nie emocjonalne):
swipe, match, Tinder installed, invitation.

## Mechanika liczenia

```
udział(tag) = liczba aktywności z danym tagiem w oknie czasowym
              / liczba wszystkich aktywności "emocjonalnych" w tym oknie (bez neutralnych)
```

## Okno czasowe

**Rolling 7 dni**, przeliczane na bieżąco (nie all-time). Uzasadnienie: struktura DNA
(geometria) jest odciskiem całej historii i jest stała — więc może to sobie pozwolić na to,
żeby kolor/nastrój odzwierciedlał *bieżącą temperaturę* relacji (ostatni tydzień), bez ryzyka,
że jedno negatywne wydarzenie "zniszczy" cały odcisk historii. Te dwa mechanizmy (stała
struktura + zmienny kolor) rozdzielają fakty od nastroju.

## Pasma intensywności podświetlenia

Więcej niż jeden tag może świecić mocno jednocześnie — nie jest to system
"zwycięzca bierze wszystko".

| Udział % danego tagu | Intensywność świecenia |
|---|---|
| 0–10% | bardzo przygaszony |
| 10–25% | widoczny, spokojny |
| 25–40% | wyraźny |
| 40%+ | mocno świecący, wiodący |

Każdy tag, który przekroczy próg, świeci proporcjonalnie do swojego %, niezależnie od
innych tagów.

---

# 7. TIMELINE

## Koncepcja

Jedna linia. Każdy **dzień relacji = jeden punkt** na linii (nie tylko dni z aktywnością).
Brak aktywności danego dnia = goły, przygaszony punkt. Aktywność = symbol(e) przy punkcie.
Notatka = mały marker przy punkcie. Odległość między punktami jest **stała** (jednostka
= jeden dzień), nie zmienna w zależności od gęstości wydarzeń (różni się to od koncepcji z v1).

## Widoki (do rozstrzygnięcia gęstości na małym ekranie)

- **Widok tygodniowy (domyślny)** — 7 punktów, duże ikony, widoczne daty/dni tygodnia.
  Nawigacja: swipe / strzałki między tygodniami.
- **Widok miesięczny (przełączany)** — cała historia miesiąca widoczna naraz, mniejsze
  punkty, bez podpisów dat przy każdym punkcie (tap na punkt = tooltip z datą).
  Nawigacja: przełączanie między miesiącami.

Nieprzerwany scroll 365 dni pozostaje jako pomysł na V2, jeśli po testach z widokiem
tygodniowym/miesięcznym okaże się potrzebny.

## Styl wizualny linii — doprecyzowanie (v3)

Pierwsza implementacja narysowała jednolitą, płaską linię — to nie oddaje mockupu
i jest wiążące do poprawy:

- **Linia ma gradient koloru wzdłuż swojej długości**, zależny od nastroju pobliskich
  wydarzeń (nie jednolity kolor) — tam gdzie dominują wydarzenia BLISKOŚCI, linia jest
  złota; tam gdzie dominuje TĘSKNOTA, przechodzi w turkus, itd. Technicznie: gradient
  wieloetapowy wzdłuż path (`linearGradient`/`gradientUnits="userSpaceOnUse"` w SVG,
  analogicznie w Skia), ze stopami wyznaczonymi kolorem najbliższych aktywności.
- **Węzły mają widoczną poświatę (halo)** wokół punktu, nie gołą kropkę.
- **Wydarzenie oznaczone jako ważne** (`importance` 1/2) = dodatkowy przerywany okrąg
  wokół węzła, wyraźnie odróżniający je od zwykłych punktów.
- Etykiety (data + glif + krótki tekst) mogą stać na przemian lewo/prawo wzdłuż linii,
  z naturalnym marginesem — nie sztywno po jednej stronie.

## Kształt ścieżki i przypisanie dat — poprawka (v4)

**Potwierdzone na realnym zrzucie ekranu**: ścieżka wyszła jako przypadkowo wyglądający
"wężyk" (nieregularne wygięcia S bez wyraźnej logiki), a etykiety dat wisiały w
nieoczywistym związku z konkretnym punktem na linii. To wymaga dwóch twardych reguł:

- **Kształt ścieżki musi być łagodny, deliberatywny, nie chaotyczny** — jedno spokojne,
  powtarzalne wygięcie (np. sinusoida o stałej, przewidywalnej amplitudzie i okresie),
  nie losowe/nieregularne skręty. Krzywizna ma sugerować "rzekę"/"DNA", a nie wyglądać
  jak przypadkowa linia.
- **Każda etykieta daty musi być jednoznacznie, wizualnie przypisana do swojego punktu**
  — np. krótki łącznik (leader line) od punktu do etykiety, albo etykieta umieszczona
  bezpośrednio przy punkcie bez możliwości pomylenia z sąsiednim. Nigdy data "wisząca"
  w przestrzeni bez oczywistego związku z konkretnym punktem na ścieżce.
- Ikony przy punktach podlegają **globalnej zasadzie z nagłówka dokumentu** — zakaz
  kwadratowego/kołowego tła za ikoną. Na zrzucie ekranu widoczne kwadratowe tła za
  ikonami przy węźle "17.08" — to jest dokładnie ten sam błąd co na Kalendarzu i
  Add Activity, do naprawienia w jednym miejscu w kodzie (współdzielony komponent
  renderujący glif), nie osobno na każdym ekranie.

## Ligatura (wiele aktywności jednego dnia)

Grupowanie wizualne — wspólny glow/aureola wokół kilku glifów przy jednym punkcie.
**Brak** proceduralnego łączenia symboli w jeden znak (odrzucone w MVP).

---

# 8. ADD ACTIVITY — PRZEPROJEKTOWANE (v4): WSZYSTKO ZWIJANE

**Zmiana względem v3**: realny zrzut ekranu pokazał pełnoekranowy formularz z rozwiniętym
na stałe kalendarzem i podpisami tekstowymi pod każdym z 27 glifów — dokładnie to, co v3
już zakazywało, ale opis panelu w v3 wciąż zakładał, że **siatka glifów stoi rozwinięta
na stałe** wewnątrz panelu. To okazało się niewystarczające. **Nowa, wiążąca zasada:
KAŻDE pole w tym panelu jest domyślnie zwinięte do minimalnej, jednowierszowej formy —
łącznie z wyborem glifu, nie tylko z datą i czasem.**

## Struktura panelu (v4)

```text
+ (Dodaj Aktywność) → otwiera panel (bottom sheet, nie pełny ekran)

┌───────────────────────────────┐
│  [chip: 08 sierpnia ▾]          │  ← ZWINIĘTE. Tap → rozwija mini-kalendarz NA CHWILĘ
│                                  │     (nad polem, nie na stałe). Wybór dnia → panel
│                                  │     kalendarza znika, pole wraca do zwiniętego
│                                  │     chipa z nową datą.
│                                  │
│  [chip: OD 14:00 — DO 20:00 ▾]   │  ← ZWINIĘTE. Tap → rozwija wheel NA CHWILĘ (tylko
│                                  │     jeśli którykolwiek WYBRANY glif ma
│                                  │     requiresDuration = true — patrz niżej, kolejność
│                                  │     pól: glif wybieramy PRZED czasem, bo czas zależy
│                                  │     od wybranego glifu). Wybór → wheel znika, pole
│                                  │     wraca do zwiniętego odczytu z nową godziną.
│                                  │
│  [chip: ☕ 🎁 + Dodaj glif ▾]     │  ← ZWINIĘTE. Pokazuje małe podglądy już wybranych
│                                  │     glifów (bez teł — zasada globalna) + przycisk
│                                  │     "+". Tap (na cały chip albo na "+") → otwiera
│                                  │     PEŁNY wybór glifów jako odrębny, nakładany widok
│                                  │     (pełny ekran picker lub wysoki bottom sheet nad
│                                  │     tym panelem — nie stała siatka wewnątrz panelu).
│                                  │     W tym widoku: wszystkie 27 glifów, pogrupowane
│                                  │     kategoriami, multi-select z podświetleniem
│                                  │     zaznaczonych. Przycisk "Gotowe" → widok się
│                                  │     zamyka, chip aktualizuje się o wybrane glify.
│                                  │
│  [notatka — pole tekstowe]        │  ← wąskie pole, zawsze widoczne (jedyne pole, które
│                                  │     nie jest "zwijane", bo samo jest już minimalne).
└───────────────────────────────┘
                              ⬤ ← FAB: okrągły, złoty przycisk z checkmarkiem (zapis).
```

## Zasady wiążące (v4)

- **Każde pole zwinięte domyślnie** — data, czas, wybór glifu. Żadne z nich nie stoi
  rozwinięte na stałe wewnątrz panelu. Rozwinięcie jest zawsze tymczasowe: tap → akcja
  wyboru → automatyczny powrót do zwiniętego stanu.
- **Wybór glifu to osobny, nakładany widok** (pełny ekran lub wysoki bottom sheet "na
  wierzchu" panelu Add Activity), otwierany z jednego zwartego pola/przycisku — nie
  stała siatka 27 ikon zajmująca miejsce w głównym panelu. To rozwiązuje problem
  "za dużo elementów naraz na małym ekranie" strukturalnie, nie kosmetycznie.
- W widoku wyboru glifu: **grupowanie kategoriami dozwolone, podpisy tekstowe pod
  ikonami dozwolone** (tu jest miejsce, jest to osobny, poświęcony temu widok — w
  przeciwieństwie do zwartego chipa w panelu głównym, gdzie podpisów nie ma).
- **Kolejność**: glif wybieramy przed czasem, bo pole czasu pojawia się/staje się
  aktywne tylko jeśli wybrany glif tego wymaga (`requiresDuration`, sekcja 13).
- **Zapis**: floating okrągły przycisk (FAB) z checkmarkiem.
- **Ważność i zdjęcie**: dodatkowy, zwijany segment panelu (np. rozwijany spod notatki
  przyciskiem "więcej opcji") — nie zaśmiecają domyślnego, zwartego widoku.
- Wszystkie ikony w tym ekranie (zarówno w zwartym chipie, jak i w pełnym widoku
  wyboru) podlegają globalnej zasadzie z nagłówka dokumentu: **zero kwadratowych/
  kołowych teł za ikoną**, jedyny dopuszczalny akcent to złota obwódka/poświata
  wokół zaznaczonego glifu w widoku wyboru.
- Wiele wybranych glifów zapisuje się jako **jedna** `Activity` z tablicą `glyphIds`
  (sekcja 12), nie jako osobne rekordy. Notatka, czas i ważność są wspólne dla całej
  aktywności dnia, nie per glif.

---

# 9. KALENDARZ

Najbardziej klasyczny, praktyczny ekran, źródło prawdy. Musi umożliwiać: przechodzenie
między miesiącami, wybór dnia, dodawanie/edycję/usuwanie wydarzenia.

## Zmiana koncepcji (v4): minimalna komórka + podgląd dnia zintegrowany pod siatką

**Potwierdzone na realnym zrzucie ekranu**: komórka dnia w siatce miesiąca jest
fizycznie za mała (na telefonie ok. 45–55px szerokości), żeby zmieścić czytelną ikonę
glifu, czas i marker notatki naraz. Próba wcięcia tego wszystkiego w jedną komórkę
kończy się nieczytelną miniaturą. **To wymaga zmiany koncepcji, nie tylko poprawki
stylu** — zamiast maksymalizować to, co widać w komórce, **minimalizujemy komórkę
i przenosimy czytelną treść do panelu pod kalendarzem.**

### Komórka dnia (v4) — maksymalnie minimalna

1. **Numer dnia** — mały, subtelny, jak dotychczas.
2. **Jeden mały, kolorowy wskaźnik aktywności** (punkt lub krótki pasek) w kolorze
   dominującego tagu nastroju tej aktywności — **nie ikona glifu**. Jeśli dzień ma
   wiele glifów, wskaźnik może być wielokolorowy (np. kilka wąskich segmentów) albo
   po prostu jednym kolorem dominującego tagu — szczegół do decyzji graficznej, ale
   **nigdy pełna ikona glifu wewnątrz komórki miesiąca**.
3. **Kropka notatki** — jak dotychczas, mały punkt przy numerze dnia.
4. Brak czasu, brak ikon — te informacje przenoszą się do panelu podglądu (niżej).

### Podgląd dnia — nowy panel pod siatką kalendarza (v4)

**Tap na komórkę dnia (z aktywnością) nie nawiguje do osobnego ekranu.** Zamiast tego,
**pod siatką kalendarza, w miejscu pozostałej wolnej przestrzeni ekranu, wysuwa się
panel podglądu tego dnia**, zajmujący większość pozostałej wysokości:

```text
┌─────────────────────────┐
│      KALENDARZ (siatka)  │  ← siatka zostaje ścieśniona tylko do
│      (skompresowana)      │     tego, co faktycznie potrzebne (bez
│                          │     dużej martwej przestrzeni pod nią)
├─────────────────────────┤
│  17 SIERPNIA              │  ← PODGLĄD DNIA — wysuwa się po tapnięciu
│  ☕ Kawa    🎁 Prezent     │     komórki, wypełnia większość reszty
│  18:00–20:00 · 2h          │     ekranu. Duże, czytelne ikony (nie
│  ★★                      │     miniatury z komórki).
│  [Odkryj notatkę]         │
│  [Edytuj] [Usuń] [Zdjęcie] │
└─────────────────────────┘
```

- Ten panel **zastępuje dotychczasową koncepcję "Day Detail jako osobny ekran
  nawigacyjny"** — staje się zintegrowaną częścią ekranu Kalendarz, nie odrębną route.
- Tap na inny dzień → panel aktualizuje się do nowego dnia (nie zamyka się i otwiera
  ponownie, tylko podmienia zawartość).
- Tap na dzień bez aktywności → panel może pokazywać krótki placeholder ("Brak
  wydarzeń tego dnia" + przycisk "Dodaj aktywność na ten dzień") albo być schowany —
  do decyzji graficznej, nie wpływa na model danych.
- Edycja/usuwanie/notatka/zdjęcie działają identycznie jak wcześniej opisany
  "Day Detail" (sekcja 16) — zmienia się tylko **umiejscowienie** (panel wewnątrz
  Kalendarza, nie osobny ekran), nie zestaw funkcji.

**Marker zdjęcia w komórce**: nie istnieje (bez zmian względem v3) — zdjęcie widoczne
wyłącznie w panelu podglądu dnia.

---

# 10. RELACJA — MODEL "JEDNA AKTYWNA + ARCHIWUM"

**Decyzja v2** (zmiana względem wcześniejszej koncepcji wielu równoległych relacji):
skoro struktura DNA jest zawsze taka sama geometrycznie (sekcja 4), posiadanie wielu
równoległych relacji nie dawałoby żadnej wizualnej różnorodności między nimi — różniłyby
się tylko kolorem. W tej sytuacji prostszy model jest właściwym wyborem.

## Mechanika

- Aplikacja prowadzi **jedną aktywną relację** na raz.
- W Ustawieniach dostępna opcja **"Zacznij nową historię"**, z wymaganym potwierdzeniem
  (np. "Czy na pewno chcesz zacząć od nowa?").
- Po potwierdzeniu: aplikacja **automatycznie zapisuje bieżące dane** (wszystkie aktywności,
  referencje do zdjęć) jako plik JSON w lokalnym archiwum na urządzeniu (dokładnie ten sam
  format co ręczny eksport — sekcja 15), a następnie czyści aktywne dane. Galaktyka i
  wszystkie widoki zaczynają się budować od zera.
- W Ustawieniach → Archiwum: lista zapisanych plików (np. "Historia — zamknięta 12.03.2027"),
  z możliwością ręcznego eksportu/udostępnienia pliku. **Brak wglądu w szczegóły archiwum
  w UI w MVP** — plik leży bezpiecznie, można go wyeksportować, ale nie przeglądać
  wewnątrz aplikacji.

---

# 11. USTAWIENIA (⚙)

Jedna ikona ustawień zastępuje dawny podział na menu (☰) i zębatkę (⚙) — patrz sekcja 5.

Zawartość ekranu Ustawień:

- **Zacznij nową historię** (patrz sekcja 10) — z potwierdzeniem.
- **Archiwum** — lista zarchiwizowanych historii, z opcją eksportu pliku.
- **Eksportuj dane** — generuje plik JSON z aktualną relacją (sekcja 15).
- **Importuj dane** — wczytuje plik JSON z powrotem.
- **Źródło codziennego cytatu** — wybór: statyczna baza lokalna (domyślne) / opcjonalne
  źródło online (patrz sekcja 14) — jeśli zostanie zaimplementowane w V2.
- **O aplikacji** — wersja, informacje.

**Brak PIN-u, brak biometrii, brak szyfrowania danych** — odrzucone w MVP (sekcja 3).

---

# 12. MODEL DANYCH

## Activity

**Kluczowa zasada v2 (ustalona po dalszej konsultacji): jeden dzień = jedna aktywność.**
Jedna `Activity` może zawierać **wiele glifów naraz** (np. dinner + gift + intimate_moment
tego samego dnia) — każdy glif liczy się osobno do statystyk (Summary Engine) i osobno
wpływa na Emotional Tone Layer (glow), ale wszystkie dzielą jedną notatkę, jeden czas
i jedną datę.

```ts
type Activity = {
  id: string
  date: string             // unikalna w skali relacji — jeden dzień = jedna Activity
  startTime?: string       // opcjonalne — patrz Glyph.requiresDuration
  endTime?: string          // opcjonalne — patrz Glyph.requiresDuration
  glyphIds: string[]        // wiele glifów w jednej aktywności dnia
  note?: string
  importance: 0 | 1 | 2     // 0 = zwykłe, 1 = ważne, 2 = bardzo ważne
  photoUri?: string         // referencja do zdjęcia w systemowej galerii (nie kopiujemy pliku)
  createdAt: string
  updatedAt: string
}
```

Zmiany względem v1:

- `glyphId` (jeden) → **`glyphIds` (tablica)** — jedna aktywność dnia może nosić kilka
  tagów/glifów naraz.
- `startTime`/`endTime` są **opcjonalne** — pojawiają się w formularzu Add Activity tylko
  jeśli **przynajmniej jeden** z zaznaczonych glifów ma `requiresDuration: true` (patrz
  sekcja 13).
- `importance` zmienione z boolean na skalę 3-poziomową (0/1/2), ustawianą ręcznie przez
  użytkownika (żadnej automatyki przypisującej ważność na podstawie typu glifu).
- Dodane `photoUri` — opcjonalne, jedno zdjęcie per aktywność, widoczne tylko z Day Detail,
  referencja do systemowej galerii (bez kopiowania pliku do własnego storage aplikacji).

## Zasada scalania przy kolizji dnia

Jeśli użytkownik w Add Activity wybierze datę, dla której już istnieje `Activity`
(np. rano dodał „kawa”, wieczorem chce dodać „kolacja + prezent” na ten sam dzień):
mini-kalendarz w Add Activity oznacza dni z istniejącą aktywnością (mały punkt pod datą).
Tap na taki dzień **otwiera edycję istniejącego rekordu** (dogrywanie kolejnych glifów
do tego samego dnia), nie tworzy nowego, osobnego rekordu. Użytkownik widzi, co już
zostało zapisane (np. że rano była „kawa”), zanim dogra kolejne rzeczy — zapobiega to
przypadkowemu nadpisaniu notatki/czasu.

## Glyph

```ts
type Glyph = {
  id: string
  name: string
  category: GlyphCategory      // z sekcji 13 (bez zmian względem v1)
  moodTag?: MoodTag              // BLISKOSC | TESKNOTA | NAMIETNOSC | RADOSC | NAPIECIE | null
  requiresDuration: boolean      // czy Add Activity pyta o czas OD/DO
  iconDefinition: string
}

type MoodTag = 'BLISKOSC' | 'TESKNOTA' | 'NAMIETNOSC' | 'RADOSC' | 'NAPIECIE'
```

Zmiany względem v1:

- **Usunięto `isCustom` i `color`** — brak możliwości tworzenia własnych glifów w MVP
  (odrzucone jednoznacznie). Zestaw glifów jest zamknięty, zaszyty przez producenta aplikacji.
- Dodano `moodTag` — przypisanie do Emotional Tone Layer (sekcja 6). `null`/brak dla
  glifów neutralnych.
- Dodano `requiresDuration` — kontroluje, czy pole czasu pojawia się w Add Activity.

## Relationship (kontener na dane)

```ts
type Relationship = {
  activities: Activity[]
  startedAt: string
}
```

Prosty kontener na jedną, aktywną relację — bez identyfikatora/listy (patrz sekcja 10,
model jednej aktywnej relacji).

---

# 13. GLIFY — FINALNA LISTA, KOLORY, REGUŁA CZASU

## Dwa różne złote — rozdzielenie kolorów UI i nastroju (v3)

**Ustalenie po audycie**: mockup faktycznie używa **dwóch różnych odcieni złota** —
stonowany, „szampański” złoty do elementów UI (przyciski, obramowania, nagłówki) i
znacznie bardziej nasycony, neonowy złoty do glow/mood BLISKOŚĆ. Używanie jednego
koloru do obu (jak w pierwszej implementacji) odbiera strefie BLISKOŚĆ własną
tożsamość wobec reszty interfejsu. **Te dwa kolory są odrębnymi tokenami w kodzie,
nigdy tym samym zmiennym:**

| Token | Rola | Wartość (zmierzona z mockupu/assetów) |
|---|---|---|
| `colors.background` | Tło aplikacji | `#050608` |
| `colors.gold` (UI) | Przyciski, obramowania, nagłówki | `#D1A262` (stonowany, szampański) |
| `moodColors.BLISKOSC` | Glow/mood — strefa BLISKOŚĆ na DNA, glify tej grupy | `#EFA52C`–`#FFCF10` (nasycony, neonowy) |
| `moodColors.TESKNOTA` | Glow/mood — cyan/turkus | `#3DF0EA`–`#79EDEE` |
| `moodColors.NAMIETNOSC` | Glow/mood — róż/magenta | `#E540A8`–`#F46BAC` |
| `moodColors.RADOSC` | Glow/mood — fiolet | `#A474E4`–`#AD6DFB` |
| `moodColors.NAPIECIE` | Glow/mood — rdzawa czerwień | `#C4513F`–`#FF4C02` |

## Finalna, zamknięta lista — 27 glifów

Poniższa tabela jest ostateczna. Kolor każdego glifu odpowiada jego tagowi nastroju
(Emotional Tone Layer, sekcja 6) — to nie jest dekoracja, to spójny język kolorów
używany też do podświetlenia struktury DNA.

| Kategoria | Glif (`id`) | Czas wymagany? | Tag nastroju | Kolor |
|---|---|---|---|---|
| CONTACT | `first_message` | NIE | TĘSKNOTA | cyan |
| CONTACT | `message` | NIE | TĘSKNOTA | cyan |
| CONTACT | `phone` | TAK | TĘSKNOTA | cyan |
| CONTACT | `video_call` | TAK | TĘSKNOTA | cyan |
| CONTACT | `ghosting` | NIE | NAPIĘCIE | rdzawa czerwień |
| CONTACT | `reconnect` | NIE | TĘSKNOTA | cyan |
| DATING | `swipe` | NIE | neutralny | biało-szary |
| DATING | `match` | NIE | neutralny | biało-szary |
| DATING | `tinder_installed` | NIE | neutralny | biało-szary |
| DATING | `invitation` | NIE | neutralny | biało-szary |
| MEETINGS | `coffee` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `dinner` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `drink` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `walk` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `picnic` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `cinema` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `concert` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `trip` | TAK | BLISKOŚĆ | złoty |
| MEETINGS | `night` | TAK | NAMIĘTNOŚĆ | róż |
| EMOTION | `important_talk` | NIE | NAPIĘCIE | rdzawa czerwień |
| EMOTION | `argument` | NIE | NAPIĘCIE | rdzawa czerwień |
| EMOTION | `reconciliation` | NIE | RADOŚĆ | fiolet |
| EMOTION | `intimate_moment` *(scala kiss+hug+romantic)* | NIE | NAMIĘTNOŚĆ | róż |
| EMOTION | `breakup` | NIE | NAPIĘCIE | rdzawa czerwień |
| OBJECTS | `gift` | NIE | RADOŚĆ | fiolet |
| OBJECTS | `flowers` | NIE | RADOŚĆ | fiolet |
| OBJECTS | `surprise` | NIE | RADOŚĆ | fiolet |

**Usunięte względem v1**: `sleepover` (scalone z `night`), `Tinder removed` (wywalone),
`kiss`/`hug`/`romantic moment` (scalone w jeden glif `intimate_moment`), `letter`/`photo`
(wywalone z kategorii OBJECTS).

## Reguła czasu — per kategoria, nie per glif

Zasada uproszczona względem pierwszej wersji: **czas trwania (`requiresDuration`)
zależy od kategorii, nie od pojedynczego glifu** — spotkanie niesie swój czas, tag
emocjonalny (kiss, argument, gift...) nigdy nie ma własnego czasu, nawet jeśli
towarzyszy spotkaniu.

- **MEETINGS** (wszystkie) → **TAK**
- **CONTACT → `phone`, `video_call`** → **TAK**
- **Cała reszta** (pozostałe CONTACT, cały DATING, cały EMOTION, cały OBJECTS) → **NIE**

Jeśli w jednej aktywności dnia zaznaczono kilka glifów (np. `dinner` + `gift`), krok
formularza z czasem **pojawia się**, bo przynajmniej jeden zaznaczony glif tego wymaga —
czas dotyczy całej aktywności dnia, nie pojedynczego glifu.

## Dwupoziomowy system wizualny

**Poziom 1 — Rdzenne Runy Emocji (5 sztuk)**: unikalne, autorskie symbole widoczne
wyłącznie na strukturze DNA (START), jeden na każdy tag nastroju z sekcji 6. Dostarczane
osobno przez klienta po zaprojektowaniu w osobnym procesie graficznym (poza zakresem
tego dokumentu). Do czasu dostarczenia — placeholdery w prototypie.

**Poziom 2 — Glify Aktywności** (cała lista z kategorii wyżej): używane w Kalendarzu,
Timeline, Add Activity, Day Detail. **Wymóg wiążący dla implementacji wizualnej**:
żadnych emoji, żadnych generycznych ikon (np. z bibliotek typu Material Icons) w wersji
finalnej — mają być zaprojektowane w jednym, autorskim stylu (cienkie, świecące linie,
geometryczne, niedosłowne — w duchu run/symboli alchemicznych), zgodnym wizualnie
z resztą aplikacji. Emoji z sekcji "Glyph Picker" w mockupie są tylko placeholderem
roboczym, nie elementem finalnego designu.

## Brak własnych glifów

**Decyzja v2, jednoznaczna**: użytkownik nie ma możliwości tworzenia własnych glifów
w żadnej formie (ani prosty wybór koloru/kategorii, ani edytor graficzny). Zestaw glifów
jest zamknięty. Funkcja "+" z mockupu (Glyph Picker) zostaje usunięta z zakresu MVP.

---

# 14. CODZIENNY CYTAT / SENTENCJA

**Widoczny element na ekranie START w mockupie (pole na tekst inspiracyjny).**

## MVP (offline)

Statyczna baza (np. 150–365) cytatów/sentencji o miłości i relacjach, zaszyta lokalnie
w aplikacji jako plik danych. Wybór dnia: deterministyczny (np. `dayOfYear % liczba_cytatów`),
działa od pierwszego dnia, bez internetu, bez zależności od zewnętrznego API.

## V2 (opcjonalne, online) — nie wchodzi do MVP

Możliwość podłączenia zewnętrznego źródła (np. codzienny cytat/dwuzdaniowy horoskop
scrapowany z konkretnej strony) jako opcja włączana ręcznie w Ustawieniach. Ocena
techniczna: scraping jednej konkretnej strony jest wykonalny, ale wprowadza zależność
od sieci (konflikt z zasadą offline-first), kruchość (zmiana HTML źródła psuje scraper)
i wymaga weryfikacji regulaminu wybranej strony pod kątem dozwolonego użycia. Traktować
jako świadomie oznaczoną funkcję "wymaga internetu", nie jako domyślne zachowanie.

---

# 15. BACKUP / EKSPORT / IMPORT DANYCH

Zgodnie z zasadą local-first / offline (sekcja 17) — potrzebne jest proste zabezpieczenie
przed utratą danych przy zmianie urządzenia.

- **Eksportuj dane** (w Ustawieniach): generuje jeden plik JSON zawierający aktualną
  relację (wszystkie aktywności, referencje do zdjęć). Użytkownik zapisuje/wysyła plik
  przez systemowe "udostępnianie" (mail, dysk, dowolna metoda).
- **Importuj dane**: wczytuje plik JSON z powrotem, odtwarzając stan aplikacji.
- **Ten sam format i mechanizm** jest używany przy automatycznym archiwizowaniu relacji
  po "Zacznij nową historię" (sekcja 10) — jeden, spójny schemat danych, bez duplikowania
  logiki.
- Brak automatycznego backupu w tle — to byłaby forma cloud sync, czego chcemy uniknąć
  zgodnie z zasadą offline-first.

---

# 16. ZDJĘCIA (wariant prosty)

- Jedno opcjonalne zdjęcie per `Activity` (pole `photoUri`).
- Wybór zdjęcia przez natywny image picker systemu (galeria telefonu).
- **Referencja (URI), nie kopiowanie pliku** — aplikacja nie duplikuje zdjęcia do
  własnego storage. Ryzyko do zaakceptowania w MVP: jeśli użytkownik usunie zdjęcie
  z galerii systemowej, referencja w aplikacji "umiera" (brak podglądu).
- Widoczność: wyłącznie z ekranu Day Detail (klik w dzień → jeśli aktywność ma zdjęcie,
  widoczna miniatura/podgląd). W komórce kalendarza — tylko mały marker/ikona
  sygnalizująca obecność zdjęcia, bez wyświetlania samego zdjęcia w widoku miesiąca.
- Rozszerzenia (V2, nie w MVP): kopiowanie zdjęcia do wewnętrznego storage aplikacji,
  wiele zdjęć na dzień, wpływ zdjęcia na wygląd węzła Timeline/DNA.

---

# 17. LOCAL-FIRST / OFFLINE

Bez zmian względem v1: aplikacja działa lokalnie, bez konta, bez backendu, bez logowania,
bez cloud sync. Jedyne wyjątki (opcjonalne, świadomie włączane w V2): źródło cytatu
online (sekcja 14).

## Baza danych

**Decyzja v2**: prosty magazyn JSON (cała tablica `Activity[]` trzymana w pamięci +
persystowana na dysku urządzenia), bez SQLite. Skala danych (setki/tysiące aktywności)
nie wymaga silnika bazodanowego — cała logika (Summary Engine, Emotional Tone Layer)
operuje na całej tablicy w pamięci. Migracja do SQLite możliwa w przyszłości, jeśli
skala danych to wymusi.

---

# 18. SUMMARY ENGINE

Bez zmian koncepcyjnych względem v1 — statystyki liczone automatycznie z `Activity[]`,
nie przechowywane jako osobne wartości ręczne: `totalHours()`, `meetingCount()`,
`messageCount()`, `giftCount()`, `importantCount()`, `activeDays()`, `longestMeeting()`,
`longestGap()`.

---

# 19. ARCHITEKTURA DANYCH

```text
Activity[]
   │
   ├── Calendar Renderer
   │
   ├── Timeline Renderer (widok tydzień/miesiąc)
   │
   ├── Summary Engine
   │
   └── Emotional Tone Layer → koloruje stałą strukturę DNA
```

Nie tworzymy osobnych baz dla Timeline i DNA. Nie generujemy geometrii DNA z danych —
tylko podświetlenie (sekcja 4, 6).

---

# 20. REKOMENDOWANY STACK

Bez zmian względem v1:

- **React Native + Expo** (aplikacja mobilna)
- **React Native Skia** — renderowanie struktury DNA (stała geometria + dynamiczne
  podświetlenie), Timeline, efektów glow/blur/gradient.

Rekomendowany plan pracy (patrz też sekcja 4): prototyp wizualny w SVG/web, iterowany
w rozmowie/podglądzie, przed przejściem do implementacji w Skia — pozwala to szybciej
dopracować estetykę struktury DNA bez kosztownych iteracji w środowisku mobilnym.

---

# 21. NAWIGACJA — DOCELOWY MODEL APLIKACJI (v4)

```text
              ┌─────────────────┐
              │      SPLASH      │
              │  (statyczny obraz│
              │   + "Hej Zuza")  │
              └────────┬─────────┘
                       │ tap
                       ▼
              ┌─────────────────────┐
              │    Zu'z Diary        │
              │  (START / galaktyka) │
              │  DNA + Summary       │
              └──────────┬───────────┘
                         │
          ┌───────────────┴───────────────┐
          │                               │
   ┌──────▼──────┐                 ┌──────▼──────────────┐
   │  TIMELINE   │                 │  CALENDAR             │
   │ (tydz./mies.)│                 │ + PODGLĄD DNIA        │
   │             │                 │ (zintegrowany panel,  │
   │             │                 │ nie osobny ekran — v4)│
   └─────────────┘                 └───────────────────────┘

                    + ADD ACTIVITY (bottom sheet, wszystko zwijane — v4)
                    ⚙ USTAWIENIA (Archiwum, Eksport/Import, O aplikacji)
```

**Zmiana względem v3**: DAY DETAIL nie jest już osobnym węzłem nawigacji — jest
zintegrowanym panelem wewnątrz ekranu KALENDARZ (sekcja 9), wysuwanym pod siatką
po tapnięciu dnia, nie odrębnym ekranem, na który się nawiguje.

---

# 22. MVP — FUNKCJE OBOWIĄZKOWE (v2, zaktualizowane)

## SPLASH (nowość)

- [ ] statyczny obraz powitalny (dino + tekst, dostarczony przez klienta)
- [ ] przycisk z klimatycznym hasłem → START
- [ ] brak PIN, brak timera

## DATA

- [ ] Activity model (glyphIds[] — wiele glifów per dzień, opcjonalny czas,
      importance 0/1/2, photoUri)
- [ ] Glyph model (27 glifów, moodTag, requiresDuration per kategoria; bez isCustom/color)
- [ ] local JSON store
- [ ] create/edit/delete Activity
- [ ] zasada scalania: tap na dzień z istniejącą aktywnością = edycja, nie duplikat
- [ ] optional note, optional photo
- [x] assety graficzne — 27 glifów aktywności + 5 run emocji przygotowane (sekcja 25)

## START ("Zu'z Diary")

- [ ] struktura DNA — stała geometria (wektor, przygotowana raz)
- [ ] Emotional Tone Layer — podświetlenie stref na podstawie % nastroju (rolling 7 dni)
- [ ] pasma intensywności (multi-highlight)
- [ ] animacja idle — wolny obrót całości
- [ ] summary: total hours, meeting/message/gift/important count
- [ ] codzienny cytat (statyczna baza offline)
- [ ] 3 CTA: Dodaj Aktywność / Kalendarz / Timeline
- [ ] ikona ⚙ (bez ☰)

## CALENDAR

- [ ] month view, navigation, day numbers
- [ ] glyph rendering (Poziom 2, autorski styl)
- [ ] time rendering (jeśli aktywność go wymaga)
- [ ] note marker, photo marker
- [ ] day selection, add/edit/delete

## TIMELINE

- [ ] widok tygodniowy (domyślny) — punkt = dzień
- [ ] widok miesięczny (przełączany)
- [ ] ligatura (wspólny glow dla wielu aktywności dnia)
- [ ] tap event → detail

## DAY DETAIL

- [ ] lista aktywności, glify, czas, importance
- [ ] note marker + reveal note
- [ ] podgląd zdjęcia (jeśli istnieje)
- [ ] edit / delete / add activity

## ADD ACTIVITY

- [ ] mini-kalendarz do wyboru daty (tap, bez ręcznego wpisywania)
- [ ] glyph picker multi-select (zamknięty zestaw 27 glifów, bez "+")
- [ ] pole czasu OD/DO (scroll 00–23) — tylko jeśli którykolwiek zaznaczony glif
      ma `requiresDuration = true`
- [ ] wybór ważności (0/1/2)
- [ ] opcjonalna notatka
- [ ] opcjonalne zdjęcie (systemowy image picker)
- [ ] save jako jedna `Activity` z `glyphIds[]`

## USTAWIENIA

- [ ] Zacznij nową historię (z potwierdzeniem + auto-archiwizacją JSON)
- [ ] Archiwum (lista, eksport pliku, bez podglądu szczegółów)
- [ ] Eksportuj / Importuj dane (JSON)
- [ ] Źródło cytatu (statyczne — jedyna opcja w MVP)
- [ ] O aplikacji

---

# 23. MVP — CZEGO NIE ROBIMY (zaktualizowane, v2)

Nie implementować w MVP:

- [ ] login, backend, cloud sync
- [ ] wiele równoległych relacji / przełącznik relacji (model "jedna relacja + archiwum" — sekcja 10)
- [ ] PIN, biometria, szyfrowanie danych
- [ ] własne glify (żadna forma — ani kolor/kategoria, ani edytor graficzny)
- [ ] proceduralne ligatury (łączenie symboli w jeden znak)
- [ ] generowanie geometrii DNA z danych (struktura jest stała)
- [ ] normalizacja/agregacja węzłów przy dużych danych (nieaktualne — DNA nie renderuje
      pojedynczych węzłów per aktywność)
- [ ] online źródło cytatu/horoskopu (V2, opcjonalne)
- [ ] kopiowanie zdjęć do wewnętrznego storage, wiele zdjęć na dzień
- [ ] nieprzerwany scroll 365 dni na Timeline (V2, jeśli potrzebny po testach)
- [ ] social features, sharing, Apple Watch, widgets, AI analysis

---

# 24. DEFINITION OF DONE (v2)

MVP uznajemy za gotowe, kiedy użytkownik może:

1. Otworzyć aplikację i zobaczyć ekran SPLASH (dino + powitanie).
2. Tapnąć przycisk i przejść do START ("Zu'z Diary").
3. Zobaczyć strukturę DNA z podświetleniem odzwierciedlającym nastrój ostatniego tygodnia.
4. Zobaczyć podsumowanie i codzienny cytat.
5. Przejść do Kalendarza lub Timeline.
6. Dodać wydarzenie: wybrać glif, opcjonalnie ustawić czas (jeśli wymagany), ważność,
   notatkę, zdjęcie.
7. Zobaczyć wydarzenie w Kalendarzu i na Timeline (właściwy widok — tydzień/miesiąc).
8. Zobaczyć wpływ wydarzenia na podświetlenie struktury DNA (jeśli wpływa na % nastroju
   w oknie 7 dni).
9. Kliknąć wydarzenie, zobaczyć szczegóły, odkryć notatkę, zobaczyć zdjęcie.
10. Edytować / usunąć wydarzenie.
11. Wyeksportować dane do pliku JSON i zaimportować je z powrotem.
12. Zacząć nową historię (z automatyczną archiwizacją poprzedniej).

---

# 25. ASSETY GRAFICZNE — STATUS: PRZYGOTOWANE (v3: transparentność naprawiona)

**Ustalenie po audycie (naprawione, nie tylko zdiagnozowane)**: pierwsza partia plików
(oba zestawy) miała kanał alfa w 100% nieprzezroczysty na całej powierzchni — renderowały
się jako nieprzezroczyste czarne prostokąty z symbolem w środku, zamiast wtapiać się
w tło i poświatę pod spodem. **Naprawione algorytmicznie (luma-key, próg jasności) —
obowiązujące pliki to wersje `*_transparent`**, z realnie przezroczystym tłem, glow
zachowany. Sam rysunek i kolorystyka obu zestawów były od początku poprawne — problem
dotyczył wyłącznie kanału alfa, nie stylu czy koloru.

## Runy Emocji (Poziom 1 — struktura DNA)

5 plików (`runy_emocji_transparent`), gotowe, tło przezroczyste, dostarczone przez
klienta (styl: ozdobny, maksymalistyczny, mistyczny — priorytet: nastrój/magia, nie
natychmiastowa czytelność):

- `closeness.png` (BLISKOŚĆ)
- `longing.png` (TĘSKNOTA)
- `passion.png` (NAMIĘTNOŚĆ)
- `joy.png` (RADOŚĆ)
- `tension.png` (NAPIĘCIE)

Uwaga implementacyjna: obrazy są rastrowe (PNG), teraz z realną przezroczystością.
Do pełnej funkcjonalności podświetlania (Emotional Tone Layer, sekcja 6) w finalnej
aplikacji (React Native Skia) może być nadal potrzebna konwersja do wektora (SVG) lub
zastosowanie technik maskowania/tintowania rastra w czasie działania aplikacji — do
rozstrzygnięcia na etapie implementacji.

## Glify Aktywności (Poziom 2 — kalendarz / timeline / add activity)

27 plików (`glify_aktywnosci_transparent`), gotowe, tło przezroczyste, nazwane zgodnie
z `id` z modelu `Glyph`, pokolorowane zgodnie z przypisanym tagiem nastroju (sekcja 6):

```
first_message, message, phone, video_call, ghosting, reconnect,
swipe, match, tinder_installed, invitation,
coffee, dinner, drink, walk, picnic, cinema, concert, trip, night,
important_talk, argument, reconciliation, intimate_moment, breakup,
gift, flowers, surprise
```

**Uwaga**: dla glifu `drink` przygotowano dwa warianty graficzne
(`drink_OPTION_wine.png` i `drink_OPTION_cocktail.png`) — decyzja, który zostaje
w finalnej aplikacji, jest odłożona do etapu implementacji/testów wizualnych.
Traktować jak dowolny inny element wizualny: jeśli po zobaczeniu w realnym
kontekście (mała komórka kalendarza) jeden z wariantów nie będzie pasował,
podmienić na drugi — to nie wymaga zmian w kodzie, tylko w assecie.

## Punkt kontrolny do etapu implementacji (nierozstrzygnięty teraz, świadomie)

Grubość kreski glifów aktywności została zaprojektowana jako cienka, elegancka linia.
Nie zweryfikowano jeszcze, czy pozostaje czytelna po przeskalowaniu do rzeczywistego
rozmiaru komórki kalendarza na ekranie telefonu. **Decyzja projektowa**: zostawiamy
jak jest, testujemy w realnym kontekście podczas implementacji, i jeśli okaże się
nieczytelna — podmieniamy assety na wersję z grubszą kreską (jednowierszowa zmiana
w prompt do generatora, nie wymaga zmian koncepcyjnych w tym dokumencie).

---

# 26. OSTATECZNA ZASADA

> **FACT → GLYPH → TIMELINE / CALENDAR → GALAXY (stała forma + żywy nastrój) → MEMORY**

**Activity** jest faktem. **Glyph** jest jego symbolem (z dwóch odrębnych, ale spójnych
stylistycznie poziomów — run emocji i glifów aktywności). **Calendar** i **Timeline**
pokazują fakty w czasie. **Relationship DNA** jest stałym, zaprojektowanym raz odciskiem
całej historii, którego jedynym żywym elementem jest podświetlenie nastroju. **Note**
i **zdjęcie** pokazują pamięć ukrytą pod symbolem.

To jest rdzeń produktu w wersji 2.
