import type { JSX } from 'react';

interface FlowSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function FlowSlider({ onChange, value }: FlowSliderProps): JSX.Element {
  const pct = (value / 10) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-soft)]">How heavy is your flow today?</p>
        <span className="text-sm font-bold text-[var(--pink)]">{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        style={{ '--pct': `${String(pct)}%` } as React.CSSProperties}
        onChange={(e) => { onChange(Number(e.target.value)); }}
        className="w-full"
      />
      <div className="flex justify-between text-xs font-medium text-[var(--text-xsoft)]">
        <span>Light</span>
        <span>Medium</span>
        <span>Heavy</span>
      </div>
    </div>
  );
}
