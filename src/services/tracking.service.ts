import { api } from './api';

import type {
  CreateTrackingEntryDto,
  TrackingEntry,
  UpdateTrackingEntryDto,
} from '#/types';

export const trackingService = {
  list(params?: { from?: string; to?: string }): Promise<TrackingEntry[]> {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [
        string,
        string,
      ][],
    ).toString();
    return api.get<TrackingEntry[]>(`/tracking-entries${query ? `?${query}` : ''}`);
  },

  byDate(date: string): Promise<TrackingEntry[]> {
    return api.get<TrackingEntry[]>(`/tracking-entries/date/${date}`);
  },

  get(id: string): Promise<TrackingEntry> {
    return api.get<TrackingEntry>(`/tracking-entries/${id}`);
  },

  create(dto: CreateTrackingEntryDto): Promise<TrackingEntry> {
    return api.post<TrackingEntry>('/tracking-entries', dto);
  },

  update(id: string, dto: UpdateTrackingEntryDto): Promise<TrackingEntry> {
    return api.patch<TrackingEntry>(`/tracking-entries/${id}`, dto);
  },

  remove(id: string): Promise<void> {
    return api.delete<void>(`/tracking-entries/${id}`);
  },
};
