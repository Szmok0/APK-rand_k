// Contextual rare events (source: zuza_diary_contextual_rare_events.md).
// Triggered by real app state (milestones, anniversaries, time of day) — never randomly.
// Milestone events persist a local `shownRareEvents` registry so they never repeat.

export type RareEvent = { id: number; group: string; label: string; main: string; sub: string };

export const RARE_EVENTS: RareEvent[] = [
  { id: 1, group: 'Event Pool', label: 'FIRST EVIDENCE', main: 'First exhibit acquired.', sub: 'The case has officially become a case.' },
  { id: 2, group: 'Event Pool', label: '10TH EVIDENCE', main: 'Ten pieces of evidence collected.', sub: 'This investigation is becoming unnecessarily well documented.' },
  { id: 3, group: 'Event Pool', label: '25TH EVIDENCE', main: 'Twenty-five exhibits.', sub: 'At this point, the archive deserves legal representation.' },
  { id: 4, group: 'Event Pool', label: '25TH ACTIVITY', main: 'Twenty-five records.', sub: 'Apparently, this was worth documenting.' },
  { id: 5, group: 'Event Pool', label: '50TH ACTIVITY', main: 'Fifty records.', sub: 'Memory is now officially outnumbered by documentation.' },
  { id: 6, group: 'Event Pool', label: '100TH ACTIVITY', main: 'One hundred activities recorded.', sub: 'The calendar has become a witness.' },
  { id: 7, group: 'Event Pool', label: 'FIRST PROFILER REPORT', main: 'First psychological observation completed.', sub: 'Congratulations. The application now has opinions.' },
  { id: 8, group: 'Event Pool', label: 'SECOND PROFILER REPORT', main: 'A second observation exists.', sub: 'Human consistency was never guaranteed.' },
  { id: 9, group: 'Event Pool', label: 'COMPARISON UNLOCKED', main: 'Comparison unlocked.', sub: 'Same subject. Different answers. Interesting.' },
  { id: 10, group: 'Event Pool', label: 'FIRST ARCHIVED CASE', main: 'First case archived.', sub: 'The folder is closed. The lore remains.' },
  { id: 11, group: 'Event Pool', label: 'RETURN AFTER 14 DAYS', main: 'Welcome back.', sub: 'The investigation survived your absence.' },
  { id: 12, group: 'Event Pool', label: 'RETURN AFTER 30 DAYS', main: 'Case reopened after a long silence.', sub: 'Reality apparently continued without documentation.' },
  { id: 13, group: 'Event Pool', label: 'FIRST OPEN AFTER MIDNIGHT', main: 'Investigation conducted after midnight.', sub: 'Decision quality may be affected.' },
  { id: 14, group: 'Event Pool', label: 'OPEN BETWEEN 02:00–04:00', main: 'Night investigator detected.', sub: 'All conclusions are temporarily classified.' },
  { id: 15, group: 'Event Pool', label: 'FIRST OPEN ON 04 AUGUST', main: '04.08.2026', sub: 'The historical record remembers the first DM.' },
  { id: 16, group: 'Event Pool', label: '04 AUGUST / ANNUAL', main: 'Another year since the first DM.', sub: 'The case file has aged surprisingly well.' },
  { id: 17, group: 'Event Pool', label: '25TH BIRTHDAY / FIRST OPEN', main: 'Happy 25th Birthday, Zuza.', sub: 'CASE #001 is officially more complicated than last year.' },
  { id: 18, group: 'Event Pool', label: '10TH APP OPEN', main: 'Ten visits completed.', sub: 'The investigation appreciates your commitment.' },
  { id: 19, group: 'Event Pool', label: '50TH APP OPEN', main: 'Fifty visits.', sub: 'At this point, the app knows the route better than you do.' },
  { id: 20, group: 'Event Pool', label: '365 DAYS SINCE CASE START', main: 'One year of CASE #001.', sub: 'No final conclusion has been issued.' },
  { id: 21, group: 'Event Pool', label: 'RARE RANDOM', main: 'The case file is behaving normally.', sub: 'This is statistically suspicious.' },
  { id: 22, group: 'Event Pool', label: 'ULTRA RARE RANDOM', main: 'THE CASE FILE HAS BECOME SELF-AWARE.', sub: 'No action is required. Probably.' },
];
