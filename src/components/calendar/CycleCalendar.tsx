import { useMemo, useState, type JSX } from 'react';

import { isSameDay, todayIso, getMonthMatrix } from '#/utils/date';

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
      map.set(d.toISOString().split('T')[0], 'period');
    }
  }

  if (prediction) {
    const ovStart = new Date(prediction.ovulationStart);
    const ovEnd = new Date(prediction.ovulationEnd);
    for (let d = new Date(ovStart); d <= ovEnd; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      if (!map.has(key)) map.set(key, 'ovulation');
    }
    const nextPeriodStart = new Date(prediction.estimatedNextPeriod);
    for (let i = 0; i < 5; i++) {
      const d = new Date(nextPeriodStart);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      if (!map.has(key)) map.set(key, 'predicted');
    }
  }

  map.set(today, 'today');
  return map;
}

const dayCellCls: Record<CalendarDay['type'], string> = {
  normal:    'text-white/80 hover:bg-white/20',
  period:    'bg-white/30 text-white font-semibold',
  ovulation: 'bg-purple-400/40 text-white font-semibold',
  predicted: 'bg-pink-200/30 text-white/70',
  today:     'bg-white text-pink-600 font-bold shadow-md',
};

function cyclePhaseLabel(prediction: CyclePrediction | null, cycle: Cycle | null): string {
  if (!cycle && !prediction) return 'No cycle tracked yet';
  const today = todayIso();
  if (!prediction) return 'Cycle active';
  const ov1 = prediction.ovulationStart.split('T')[0];
  const ov2 = prediction.ovulationEnd.split('T')[0];
  if (today >= ov1 && today <= ov2) return 'Today is Fertile Day';
  if (cycle) {
    const ps = cycle.periodStartDate.split('T')[0];
    const pe = cycle.periodEndDate?.split('T')[0] ?? '';
    if (today >= ps && (!pe || today <= pe)) return 'Period Day';
  }
  return 'Cycle Tracking Active';
}

export function CycleCalendar({ cycle, onDayClick, prediction }: CycleCalendarProps): JSX.Element {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const matrix = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);
  const dayMap = useMemo(() => buildDayMap(cycle, prediction), [cycle, prediction]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long' });
  const today = todayIso();
  const todayNum = now.getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  const phase = cyclePhaseLabel(prediction, cycle);
  const cycleDay = cycle
    ? Math.floor((now.getTime() - new Date(cycle.cycleStartDate).getTime()) / 86_400_000) + 1
    : null;

  return (
    <div className="cal-card overflow-hidden">
      {/* ── Calendar grid ── */}
      <div className="px-5 pt-5 pb-4">
        {/* Month header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-white">
            Today, {monthLabel} ▾
          </span>
          <button
            onClick={nextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Day labels */}
        <div className="mb-2 grid grid-cols-7 text-center">
          {DAY_LABELS.map((d) => (
            <span key={d} className="text-xs font-semibold text-white/60">{d}</span>
          ))}
        </div>

        {/* Weeks */}
        {matrix.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-y-0.5">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="h-9" />;
              const iso = day.toISOString().split('T')[0];
              const type: CalendarDay['type'] = isSameDay(iso, today)
                ? 'today'
                : (dayMap.get(iso) ?? 'normal');
              return (
                <button
                  key={iso}
                  onClick={() => onDayClick?.(iso)}
                  className={[
                    'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition',
                    dayCellCls[type],
                  ].join(' ')}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Day spotlight ── */}
      <div className="border-t border-white/20 bg-white/10 px-5 py-4">
        <div className="flex items-center gap-5">
          {/* Concentric ring display */}
          <div className="relative flex-shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-white shadow-md">
                <span className="text-xl font-black text-pink-500">{todayNum}</span>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-white">{phase}</p>
            {cycleDay !== null && (
              <p className="text-xs text-white/70">
                Day Cycle: <span className="font-semibold text-white">{cycleDay} Days</span>
              </p>
            )}
            {prediction && (
              <p className="text-xs text-white/70">
                Avg Cycle: <span className="font-semibold text-white">{prediction.averageCycleLength} Days</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 bg-white/5 px-5 py-3">
        {([
          ['period',    'Period',    'bg-white/40'],
          ['ovulation', 'Ovulation', 'bg-purple-400/60'],
          ['predicted', 'Predicted', 'bg-pink-200/50'],
          ['today',     'Today',     'bg-white'],
        ] as const).map(([, label, dot]) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-white/70">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
