import { api } from './api';

import type {
  HealthReport,
  HistoricalEntry,
  PeriodLengthPoint,
  SymptomFrequency,
} from '#/types';

export const healthReportsService = {
  latest(): Promise<HealthReport> {
    return api.get<HealthReport>('/health-reports/latest');
  },

  monthly(year: number, month: number): Promise<HealthReport> {
    return api.get<HealthReport>(`/health-reports/monthly/${year}/${month}`);
  },

  get(id: string): Promise<HealthReport> {
    return api.get<HealthReport>(`/health-reports/${id}`);
  },

  generate(): Promise<HealthReport> {
    return api.post<HealthReport>('/health-reports/generate', {});
  },

  downloadPdf(id: string): Promise<Blob> {
    return api.get<Blob>(`/health-reports/${id}/download-pdf`);
  },

  symptomFrequency(): Promise<SymptomFrequency[]> {
    return api.get<SymptomFrequency[]>('/analytics/symptom-frequency');
  },

  cycleTrends(): Promise<PeriodLengthPoint[]> {
    return api.get<PeriodLengthPoint[]>('/analytics/cycle-trends');
  },

  historicalEntries(): Promise<HistoricalEntry[]> {
    return api.get<HistoricalEntry[]>('/analytics/history');
  },
};
