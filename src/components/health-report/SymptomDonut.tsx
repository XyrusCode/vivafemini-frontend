import type { SymptomCategory } from '#/types';
import type { JSX } from 'react';


interface SymptomDonutProps {
  breakdown: Partial<Record<SymptomCategory, number>>;
}

const CATEGORY_CONFIG: Record<SymptomCategory, { color: string; label: string }> = {
  physical_pain:       { color: '#EC4899', label: 'Physical Pain' },
  mood_mental:         { color: '#8B5CF6', label: 'Mood & Mental' },
  digestion_appetite:  { color: '#F59E0B', label: 'Digestion & Appetite' },
  period_indicators:   { color: '#F472B6', label: 'Period Indicators' },
  sexual_health:       { color: '#14B8A6', label: 'Sexual Health' },
};

interface DonutProps {
  percentage: number;
  color: string;
  label: string;
}

function Donut({ percentage, color, label }: DonutProps): JSX.Element {
  const R = 32;
  const circ = 2 * Math.PI * R;
  const dash = (percentage / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Track */}
          <circle cx="40" cy="40" r={R} fill="none" stroke="#F3F4F6" strokeWidth="10"/>
          {/* Arc */}
          <circle
            cx="40" cy="40" r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${String(dash)} ${String(circ - dash)}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
          />
          {/* Percentage label */}
          <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1F2937">
            {String(percentage)}%
          </text>
        </svg>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: color }}/>
        <span className="text-xs text-[var(--text-soft)] text-center leading-tight">{label}</span>
      </div>
    </div>
  );
}

export function SymptomDonut({ breakdown }: SymptomDonutProps): JSX.Element {
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--text-xsoft)]">
        No symptom data yet — start tracking to see your breakdown.
      </p>
    );
  }

  const items = (Object.entries(breakdown) as [SymptomCategory, number][]).map(([cat, val]) => ({
    category: cat,
    color: CATEGORY_CONFIG[cat].color,
    label: CATEGORY_CONFIG[cat].label,
    percentage: Math.round((val / total) * 100),
  }));

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {items.map((item) => (
        <Donut key={item.category} percentage={item.percentage} color={item.color} label={item.label} />
      ))}
    </div>
  );
}
