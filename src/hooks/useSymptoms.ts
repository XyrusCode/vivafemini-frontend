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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    symptomsService
      .list()
      .then(setSymptoms)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load symptoms');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const grouped = symptoms.reduce<Partial<Record<SymptomCategory, Symptom[]>>>(
    (acc, symptom) => {
      const cat = symptom.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat]!.push(symptom);
      return acc;
    },
    {},
  );

  return { categoryLabels: CATEGORY_LABELS, error, grouped, isLoading, symptoms };
}
