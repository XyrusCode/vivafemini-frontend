import { api } from './api';

import type { Symptom, SymptomCategory } from '#/types';

export const symptomsService = {
  list(category?: SymptomCategory): Promise<Symptom[]> {
    const query = category ? `?category=${category}` : '';
    return api.get<Symptom[]>(`/symptoms${query}`);
  },

  get(id: string): Promise<Symptom> {
    return api.get<Symptom>(`/symptoms/${id}`);
  },
};
