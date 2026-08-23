# CALENDAR — TECHNICAL / GRAPHIC SPEC

## Status
IN PROGRESS — proposed technical implementation

## Role
The calendar is the visual entry point to the diary.

The user:
1. sees the whole month as a readable grid,
2. selects a day,
3. sees that day's recorded activity below the grid.

The lower section is the actual diary view: activity icons, time, note/report and optional attached evidence.

## Preserve from existing app
- Monthly grid
- Previous / next month navigation
- Selected-day state
- Activity markers on days
- Display of selected-day details below the grid
- Existing activity/calendar data logic

Do not rebuild these mechanics unless necessary.

## Visual approach
### Background
Do NOT create the whole calendar as one wallpaper image.

Use:
- subtle static noir texture/background,
- optional very faint dossier / investigation decoration,
- code-rendered calendar grid on top.

Reason:
The month grid changes constantly and must remain readable.

## Static graphic assets needed
1. `calendar_bg.webp`
   - dark noir background texture
   - no text
   - no calendar cells baked into image
   - decoration concentrated outside dense reading areas

2. Optional small transparent PNG assets:
   - selected-day stamp/marker
   - subtle dossier/evidence decoration
   - empty-state decoration

## Code-driven UI
- Month name
- Weekday labels
- Day numbers
- Previous / next controls
- Activity markers
- Selected-day highlight
- All selected-day content
- Add Activity button

## Activity markers
Keep markers simple and readable.

Recommended:
- existing colored short lines / dots may remain
- activity color mapping remains data-driven
- do not place tiny complex icons inside calendar cells

A cell must remain readable at phone scale.

## Selected-day area
This is the lower “case day” section.

Suggested labels:
- date heading: `CASE DAY — 16 AUG 2026`
  or similar final copy
- note: `REPORT`
- photo: `EVIDENCE`
- empty state: custom noir wording

Content remains code-driven and scrollable if necessary.

## Empty day
Keep the existing useful logic:
- no activity message
- prominent `+ ADD ACTIVITY`

Only visual language changes.

## Touch targets
- day cells must remain easy to tap
- month arrows must have sufficiently large invisible hit areas
- no miniature decorative controls

## Readability rule
Calendar density is already high.
No wallpaper, ornament or texture may compete with:
- numbers
- markers
- selected date
- selected-day diary content

## Implementation strategy
Layer order:

1. app background / `calendar_bg.webp`
2. subtle decorative texture
3. code-rendered month header
4. code-rendered calendar grid
5. code-rendered activity markers
6. code-rendered selected-day section
7. code-rendered navigation / Add Activity controls

## Conclusion
The calendar should be a mostly code-rendered functional screen with a noir atmosphere around it — not a poster with a calendar painted on top.
