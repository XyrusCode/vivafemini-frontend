// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

// ─── Cycle ───────────────────────────────────────────────────────────────────

export type CycleStatus = 'active' | 'completed' | 'paused';

export interface Cycle {
  id: string;
  userId: string;
  cycleStartDate: string;
  cycleEndDate: string | null;
  cycleLength: number;
  periodStartDate: string;
  periodEndDate: string | null;
  periodDuration: number | null;
  estimatedNextPeriod: string | null;
  ovulationStartDate: string | null;
  ovulationEndDate: string | null;
  status: CycleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CyclePrediction {
  estimatedNextPeriod: string;
  ovulationStart: string;
  ovulationEnd: string;
  averageCycleLength: number;
}

export interface CreateCycleDto {
  cycleStartDate: string;
  periodStartDate: string;
}

export interface UpdateCycleDto {
  cycleEndDate?: string;
  periodEndDate?: string;
  periodDuration?: number;
}

// ─── Symptoms ─────────────────────────────────────────────────────────────────

export type SymptomCategory =
  | 'physical_pain'
  | 'mood_mental'
  | 'digestion_appetite'
  | 'period_indicators'
  | 'sexual_health';

export interface Symptom {
  id: string;
  name: string;
  category: SymptomCategory;
  iconEmoji: string;
  colorCode: string;
  isActive: boolean;
}

// ─── Tracking ─────────────────────────────────────────────────────────────────

export interface TrackingSymptom {
  id: string;
  symptomId: string;
  symptom: Symptom;
  severityLevel: number | null;
}

export interface TrackingEntry {
  id: string;
  userId: string;
  cycleId: string | null;
  date: string;
  time: string;
  flowIntensity: number | null;
  notes: string | null;
  symptoms: TrackingSymptom[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackingEntryDto {
  date: string;
  time?: string;
  cycleId?: string;
  flowIntensity?: number;
  notes?: string;
  symptomIds: string[];
}

export interface UpdateTrackingEntryDto {
  flowIntensity?: number;
  notes?: string;
  symptomIds?: string[];
}

// ─── Analytics & Reports ──────────────────────────────────────────────────────

export interface SymptomFrequency {
  symptomName: string;
  count: number;
  percentage: number;
  category: SymptomCategory;
}

export interface PeriodLengthPoint {
  month: string;
  length: number;
}

export interface CycleSummary {
  cycleLength: number;
  periodDuration: number;
  estimatedNextPeriod: string;
  ovulationStart: string;
  ovulationEnd: string;
  averageCycleLength: number;
  mostFrequentSymptom: string | null;
}

export interface HealthReport {
  id: string;
  userId: string;
  cycleId: string;
  monthYear: string;
  averageCycleLength: number;
  pmsSymptomFrequency: Record<string, number>;
  mostFrequentSymptom: string | null;
  periodLengthTrend: PeriodLengthPoint[];
  symptomFrequencyBreakdown: Record<SymptomCategory, number>;
  generatedAt: string;
}

export interface HistoricalEntry {
  date: string;
  topSymptom: string | null;
  totalSymptoms: number;
  notes: string | null;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export type DayType = 'period' | 'ovulation' | 'predicted' | 'normal' | 'today';

export interface CalendarDay {
  date: string;
  type: DayType;
  hasEntry: boolean;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
