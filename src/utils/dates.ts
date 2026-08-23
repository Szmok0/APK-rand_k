// Pomocnicze funkcje dat. Reprezentacja dnia w całej appce: 'YYYY-MM-DD' (string, lokalny dzień).

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, days: number): string {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function diffInDays(aKey: string, bKey: string): number {
  const a = fromDateKey(aKey).getTime();
  const b = fromDateKey(bKey).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function weekdayLabels(): string[] {
  return WEEKDAY_NAMES;
}

export function dayLabelShort(key: string): string {
  const d = fromDateKey(key);
  return WEEKDAY_NAMES[(d.getDay() + 6) % 7];
}

// 'MAY 26' style — used on the Case Day ticket header (Calendar) and exhibit dates.
export function dateLabelUpper(key: string): string {
  const d = fromDateKey(key);
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3).toUpperCase()} ${d.getDate()}`;
}

// Zwraca siatkę dni miesiąca (poniedziałek-start), z dniami z sąsiednich miesięcy
// wypełniającymi pierwszy/ostatni tydzień — jak w mockupie kalendarza.
export function monthGrid(year: number, month: number): { key: string; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // 0 = poniedziałek
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { key: string; inMonth: boolean }[] = [];

  for (let i = startOffset; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    cells.push({ key: toDateKey(d), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: toDateKey(new Date(year, month, day)), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = fromDateKey(cells[cells.length - 1].key);
    const d = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    cells.push({ key: toDateKey(d), inMonth: false });
  }
  return cells;
}

// 7 dni kończących się na `endKey` (włącznie), w kolejności rosnącej.
export function weekEnding(endKey: string): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) out.push(addDays(endKey, -i));
  return out;
}

// Poniedziałek–niedziela tygodnia przesuniętego o `offsetWeeks` względem bieżącego.
export function weekDays(offsetWeeks: number): string[] {
  const today = fromDateKey(todayKey());
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset + offsetWeeks * 7);
  const mondayKey = toDateKey(monday);
  return Array.from({ length: 7 }, (_, i) => addDays(mondayKey, i));
}

export function hourRange(): string[] {
  return Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0') + ':00');
}

export function durationHours(startTime?: string, endTime?: string): number {
  if (!startTime || !endTime) return 0;
  const [sh] = startTime.split(':').map(Number);
  const [eh] = endTime.split(':').map(Number);
  let diff = eh - sh;
  if (diff < 0) diff += 24; // przejście przez północ
  return diff;
}
