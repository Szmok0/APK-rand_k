# ZUZA DIARY --- THE LID PREVIEW

## Final classification screen --- implementation specification

## 1. Purpose

This is the final screen of the THE LID flow.

It interprets two independent sources:

-   **THE LID** --- the user's subjective 1--5 assessment.
-   **RELATIONSHIP DNA** --- the real activity history from Calendar /
    Evidence.

The Preview combines them into a fictional, humorous case-file
classification.

**Important:** a large number of activities can produce very strong DNA
scores while the user's slider assessment says something completely
different. This contradiction is intentional and should NOT be averaged
away.

THE LID = what she thinks about him.\
RELATIONSHIP DNA = what the recorded history suggests.\
PREVIEW = the entertaining interpretation of both.

This is not a psychological diagnosis or scientific prediction.

------------------------------------------------------------------------

## 2. Screen

The screen is vertically scrollable and must respect mobile Safe Area.

The prepared background is a static graphical asset. Do not redesign it
in code.

Dynamic sections:

1.  Header --- `THE LID HAS SPOKEN`
2.  Primary Type + percentage
3.  Secondary Trait + percentage
4.  Threat Level + percentage
5.  Central dinosaur image
6.  Profile Confidence
7.  Field Note
8.  Relationship statistics
9.  Final Remark / Easter Egg
10. `BACK TO DIARY`

The sunglasses-wearing dinosaur is a key visual element and remains the
style reference.

------------------------------------------------------------------------

## 3. THE LID DATA

Current sliders:

-   ROMANTIC
-   CARING
-   HONEST
-   CONSISTENT
-   INITIATIVE
-   HUMOR
-   MYSTERY
-   DRAMA
-   WOULD_DO_IT_AGAIN

Values are 1--5.

Normalize:

`score = (value - 1) / 4 × 100`

Therefore:

-   1 = 0
-   2 = 25
-   3 = 50
-   4 = 75
-   5 = 100

Keep the original 1--5 values available.

------------------------------------------------------------------------

# 4. PRIMARY TYPE

Primary Type is based primarily on THE LID sliders.

**Do not let Relationship DNA overwrite the user's assessment.**

Initial archetypes:

### GOLDEN RETRIEVER

-   ROMANTIC 20%
-   CARING 30%
-   HONEST 10%
-   CONSISTENT 20%
-   INITIATIVE 10%
-   HUMOR 10%

### GENTLEMAN

-   ROMANTIC 25%
-   CARING 20%
-   HONEST 20%
-   CONSISTENT 25%
-   INITIATIVE 10%

### THE SPINO

-   INITIATIVE 25%
-   MYSTERY 25%
-   HUMOR 10%
-   DRAMA 10%
-   WOULD_DO_IT_AGAIN 15%
-   CARING 15%

### THE ANKYLO

-   CARING 30%
-   CONSISTENT 30%
-   HONEST 15%
-   ROMANTIC 10%
-   INITIATIVE 10%
-   DRAMA inverse 5%

### THE SNAKE

-   MYSTERY 30%
-   DRAMA 20%
-   HONEST inverse 5%
-   CONSISTENT inverse 10%
-   HUMOR 15%
-   WOULD_DO_IT_AGAIN 20%

### THE MENACE

-   DRAMA 35%
-   MYSTERY 20%
-   INITIATIVE 15%
-   HUMOR 15%
-   WOULD_DO_IT_AGAIN 15%

### THE GHOST

-   MYSTERY 30%
-   CONSISTENT inverse 25%
-   INITIATIVE inverse 20%
-   HONEST inverse 15%
-   WOULD_DO_IT_AGAIN 10%

### THE UNEXPLAINED

Use when no archetype is sufficiently dominant, the combination is
unusually contradictory, or there is insufficient information.

If an attribute is marked inverse:

`inverseScore = 100 - attributeScore`

For each archetype:

`rawScore = sum(attributeScore × weight)`

Weights are normalized to 100%.

Primary Type = highest meaningful archetype score.

The displayed percentage is **TYPE COMPATIBILITY**, not objective
probability.

------------------------------------------------------------------------

# 5. SECONDARY TRAIT

Secondary Trait = second-highest meaningful archetype.

Show it only if its score is at least 45.

Otherwise:

`SECONDARY TRAIT` `UNRESOLVED`

Do not force a second classification.

------------------------------------------------------------------------

# 6. THREAT LEVEL

Threat Level is intentionally independent of Primary Type.

It represents potential trouble.

Use both THE LID and real relationship data.

### THE LID contribution

-   DRAMA × 0.30
-   MYSTERY × 0.20
-   INITIATIVE × 0.10
-   WOULD_DO_IT_AGAIN × 0.10

### Relationship DNA contribution

-   DNA CHAOS × 0.15
-   DNA MYSTERY × 0.10

### Incident contribution

-   normalized INCIDENT COUNT × 0.05

Incident normalization:

`incidentScore = min(INCIDENT_COUNT / 5, 1) × 100`

5+ incidents reaches the maximum incident contribution.

Clamp final result to 0--100.

Labels:

-   0--19 = CLEAR
-   20--39 = LOW
-   40--59 = MODERATE
-   60--79 = ELEVATED
-   80--100 = UNEXPLAINED

High values use the app's red warning language.

------------------------------------------------------------------------

# 7. CONTRADICTION ENGINE

This is a core feature.

The system must detect when subjective assessment and recorded behaviour
disagree.

Do not hide the contradiction.

Examples:

### CONSISTENCY

If THE LID CONSISTENT \>= 4 and DNA CHAOS is high or incidents are
repeated:

`Subject's consistency remains under investigation.`

### ROMANTIC

If ROMANTIC \>= 4 and there are very few GIFTS / MEETINGS:

`Romantic evidence remains surprisingly theoretical.`

### CARING

If CARING \>= 4 and incidents are high:

`Care appears to coexist with questionable operational decisions.`

### MYSTERY

If MYSTERY \>= 4 and there are many DMs but few meetings:

`Subject has provided extensive communication and suspiciously little physical evidence.`

### WOULD_DO_IT_AGAIN

If WOULD_DO_IT_AGAIN = 5 and INCIDENT_COUNT \> 0:

`The LID has been warned.`

If WOULD_DO_IT_AGAIN = 1:

`Further contact is not recommended.`

These rules must be configurable and expandable.

------------------------------------------------------------------------

# 8. PROFILE CONFIDENCE

Profile Confidence is NOT Primary Type percentage.

It describes how much real relationship data exists.

Use:

-   TOTAL DAYS
-   TOTAL ACTIVITIES
-   EVIDENCE ITEMS
-   INCIDENTS

Initial formula:

Activity confidence:

`min(TOTAL_ACTIVITIES / 30, 1) × 60`

Time confidence:

`min(TOTAL_DAYS / 30, 1) × 25`

Evidence confidence:

`min(EVIDENCE_ITEMS / 10, 1) × 15`

Total = 0--100.

Labels:

-   0--29 = PRELIMINARY
-   30--59 = DEVELOPING
-   60--79 = WELL DOCUMENTED
-   80--100 = EXTENSIVELY DOCUMENTED

This is an internal fictional indicator, not statistical certainty.

------------------------------------------------------------------------

# 9. RELATIONSHIP DATA

Use the existing activity model and existing Relationship DNA.

Activity categories:

-   MEETING
-   CALL
-   DM
-   GIFT
-   INCIDENT

Statistics:

-   TOTAL ACTIVITIES
-   TOTAL DAYS
-   EVIDENCE ITEMS
-   INCIDENT COUNT
-   MEETINGS
-   MESSAGES
-   CALLS
-   INCIDENTS
-   EVIDENCE

Do not invent values.

TOTAL ACTIVITIES means all recorded activities. Do not count badges/tags
separately.

------------------------------------------------------------------------

# 10. FIELD NOTES

Field Note is selected by rules, not purely random.

Priority:

1.  rare Easter Egg
2.  contradiction rule
3.  data-dependent rule
4.  archetype-specific rule
5.  generic fallback

Only one main Field Note is displayed.

Example pool:

### Generic

`Subject displays surprisingly normal behaviour.`

`Further observation recommended.`

`Current evidence remains inconclusive.`

### Romantic

`Romantic behaviour exceeds expected levels.`

`Flowers detected. Situation escalating.`

### Mystery

`Subject continues to withhold approximately 73% of his backstory.`

`Further questioning may be required.`

### Chaos

`The situation appears to have developed its own agenda.`

`Three incidents is no longer a coincidence.`

### Consistency

`Annoyingly reliable.`

### Humor

`Unfortunately hilarious.`

### Contradiction

`Interesting testimony.`

`Subject's statements and available evidence do not fully agree.`

### Low data

`Insufficient evidence for a responsible conclusion.`

`Keep observing.`

Keep this content in a separate configuration file.

------------------------------------------------------------------------

# 11. EASTER EGGS

Easter Eggs are rare and deterministic.

Do not show multiple at once.

Examples:

### All sliders = 5

`CLASSIFICATION FAILURE`

`Subject appears suspiciously perfect. This cannot be trusted.`

### All sliders = 1

`NO FURTHER QUESTIONS.`

### DRAMA = 5 AND MYSTERY = 5

`WARNING`

`This combination has historically caused unnecessary plot development.`

### ROMANTIC \>= 4 AND CARING \>= 4 AND CONSISTENT \>= 4

`RARE SPECIMEN DETECTED.`

### HUMOR = 5 AND DRAMA = 5

`THIS IS GOING TO BE A PROBLEM.`

### WOULD_DO_IT_AGAIN = 5 AND INCIDENTS \> 0

`THE LID HAS BEEN WARNED.`

### DNA CHAOS \>= 80 AND LID CONSISTENT \>= 4

`Interesting testimony.`

Use a priority system so only the strongest applicable Easter Egg wins.

------------------------------------------------------------------------

# 12. FINAL REMARK

Short humorous closing line.

Examples:

`Love is optional. The LID is forever.`

`Proceed with snacks.`

`Handle with questionable optimism.`

`Evidence suggests continued observation.`

`This profile is not a promise. It's a probability.`

Keep it short and phone-readable.

------------------------------------------------------------------------

# 13. ARCHETYPE IMAGE

The central image is selected from prepared assets.

Example mapping:

-   golden_retriever → `lid_golden.png`
-   spino → `lid_spino.png`
-   anklyo → `lid_ankylo.png`
-   snake → `lid_snake.png`
-   menace → `lid_menace.png`
-   ghost → `lid_ghost.png`
-   unexplained → `lid_unexplained.png`

The current sunglasses-wearing dinosaur is the visual reference.

Do not generate images inside the app.

------------------------------------------------------------------------

# 14. ASSET / CODE SEPARATION

### Static graphics

-   complete background
-   paper
-   tape
-   stamps
-   central photo frame
-   dinosaur image frame
-   textures
-   decorative fossils / foliage / dino elements
-   static labels intentionally included in artwork

### Dynamic code

-   Primary Type
-   Primary percentage
-   Secondary Trait
-   Secondary percentage
-   Threat Level
-   Threat percentage
-   Profile Confidence
-   Field Note
-   relationship statistics
-   final remark
-   selected dinosaur image

Do not generate the whole dynamic screen as one flat image.

------------------------------------------------------------------------

# 15. MOBILE READABILITY

The design reference is not permission to use tiny text.

Real mobile readability has priority over decorative density.

Hierarchy:

1.  Primary Type --- large
2.  percentages --- large
3.  Threat Level --- large
4.  Field Note --- readable
5.  statistics --- medium
6.  secondary metadata --- small but readable

Do not add tiny text simply to fill empty space.

------------------------------------------------------------------------

# 16. EMPTY STATE

If THE LID has not been completed:

`THE LID HAS NOT SPOKEN.`

`Assessment required.`

Button:

`OPEN THE LID`

If there is very little relationship data, classification may still be
generated from THE LID, but Profile Confidence must remain PRELIMINARY.

------------------------------------------------------------------------

# 17. NAVIGATION

Primary action:

`BACK TO DIARY`

Optional return to THE LID is acceptable if it fits the existing
navigation structure.

Do not add extra navigation solely for decoration.

------------------------------------------------------------------------

# 18. IMPLEMENTATION STRUCTURE

Keep all scoring and content rules outside React Native UI components.

Recommended:

`src/engine/lid/`

-   `lidTypes.ts`
-   `lidScoring.ts`
-   `lidThreat.ts`
-   `lidConfidence.ts`
-   `lidNotes.ts`
-   `lidEasterEggs.ts`
-   `lidAssets.ts`

The UI consumes a final result object:

``` ts
{
  primaryType,
  primaryScore,
  secondaryType,
  secondaryScore,
  threatLevel,
  threatLabel,
  profileConfidence,
  profileConfidenceLabel,
  fieldNote,
  finalRemark,
  statistics,
  imageAsset
}
```

Same slider values + same relationship data must always produce the same
result.

Do not use randomness for classification.

------------------------------------------------------------------------

# 19. DO NOT

Do NOT:

-   create another dashboard,
-   create charts,
-   create pie charts,
-   add sliders to this screen,
-   repeat the assessment,
-   overwrite THE LID with activity data,
-   treat activity count as proof of personality,
-   use hidden scoring multipliers,
-   use machine learning,
-   invent activity/evidence data,
-   use pink/purple/neon styling,
-   introduce generic Material UI cards,
-   make the result look scientifically validated.

Visual language remains:

**DARK / INVESTIGATIVE / CINEMATIC / GRITTY / CASE FILE / DINOSAUR /
MYSTERY / HUMOUR**

------------------------------------------------------------------------

# 20. CORE PRODUCT LOGIC

The final screen answers three separate questions:

**WHAT DID SHE THINK?**\
THE LID sliders.

**WHAT ACTUALLY HAPPENED IN THE LOG?**\
Relationship DNA + Calendar + Evidence.

**WHAT DOES THE CASE FILE SAY?**\
THE LID PREVIEW.

The most interesting output can be a contradiction.

Example:

THE LID: `CONSISTENT = 5` `CARING = 5` `ROMANTIC = 5`

Relationship history: `CHAOS = 91%` `INCIDENTS = 4`

Preview:

`PRIMARY TYPE: THE GOLDEN RETRIEVER`

`THREAT LEVEL: ELEVATED`

Field Note:

`Subject's testimony is unexpectedly optimistic.`

That tension is intentional and is a central part of the humour.

------------------------------------------------------------------------

# 21. IMPORTANT DESIGN PRINCIPLE

Do not try to make the activity history and THE LID agree.

They are two different sources of information.

A relationship with hundreds of recorded activities can have very strong
DNA scores while the user can still manually rate the subject very
differently.

The Preview should preserve that distinction and use it to generate the
narrative result.
