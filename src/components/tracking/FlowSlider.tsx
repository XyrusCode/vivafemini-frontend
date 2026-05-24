import { type JSX } from 'react';

interface FlowSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const LABELS = ['None', 'Light', 'Medium', 'Heavy', 'Very Heavy'];

export function FlowSlider({ onChange, value }: FlowSliderProps): JSX.Element {
  const label = LABELS[Math.round((value / 10) * (LABELS.length - 1))] ?? '';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--sea-ink)]">Flow Intensity</span>
        <span className="font-semibold text-pink-500">{label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-600 accent-pink-500"
      />
      <div className="flex justify-between text-xs text-[var(--sea-ink-soft)]">
        <span>Light</span>
        <span>Medium</span>
        <span>Heavy</span>
      </div>
    </div>
  );
}
