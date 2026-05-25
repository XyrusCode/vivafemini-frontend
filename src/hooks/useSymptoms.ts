import { useEffect, useState } from 'react';

import { symptomsService } from '#/services/symptoms.service';

import type { Symptom, SymptomCategory } from '#/types';

const CATEGORY_LABELS: Record<SymptomCategory, string> = {
  digestion_appetite: 'Digestion & Appetite',
  mood_mental: 'Mood & Mental',
  period_indicators: 'Period Indicators',
  physical_pain: 'Physical Pain',
  sexual_health: 'Sexual Health',
};

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  // Start loading only if a token already exists; avoids synchronous setState in the effect
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('access_token'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
    symptomsService
      .list()
      .then(setSymptoms)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load symptoms');
      })
      .finally(() => { setIsLoading(false); });
  }, []);

  const grouped = symptoms.reduce<Partial<Record<SymptomCategory, Symptom[]>>>(
    (acc, symptom) => {
      const cat = symptom.category;
      acc[cat] ??= [];
      acc[cat].push(symptom);
      return acc;
    },
    {},
  );

  return { categoryLabels: CATEGORY_LABELS, error, grouped, isLoading, symptoms };
}
