import { QUOTES } from '@/data/quotes';

// Was deterministic (day-of-year % pool length), so the same quote sat on
// screen all day, even across a full app restart. Product owner feedback:
// it should change every time you land on the screen, not once a day —
// picks a fresh random quote on every call instead.
export function dailyQuote(): string {
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index];
}
