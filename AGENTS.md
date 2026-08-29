# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Product spec (v2 — noir rebuild, supersedes everything below)

The app was fully rebuilt from "Zu'z Diary" (a Polish-language relationship calendar
with glyphs/DNA-galaxy) into **Zuza's Diary — Case Log**: a private, offline
relationship diary framed as a strange noir investigation. Same engine
(Activity model, calendar logic, local storage), completely different visual
language, terminology and language (English).

Authoritative specs, in order of how concrete/binding they are:

1. `docs/ZUZA_CASE_LOG_CLAUDE_CODE_MASTER.md` — the creative/priority brief.
   Explicitly says NOT to build every proposed module — Comparative Analysis,
   Incident Classification, Case Narrative and Evidence Wall are parked until
   proven necessary; the full Profiler (question bank + scoring) needs design
   work first, it's not just a missing file.
2. `docs/HOME_APPROVED_TECH_SPEC.md`, `docs/CALENDAR_TECH_SPEC.md`,
   `docs/ADD_ACTIVITY_TECH_SPEC.md` — approved, concrete screen specs for the
   4 screens actually built (Home, Calendar, Add Activity, Evidence Archive).
2b. `docs/ZUZA_DIARY_PROFILER_KONCEPCJA.md` — approved working concept for
   Profiler, superseding MD section 11 wherever more specific: exactly 4
   screens (PROFILER hub, RELATIONSHIP DNA, THE LID, THE LID PREVIEW) — no
   Trend/Case Snapshot/Gap/Full Analysis/Diagnosis History/Field Notes
   screens. RELATIONSHIP DNA is a real algorithm over Activity data (6
   parameters, weights TBD); THE LID is slider-based (1-5), not a quiz;
   THE LID PREVIEW needs per-archetype illustration assets that don't exist
   yet. See section 14 of that doc for what's still open.
3. `docs/ZUZA_DIARY_CLAUDE_CODE_TECHNICAL_MASTER_v2.md` — earlier, broader
   technical contract. Still useful background, but superseded wherever it
   conflicts with the two docs above (e.g. it originally described Evidence
   as a separate persisted entity — the product decision that stuck is
   Evidence Archive as a derived VIEW over Activity, no second table).
4. `docs/content/*.md` — the local content pools actually wired into the app
   (quotes, case status lines, easter eggs, empty states, action messages).
   All English, deterministic selection, no network.
5. `docs/MVP_relacyjny_kalendarz_v6.md` / `docs/AUDYT_WIZUALNY_v3.md` — the
   PREVIOUS product concept (Polish relationship calendar). Kept for history
   only; do not follow these for new work.

## Rules that are easy to violate by accident

- **Single, permanent case.** There is exactly one case (`CASE No. 001`,
  alias `THE LID`, real name `ZUZA` only where the Profiler addresses her
  directly). No multi-case UI. "Close & Clear Case" in Settings archives and
  resets activities — it does not create a new case.
- **Evidence Archive is a derived view**, never a second table. Every
  `Activity` automatically becomes an exhibit (`src/engine/evidence.ts`).
  Do not add a standalone "add evidence" flow.
- **Whole app is in English.** Don't reintroduce Polish UI copy.
- **Old glyph/icon set stays** (all ~28 icons), grouped under the 5 existing
  categories (now English labels) as "incident types" — not replaced by a
  simplified icon set, even though some mockups explored that.
- **No fake Profiler.** The question bank, scoring/tags and report templates
  are real product/psychology design work (MD section 9/11; see also
  `ZUZA_DIARY_PROFILER_KONCEPCJA.md` section 14 for the current open list —
  weights, normalization, trait list, archetype mapping, threat-level scoring,
  Field Note pool) — don't invent a "fake psychological system" to fill the
  gap. `app/(tabs)/profiler.tsx` is the real hub (background + invisible
  buttons over its two baked card zones); `app/profiler/dna.tsx` is the real
  RELATIONSHIP DNA screen — a deterministic scoring model over real Activity
  data (`src/engine/dna.ts`, weights in `src/engine/dnaWeights.ts`, kept
  separate from the calculation on purpose), never a real psychological
  measurement. `app/profiler/lid.tsx` is still an honest placeholder until
  the slider/trait design lands — not a stand-in for THE LID itself.
- **4 bottom-nav tabs, no FAB**: HOME / CALENDAR / EVIDENCE / PROFILER.
  Comparative Analysis is intentionally not a tab yet (needs ≥2 real Profiler
  assessments to compare against).
- **Safe areas are mandatory** (`src/components/ui.tsx` `Header` uses real
  `useSafeAreaInsets()` — this was a real, reported bug: a fixed padding let
  content render under the system status bar).
- **Missing assets get reported, not invented.** The delivered asset packs
  only include real, ready-to-use transparent PNGs for Evidence Archive
  (`assets/noir/evidence/*`). Home/Calendar/Add Activity backgrounds
  (`assets/noir/backgrounds/*`) were cropped from mockup composites at modest
  resolution — usable, but a proper full-resolution export would look sharper.
