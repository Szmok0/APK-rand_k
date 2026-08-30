// GIFT-BUILD SEED — real activities the product owner typed up in the
// desktop/web preview, exported via Settings -> Export, and handed over to
// be baked into a one-off build for a friend (not committed as "fake test
// data" — this is real content the product owner wrote, just entered via
// keyboard instead of a phone).
//
// Wiring: src/store/RelationshipStore.tsx loads this ONLY when AsyncStorage
// is completely empty (a genuinely fresh install) — see the cold-start
// effect there. Leave SEED_ACTIVITIES as [] for a normal, empty-by-default
// build (this file's own default anyone else building from this branch
// gets); populate it (as below) only for a specific one-off gift build,
// then revert to [] afterward so the branch goes back to shipping empty
// by default.
//
// One dropped field: the picnic/match entry (2026-08-03) originally had a
// photoUri pointing at a browser blob: URL from the web preview session —
// that URL only exists inside that one browser tab and can never resolve
// on a phone, so it was removed rather than shipped broken. Send the real
// photo file separately if it should be restored (that needs bundling it
// as a real asset, a separate small change).
//
// Markdown syntax (###, **, >) from the original notes was stripped before
// embedding — the note screen renders plain Text, no Markdown parser, so
// the literal punctuation would have shown up in the app instead of being
// interpreted.

import type { Activity } from '@/types/models';

export const SEED_ACTIVITIES: Activity[] = [
  {
    "id": "mtfki6pr-qr46rap",
    "date": "2026-08-04",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "first_message"
    ],
    "note": "CASE #001 — PIERWSZY KONTAKT\n\nStatus: wydarzyło się.\nPrawdopodobieństwo, że było to przewidziane: 0,3%\nPrawdopodobieństwo, że swipe right miał konsekwencje: 100%\n\nDzień wcześniej wykonała niewinny ruch palcem w prawo.\n\nTak przynajmniej wtedy uważała.\n\nNie wiedziała jeszcze, że historia ludzkości zna już podobne przypadki.\n\nJabłko Newtona.\nKoń trojański.\nOtwarcie puszki Pandory.\nKliknięcie „Akceptuję wszystkie” bez czytania.\n\nI teraz to.\n\nTinder.\n\nNastępnego dnia pojawił się pierwszy DM.\n\nTak właśnie zaczynają się niektóre katastrofy.\n\nNaukowcy długo spierali się, czy dinozaury wyginęły przez asteroidę.\nNiektórzy twierdzą, że powód był bardziej prozaiczny:\n\nktoś odpisał niewłaściwej osobie.\n\nNa razie brak ofiar.\n\nBrak pożarów.\n\nBrak konieczności ewakuacji kontynentu.\n\nAle sytuacja jest rozwojowa.\n\nCASE #001 pozostaje OTWARTY.\n\n„To był tylko swipe.”\n— słowa wypowiedziane tuż przed rozpoczęciem wielu złych historii",
    "importance": 2,
    "createdAt": "2026-08-30T08:48:51.326Z",
    "updatedAt": "2026-08-30T08:48:51.326Z"
  },
  {
    "id": "mtfktguu-h2f3l26",
    "date": "2026-08-02",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "argument"
    ],
    "note": "The blue glow was doing zero favors for their soul. Another profile, another holding a dead fish, another claiming a passion for \"spontaneous adventures\" (drinking in a parking lot).\n\nTheir thumb hovered over Delete App. It jiggled with digital panic. They almost pressed it. Almost. But sheer, lazy apathy won. They just locked the screen, tossed the phone, and accepted their fate as a future crazy cat person.\n\nThey fell asleep in bitter peace. Completely unaware that tomorrow, a bizarre server glitch would resurrect their dormant profile and blast it straight onto the screen of an insanely wealthy, oddly specific soulmate.\n\nThey thought they were done with the digital meat market. The universe, however, was already warming up the popcorn.",
    "importance": 2,
    "createdAt": "2026-08-30T08:57:37.686Z",
    "updatedAt": "2026-08-30T08:57:37.686Z"
  },
  {
    "id": "mtfl7uod-pmxj3bp",
    "date": "2026-08-03",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "swipe",
      "match"
    ],
    "note": "Yesterday, the neon glare felt like a crime scene. She hovered over Delete App, ready to bury her dating life. She didn’t. Laziness beat self-respect.\n\nToday, nursing a hangover, she gave the roulette one last spin—purely for laughs, a quick sociological experiment. Up popped a guy unironically holding a broadsword. A literal sword. A red flag big enough to cover a stadium, or a future murder weapon.\n\nSwipe right. Just a joke.\n\nShe tossed the phone, completely oblivious that this ridiculous, blade-wielding lunatic would somehow end up as the love of her life, her future spouse, and her absolute favorite mistake.\n\nToday, it was just a cheap laugh at a guy with a sword. Tomorrow, the trap snaps shut. The universe was already warming up the popcorn.",
    "importance": 2,
    "createdAt": "2026-08-30T09:08:48.781Z",
    "updatedAt": "2026-08-30T09:40:33.507Z"
  },
  {
    "id": "mtflatzy-xytrcvp",
    "date": "2026-08-06",
    "startTime": "16:00",
    "endTime": "22:00",
    "glyphIds": [
      "coffee",
      "important_talk"
    ],
    "note": "CASE #002 — KAWA\n\nMiała być kawa.\n\nJedna.\n\nTaka zwyczajna, cywilizowana, 60 minut max.\n\nPo 6 godzinach nadal siedzieli i gadali.\n\nKawa dawno umarła.\nKelner przeszedł przez trzy epoki geologiczne.\nGdzieś w tle przelatuje meteor i dinozaury oficjalnie zaczynają się martwić.\n\nTo był ten moment, kiedy człowiek zaczyna rozumieć, że „wpadnę tylko na kawę” jest mniej wiarygodne niż:\n\n„Luke, I am your father.”\n\nWstępny raport:\n\n☕ kawa — 1\n🗣️ rozmowa — 6h\n🦖 T-Rex — prawdopodobnie zazdrosny\n\nCASE #002 — obserwacja trwa.",
    "importance": 2,
    "createdAt": "2026-08-30T09:11:07.870Z",
    "updatedAt": "2026-08-30T09:11:07.870Z"
  },
  {
    "id": "mtfle7hq-lq6cnya",
    "date": "2026-08-08",
    "startTime": "12:00",
    "endTime": "19:00",
    "glyphIds": [
      "picnic",
      "gift"
    ],
    "note": "CASE #003 — THE PICNIC\n\nZaprosił ją na piknik.\n\nPlan: kilka godzin.\nRzeczywistość: 7 h.\n\nBył koc.\nByło jedzenie.\nBył prezent.\n\nI właśnie ten ostatni element budzi największe podejrzenia.\n\n“Seven hours? That’s not a picnic.”\n— someone, shortly before the timeline stopped making sense\n\nCo miał oznaczać prezent?\nTak od razu ?\nPułapka?\nInwestycja długoterminowa?\nPróba uzyskania późniejszych korzyści?\nA może po prostu prezent?\n\nTo ostatnie wydaje się podejrzanie proste.\n\nTego raport nie wyjaśnia.\n\nNiektóre pytania powinny pozostać bez odpowiedzi.\n\nThe truth is out there.\n\nCASE #003\nStatus: unexplained.",
    "importance": 1,
    "createdAt": "2026-08-30T09:13:45.326Z",
    "updatedAt": "2026-08-30T09:13:45.326Z"
  },
  {
    "id": "mtfll04t-iu9pjby",
    "date": "2026-08-10",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "message"
    ],
    "note": "CASE #004 — DEPARTURE\n\nWyjechała na wakacje.\n\nPierwszy dzień poza zasięgiem.\n\nPierwszy DM przyszedł szybciej, niż przewidywały procedury.\n\nPrzypadek?\n\n“I know where you are.”\n\nNie wiadomo, czy wiadomość została wysłana żartem.\n\nNie wiadomo też, dlaczego brzmi jak początek filmu, w którym policja przyjeżdża dopiero w połowie drugiego aktu.\n\nTrop #1: wiadomość przyszła dokładnie wtedy, kiedy powinna.\n\nCoincidence detected.\nSuspicion level: rising.",
    "importance": 0,
    "createdAt": "2026-08-30T09:19:02.381Z",
    "updatedAt": "2026-08-30T09:19:02.381Z"
  },
  {
    "id": "mtfllx8d-wmzoaf1",
    "date": "2026-08-11",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "message"
    ],
    "note": "CASE #005 — THE SECOND MESSAGE\n\nDrugi dzień.\n\nDrugi DM.\n\nTo już przestaje wyglądać jak przypadek.\n\nChociaż oczywiście może nim być.\n\nTak samo jak koń trojański mógł być po prostu bardzo dużym koniem.\n\n“Enjoy your vacation.”\n\nNiby normalne.\n\nTylko skąd wiedział, że właśnie zaczęła dzień?\n\nRozważane hipotezy:\n\nA) tęskni\nB) obserwuje\nC) ma nadprzyrodzone zdolności\nD) algorytm wie więcej niż my\n\nHipoteza D została natychmiast utajniona.\n\nThe game is afoot.",
    "importance": 0,
    "createdAt": "2026-08-30T09:19:45.277Z",
    "updatedAt": "2026-08-30T09:19:45.277Z"
  },
  {
    "id": "mtflmhn1-sl83cmv",
    "date": "2026-08-12",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "message"
    ],
    "note": "CASE #006 — PATTERN\n\nTrzeci dzień.\n\nDM przyszedł ponownie.\n\nTa sama pora.\n\nPrzypadek?\n\nNie.\n\nWzorzec.\n\nW historii kryminalistyki wszystko zaczyna się od wzorca.\n\nW historii randek również.\n\nRóżnica polega na tym, że w jednym przypadku pojawia się FBI, a w drugim człowiek sprawdza, czy wiadomość została przeczytana.\n\n“Once is chance. Twice is coincidence. Three times is a pattern.”\n\nKtoś kiedyś to powiedział.\n\nAlbo zaraz powie.\n\nRaport nie potrafi ustalić, kto pierwszy.\n\nTrop #2: trzy wiadomości.\nTrop #3: żadnej sensownej przyczyny.\n\nTymczasem gdzieś daleko Sherlock Holmes właśnie podniósł brew.",
    "importance": 0,
    "createdAt": "2026-08-30T09:20:11.725Z",
    "updatedAt": "2026-08-30T09:20:11.725Z"
  },
  {
    "id": "mtflnlyt-d5vchmp",
    "date": "2026-08-13",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "message"
    ],
    "note": "CASE #007 — THE DISTRACTION\n\nCzwarty dzień.\n\nKolejny DM.\n\nTym razem zupełnie zwyczajny.\n\nI właśnie dlatego podejrzany.\n\nZa zwyczajny.\n\nCzy to próba odwrócenia uwagi?\n\nCzy poprzednie wiadomości miały stworzyć określony schemat?\n\nCzy może właśnie teraz przesadzamy?\n\nTak.\n\nAle śledztwa nie prowadzi się po to, żeby zachować zdrowy rozsądek.\n\n“Nothing to see here.”\n\nOczywiście.\n\nNajbardziej podejrzane zdanie w historii ludzkości.\n\nTrop #4 zostaje zabezpieczony.\n\nNie wiadomo po co.\n\nAle zabezpieczony.",
    "importance": 0,
    "createdAt": "2026-08-30T09:21:03.989Z",
    "updatedAt": "2026-08-30T09:21:03.989Z"
  },
  {
    "id": "mtfloauc-8xjs7dw",
    "date": "2026-08-14",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "message"
    ],
    "note": "CASE #008 — THE MESSAGE\n\nPiąty dzień.\n\nDM przyszedł.\n\nAle tym razem coś się nie zgadzało.\n\nNie treść.\n\nTiming.\n\nWiadomość pojawiła się kilka godzin później niż zwykle.\n\nCzyli:\n\nalbo nic się nie stało,\nalbo stało się wszystko.\n\nW takich momentach procedury nakazują zachować spokój.\n\nProcedury zostały zignorowane.\n\n“The absence of evidence is not evidence of absence.”\n\nMulder miałby tu coś do powiedzenia.\n\nScully prawdopodobnie przewróciłaby oczami.\n\nRaport pozostaje neutralny.\n\nPrawdopodobnie.",
    "importance": 0,
    "createdAt": "2026-08-30T09:21:36.228Z",
    "updatedAt": "2026-08-30T09:21:36.228Z"
  },
  {
    "id": "mtflpg6s-pkvcy9z",
    "date": "2026-08-15",
    "startTime": "18:00",
    "endTime": "18:00",
    "glyphIds": [
      "message"
    ],
    "note": "CASE #009 — THE LAST DAY\n\nSzósty dzień.\n\nOstatni DM przed powrotem.\n\nI nagle wszystko wygląda normalnie.\n\nZa normalnie.\n\nŻadnych zagadek.\nŻadnych podejrzanych godzin.\nŻadnych anomalii.\n\nTylko wiadomość.\n\nJak gdyby przez ostatnie pięć dni nic się nie wydarzyło.\n\nI wtedy pojawia się pytanie:\n\nA co, jeśli właśnie o to chodziło?\n\nMoże nie było żadnego śledztwa.\n\nMoże nie było żadnego planu.\n\nMoże sześć wiadomości było po prostu sześcioma wiadomościami.\n\n...\n\nSure.\n\n“This is where the story gets interesting.”\n\n— unidentified source\n\nCASE #009\nStatus: unresolved.\n\nVACATION FILES — CLOSED.\n\nFor now.",
    "importance": 0,
    "createdAt": "2026-08-30T09:22:29.812Z",
    "updatedAt": "2026-08-30T09:22:29.812Z"
  },
  {
    "id": "mtflrbul-byaiou5",
    "date": "2026-08-16",
    "startTime": "18:00",
    "endTime": "21:00",
    "glyphIds": [
      "walk",
      "gift"
    ],
    "note": "CASE #010 — THE RETURN\n\nWróciła.\n\nPierwsza wiadomość po powrocie:\n\n„Spacer?”\n\nNiewinnie.\n\nPodejrzanie niewinnie.\n\n3 godziny później nadal spacerowali.\n\nI wtedy pojawił się prezent.\n\nDrugi.\n\nDrugi prezent.\n\nCzy to już rytuał?\nCzy ktoś prowadzi księgowość?\nCzy prezenty są przypadkowe, czy stanowią część większego planu?\n\nHipoteza A: romantyczny gest.\nHipoteza B: inwestycja.\nHipoteza C: zdobywanie punktów na przyszłość.\nHipoteza D: wszystko powyżej.\n\n“There is no such thing as a free lunch.”\n— Milton Friedman\n— albo ktoś, kto właśnie dostał prezent\n\n3 godziny spaceru.\n\nDrugi prezent.\n\nTrop #5 zabezpieczony.\n\nCASE #010\nStatus: pattern confirmed.",
    "importance": 1,
    "createdAt": "2026-08-30T09:23:57.501Z",
    "updatedAt": "2026-08-30T09:23:57.501Z"
  },
  {
    "id": "mtflvgic-5u5gtll",
    "date": "2026-08-17",
    "startTime": "16:00",
    "endTime": "22:00",
    "glyphIds": [
      "dinner"
    ],
    "note": "CASE #011 — THE HOUSE\n\nPierwszy raz u niego.\n\nObiad.\n\nTylko obiad.\n\nPo 6 godzinach sytuacja wymagała już powołania komisji.\n\n“Come in. It’s just dinner.”\n— famous last words\n\nLodówka została otwarta.\nZawartość oceniona.\nMieszkanie zabezpieczone.\n\nNie stwierdzono obecności drugiej szczoteczki do zębów.\n\nNa razie.\n\nCzy był to zwykły obiad?\n\nCzy może właśnie przekroczyliśmy niewidzialną granicę między\n„znamy się” a „znamy już adres”?\n\nRaport nie przesądza ale jednoznacznie stwierdza że dopełniona została procedura, która mówi - \nKLIENTA NIE MOZNA WYŻUCIĆ Z PROJEKTU !\n\nCASE #011\nStatus: territory entered.",
    "importance": 2,
    "createdAt": "2026-08-30T09:27:10.164Z",
    "updatedAt": "2026-08-30T09:32:30.732Z"
  }
];

// Earliest seeded activity date — used as CaseMeta.firstContactDate so
// "days together" in Profiler reads correctly against this real history
// instead of the unrelated hardcoded default.
export const SEED_FIRST_CONTACT_DATE = '2026-08-02';
