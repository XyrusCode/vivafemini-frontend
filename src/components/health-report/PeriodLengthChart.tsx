import { type JSX } from 'react';

import type { PeriodLengthPoint } from '#/types';

interface PeriodLengthChartProps {
  data: PeriodLengthPoint[];
}

const MAX_HEIGHT = 120;
const MAX_DAYS = 10;

export function PeriodLengthChart({ data }: PeriodLengthChartProps): JSX.Element {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--sea-ink-soft)]">
        No data yet
      </p>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.length), MAX_DAYS);

  return (
    <div className="relative">
      {/* Y-axis gridlines */}
      <div className="absolute inset-0 flex flex-col justify-between pb-6">
        {[maxVal, Math.round(maxVal / 2), 0].map((v) => (
          <div key={v} className="flex items-center gap-2">
            <span className="w-4 text-right text-xs text-[var(--sea-ink-soft)]">
              {v}
            </span>
            <div className="flex-1 border-t border-dashed border-[var(--line)]" />
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="relative flex items-end gap-2 pb-6 pl-8" style={{ height: MAX_HEIGHT + 24 }}>
        {data.map((point) => {
          const heightPx = Math.round((point.length / maxVal) * MAX_HEIGHT);
          return (
            <div
              key={point.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-pink-400 to-pink-300 transition-all group-hover:from-pink-500 group-hover:to-pink-400"
                style={{ height: heightPx }}
                title={`${point.length} days`}
              />
              <span className="mt-1 text-center text-xs text-[var(--sea-ink-soft)]">
                {point.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
