# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Product spec

`docs/MVP_relacyjny_kalendarz_v6.md` is the authoritative, binding product spec for
this app (Zu'z Diary). It supersedes all earlier verbal/MD instructions about screens,
layout, and visual rules. Read it before making any UI/UX change. Key points that are
easy to miss and easy to violate accidentally:

- Global rule: no square/circular background container behind any glyph/rune icon —
  ever, anywhere. Only its own baked-in glow. The one exception is a gold outline/glow
  on a *selected* glyph in the Add Activity picker.
- DNA/galaxy on START is now a **static image** (`assets/dna_background.png`), not
  vector-rendered — Emotional Tone Layer (dynamic recoloring) is deferred, not required.
- Add Activity is a bottom sheet where every field (date, time, glyph) is collapsed to
  a one-line chip by default and only expands temporarily on tap.
- Calendar's day cell is minimal (day number + one small mood-color dot/bar + note dot,
  no glyph icon, no time text); tapping a day slides up an integrated preview panel
  below the grid instead of navigating to a separate screen.
- Two distinct gold tokens: `colors.gold` (muted UI accent) vs `moodColors.BLISKOSC`
  (vivid neon mood color) — never the same value.
