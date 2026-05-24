import { api } from './api';

import type {
  CreateCycleDto,
  Cycle,
  CyclePrediction,
  UpdateCycleDto,
} from '#/types';

export const cyclesService = {
  list(): Promise<Cycle[]> {
    return api.get<Cycle[]>('/cycles');
  },

  current(): Promise<Cycle | null> {
    return api.get<Cycle | null>('/cycles/current');
  },

  get(id: string): Promise<Cycle> {
    return api.get<Cycle>(`/cycles/${id}`);
  },

  predictions(id: string): Promise<CyclePrediction> {
    return api.get<CyclePrediction>(`/cycles/${id}/predictions`);
  },

  create(dto: CreateCycleDto): Promise<Cycle> {
    return api.post<Cycle>('/cycles', dto);
  },

  update(id: string, dto: UpdateCycleDto): Promise<Cycle> {
    return api.patch<Cycle>(`/cycles/${id}`, dto);
  },

  remove(id: string): Promise<void> {
    return api.delete<void>(`/cycles/${id}`);
  },
};
