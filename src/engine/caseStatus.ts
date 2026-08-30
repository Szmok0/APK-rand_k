// Home screen rotating status line — local pool, no network. See
// src/data/caseStatusLines.ts (source: zuza_diary_case_status_lines.md).
//
// Was deterministic (day-of-year % pool length), matching dailyQuote()'s
// OLD behavior — but dailyQuote() was since changed to a fresh random pick
// per visit (product owner feedback: "should change every time you land on
// the screen, not once a day") and this was never updated to match, so it
// sat on the same line all day just like the old quote used to. Now mirrors
// dailyQuote() exactly.

import { CASE_STATUS_LINES } from '@/data/caseStatusLines';

export function caseStatus(): string {
  const index = Math.floor(Math.random() * CASE_STATUS_LINES.length);
  return CASE_STATUS_LINES[index];
}
