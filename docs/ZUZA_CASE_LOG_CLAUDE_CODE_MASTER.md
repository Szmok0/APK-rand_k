# ZUZA — CASE LOG
## MASTER DESIGN BRIEF FOR CLAUDE CODE

### Project status
Concept phase is complete enough to begin a separate technical feasibility pass. The current idea inventory is intentionally too large: do not implement every proposed module blindly. First inspect the existing app, reuse what already works, and aggressively merge or remove duplicate screens.

---

# 1. CORE IDEA

A private, offline relationship diary / encounter journal disguised as a strange noir investigation.

The app is a personal birthday gift, a creative portfolio piece and a learning project. It must not feel like a generic diary, dating tracker, Figma template, self-help dashboard or corporate analytics app.

Normal relationship events are reframed as incidents, evidence, observations, exhibits, case notes and behavioural clues.

Primary user action remains simple:

ADD ACTIVITY

Everything else should reuse those records automatically.

---

# 2. HARD TECHNICAL CONSTRAINTS

- Offline-first and local-only core experience.
- No API dependency for diary, quotes, profiler or generated reports.
- No cloud backend is required for the core concept.
- Do not introduce SQL/backend/push/security complexity unless a real later requirement demands it.
- Prefer deterministic local logic.
- Reuse existing mechanics and data structures whenever possible.
- Avoid duplicate data entry.
- Avoid features that require the user to maintain a second database.

Data flow target:

Activity record
→ Calendar day record
→ Evidence Archive exhibit
→ Interrogation prompts generated from categories/data

Optional profiler answers
→ local scoring/tags
→ generated behavioural report

---

# 3. GLOBAL DESIGN UNIVERSE

Visual mood:
- noir
- psychological thriller
- investigation dossier
- controlled grunge
- cinematic poster energy

Avoid:
- childish fantasy
- generic cute diary aesthetics
- fake desktop dashboards on mobile
- microscopic decorative UI
- unnecessary complexity

Suggested ingredients:
- deep black / charcoal
- bone white / cream
- muted gray
- amber/gold
- restrained red accents
- occasional cyan/violet/magenta when justified
- distressed paper / case-file texture
- stamps, labels and evidence markers
- condensed uppercase display typography

Narrative universe:
- CASE No. 001
- THE LID
- STATUS: UNDER OBSERVATION
- dinosaurs
- subtle K-pop / pop-star / K-drama references
- occasional longsword references
- investigation and psychological language
- controlled absurdity

---

# 4. GLOBAL UX RULE: READABILITY

This is non-negotiable for every screen.

Concept art may be dense, but:
- text must be realistically readable on a phone;
- icons and tap targets must be comfortably tappable;
- long vertical screens are allowed;
- scrolling is allowed;
- do not force everything into one viewport;
- decorative typography must not replace readable functional typography;
- if atmosphere conflicts with usability, usability wins.

Goal:

cinematic atmosphere + real mobile usability

Not:

a beautiful poster pretending to be an app.

---

# 5. SCREEN: START / LOGIN / COVER

Status: direction established.

Poster language:

ZUZA

PSYCHOLOGICAL WARFARE

IN THE TINDER JUNGLE

SOME SECRETS SHOULD STAY EXTINCT

Additional universe copy:

TALES FROM THE TINDER JUNGLE

DATING, DINOSAURS & OTHER DANGEROUS SPECIES

Technical direction:
- keep simple;
- no unnecessary loading animation;
- direct entry into the app;
- entry button still to be finalized.

---

# 6. SCREEN: HOME — CASE OVERVIEW

Status: approved concept.

Purpose:
Main overview of the active relationship/person/case.

Identity:

CASE No. 001

Subject alias:

THE LID

Primary status:

STATUS: UNDER OBSERVATION

Rotating secondary status is generated locally from a pool.

Examples:
- No evidence suggests that The Lid is actually dangerous.
- Subject remains under observation.
- Behaviour currently appears non-threatening.
- Further evidence is required.
- Emotional conditions remain unstable.
- Investigation continues.
- No immediate danger detected.
- This assessment may be revised without warning.

Home content:
- case number;
- subject image;
- alias;
- status;
- rotating micro-observation;
- existing activity summaries;
- rotating larger quote;
- navigation/actions.

Reuse existing mechanics wherever possible.

---

# 7. SCREEN: CASE LOG — CALENDAR

Status: approved concept.

Purpose:
This is one of the main engines of the diary.

The calendar answers:

WHEN DID SOMETHING HAPPEN?

Requirements:
- full monthly grid;
- month navigation;
- activity days visibly marked;
- selected day highlighted;
- existing color/activity logic may be reused;
- tapping a day reveals the full day record below.

Selected day record can include:
- activity icons;
- activity type;
- time;
- importance;
- note/report;
- associated photos/evidence where relevant.

Generic diary language should become case language.

Suggested label:

CASE NOTE

Empty states should use local rotating copy:
- No significant events recorded.
- Nothing worth documenting. Probably.
- No witnesses. No evidence.
- The subject appears to have behaved normally. Suspicious.
- This date remains emotionally unclassified.
- No dinosaurs were involved. As far as we know.

---

# 8. SCREEN: NEW ENTRY — ADD ACTIVITY

Status: approved concept.

Separate screen from Calendar.

Header:

NEW ENTRY

ADD TO CASE LOG

Sections:

1. SELECT DATE
Monthly calendar grid, month navigation and date selection.

2. CHOOSE EVIDENCE TYPE
Activities represented by icons.

Existing categories include:

CONTACT
- First message
- Message
- Phone
- Video call
- Ghosting
- Return of contact

DATING
- Swipe
- Match
- App installation
- Invitation

MEETINGS
- Coffee
- Dinner
- Drink
- Walk
- Picnic
- Movie
- Concert
- Trip
- Night together

EMOTIONS
- Important conversation
- Argument
- Reconciliation
- Close moment
- Breakup

OBJECTS
- Gift
- Flowers
- Surprise

Important:
Do not implement activity selection as an endless tiny horizontal icon strip. Prefer the simplest readable grouping, paging, sectioning or selector.

3. TIME FRAME
- FROM
- TO
- ALL DAY

Reuse existing time logic.

4. CASE REPORT
Optional free-text note.

Possible placeholder:

What went down?
Details. Observations. Suspicions.

5. ADD EVIDENCE (PHOTOS)
Optional photos.

Supporting copy:

Photos, screenshots, anything relevant.

6. IMPORTANCE LEVEL

1 — LOW
just a blip

2 — MEDIUM
notable

3 — HIGH
significant

Primary action:

ADD TO CASE LOG

---

# 9. SCREEN: EVIDENCE ARCHIVE

Status: approved concept.

Purpose:
Automatic archive of all recorded activities.

No second database and no additional manual maintenance.

Each activity automatically becomes an evidence record/exhibit using existing:
- date;
- activity type/icon;
- time;
- note;
- photo;
- importance.

Example:

EXHIBIT #042
Coffee. 3 hours.

Suggested filters:
- ALL
- MEETINGS
- MESSAGES
- ITEMS
- EMOTIONS
- INCIDENTS

Sorting:
- newest;
- oldest;
- most important.

Mobile direction:
- one main column;
- large readable records;
- normal mobile text size;
- clear photo thumbnail;
- long vertical scroll;
- no miniature desktop dashboard.

Unique purpose:

WHAT EVIDENCE EXISTS?

---

# 10. SCREEN: INTERROGATION ROOM

Status: strong concept and visual direction established.

Purpose:
A strange investigative view that asks questions extracted from existing case data.

It must not become a second calendar.

Examples:

WHERE WERE YOU?
→ meeting/location-related records

WHO CONTACTED WHOM?
→ communication records

WHAT HAPPENED HERE?
→ notable incidents

EXPLAIN THIS.
→ gifts, objects, unusual evidence

WHAT DOES THIS MEAN?
→ emotional/relationship observations

CAN YOU ACCOUNT FOR THIS EVIDENCE?
→ physical evidence/photos/items

Visual direction:
- dossier / interrogation-room collage;
- readable text;
- vertical scrolling allowed;
- do not force all cards into one viewport.

Architecture requirement:
During technical review define exactly:
- which cards can be generated from existing categories;
- how counts/records are derived;
- fallback states;
- how to avoid inventing data;
- how this differs from Evidence Archive.

Unique purpose:

WHAT QUESTIONS DOES THE EVIDENCE RAISE?

Evidence Archive answers:

WHAT EVIDENCE EXISTS?

---

# 11. MAJOR SPECIAL MODULE: PROFILER

Status:
High-priority TODO and likely the most ambitious special feature.

Core idea:
Not a personality quiz.
Not a diagnosis.
Not an AI/API feature.

It is an optional local behavioural assessment built from psychologically meaningful questions rewritten into the absurd noir universe.

The user may:
- ignore it;
- answer questions for fun;
- repeat the assessment after weeks/months;
- receive a different report if answers change.

Target architecture:

Question bank stored locally
→ selected question
→ selected answer
→ local tags/weights
→ combined dimensions/conditions
→ report template selection
→ final behavioural assessment

No cloud or API.

The system should use psychologically meaningful constructs and behavioural/interview logic, but present them through strange noir language and controlled absurdity.

Report style:
Text-first.
No graphs.
No normal analytics dashboard.
No pseudo-medical diagnosis.

Example:

PRELIMINARY BEHAVIOURAL ASSESSMENT

Primary behavioural pattern:
Strategic emotional reconnaissance.

Reaction to uncertainty:
Moderate, with occasional velociraptor escalation.

Potential risk factor:
Excessive internal screenplay production.

Overall assessment:
Subject remains difficult to classify.

Disclaimer:

This report is not a medical diagnosis.
It is, however, disturbingly specific.

Reassessment:
A later run can produce a different report if answers change.

Optional history:
ASSESSMENT #001
ASSESSMENT #002

Profiler UX should likely be minimized into:

PROFILER HUB
→ start/continue assessment

ASSESSMENT QUESTIONS
→ readable large questions/answers

REPORT
→ separate readable textual assessment

Do not repeat the rejected approach of combining questions, photo, tabs, statistics, analytics and report into one overloaded mobile screen.

Research TODO before implementation:
- identify psychologically defensible non-clinical constructs;
- research behavioural/investigative interviewing principles;
- define useful dimensions;
- design approximately 20–30 optional questions;
- map answers to local tags/weights;
- design deterministic scoring;
- create report templates;
- explicitly avoid diagnosis/real forensic claims.

---

# 12. QUOTES AND MICRO-COPY

Large local quote pool required.

Mechanism:
- local pool;
- random selection;
- no API;
- no user maintenance.

Categories:
1. psychological/observational
2. dating noir
3. controlled absurdity
4. dinosaurs
5. K-pop/pop-star references
6. K-drama references
7. investigation/evidence language
8. swords/combat
9. CASE No. 001 / The Lid
10. meta commentary about documenting relationships

The references should often be subtle and personal.

---

# 13. EASTER EGGS

Frequent but layered.

Possible surfaces:
- rotating status messages;
- empty states;
- quotes;
- fake evidence stamps;
- dinosaur imagery;
- suspicious system messages;
- The Lid references;
- longsword references;
- music/celebrity/drama references;
- strange Settings labels;
- hidden credits;
- unusual save/confirmation/error messages.

The app should reward attention without showing every joke at once.

---

# 14. OLD TIMELINE

Not finalized.

Existing weekly/monthly/infinite-scroll timeline should not survive merely because it already exists in code.

During technical review:
- inspect what it currently does;
- determine whether it provides a unique experience;
- transform, merge or remove it.

---

# 15. SETTINGS / CREDITS

Not yet fully designed.

Possible functions:
- app settings;
- optional manual status changes;
- archive/history controls;
- hidden credits;
- birthday/personal reveal;
- Easter eggs.

Credits should not loudly advertise the app as a gift.

---

# 16. CANDIDATE MODULES TO MERGE OR REMOVE

The concept phase produced too many good ideas. That does not mean all should ship.

Candidates:

COMPARATIVE ANALYSIS
Risk: duplicates Profiler or becomes a statistics dashboard.

INCIDENT CLASSIFICATION SYSTEM
Risk: duplicates Evidence Archive and/or Profiler; may be reduced to micro-copy or merged.

CASE FILE / NARRATIVE
Possible Timeline replacement, but may duplicate Calendar/Evidence Archive.

THE WALL / EVIDENCE BOARD
Visually interesting but currently unnecessary and potentially complex.

Default technical stance:

Do not implement these until the architecture review proves they have a unique purpose.

---

# 17. TECHNICAL PASS — REQUIRED NEXT PHASE

Do not implement every screen immediately.

For every module, review:

A. EXISTING IMPLEMENTATION
- what already exists?
- what components can be reused?
- what data models already exist?

B. FEASIBILITY
- can it be implemented simply?
- does it work offline?
- does it require unnecessary dependencies?
- can custom graphics/static assets solve part of the visual need?

C. MOBILE USABILITY
- readable text;
- large tap targets;
- vertical scrolling where needed;
- no tiny icon grids;
- no desktop dashboard layouts.

D. DATA FLOW
For every displayed element answer:

WHERE DOES THIS DATA COME FROM?

If unclear:
- redesign;
- simplify;
- remove.

E. DUPLICATION CHECK
For every module answer:

WHAT UNIQUE USER EXPERIENCE DOES THIS PROVIDE THAT ANOTHER SCREEN DOES NOT?

If none:
- merge;
- simplify;
- remove.

F. IMPLEMENTATION SPEC
For each surviving screen produce:
- purpose;
- user actions;
- data inputs;
- data outputs;
- components;
- state;
- assets;
- local generation rules;
- implementation complexity;
- reuse opportunities;
- acceptance criteria.

---

# 18. CURRENT PRIORITY

CORE
1. Start/Cover
2. Home
3. Case Log / Calendar
4. New Entry
5. Evidence Archive

SPECIAL
6. Interrogation Room
7. Profiler

EVALUATE / POSSIBLY REMOVE
8. Old Timeline
9. Comparative Analysis
10. Incident Classification
11. Case Narrative
12. Evidence Wall

UTILITY
13. Settings/Credits

This is not a commitment to build all modules.

---

# 19. IMPLEMENTATION PHILOSOPHY

The correct response to this design brief is not:

Build every cool screen exactly as concept art.

The correct response is:

Preserve the strongest ideas while aggressively simplifying architecture.

The app should feel:
- unique;
- cinematic;
- private;
- strange;
- intelligent;
- playful.

The implementation should be:
- local;
- deterministic;
- maintainable;
- readable;
- easy to extend.

The atmosphere can be insane.

The code should not have to be.
