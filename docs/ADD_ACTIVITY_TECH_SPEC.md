# ADD ACTIVITY — TECHNICAL / GRAPHIC SPEC

## Status
PROPOSED

## Role
Separate data-entry screen feeding Calendar and all derived views.

The screen already has the required logic concept:
- date
- activity icon(s)
- time from / to
- report/note
- evidence/photo
- significance level

Do not redesign the data model unnecessarily.

## Preserve from existing app
- date picker / monthly calendar selection
- icon selection
- time selection
- text note input
- photo attachment
- significance/importance selection
- save action

## Visual direction
This is a form, not a wallpaper poster.

Use a subtle noir background plus clear code-driven sections.
The atmosphere comes from:
- labels
- typography
- borders
- stamps / dossier details
- small decorative assets

Not from baking controls into a single image.

## Proposed terminology
- Date → INCIDENT DATE
- Activity → INCIDENT TYPE
- Time → TIME WINDOW
- Note → REPORT
- Photo → EVIDENCE
- Importance/significance → CASE PRIORITY
- Save → FILE REPORT

Final wording can be adjusted later.

## Layout strategy

### 1. Top area
Screen title:
`FILE NEW INCIDENT`
or final equivalent.

No unnecessary subtitle.

### 2. Date
Compact field showing selected date.
Tap opens the existing monthly date selector.

Do not permanently display a second full calendar on this form unless the existing implementation requires it.

### 3. Incident type
This is the visually largest selection section.

Because there are many icons:
- do NOT use a long horizontal strip
- use a readable grid
- categories can remain as existing grouping if already implemented
- selected item gets a strong but simple highlight

Existing icon set may be preserved initially.
No need to rebuild icons before the rest of the app works.

### 4. Time window
Two compact controls:
`FROM`
`TO`

Keep existing time-picker logic.

### 5. Report
Large readable text area.
Can grow vertically.

Optional noir placeholder text, but input must remain clearly readable.

### 6. Evidence
Single photo attachment area:
- thumbnail after selection
- remove/replace action
- local storage only

The attachment UI can use a small transparent evidence-frame/stamp asset.

### 7. Case priority
Do not overcomplicate with statistics.

Use existing three-level logic if that is what the app already stores.
Visually: three clearly tappable levels, not tiny controls.

Possible wording:
- ROUTINE
- NOTED
- CRITICAL

These are only visual labels; underlying values can remain the existing 1/2/3.

### 8. Bottom action
Large primary button:
`FILE REPORT`

Must remain reachable and readable.
Respect bottom safe area.

## Background / assets

Recommended static assets:

/add-activity/
├── add_activity_bg.webp
│   subtle noir texture, no controls baked in
├── evidence_frame.png
│   optional transparent photo frame/stamp
└── dossier_mark.png
    optional small decorative accent

Everything interactive remains code-driven.

## Layer order

1. background texture
2. optional subtle static decoration
3. title
4. date field
5. icon/category grid
6. time controls
7. report input
8. evidence attachment
9. priority controls
10. save button

## Readability / touch rules
- activity icons must remain large enough to tap
- labels must not be tiny
- the form may scroll vertically
- no essential information hidden behind miniature controls
- bottom button respects dedicated safe area

## Key implementation principle
Keep the existing functional form and replace its skin.

Do not build a graphic mockup that must then be reverse-engineered into an interface.
