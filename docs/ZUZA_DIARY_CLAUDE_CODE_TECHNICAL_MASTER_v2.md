# ZUZA'S DIARY — TECHNICAL MASTER SPECIFICATION FOR CLAUDE CODE

> **Purpose:** This document is the technical implementation contract for rebuilding the existing working application into the approved **Zuza's Diary** concept.
>
> The application already exists. Do not assume a greenfield project.
>
> Primary implementation principle:
>
> **Inspect first. Preserve working code where possible. Ask when a decision cannot be safely inferred.**

---

# 0. IMPLEMENTATION PROTOCOL

## 0.1 Before changing code

Claude Code must first inspect:

1. project structure;
2. framework and runtime;
3. package/dependency configuration;
4. existing routes/navigation;
5. existing screen/component structure;
6. current data models;
7. current persistence/storage;
8. existing assets;
9. build/run configuration.

Do not begin by replacing the project architecture.

## 0.2 When to ask the user

Claude Code **must ask the user** when:

- a required product behaviour is genuinely unclear;
- the existing code and this specification contradict each other;
- several materially different implementations are possible and the choice affects product behaviour;
- an existing working feature would need to be removed or replaced;
- storage/data migration could destroy or invalidate user data;
- a referenced graphic/asset is missing and cannot be safely replaced with an existing approved asset;
- implementing a feature would require a new major screen, navigation destination, backend, API or external service not described here;
- the meaning of an existing data field cannot be safely inferred.

Claude Code should **not ask** for trivial implementation choices that can be safely inferred from the existing codebase, such as local component structure, naming, existing styling conventions or already available libraries.

### Critical rule

Do not fill conceptual gaps with creative invention.

**If the gap affects the product, ask.  
If the gap affects only an implementation detail and the existing project provides a safe answer, implement.**

## 0.3 Graphics rule

Claude Code is not expected to create missing artwork.

If an approved asset is missing:

1. search existing project assets and supplied asset folders;
2. check whether an existing approved asset is clearly intended for that role;
3. if not, use a neutral placeholder/container only when this allows the rest of the implementation to proceed;
4. report the exact missing asset and intended role.

Do not generate replacement artwork, fake noir illustrations or arbitrary icon sets.

## 0.4 Existing application rule

Prefer:

- KEEP working logic;
- MODIFY existing components;
- REUSE navigation;
- REUSE storage;
- REUSE compatible models.

Do not rewrite the application from scratch merely because a cleaner architecture would be desirable.

---

# 1. PRODUCT DEFINITION

**Zuza's Diary** is a private, playful, noir-styled relationship and memory diary framed as a fictional investigation.

The app combines:

- activities/incidents;
- calendar history;
- evidence;
- case identity;
- a psychological question system ("Profiler");
- generated textual reports;
- comparison of repeated profiler assessments;
- quotes;
- contextual microcopy;
- hidden references and Easter eggs.

The app is:

- local;
- offline;
- single-device;
- private;
- intentionally free of accounts and cloud services.

It is **not**:

- a social network;
- a real CRM;
- a medical or diagnostic application;
- a statistics dashboard;
- a cloud product.

---

# 2. HARD TECHNICAL CONSTRAINTS

## 2.1 Offline only

Do not add:

- APIs;
- network dependency;
- remote database;
- cloud synchronization;
- authentication;
- account system;
- server;
- SQL backend;
- push service.

The app must remain functional in airplane mode.

## 2.2 Local persistence

Use the existing local persistence mechanism if it is already present and reliable.

Do not introduce a second persistence system without a technical need.

Persist locally:

- cases;
- case metadata;
- activities;
- evidence;
- media references if supported by the existing app;
- profiler answers;
- generated reports;
- comparison history;
- quote/randomization state;
- rare-event state;
- settings;
- archive state.

## 2.3 Migration safety

If the existing app already contains user data:

- inspect existing storage before migration;
- preserve data whenever technically reasonable;
- avoid destructive schema resets;
- ask the user before an irreversible migration or deletion.

---

# 3. MOBILE LAYOUT CONTRACT

## 3.1 Safe areas are mandatory

The application previously had problems with content overlapping the device UI.

Every screen must respect:

- top status/system area;
- bottom gesture/navigation area;
- keyboard insets where applicable.

No important control may be placed under a system bar.

## 3.2 Readability is non-negotiable

The visual concept must adapt to a real phone.

Required:

- readable body text;
- readable dates;
- readable labels;
- readable icons;
- comfortable touch targets;
- scalable text where the existing platform supports it;
- scrollable content when vertical space is insufficient.

Never solve a layout problem by shrinking text and controls until they become decorative.

### Rule

**Preserve hierarchy and atmosphere, not literal concept-art geometry.**

## 3.3 Mobile-first

Desktop screenshots are not the primary target.

Design and implementation decisions must be validated against practical mobile dimensions.

---

# 4. CORE DATA LOGIC

The central conceptual object is a **Case**.

```text
CASE
├── identity / subject
├── first contact date
├── activities
├── evidence
├── profiler assessments
├── generated reports
└── archive state
```

Recommended conceptual relationships:

```text
Case
  1 ─── N Activities
  1 ─── N Evidence items
  1 ─── N Profiler assessments
  Assessment ─── 1 Generated report
```

Use existing project models where compatible. Do not force this exact class naming if the current architecture already has equivalent structures.

---

# 5. CASE STATE

The main active case is conceptually **CASE #001**.

Default known relationship metadata:

- first DM / first contact: **04.08.2026**

This date is real application content and should be stored as data, not painted permanently into a background image.

The case must support:

- active state;
- archived state;
- reopening from archive;
- creation of a new case if this already exists in the approved application flow.

Do not multiply case-management screens unless the existing app already requires them.

---

# 6. HOME SCREEN — TECHNICAL LOGIC

Purpose:

- entry point for the active case;
- subject/case identity;
- first contact date;
- navigation to main areas;
- dynamic case status;
- subject image.

## 6.1 Subject image

The subject image area must support:

- an inserted user-selected image, OR
- an approved prepared/generated asset embedded with the project.

Do not hard-code dynamic information into the image.

If no image exists, show an appropriate existing placeholder/container.

## 6.2 Dynamic status

Home may display a short rotating case status.

Source:

- `zuza_diary_case_status_lines.md`

Selection rules:

- choose from the status pool;
- do not visibly change repeatedly during a single short session;
- optionally choose once per day or once per app session;
- persist enough state to avoid obvious repetition.

Use deterministic daily selection if practical:

```text
localDate + caseId -> stable index
```

or a persisted random index.

No API/random service.

---

# 7. CALENDAR / ACTIVITIES

The calendar is the canonical place for reviewing dated activity history.

## 7.1 Activity requirements

An activity must contain at minimum:

- stable local ID;
- case ID;
- date/time or date;
- activity type/title;
- created timestamp;
- updated timestamp if the existing model supports editing.

Optional fields may remain compatible with the existing application.

## 7.2 Calendar logic

Calendar data must be generated from stored activities.

Do not duplicate activity data into a separate manually maintained "stats" structure.

Calendar -> activity detail/edit -> persistence.

If counts are displayed anywhere, calculate them from the source data rather than maintaining independent counters unless the existing app already uses safe derived caching.

## 7.3 Evidence relationship

Evidence may be linked to an activity where appropriate.

Do not require every evidence item to belong to an activity if the approved existing concept allows standalone evidence.

---

# 8. EVIDENCE

Evidence is either:

1. manually added by the user;
2. linked to an activity/incident;
3. represented by local text/media metadata.

The application must not pretend that evidence is automatically generated by AI.

## 8.1 Evidence data

Conceptually:

```text
EvidenceItem
├── id
├── caseId
├── optional activityId
├── title/type
├── date
├── note/text
├── optional local attachment reference
├── createdAt
└── updatedAt
```

Adapt to existing data structures where possible.

## 8.2 Add Evidence

"Add New Evidence" must create a real persistent record.

The UI button must not be decorative.

## 8.3 Attachments

If local attachment support already exists, preserve it.

If attachment implementation is absent and adding it requires substantial platform-specific work, ask before introducing a new file/media subsystem.

---

# 9. PROFILER — CORE LOGIC

This is one of the most important systems.

The Profiler is a repeatable set of psychologically inspired, deliberately unusual questions.

It is **not a medical diagnostic tool**.

Its purpose is:

- engagement;
- reflection;
- pattern observation;
- comparison of answers over time.

## 9.1 Repeatability

The same person may complete the Profiler again after weeks or months.

A later completion must remain a separate historical assessment.

Do not overwrite the original assessment.

## 9.2 Assessment model

Conceptually:

```text
ProfilerAssessment
├── id
├── caseId
├── completedAt
├── answers[]
├── generatedReportId
└── optional assessmentVersion
```

Each answer:

```text
Answer
├── questionId
├── selectedOption / value
└── optional timestamp
```

## 9.3 Question source

Questions should be represented as structured local data, not hard-coded across unrelated UI components.

Conceptually:

```text
Question
├── id
├── text
├── options[]
├── interpretation tags / weights
└── optional category
```

The exact scoring/interpretation mechanism may be refined later.

If the question content or interpretation rules are missing from the supplied project files and are required for implementation, ask the user rather than inventing a fake psychological system.

## 9.4 No charts

Profiler output must not become:

- radar charts;
- bar charts;
- percentages;
- KPI dashboards;
- pseudo-scientific scoreboards.

Output should remain primarily textual and atmospheric.

---

# 10. REPORT GENERATION — LOCAL AND DETERMINISTIC

Because the app is offline:

- no LLM API;
- no remote AI generation.

Reports must be generated locally from structured rules and text fragments.

This is a template/rule engine, not an online generative model.

## 10.1 Recommended local generation model

Use:

```text
answers
   ↓
interpretation tags / scores
   ↓
determine dominant observations
   ↓
select compatible text fragments
   ↓
assemble report
```

Example conceptual categories:

```text
directness
uncertainty
caution
curiosity
attachment
control
spontaneity
reflection
```

These names are placeholders until the approved Profiler question model defines the actual categories.

Do not expose raw scores as charts.

## 10.2 Controlled variation

The report should not always be word-for-word identical.

Use local controlled variation:

- fragment pools;
- deterministic seed;
- report date/assessment ID;
- optional rare variants.

The same stored assessment should reproduce the same report after reopening.

Therefore:

- generate once and persist the generated report text; OR
- use a deterministic seed that guarantees identical regeneration.

Persisting the generated final text is recommended for historical stability.

## 10.3 Repeated assessments

A later assessment can generate a different report because:

- answers changed;
- dominant tags changed;
- report fragment selection differs.

This is expected.

---

# 11. COMPARATIVE ANALYSIS

Comparison becomes meaningful only after at least two completed assessments exist.

The comparison engine should compare structured answers/tags, not hallucinate from nothing.

Conceptually:

```text
Assessment A
Assessment B
    ↓
changed answers / changed dominant tags
    ↓
local comparison rules
    ↓
textual observation
```

Output examples should describe:

- stability;
- meaningful changes;
- shifts in priorities or tendencies;
- uncertainty where no strong pattern exists.

Do not claim clinical conclusions.

Do not use charts.

If comparison logic cannot be defined because question scoring data is missing, implement the assessment storage/report history and ask before inventing the interpretation system.

---

# 12. QUOTES

Source file:

- `zuza_diary_daily_quotes.md`

Quotes are local content.

## 12.1 Selection

Recommended:

- one stable quote per local calendar day; OR
- one quote per app launch/session.

Do not refresh randomly every render.

Preferred daily algorithm:

```text
stableSeed = YYYY-MM-DD + caseId
index = deterministicHash(stableSeed) % quotePool.length
```

This makes the quote stable throughout the day without requiring network access.

Alternative: persist selected quote ID/date locally.

## 12.2 Content references

Concrete references and Easter eggs may appear in normal quote pools, but only when their context remains understandable.

Do not randomly insert unrelated references into system errors.

---

# 13. CASE STATUS LINES

Source:

- `zuza_diary_case_status_lines.md`

Use for the Home screen.

Selection:

- stable per session/day;
- avoid immediate repeats;
- local only.

---

# 14. EASTER EGGS

Source files include:

- `zuza_diary_easter_eggs.md`
- `zuza_diary_concrete_reference_eggs.md`
- `zuza_diary_contextual_rare_events.md`

## 14.1 Important distinction

There are three different mechanisms:

### A. Interaction Easter Eggs

Triggered by a specific action:

- repeated tap;
- long press;
- repeated screen interaction;
- hidden gesture where technically supported.

### B. Concrete reference Eggs

Specific references to:

- K-pop;
- BLACKPINK and members;
- Taylor Swift;
- Sabrina Carpenter;
- office folklore;
- Men’s Hell;
- Women’s Hell;
- client files;
- 02-P;
- dinosaurs;
- specific paleontology/Jurassic references.

These references must retain meaning.

**Do not create random crossover jokes.**

### C. Contextual rare events

Triggered by real state:

- first evidence;
- milestone count;
- return after absence;
- anniversary;
- birthday;
- time of day;
- assessment comparison availability.

## 14.2 Persistence

Use a local registry such as:

```text
shownRareEvents: {
  "first_evidence": true,
  "evidence_10": true,
  "first_report": true
}
```

Do not show one-time events repeatedly after restart.

## 14.3 Non-disruption

Eggs must not block normal workflows.

Prefer:

- toast;
- snackbar;
- lightweight modal;
- temporary status text.

Do not add new screens solely for an Easter egg.

---

# 15. CONCRETE REFERENCE RULES

## 15.1 02-P

02-P may be used for dark/internal office humour where appropriate because it is a specific recognised internal context.

Do not randomly apply other disability symbols to jokes.

Especially avoid using serious medical/disability categories merely as absurd labels.

The approved tonal example is:

> "File classified under 02-P. Nobody is surprised."

## 15.2 Men’s Hell / Women’s Hell

Use exact English names:

- **Men’s Hell**
- **Women’s Hell**

Treat them as internal proper-name references.

Do not generate meaningless combinations.

Use sparingly: a few good references are better than repetition.

## 15.3 Celebrity/K-pop references

Concrete references must relate to a recognisable trait, work, meme, phrase, era, public context or fandom reference.

Do not simply concatenate:

```text
celebrity + random case action
```

Every reference must make sense independently.

---

# 16. EMPTY STATES

Source:

- `zuza_diary_empty_states_system_messages.md`

Each text pool is tied to a specific application state.

Examples of state classes:

- no activity;
- empty calendar day;
- no evidence;
- no photo;
- missing attachment;
- profiler not started;
- profiler incomplete;
- no report;
- no comparison;
- empty archive;
- import failure;
- no search result.

Do not use random text from another state.

---

# 17. ACTION MESSAGES

Source:

- `zuza_diary_action_messages.md`

Action messages occur only after the corresponding operation succeeds.

Examples:

- activity saved;
- activity edited;
- activity deleted;
- evidence added;
- evidence removed;
- report generated;
- comparison generated;
- case archived;
- case reopened;
- export completed;
- import completed.

Do not display a success message before persistence actually succeeds.

---

# 18. SETTINGS / ABOUT / CREDITS

Settings/About/Credits are functional content screens, not decoration.

Approved author block:

```text
Jacek J.

Office Dad. Unofficial investigator.
Creator of questionable digital evidence.

Specialist in sarcasm, questionable ideas
and maintaining a healthy distance from his own nonsense.
```

Birthday context:

```text
This application was created as a birthday present
for Zuza's 25th birthday.
```

Copyright:

```text
© 2026 Jacek J.
All rights reserved.
```

Exact surrounding copy may be taken from the approved content files/conversation specification.

Do not add legal/account/network functionality.

---

# 19. RANDOMIZATION SYSTEM

Random content must not behave chaotically.

## 19.1 Categories

Keep pools separate:

```text
dailyQuotes
caseStatuses
interactionEggs
concreteReferenceEggs
rareEvents
emptyStateVariants
actionMessageVariants
```

## 19.2 Selection rules

- Daily content: stable for a defined period.
- Session content: stable during one session.
- One-time rare event: persisted.
- Contextual messages: only within their matching context.
- Avoid immediate repetition where a pool contains multiple variants.

## 19.3 Seeded randomness

Where reproducibility is useful, use deterministic local hashing from values such as:

```text
date
caseId
assessmentId
eventId
```

Do not depend on remote randomness.

---

# 20. ASSETS AND FILE INTEGRATION

The owner is supplying generated graphics separately.

When assets are available:

1. inspect actual filenames;
2. map them to screen/component roles;
3. centralize asset references;
4. avoid duplicating file paths across many components.

Recommended conceptual asset map:

```text
assets/
  noir/
    backgrounds/
    frames/
    icons/
    subject/
    profiler/
    evidence/
```

Do not require this exact folder structure if the existing project already uses another structure.

## 20.1 Important

If a graphic is missing:

- do not invent it;
- do not silently substitute an unrelated image;
- report it clearly.

---

# 21. NAVIGATION

Use the existing navigation architecture.

Do not create a miniature icon maze.

Navigation must preserve:

- obvious primary destinations;
- readable labels;
- adequate touch targets;
- safe-area spacing.

If the existing bottom navigation has too many items or conflicts with the approved design, inspect before changing and ask if the product decision cannot be safely inferred.

---

# 22. IMPLEMENTATION ORDER

Claude Code should implement in this order unless existing architecture makes a different dependency order necessary:

## Phase 1 — Audit

- inspect project;
- identify framework;
- identify screens/routes;
- identify persistence;
- identify reusable components;
- identify available assets.

Provide a concise audit summary before destructive changes.

## Phase 2 — Foundation

- safe areas;
- responsive layout rules;
- theme integration;
- asset registry;
- local data model alignment.

## Phase 3 — Core navigation and screens

Implement/modify approved existing screens while preserving working routes.

## Phase 4 — Data logic

- Case;
- Activities;
- Evidence;
- Archive;
- local persistence.

## Phase 5 — Profiler

- structured question model;
- assessment persistence;
- report persistence;
- comparison readiness.

If question interpretation rules are missing, stop at the safe data architecture and ask.

## Phase 6 — Text pools

Integrate:

- quotes;
- statuses;
- empty states;
- action messages;
- Easter eggs;
- rare events.

## Phase 7 — Validation

Verify:

- offline use;
- persistence after restart;
- safe areas;
- small/large phone layout;
- no clipped critical text;
- no tiny primary controls;
- no duplicate random spam;
- no one-time event repetition.

---

# 23. TESTING CHECKLIST

## Offline

- [ ] App works in airplane mode.
- [ ] No screen requires a network request.
- [ ] Quotes/statuses/reports work locally.

## Persistence

- [ ] Activities survive restart.
- [ ] Evidence survives restart.
- [ ] Profiler assessments survive restart.
- [ ] Generated reports survive restart.
- [ ] Rare-event completion state survives restart.
- [ ] Archive state survives restart.

## Layout

- [ ] Top content does not overlap system status area.
- [ ] Bottom controls do not overlap gesture/navigation area.
- [ ] Keyboard does not permanently hide required inputs.
- [ ] Long text scrolls.
- [ ] Important labels remain readable.
- [ ] Touch targets are practical.

## Logic

- [ ] Calendar derives from stored activities.
- [ ] Evidence can be created and persisted.
- [ ] Profiler never overwrites previous completed assessments.
- [ ] Comparison requires sufficient assessments.
- [ ] Reports are stable once stored.
- [ ] No fake AI/API behaviour exists.

## Randomization

- [ ] Daily quote does not change every render.
- [ ] Status does not flicker/change constantly.
- [ ] One-time rare events do not repeat.
- [ ] Contextual messages match actual state.
- [ ] Concrete reference eggs retain their intended context.

---

# 24. FINAL IMPLEMENTATION SUMMARY FORMAT

After a meaningful implementation pass, report:

## Implemented
- concrete features/components changed.

## Preserved
- existing working systems intentionally retained.

## Changed
- architecture/data/navigation changes.

## Missing assets
- exact role/file needed.

## Questions requiring user decision
- only genuine product/logic ambiguities.

## Risks / TODO
- only real technical limitations or deferred decisions.

Do not bury critical questions inside a long narrative.

---

# 25. FINAL PRINCIPLE

This project is unusual because the visual concept, humour and local logic are intentional.

The implementation must therefore satisfy three layers simultaneously:

1. **It must actually work.**
2. **It must remain readable on a real phone.**
3. **It must not lose its strange personality.**

When these conflict:

```text
data integrity and safe operation
        ↓
readability and mobile usability
        ↓
approved product logic
        ↓
visual atmosphere
        ↓
Easter eggs and decoration
```

Never sacrifice the first layers for the last.
