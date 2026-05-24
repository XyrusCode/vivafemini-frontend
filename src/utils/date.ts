// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function todayIso(): string {
  return new Date().toISOString().split('T')[0]!;
}

export function isSameDay(a: string, b: string): boolean {
  return a.split('T')[0] === b.split('T')[0];
}

// ─── Calendar generation ──────────────────────────────────────────────────────

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getMonthMatrix(year: number, month: number): (Date | null)[][] {
  const days = getDaysInMonth(year, month);
  const startDay = days[0]!.getDay(); // 0 = Sun
  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(startDay).fill(null) as null[];
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

// ─── Cycle helpers ────────────────────────────────────────────────────────────

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86_400_000);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0]!;
}
