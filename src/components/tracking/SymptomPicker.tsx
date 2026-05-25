import type { Symptom, SymptomCategory } from '#/types';
import type { JSX } from 'react';


interface SymptomPickerProps {
  grouped: Partial<Record<SymptomCategory, Symptom[]>>;
  categoryLabels: Record<SymptomCategory, string>;
  selected: string[];
  onChange: (ids: string[]) => void;
}

function toggleItem(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function SymptomPicker({
  categoryLabels,
  grouped,
  onChange,
  selected,
}: SymptomPickerProps): JSX.Element {
  return (
    <div className="space-y-6">
      {(Object.entries(grouped) as [SymptomCategory, Symptom[]][]).map(([cat, symptoms]) => (
        <div key={cat}>
          <h3 className="mb-3 text-sm font-bold text-[var(--text)]">
            {categoryLabels[cat]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => {
              const isSelected = selected.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => { onChange(toggleItem(selected, symptom.id)); }}
                  className={`chip${isSelected ? ' selected' : ''}`}
                >
                  <span>{symptom.iconEmoji}</span>
                  <span>{symptom.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
