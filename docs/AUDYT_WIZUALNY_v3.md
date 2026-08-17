# Audyt wizualny v1 vs mockup — fakty, rozbieżności, poprawki do MD v3

Dokument roboczy. Cel: rozstrzygnąć, co dokładnie nie zagrało w pierwszej
implementacji (branch `claude/mobile-apk-md-ogynun`), które elementy to
**bugi do naprawienia w kodzie bez zmiany specyfikacji**, a które to
**luki/niejasności w samym MD v2**, wymagające decyzji przed napisaniem MD v3.

Metoda: porównałem realne zrzuty ekranu z implementacji z dwoma zestawami
mockupów w pełnej rozdzielczości (1536×1024, wyciągnięte z historii
konwersacji), spróbkowałem piksele obu (kolory, przezroczystość), i
zweryfikowałem faktyczną zawartość dostarczonych plików graficznych (27
glifów + 5 run) na poziomie kanału alfa. Nie zgaduję — każdy punkt niżej
oznaczony **[FAKT]** jest zmierzony/zweryfikowany, nie oceniony "na oko".

---

## 0. Najważniejsze odkrycie: mamy DWA niespójne ze sobą mockupy

Dostałem w tej konwersacji dwa różne zestawy obrazów referencyjnych:

- **Mockup A** ("1. START – DNA CAŁEJ ZNAJOMOŚCI / 2. TIMELINE / 3. KALENDARZ",
  ekran START podpisany **"OUR TRACE"**) — wygląda na nowszą, dopracowaną
  wersję koncepcyjną. Przyciski: pełny złoty pill "+ DODAJ AKTYWNOŚĆ" +
  outline pill "KALENDARZ" — **to dokładnie odpowiada temu, co opisuje MD
  v2 sekcja 5**.
- **Mockup B** ("RELACYJNY KALENDARZ – KONCEPT APLIKACJI", ekran START
  podpisany po prostu **"START"**, z ikoną ☰ menu) — jego własny opis
  tekstowy w rogu mówi wprost: *"Każda relacja ma swój unikalny wzór
  generowany z całej historii. Im więcej wydarzeń, tym bardziej złożona
  forma."* To jest **dokładnie ten model proceduralny, który MD v2 sekcja 4
  świadomie odrzuca** ("Struktura... jest stała i niezmienna... Nie
  generujemy jej proceduralnie z danych"). Mockup B ma też ikonę ☰, którą
  MD v2 sekcja 5 explicité usuwa. Innymi słowy: **Mockup B to zamrożony
  obraz koncepcji v1, którą MD v2 tekstowo unieważnił.**

**[FAKT]** MD v2 nigdy nie mówi, który z tych dwóch obrazów jest "tym
jedynym" mockupem, o którym mówi zasada z linii 10 ("MOCKUP = VISUAL SOURCE
OF TRUTH"). Ja w praktyce mieszałem oba, budując z tekstu MD v2 (5 stałych
stref) i podpierając się stylistycznie obydwoma obrazami na raz — stąd
niespójny efekt.

**Rekomendacja do MD v3:** wybrać jawnie **Mockup A jako jedyne źródło
prawdy wizualnej** dla ekranów START / TIMELINE / KALENDARZ / ADD ACTIVITY
(bo jest spójny z tekstem MD v2). Mockup B zostaje jako materiał
pomocniczy **tylko** tam, gdzie Mockup A nie pokazuje danego ekranu wcale
— czyli wyłącznie dla **DAY DETAIL** (którego Mockup A w ogóle nie zawiera).
To wymaga jawnego zdania w MD v3, np.: *"Mockup A jest jedynym wiążącym
źródłem wizualnym. Mockup B jest historyczny/poglądowy i obowiązuje tylko
dla elementów nieobecnych w Mockupie A (Day Detail)."*

---

## 1. [FAKT] Dostarczone assety graficzne nie mają przezroczystości

Sprawdziłem kanał alfa bezpośrednio na pikselach (nie na typie pliku):

```
assets/runes/closeness.png   → alpha = 255 na całej próbce (łącznie z rogami)
assets/glyphs/coffee.png     → alpha = 255 na całej próbce
assets/glyphs/gift.png       → alpha = 255 na całej próbce
```

To są pliki w trybie RGBA (mają kanał alfa jako taki), ale **kanał alfa
jest w 100% nieprzezroczysty na całej powierzchni obrazu**. To NIE są
wycięte symbole na przezroczystym tle — to małe kwadratowe obrazki z
zapisanym na sztywno, prawie czarnym tłem (róg to np. RGB(0,0,0) albo
RGB(19,14,8), zawsze przy alpha=255).

**Konsekwencja:** każdy glif/runa renderuje się jako nieprzezroczysty
czarny/prawie-czarny prostokąt z symbolem w środku, zamiast wtapiać się w
tło i poświatę pod spodem. To tłumaczy większość zgłoszonych "czarnych
kwadratów" na Kalendarzu, Timeline, Add Activity i DNA.

**Dobra wiadomość [FAKT]:** sam **rysunek i kolorystyka** glifów są
poprawne i zgodne z MD sekcja 13 — sprawdziłem to bezpośrednio, próbkując
dominującą barwę każdego pliku:

| Tag nastroju | Zmierzony kolor (rune) | Zmierzony kolor (przykładowy glyph) | Zgodność z sekcją 13 MD |
|---|---|---|---|
| BLISKOŚĆ | `#EFA52C` (closeness) | `#FFCF10` (coffee) | ✅ złoty |
| TĘSKNOTA | `#3DF0EA` (longing) | `#79EDEE` (phone) | ✅ cyan/turkus |
| NAMIĘTNOŚĆ | `#E540A8` (passion) | `#F46BAC` (intimate_moment) | ✅ róż/magenta |
| RADOŚĆ | `#A474E4` (joy) | `#AD6DFB` (gift) | ✅ fiolet |
| NAPIĘCIE | `#C4513F` (tension) | `#FF4C02` (argument) | ✅ rdzawa czerwień/pomarańcz |

Styl rysunku (cienka świecąca linia neonowa) też zgadza się z wymogiem z
sekcji 13 ("cienkie, świecące linie, geometryczne, niedosłowne"). **Nie ma
tu problemu ze stylem assetów — jest wyłącznie problem z brakiem
przezroczystości tła.**

**Rekomendowana naprawa (do wyboru, wpisać decyzję w MD v3):**

- **Opcja A (najlepsza, wymaga kontaktu z grafikiem/generatorem):**
  poprosić o re-eksport tych samych 32 plików z realną przezroczystością
  (usunięte tło zamiast wypełnionego czarnym).
- **Opcja B (da się zrobić bez nowych plików):** algorytmiczne usunięcie
  tła po naszej stronie — tło jest w każdym pliku bardzo blisko czerni
  (RGB ~0–25) na całej krawędzi, a sama linia jest jasna i nasycona, więc
  prosty próg jasności (chroma/luma key) powinien czysto oddzielić linię
  od tła bez utraty jakości. To jednorazowy skrypt do przetworzenia 32
  plików, nie wymaga zmian koncepcyjnych w MD.

---

## 2. Ekran START — DNA / galaktyka

### Czego faktycznie oczekuje Mockup A (opis strukturalny z próbkowania obrazu)

To NIE jest 5 punktów połączonych liniami. To, co faktycznie widać w
Mockupie A ("OUR TRACE"):

- **Rdzeń**: bardzo gęsto upakowane, wąskie koncentryczne pierścienie (na
  oko kilkanaście–dwadzieścia, nie 3–4), tworzące jasny "punkt centralny"
  z efektem głębi, nie 4 przerywane kółka.
- **4–5 dużych, zachodzących na siebie ŁUKÓW/ORBIT** (okręgi o różnych
  promieniach, środki NIE pokrywają się ze środkiem rdzenia — stąd wrażenie
  "spirografu"/zazębiających się kręgów), każdy w innym kolorze
  dominującym (złoty, różowo-magenta, turkusowo-zielony, fioletowy).
  Łuki się PRZECINAJĄ, nie są to odrębne "szprychy" z jednego centrum.
- Na każdym łuku: sznur kropek o różnej wielkości (jak korale), a w kilku
  miejscach większe "huby" — małe kółka z cienkim symbolem-linią w środku
  (miniaturowe, może 5–8% szerokości ekranu), z których promieniście
  odchodzą cienkie "kolce" (jak rozbłysk gwiazdy).
- Dodatkowo: pojedyncze, niepodłączone do niczego małe symbole/kształty
  (romby, plusy, ikonki) rozrzucone w tle jako czysta dekoracja.
- Całość: gęsta, "żywa", przechodzi jeden kolor w drugi płynnie przez
  nakładanie się łuków — nie ma ostrych, osobnych "5 planet".

### Co dostarczyłem

5 węzłów w stałych pozycjach co 72° (pięciokąt), proste szprychy od
jednego centralnego punktu do każdego węzła, 4 cienkie przerywane
pierścienie w rdzeniu, cienki pięciokątny obrys łączący węzły. Brak
zachodzących na siebie łuków, brak dodatkowych kropek/korali na "orbitach"
węzłów w liczbie i gęstości z mockupu, brak dekoracyjnych pływających
symboli w tle poza generycznym starfieldem.

### Rozbieżność i jej źródło

To nie jest bug — to inna, dużo uboższa geometria niż w mockupie, i wynika
wprost z decyzji tekstowej w **MD v2 sekcja 4**: *"Struktura ma z góry
zaprojektowane strefy (np. 5, odpowiadające 5 tagom nastroju), każda
niezależnie kolorowalna."* Zbudowałem dosłownie "5 stref" z tekstu, a nie
gęstą, wielołukową kompozycję z obrazka. Sekcja 4 MD i "MOCKUP = VISUAL
SOURCE OF TRUTH" z linii 10 stoją tu w realnym konflikcie, którego MD sam
nie rozstrzyga.

**To jest do pogodzenia bez łamania decyzji "struktura jest stała":**
"stała" ≠ "prosta". Można zaprojektować RAZ, na sztywno, dużo bogatszą
geometrię (więcej łuków, więcej kropek/korali na orbitach, radiujące
kolce z hubów, warstwa dekoracyjnych mikro-symboli w tle) — to wciąż będzie
JEDNA, niezmienna struktura, tylko bogatsza niż moje 5 szprych. Zmienną
sterowaną danymi w dalszym ciągu jest wyłącznie podświetlenie/kolor, nie
liczba elementów.

### Co dopisać w MD v3 (konkretnie)

- Liczba głównych łuków/orbit i ich przybliżona geometria (min. 4,
  zachodzące na siebie, nie współśrodkowe).
- Liczba "koralów"/kropek na każdym łuku (rząd wielkości: kilkanaście).
- Że huby-węzły mają mieć promieniste "kolce" wychodzące na boki, nie tylko
  gołą poświatę.
- Że w tle mają być dodatkowe, niepodłączone mikro-symbole dekoracyjne
  (nie tylko gwiazdy-kropki).
- Że rdzeń centralny ma być gęsto pierścieniowy (rząd wielkości: kilkanaście
  wąskich pierścieni), nie 3–4.
- Rozstrzygnięcie: czy ta bogatsza geometria jest **jedna, ręcznie
  zaprojektowana** (mój rekomendowany kierunek — spójne z sekcją 4) czy
  klient akceptuje uproszczoną wersję i akceptuje, że odstaje od mockupu.

---

## 3. Kalendarz

### Mockup A — komórka dnia z wydarzeniem

Numer dnia w lewym górnym rogu komórki (mały, subtelny). Pod nim, na
środku komórki: **jedna** czytelna ikona glifu (bez żadnego dodatkowego
pierścienia/łuku wokół numeru dnia). Pod ikoną: mały podpis czasu, np.
"6h", zwykłym szarym tekstem. Kropka-notatka jako osobny, malutki punkt
przy numerze dnia (nie w osobnym "wierszu markerów" pod spodem). Układ jest
bardzo przewiewny — 3 elementy na komórkę, nie 5.

### Co dostarczyłem

Dodałem **własny, niewystępujący w mockupie ani w MD element**: cienki łuk
SVG ("pierścień czasu") owinięty wokół numeru dnia, którego długość ma
zależeć od liczby godzin. To wymyśliłem sam, bo w MD sekcja 9 jest
lakoniczna ("Czas, tylko jeśli aktywność go wymaga") — nie sprawdziłem
tego pomysłu względem mockupu, więc wylądował jako dodatkowa warstwa
konkurująca o miejsce w komórce ~59×59px z numerem dnia, ikoną, czasem i
markerami notatki/zdjęcia. Stąd "elementy nie w tych miejscach, w których
powinny" — bo upchnąłem więcej niż mockup w tej samej przestrzeni, plus
ikony i tak są nieczytelne przez brak przezroczystości (punkt 1).

### Co dopisać w MD v3

- Wprost usunąć/nie wprowadzać pomysłu "pierścienia czasu" wokół numeru
  dnia — w mockupie go nie ma, MD go nie wymaga.
- Doprecyzować układ komórki co do kolejności/pozycji: numer dnia (róg) →
  jedna ikona/ligatura (środek) → opcjonalny podpis czasu (pod ikoną) →
  kropka notatki jako mały punkt przy numerze dnia, nie osobny wiersz
  markerów na dole komórki.
- Zdjęcie: mockup w ogóle nie pokazuje odrębnego markera zdjęcia w
  komórce miesiąca — MD sekcja 16 mówi, że w komórce ma być "tylko mały
  marker/ikona", ale mockup żadnego takiego markera nie ma na żadnym dniu.
  Do ustalenia: czy w ogóle chcemy marker zdjęcia w komórce, czy to
  informacja widoczna wyłącznie w Day Detail.

---

## 4. Timeline

### Mockup A

Gruba **wstęga zmieniająca kolor wzdłuż linii** (gradient: złoty →
różowy → turkusowy → różowy, śledzący nastrój pobliskich wydarzeń), nie
jednolity kolor. Wzdłuż niej: gęsty łańcuszek małych kropek (jak
korale/nić), większe świecące węzły przy faktycznych wydarzeniach, a przy
wydarzeniach oznaczonych jako ważne — dodatkowy przerywany okrąg wokół
węzła. Etykiety (data + ikona + krótki tekst) stoją na przemian
lewo/prawo, z dużym naturalnym marginesem.

### Co dostarczyłem

Jeden, płaski, jednolicie złoty stroke 1.5px, małe kropki (2.5–5px), bez
gradientu koloru wzdłuż ścieżki, bez poświaty/glow wokół punktów, szare
(nie kolorowe) podpisy tekstowe. To nie jest błąd wykonania — to efekt,
którego po prostu nie zaimplementowałem (gradient wzdłuż path w SVG to
dodatkowa technika, `linearGradient`/`gradientUnits="userSpaceOnUse"` z
wieloma stopami zależnymi od koloru sąsiednich wydarzeń — nie napisałem
tego kodu w ogóle).

### Co dopisać w MD v3

- Explicite: linia ma mieć **gradient koloru zależny od nastroju sąsiednich
  wydarzeń**, nie jednolity kolor.
- Explicite: węzły mają mieć widoczną poświatę (halo), nie gołą kropkę.
- Explicite: "ważne" wydarzenie = dodatkowy przerywany okrąg wokół węzła
  (to akurat już mam w legendzie mojej implementacji, ale sam efekt
  wizualny wypadł słabo przez brak przezroczystości ikon w środku).

---

## 5. Add Activity

To jest ekran z największą rozbieżnością interakcji, nie tylko wyglądu.

### Mockup A — realny układ (spory panel na dole ekranu, nie cały ekran)

- Siatka glifów: **zaokrąglone kwadraty z cienką ramką**, ikona wewnątrz,
  ciemne wypełnienie, **bez podpisu tekstowego pod ikoną**. 2 rzędy,
  wszystkie glify widoczne na raz bez przewijania. Zaznaczony glif =
  dodatkowa złota ramka/poświata wokół kwadratu.
- Czas: dwa zaokrąglone pola tekstowe obok siebie, "OD 14:00" i "DO 20:00",
  wyglądające jak zwarty, **stały element panelu**, nie pełnoekranowy
  wheel. (To nie wyklucza reguły z sekcji 8 "wybór wyłącznie przez
  scroll/wheel" — to prawdopodobnie **zwinięty odczyt**, który po tapnięciu
  otwiera wheel, a po wyborze wraca do tego zwartego widoku).
- Notatka: jedno wąskie pole na dole panelu, zawsze widoczne.
- Zapis: duży, okrągły, złoty przycisk z checkmarkiem, pływający po
  prawej stronie panelu (FAB), nie pełnoszerokościowy pill na dole strony.
- **Data w ogóle nie jest widoczna w tym widoku panelu.** To silna
  przesłanka, że wybór daty to osobny, zwinięty element (np. mały "chip"
  z aktualnie wybraną datą), który rozwija się w kalendarz po tapnięciu i
  **zwija z powrotem po wybraniu dnia** — dokładnie to, o co prosiłeś w
  poprzedniej wiadomości, i dokładnie czego mockup nie pokazuje jako
  rozłożonego na stałe.

### Co dostarczyłem

Osobny, pełny ekran (nie panel/bottom sheet) ze WSZYSTKIM rozłożonym na
raz i na stałe, w kolejności z sekcji 8 MD: pełny miesięczny mini-kalendarz
(6 wierszy, cały czas rozwinięty) → siatka 27 glifów pogrupowana w 5
kategorii **z podpisem tekstowym pod każdą ikoną** (znacznie więcej pionu
niż w mockupie) → warunkowy wheel czasu (pełnoekranowy, nie zwarte pola) →
ważność → notatka → zdjęcie → pełnoszerokościowy przycisk "Zapisz" na
samym dole. Efekt: bardzo długi scroll, żaden fragment nie przypomina
zwartego panelu z mockupu.

### Skąd ta rozbieżność

Trzymałem się dosłownie kolejności kroków z MD sekcji 8 ("krok po kroku")
i zbudowałem to jakoліniowy, w pełni rozwinięty formularz — nie
zauważyłem, że mockup pokazuje **dokładnie te same dane** w formie
zwartego, częściowo zwiniętego panelu z jednym floating-FAB, i że MD
sekcja 8 nigdy nie mówi wprost "wszystko ma być widoczne na raz, na cały
ekran". "Krok po kroku" dało się zrealizować jako panel z sekcjami, które
się zwijają/rozwijają, i to najwyraźniej było zamiarem za mockupem.

### Co dopisać w MD v3 (to jest chyba najważniejsza poprawka w całym audycie)

- Add Activity to **panel (bottom sheet), nie osobny pełny ekran** —
  zgodnie zresztą z tym, jak w Kalendarzu/Timeline traktowany jest już
  dziś jako `presentation: 'modal'`, tylko potraktowany jako pełnoekranowy
  modal zamiast jako częściowej wysokości sheet.
- **Data**: domyślnie zwinięta do jednej linijki/chipa z aktualną datą.
  Tap → rozwija mini-kalendarz. Wybór dnia → automatyczny powrót do
  zwiniętego stanu z nową datą.
- **Glify**: siatka bez podpisów tekstowych pod ikonami (nazwa glifu
  widoczna np. przez long-press/tooltip albo w ogóle nie — do ustalenia),
  żeby zmieścić 27 glifów w 2–3 rzędach bez przewijania.
- **Czas**: domyślnie zwarty odczyt "OD hh:mm — DO hh:mm" jako dwa pola;
  tap na pole → rozwija wheel wyłącznie dla tego pola, wybór → zwija z
  powrotem do odczytu. (Reguła "tylko scroll/wheel" z sekcji 8 zostaje,
  zmienia się tylko to, że wheel nie stoi rozwinięty na stałe.)
- **Zapis**: floating okrągły przycisk z checkmarkiem, nie pełnoszerokościowy
  pill.
- Ważność i zdjęcie: mockup ich nie pokazuje w tym konkretnym kadrze — do
  ustalenia, czy wjeżdżają jako dodatkowy, zwijany segment panelu, czy
  zostają tam gdzie są (to jest otwarte pytanie, nie mam na nie odpowiedzi
  z samego obrazka).

---

## 6. Day Detail

Mockup A nie pokazuje tego ekranu w ogóle — jedyne źródło to **Mockup B**
(ten "unieważniony" tekstowo, ale to jedyny materiał wizualny, jaki mamy
dla tego widoku). Sam układ z Mockupu B (dwie kolumny: glify+czas po
lewej, notatka po prawej z przyciskiem "Odkryj notatkę") zaimplementowałem
w miarę wiernie w jednokolumnowym układzie mobilnym — to jeden z powodów,
dla których to jedyny ekran, który oceniłeś jako "może być".

**Do ustalenia w MD v3:** czy dwukolumnowy układ z Mockupu B (glify+czas |
notatka) ma zostać odtworzony dosłownie na telefonie (osobne panele obok
siebie, węższe), czy mój jednokolumnowy układ (glify+czas, potem notatka
pod spodem) jest akceptowalny — na szerokości telefonu dwie kolumny obok
siebie byłyby bardzo ciasne.

---

## 7. Paleta kolorów — zmierzone wartości

| Rola | Zmierzone z mockupu/assetów | Użyte w kodzie | Ocena |
|---|---|---|---|
| Tło appki | `#050608` (róg ekranu, Mockup A) | `#05040A` | ✅ praktycznie identyczne, zostawić |
| Akcent UI / przyciski (pill, obramowania) | `#D1A262` (uśredniony odczyt z wypełnienia przycisku "DODAJ AKTYWNOŚĆ", Mockup A) | `#E9B54D` | ⚠️ mój jest bardziej nasycony/żółty niż stonowany "szampański" złoty z mockupu — do rozważenia zmiana |
| BLISKOŚĆ (glow/mood) | `#EFA52C`–`#FFCF10` (zmierzone z realnych assetów) | `#E9B54D` | ⚠️ mój jest zbyt zbliżony do UI-akcentu — patrz uwaga niżej |
| TĘSKNOTA | `#3DF0EA`–`#79EDEE` | `#4DD8E0` | ✅ dobrze skalibrowane |
| NAMIĘTNOŚĆ | `#E540A8`–`#F46BAC` | `#E85FA6` | ✅ dobrze skalibrowane |
| RADOŚĆ | `#A474E4`–`#AD6DFB` | `#B07CF0` | ✅ dobrze skalibrowane |
| NAPIĘCIE | `#C4513F`–`#FF4C02` | `#D8593A` | ✅ w akceptowalnym zakresie |

**Konkretna uwaga do MD v3:** w samym mockupie funkcjonują **dwa różne
złote** — stonowany, "szampański" złoty do elementów UI (przyciski,
obramowania, nagłówki) i dużo bardziej nasycony, neonowy złoty do
glow/mood BLISKOŚĆ. W moim kodzie jest to jeden i ten sam kolor
(`colors.gold`), co teoretycznie jest OK dla spójności UI, ale odbiera
strefie BLISKOŚĆ na DNA jej własną tożsamość wobec reszty interfejsu. Do
decyzji: rozdzielić na `colors.gold` (UI) i osobny, bardziej neonowy
`moodColors.BLISKOSC`.

---

## 8. Co jest już dobre i NIE wymaga zmian

Żeby nie zgubić proporcji — te elementy potwierdziłem jako zgodne i warte
zachowania w MD v3 bez zmian:

- Kolor tła appki.
- Kolorystyka i styl rysunku wszystkich 27 glifów + 5 run — poprawne,
  zgodne z sekcją 13, jedyny problem to brak przezroczystości (punkt 1).
- Kalibracja kolorów mood-tagów poza BLISKOŚĆ (patrz tabela wyżej).
- Ogólna struktura nawigacji (Splash → START → Kalendarz/Timeline → Day
  Detail, + Ustawienia) — to nie było kwestionowane.
- Ekran Ustawień — brak w mockupach bogatszego wzorca, moja generyczna
  lista nie ma się o co potknąć.

---

## 9. Otwarte pytania, których nie mogę sam rozstrzygnąć

1. Czy Mockup A rzeczywiście ma być jedynym wiążącym źródłem (sekcja 0),
   czy jest jeszcze inny, bardziej aktualny materiał, którego nie widziałem?
2. DNA/galaktyka: bogatsza, ale wciąż statyczna geometria (mój rekomendowany
   kierunek) — czy akceptujesz zwiększenie zakresu prac nad tym ekranem, czy
   wolisz świadomie uprościć i odejść od mockupu?
3. Assety: prosimy grafika o re-eksport z przezroczystością, czy robimy
   background-removal algorytmicznie po naszej stronie (punkt 1)?
4. Add Activity jako collapsible bottom sheet (punkt 5) — czy to kierunek,
   który potwierdzasz?
5. Day Detail — układ jednokolumnowy (mój) czy próba odtworzenia
   dwukolumnowego z Mockupu B mimo węższego ekranu telefonu?
6. Złoty UI-akcent vs złoty BLISKOŚĆ — rozdzielić na dwa różne kolory (punkt 7)?

Dokument nie został jeszcze scommitowany — czekam na Twoje decyzje w
punkcie 9, żeby MD v3 pisać raz, a nie iteracyjnie nadpisywać.
