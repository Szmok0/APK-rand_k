import { QUOTES } from '@/data/quotes';
import { dayOfYear } from '@/utils/dates';

export function dailyQuote(date: Date = new Date()): string {
  const index = dayOfYear(date) % QUOTES.length;
  return QUOTES[index];
}
