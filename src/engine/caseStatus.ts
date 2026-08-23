// Home screen rotating status line — deterministic per calendar day (same
// mechanism as dailyQuote), local pool, no network. See
// src/data/caseStatusLines.ts (source: zuza_diary_case_status_lines.md).

import { CASE_STATUS_LINES } from '@/data/caseStatusLines';
import { dayOfYear } from '@/utils/dates';

export function caseStatus(date: Date = new Date()): string {
  const index = dayOfYear(date) % CASE_STATUS_LINES.length;
  return CASE_STATUS_LINES[index];
}
