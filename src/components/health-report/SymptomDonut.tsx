import { type JSX } from 'react';

import type { SymptomCategory } from '#/types';

interface Slice {
  category: SymptomCategory;
  label: string;
  percentage: number;
  color: string;
}

interface SymptomDonutProps {
  breakdown: Partial<Record<SymptomCategory, number>>;
}

const CATEGORY_CONFIG: Record<SymptomCategory, { color: string; label: string }> = {
  digestion_appetite: { color: '#f59e0b', label: 'Digestion' },
  mood_mental: { color: '#8b5cf6', label: 'Mood' },
  period_indicators: { color: '#ec4899', label: 'Period' },
  physical_pain: { color: '#ef4444', label: 'Physical' },
  sexual_health: { color: '#06b6d4', label: 'Sexual' },
};

function buildSlices(breakdown: Partial<Record<SymptomCategory, number>>): Slice[] {
  const total = Object.values(breakdown).reduce((s, v) => s + (v ?? 0), 0);
  if (total === 0) return [];
  return (Object.entries(breakdown) as [SymptomCategory, number][]).map(
    ([cat, val]) => ({
      category: cat,
      color: CATEGORY_CONFIG[cat].color,
      label: CATEGORY_CONFIG[cat].label,
      percentage: Math.round((val / total) * 100),
    }),
  );
}

export function SymptomDonut({ breakdown }: SymptomDonutProps): JSX.Element {
  const slices = buildSlices(breakdown);

  if (slices.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--sea-ink-soft)]">
        No data yet
      </p>
    );
  }

  // Build SVG conic-gradient equivalent via stroke-dasharray
  const size = 120;
  const r = 40;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 120 120">
        {slices.map((slice) => {
          const dash = (slice.percentage / 100) * circumference;
          const offset = circumference - cumulative * circumference * 0.01;
          cumulative += slice.percentage;
          return (
            <circle
              key={slice.category}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
            />
          );
        })}
        <circle cx="60" cy="60" r="28" className="fill-[var(--header-bg)]" />
      </svg>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {slices.map((slice) => (
          <div key={slice.category} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ background: slice.color }}
            />
            <span className="text-xs text-[var(--sea-ink-soft)]">
              {slice.label}{' '}
              <span className="font-semibold text-[var(--sea-ink)]">
                {slice.percentage}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
