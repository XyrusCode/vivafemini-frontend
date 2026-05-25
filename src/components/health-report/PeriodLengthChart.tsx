import type { PeriodLengthPoint } from '#/types';
import type { JSX } from 'react';


interface PeriodLengthChartProps {
  data: PeriodLengthPoint[];
}

const W = 560;
const H = 160;
const PAD_L = 36;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 32;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

export function PeriodLengthChart({ data }: PeriodLengthChartProps): JSX.Element {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[var(--text-xsoft)]">
        No period length data yet — log a few cycles to see trends.
      </p>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.length), 10);
  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  const pts = data.map((d, i) => ({
    x: PAD_L + (i / Math.max(data.length - 1, 1)) * INNER_W,
    y: PAD_T + INNER_H - (d.length / maxVal) * INNER_H,
    label: d.month,
    val: d.length,
  }));

  const polyline = pts.map((p) => `${String(p.x)},${String(p.y)}`).join(' ');

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${String(W)} ${String(H)}`}
        className="w-full min-w-[320px]"
        aria-label="Period length trend chart"
      >
        {/* Y-axis gridlines */}
        {yTicks.map((tick) => {
          const y = PAD_T + INNER_H - (tick / maxVal) * INNER_H;
          return (
            <g key={tick}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 3"/>
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{tick}</text>
            </g>
          );
        })}

        {/* Area fill */}
        {pts.length > 1 && (
          <polygon
            points={`${polyline} ${String(pts[pts.length - 1]?.x ?? 0)},${String(PAD_T + INNER_H)} ${String(PAD_L)},${String(PAD_T + INNER_H)}`}
            fill="url(#pinkFade)"
            opacity="0.3"
          />
        )}

        <defs>
          <linearGradient id="pinkFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Line */}
        {pts.length > 1 && (
          <polyline
            points={polyline}
            fill="none"
            stroke="#EC4899"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dots + tooltips */}
        {pts.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#EC4899" strokeWidth="2.5"/>
            {/* X-axis label */}
            <text x={p.x} y={H - 6} textAnchor="middle" fontSize="10" fill="#9CA3AF">{p.label}</text>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-center text-xs text-[var(--text-xsoft)]">
        ⓘ Higher peaks indicate stronger symptoms. Flow overlay (pink) shows heavier days.
      </p>
    </div>
  );
}
