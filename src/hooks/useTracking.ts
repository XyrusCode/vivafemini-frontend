import { useCallback, useEffect, useState } from 'react';

import { trackingService } from '#/services/tracking.service';

import type { CreateTrackingEntryDto, TrackingEntry } from '#/types';

export function useTracking(date?: string) {
  const [entries, setEntries] = useState<TrackingEntry[]>([]);
  // Start loading only if a token already exists; avoids synchronous setState in the effect
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('access_token'));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
