# Zuza's Diary — Case Log

A private, offline relationship diary framed as a strange noir investigation.
Same engine as the previous "Zu'z Diary" build (Activity model, calendar
logic, local storage) — completely new visual language, terminology and
language (English). Spec: `docs/ZUZA_CASE_LOG_CLAUDE_CODE_MASTER.md` +
`docs/HOME_APPROVED_TECH_SPEC.md` / `docs/CALENDAR_TECH_SPEC.md` /
`docs/ADD_ACTIVITY_TECH_SPEC.md` (see `AGENTS.md` for the full doc hierarchy).
Expo (React Native) + TypeScript + expo-router.

## Run — Expo Go preview (fastest)

```bash
npm install
npx expo start          # scan the QR code with the Expo Go app on your phone
npx expo start --tunnel # if phone and computer aren't on the same Wi-Fi
```

Limitation: Expo Go shows the app under its own icon and doesn't fully honor
the native boot splash (`expo-splash-screen`) — for that, use the real build
below.

## Real, installable build (EAS Build)

Requires a free [expo.dev](https://expo.dev) account and `eas-cli`:

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview   # builds a .apk, download link at the end
```

`eas.json` (`preview` profile, builds an installable `.apk` directly, no
store) and `android.package`/`ios.bundleIdentifier` in `app.json`
(`com.zuzdiary.app`) are already set up.

## Structure

```
app/
  index.tsx              COVER — poster tagline, tap to enter (dinosaur splash art)
  (tabs)/                 bottom nav: HOME / CALENDAR / EVIDENCE / PROFILER, no FAB
    _layout.tsx
    home.tsx              Case Overview — case number, alias, status, stats, quote
    calendar.tsx           Case Log — month grid + inline day panel below it
    evidence.tsx            Evidence Archive — derived view over Activity, filters
    profiler.tsx             placeholder (question bank not designed yet)
  day/[date].tsx          deep-link target for a single case day (DayDetailPanel)
  add-activity.tsx        FILE NEW INCIDENT — collapsible-chip form
  settings/               Settings, Archive, About
src/
  types/models.ts         Activity / Glyph / CaseMeta / Exhibit
  data/
    glyphs.ts              ~28 incident-type icons (unchanged set), English labels
    quotes.ts               181 quotes (docs/content/zuza_diary_daily_quotes.md)
    caseStatusLines.ts       103 HOME status lines
    easterEggs.ts / concreteReferenceEggs.ts / rareEvents.ts / emptyStates.ts /
    actionMessages.ts        remaining local content pools (not all wired up yet)
  engine/
    summary.ts               stats (incl. computeHomeStats — the 5 HOME concepts)
    evidence.ts               Evidence Archive derivation (no second table)
    caseStatus.ts             deterministic daily HOME status line
    quote.ts                  deterministic daily quote
  store/RelationshipStore.tsx single store (AsyncStorage/JSON): activities,
                              archives, caseMeta (case number/alias/first contact)
  components/
    ui.tsx                    Screen/Header (real safe-area insets)/buttons
    DayDetailPanel.tsx         shared "Case Day" content (Calendar + day/[date])
    GlyphPickerOverlay.tsx      full-screen incident-type picker
assets/
  glyphs/*_transparent.png     ~28 icons, alpha fixed via luma-key (kept as-is)
  noir/backgrounds/            desk_bg.jpg / calendar_bg.jpg — cropped from the
                                mockup composites; usable but modest resolution
  noir/evidence/                real transparent PNGs (evidence_card_frame,
                                evidence_photo_frame, exhibit_stamp)
```

## Product decisions worth knowing before touching this

- **Single, permanent case** (`CASE No. 001`, alias `THE LID`) — no
  multi-case UI. "Close & Clear Case" archives + resets activities.
- **Evidence Archive is a derived view**, not a second table — every
  `Activity` is automatically an exhibit.
- **Old glyph/icon set kept**, grouped under the same 5 categories
  (relabelled in English) — not replaced by a simplified icon set.
- **Profiler is a placeholder.** The question bank + scoring model is real
  design work, not a missing file — see `AGENTS.md`.
- **4 nav tabs, no FAB.** Comparative Analysis intentionally isn't a tab yet.

## Missing / lower-fidelity assets (reported, not invented — see AGENTS.md)

- `assets/noir/backgrounds/*.jpg` were cropped from mockup composite images
  (no separate full-resolution export was delivered for Home/Calendar/Add
  Activity backgrounds) — visually consistent, but a proper `.webp` export at
  the sizes named in the mockup legends (e.g. 1170×2532) would look sharper.
- No dedicated profile-frame/placeholder or paper-stamp (CONFIDENTIAL/
  RECORDED) transparent assets were delivered for Home/Calendar — these are
  currently code-drawn (bordered text badges) instead.
- Profiler/Comparative Analysis have a real, complete asset kit already
  (`report_frame`, `question_card_frame`, `report_section_icon_*`,
  `comparison_header_frame`, etc., in the original delivered zip) — not yet
  copied into `assets/` since those screens aren't built.

## Verified

`tsc --noEmit` clean. Verified visually via `expo start --web` + Playwright
screenshots across Cover → Home → Calendar → Add Activity (incident-type
picker, filled form, save) → Evidence Archive → Settings/About, including the
full data flow (an activity added in Add Activity correctly shows up in
Calendar, Evidence Archive as an exhibit, and Home's stats).

Not yet verified natively on iOS/Android (no simulator/emulator in this build
environment) — next step is `eas build` or `npm run android`/`npm run ios` on
a real device.
