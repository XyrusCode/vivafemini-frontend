import { useMemo, useState, type JSX } from 'react';

import { isSameDay, todayIso } from '#/utils/date';
import { getMonthMatrix } from '#/utils/date';
import type { CalendarDay, Cycle, CyclePrediction } from '#/types';

interface CycleCalendarProps {
  cycle: Cycle | null;
  prediction: CyclePrediction | null;
  onDayClick?: (date: string) => void;
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function buildDayMap(
  cycle: Cycle | null,
  prediction: CyclePrediction | null,
): Map<string, CalendarDay['type']> {
  const map = new Map<string, CalendarDay['type']>();
  const today = todayIso();

  if (cycle) {
    const start = new Date(cycle.periodStartDate);
    const end = cycle.periodEndDate
      ? new Date(cycle.periodEndDate)
      : new Date(start.getTime() + 5 * 86_400_000);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      map.set(d.toISOString().split('T')[0]!, 'period');
    }
  }

  if (prediction) {
    const ovStart = new Date(prediction.ovulationStart);
    const ovEnd = new Date(prediction.ovulationEnd);
    for (let d = new Date(ovStart); d <= ovEnd; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0]!;
      if (!map.has(key)) map.set(key, 'ovulation');
    }

    const nextPeriodStart = new Date(prediction.estimatedNextPeriod);
    for (let i = 0; i < 5; i++) {
      const d = new Date(nextPeriodStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0]!;
      if (!map.has(key)) map.set(key, 'predicted');
    }
  }

  map.set(today, 'today');
  return map;
}

const dayDotStyles: Record<CalendarDay['type'], string> = {
  normal: '',
  ovulation: 'bg-blue-400',
  period: 'bg-pink-500',
  predicted: 'bg-pink-300',
  today: 'bg-[var(--lagoon-deep)]',
};

const dayCellStyles: Record<CalendarDay['type'], string> = {
  normal: 'hover:bg-[var(--link-bg-hover)]',
  ovulation: 'bg-blue-100/60 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  period: 'bg-pink-100/70 dark:bg-pink-900/25 text-pink-700 dark:text-pink-300 font-semibold',
  predicted: 'bg-pink-50 dark:bg-pink-900/10 text-pink-500',
  today:
    'ring-2 ring-[var(--lagoon-deep)] bg-[var(--lagoon-deep)]/10 font-bold text-[var(--lagoon-deep)]',
};

export function CycleCalendar({
  cycle,
  onDayClick,
  prediction,
}: CycleCalendarProps): JSX.Element {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const matrix = useMemo(
    () => getMonthMatrix(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const dayMap = useMemo(
    () => buildDayMap(cycle, prediction),
    [cycle, prediction],
  );

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <div className="island-shell rounded-2xl p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--sea-ink)]">
          {monthLabel}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)]"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)]"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_LABELS.map((d) => (
          <span
            key={d}
            className="text-xs font-medium text-[var(--sea-ink-soft)]"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Weeks */}
      {matrix.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-0.5">
          {week.map((day, di) => {
            if (!day) return <div key={di} />;
            const iso = day.toISOString().split('T')[0]!;
            const today = todayIso();
            const type: CalendarDay['type'] = isSameDay(iso, today)
              ? 'today'
              : (dayMap.get(iso) ?? 'normal');
            return (
              <button
                key={iso}
                onClick={() => onDayClick?.(iso)}
                className={[
                  'relative flex h-9 w-full items-center justify-center rounded-xl text-sm transition',
                  dayCellStyles[type],
                ].join(' ')}
              >
                {day.getDate()}
                {dayMap.has(iso) && type !== 'today' && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${dayDotStyles[type]}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {(
          [
            ['period', 'Period', 'bg-pink-500'],
            ['ovulation', 'Ovulation', 'bg-blue-400'],
            ['predicted', 'Predicted', 'bg-pink-300'],
            ['today', 'Today', 'bg-[var(--lagoon-deep)]'],
          ] as const
        ).map(([, label, dot]) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-[var(--sea-ink-soft)]">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
