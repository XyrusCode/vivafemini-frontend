import { useCallback, useEffect, useState } from 'react';

import { cyclesService } from '#/services/cycles.service';

import type { Cycle, CyclePrediction, CreateCycleDto } from '#/types';

export function useCycle() {
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  // Start loading only if a token already exists; avoids synchronous setState in the effect
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('access_token'));
  const [error, setError] = useState<string | null>(null);

  const fetchCurrent = useCallback(async () => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
    try {
      setIsLoading(true);
      const current = await cyclesService.current();
      setCycle(current);
      if (current) {
        const pred = await cyclesService.predictions(current.id);
        setPrediction(pred);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cycle');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCurrent();
  }, [fetchCurrent]);

  const startCycle = useCallback(
    async (dto: CreateCycleDto) => {
      const newCycle = await cyclesService.create(dto);
      setCycle(newCycle);
      const pred = await cyclesService.predictions(newCycle.id);
      setPrediction(pred);
    },
    [],
  );

  return { cycle, error, isLoading, prediction, refetch: fetchCurrent, startCycle };
}
