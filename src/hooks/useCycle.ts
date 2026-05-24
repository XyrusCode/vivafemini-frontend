import { useCallback, useEffect, useState } from 'react';

import { cyclesService } from '#/services/cycles.service';
import type { Cycle, CyclePrediction, CreateCycleDto } from '#/types';

export function useCycle() {
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrent = useCallback(async () => {
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
