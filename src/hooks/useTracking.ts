import { useCallback, useEffect, useState } from 'react';

import { trackingService } from '#/services/tracking.service';
import type { CreateTrackingEntryDto, TrackingEntry } from '#/types';

export function useTracking(date?: string) {
  const [entries, setEntries] = useState<TrackingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = date
        ? await trackingService.byDate(date)
        : await trackingService.list();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const save = useCallback(
    async (dto: CreateTrackingEntryDto): Promise<TrackingEntry> => {
      setIsSaving(true);
      try {
        const entry = await trackingService.create(dto);
        setEntries((prev) => [entry, ...prev]);
        return entry;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await trackingService.remove(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, error, isLoading, isSaving, refetch: fetch, remove, save };
}
