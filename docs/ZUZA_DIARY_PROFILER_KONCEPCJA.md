# ZUZA DIARY --- PROFILER

## Status

Ustalona koncepcja robocza do dalszego projektowania UI, assetów i
implementacji w Expo/React Native.

## 1. Rola Profilera

Profiler nie jest kolejnym dashboardem statystycznym.

Łączy dwie perspektywy:

1.  **RELATIONSHIP DNA** --- automatyczny profil relacji wyliczany z
    aktywności zapisanych w Calendar / Evidence.
2.  **THE LID** --- subiektywna ocena mężczyzny wykonywana przez
    użytkowniczkę.

Na końcu powstaje **THE LID PREVIEW** --- pokręcona, humorystyczna
diagnoza/profil faceta.

Zasada: dane pochodzą z aplikacji, interpretacja może być absurdalna.

## 2. Struktura

Tylko cztery główne ekrany:

1.  **PROFILER** --- ekran wejściowy
2.  **RELATIONSHIP DNA**
3.  **THE LID**
4.  **THE LID PREVIEW**

Nie tworzymy osobnych ekranów Trend, Case Snapshot, The Gap, Full
Analysis, Diagnosis History ani Field Notes. Jeśli takie elementy będą
potrzebne, są sekcjami istniejących ekranów.

## 3. PROFILER --- wejście

Funkcja: hub Profilera.

Zawartość: - klimatyczna tapeta, - `PROFILER`, - krótki tekst, - dwa
główne wejścia: `RELATIONSHIP DNA` i `THE LID`, - opcjonalnie numer
sprawy / nazwa przypadku.

Klimat: dark investigative / case file, grunge, stare dokumenty, papier,
stemple, taśma, dokumentacja. Można mocniej wykorzystać dinozaury,
szczególnie Spinozaura i Ankylozaura.

Nie przeładowywać dekoracją.

## 4. RELATIONSHIP DNA

Automatyczny profil relacji wynikający z zapisanych aktywności. To
fikcyjny, humorystyczny algorytm, nie naukowa diagnoza.

Podstawowe parametry: - `CONTACT` - `EFFORT` - `CHEMISTRY` - `CHAOS` -
`MYSTERY` - `EVIDENCE`

Wartości prezentowane jako 0--100%.

Każda aktywność może wpływać na kilka parametrów, np.:

-   MEETING → CONTACT, EFFORT, CHEMISTRY
-   CALL → CONTACT, EFFORT, CHEMISTRY
-   DM / MESSAGE → CONTACT, CHEMISTRY
-   GIFT → EFFORT, CHEMISTRY, MYSTERY
-   INCIDENT → CHAOS, MYSTERY, EVIDENCE
-   NOTE → EVIDENCE, MYSTERY

Dokładne wagi zostaną ustalone osobno.

### CASE EQUATION

Pokazuje: - liczbę dni znajomości, - liczbę aktywności, - liczbę
Evidence, - liczbę Incidents, - aktywności / dzień.

Liczba dni jest dynamiczna i zwiększa się codziennie od pierwszego dnia
znajomości.

Nie używać wykresów kołowych ani klasycznych wykresów trendu.

DNA powinno być charakterystycznym assetem graficznym, a liczby i teksty
powinien nakładać kod.

Na ekranie może pojawić się krótki `SYSTEM COMMENT` / `FIELD NOTE` z
puli, zawsze sensowny względem danych.

## 5. THE LID

Subiektywna ocena faceta przez użytkowniczkę.

Nie robimy klasycznego quizu z pytaniami.

Mechanizm: zestaw suwaków 1--5. Użytkowniczka tylko przesuwa / ustawia
wartości.

Robocza lista cech: - ROMANTYCZNY - OPIEKUŃCZY - SZCZERY -
KONSEKWENTNY - INICJATYWA - HUMOR - PEWNOŚĆ SIEBIE - DRAMA POTENTIAL -
TAJEMNICZOŚĆ - CHEMIA

Lista może zostać skrócona lub zmieniona.

Każdy poziom może mieć krótki, humorystyczny opis.

Nie potrzebujemy klasycznego `SAVE`; wartości mogą być zapisywane
automatycznie jako stan profilu.

Na dole powinien być przycisk prowadzący do wyniku, np.
`RUN THE ANALYSIS`.

## 6. THE LID PREVIEW

Wynik oceny użytkowniczki.

Zawartość: - `THE LID PREVIEW`, - PRIMARY TYPE / główny archetyp, -
ilustracja przypisana do wyniku, - krótki opis, - SECONDARY TRAIT, -
THREAT LEVEL, - FIELD NOTE.

Ilustracja przedstawia jego archetyp, a nie „DNA związku".

Możliwe są różne stworzenia / motywy, szczególnie Spinozaur i
Ankylozaur. Ilustracje muszą być osobnymi assetami, aby kod mógł je
podmieniać zależnie od wyniku.

## 7. Field Notes i humor

Field Notes nie są osobnym ekranem.

Mają być krótkie, absurdalne, ironiczne, pseudo-naukowe lub
detektywistyczne. Mogą być kontekstowe względem danych, archetypu lub
aktywności.

Najważniejsze: nie mogą być pustym randomem.

Profiler ma być jednym z najbardziej humorystycznych miejsc aplikacji.

## 8. Easter Eggs

Easter Eggs mogą zależeć od: - typu aktywności, - kombinacji
aktywności, - wartości DNA, - wyników THE LID, - liczby Incidents, -
liczby Gifts, - braku aktywności, - konkretnych kombinacji cech.

Przykładowy kierunek: - `EVIDENCE DISAGREES.` - `CITATION NEEDED.` -
`THE SYSTEM HAS STOPPED PRETENDING THIS IS SCIENCE.` -
`SUSPICIOUS AMOUNT OF GIFTS DETECTED.` -
`FURTHER INVESTIGATION REQUIRED.`

Easter Eggs powinny mieć reguły i kontekst, a nie być wyłącznie
losowane.

## 9. Assety i implementacja

Zasada:

**Grafika = klimat + stała konstrukcja.** **Kod = dane + tekst +
wartości + stan.**

Nie generować całych dynamicznych ekranów jako jednej płaskiej grafiki.

Potrzebne będą m.in.: - backgroundi, - DNA graphic, - papierowe /
dokumentowe ramki, - dekoracje, - elementy sliderów, jeśli nie zostaną
wykonane w kodzie, - osobne ilustracje archetypów, - Field Note card.

Kod ma wstawiać: - procenty, - liczby, - teksty, - wartości sliderów, -
archetypy, - threat level, - Field Notes.

## 10. Styl wizualny

Profiler pozostaje częścią ZUZA DIARY.

Bazowe cechy: - bardzo ciemne tło, - czernie / ciemne brązy, - papier /
pergamin jako akcent, - subtelny grunge, - case file / investigative
aesthetic, - czerwone akcenty, - czytelna typografia, - wyraźna
hierarchia.

W Profilerze można użyć nieco jaśniejszych akcentów i większej liczby
ilustracji dinozaurów.

Dinozaury mają funkcję narracyjną, nie są przypadkową dekoracją.

Priorytet: **czytelność \> dekoracja**.

## 11. Safe zone

Każdy ekran musi uwzględniać: - safe area góry, - safe area dołu, -
systemowe elementy telefonu, - różne wysokości ekranów.

Nie projektować grafiki tak, jakby cała powierzchnia ekranu była
dostępna dla aplikacji.

## 12. Czego nie robimy

Nie dodajemy bez potrzeby: - kolejnych dashboardów, - wykresów
kołowych, - wykresów trendu, - osobnej historii diagnoz, - osobnego
ekranu Field Notes, - osobnego ekranu The Gap, - wieloetapowych
quizów, - rozbudowanych formularzy, - ekranów istniejących tylko
dlatego, że mogą być „fajne".

Każdy ekran musi mieć konkretną funkcję.

## 13. Sedno koncepcji

**RELATIONSHIP DNA:** co wynika z tego, co faktycznie wydarzyło się
między nimi?

**THE LID:** jak użytkowniczka ocenia tego faceta?

**THE LID PREVIEW:** jaki absurdalny profil wynika z tej oceny?

To fikcyjny system profilowania faceta oparty na danych z relacji i
subiektywnej ocenie użytkowniczki --- z dużą dawką humoru, Easter Eggs i
stylu ZUZA DIARY.

## 14. Do dalszego dopracowania

1.  Wagi punktowe wszystkich aktywności.
2.  Normalizacja DNA.
3.  Finalna lista cech THE LID.
4.  Opisy poziomów 1--5.
5.  Mapowanie suwaków → archetyp.
6.  Lista archetypów i ilustracji.
7.  Sposób wyliczania Threat Level.
8.  Reguły Easter Eggs.
9.  Duża pula Field Notes.
10. Dokładny asset pack czterech ekranów.
