import { useState, type JSX } from 'react';

import type { Symptom, SymptomCategory } from '#/types';

interface SymptomPickerProps {
  grouped: Partial<Record<SymptomCategory, Symptom[]>>;
  categoryLabels: Record<SymptomCategory, string>;
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function SymptomPicker({
  categoryLabels,
  grouped,
  onChange,
  selected,
}: SymptomPickerProps): JSX.Element {
  const [expanded, setExpanded] = useState<Set<SymptomCategory>>(
    new Set(['physical_pain', 'mood_mental']),
  );

  function toggleCategory(cat: SymptomCategory) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleSymptom(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-2">
      {(Object.entries(grouped) as [SymptomCategory, Symptom[]][]).map(
        ([cat, symptoms]) => (
          <div key={cat} className="rounded-xl border border-[var(--line)] overflow-hidden">
            <button
              onClick={() => toggleCategory(cat)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] transition"
            >
              <span>{categoryLabels[cat]}</span>
              <span className="text-[var(--sea-ink-soft)]">
                {expanded.has(cat) ? '▲' : '▼'}
              </span>
            </button>

            {expanded.has(cat) && (
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                {symptoms.map((symptom) => {
                  const isSelected = selected.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={[
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition',
                        isSelected
                          ? 'bg-pink-500 text-white shadow-sm'
                          : 'border border-[var(--line)] bg-white/60 text-[var(--sea-ink)] hover:border-pink-300 hover:bg-pink-50 dark:bg-white/5',
                      ].join(' ')}
                    >
                      <span>{symptom.iconEmoji}</span>
                      {symptom.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
}
