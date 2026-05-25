import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type JSX } from 'react';

import { PeriodLengthChart } from '#/components/health-report/PeriodLengthChart';
import { SymptomDonut } from '#/components/health-report/SymptomDonut';
import { useAuthContext } from '#/context/AuthContext';
import { healthReportsService } from '#/services/health-reports.service';
import { formatDate } from '#/utils/date';

import type {
  HealthReport,
  HistoricalEntry,
  PeriodLengthPoint,
  SymptomFrequency,
} from '#/types';

export const Route = createFileRoute('/health-report')({ component: HealthReportPage });

/* ── Stat pill ─────────────────────────────────────────────────────────────── */
interface StatPillProps { icon: string; label: string; value: string; color?: string }
function StatPill({ icon, label, value, color = '#EC4899' }: StatPillProps): JSX.Element {
  return (
    <div className="stat-pill" style={{ borderColor: `${color}40`, color }}>
      <span>{icon}</span>
      <span style={{ color: 'var(--text-soft)' }} className="text-xs">{label}:</span>
      <span className="font-bold text-xs">{value}</span>
    </div>
  );
}

function HealthReportPage(): JSX.Element {
  const { isAuthenticated, openAuthModal } = useAuthContext();
  const [report, setReport] = useState<HealthReport | null>(null);
  const [trends, setTrends] = useState<PeriodLengthPoint[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomFrequency[]>([]);
  const [history, setHistory] = useState<HistoricalEntry[]>([]);
  // Start loading only if a token exists; avoids synchronous setState in the effect
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('access_token'));
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      return;
    }
    void Promise.all([
      healthReportsService.latest().catch(() => null),
      healthReportsService.cycleTrends().catch(() => []),
      healthReportsService.symptomFrequency().catch(() => []),
      healthReportsService.historicalEntries().catch(() => []),
    ]).then(([r, t, s, h]) => {
      setReport(r);
      setTrends(t);
      setSymptoms(s);
      setHistory(h);
      setIsLoading(false);
    });
  }, []);

  async function handleGenerate() {
    if (!isAuthenticated) { openAuthModal(); return; }
    setIsGenerating(true);
    const newReport = await healthReportsService.generate().catch(() => null);
    if (newReport) setReport(newReport);
    setIsGenerating(false);
  }

  /* ── Unauthenticated gate ── */
  if (!isAuthenticated && !isLoading) {
    return (
      <main className="page-wrap flex h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">📊</span>
        <h1 className="text-2xl font-bold text-[var(--text)]">Health Report</h1>
        <p className="text-sm text-[var(--text-xsoft)]">
          Sign in to view your personal cycle analytics and health trends.
        </p>
        <button
          onClick={openAuthModal}
          className="rounded-full bg-[var(--pink)] px-6 py-2.5 text-sm font-bold text-white"
        >
          Sign in to view report
        </button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="page-wrap flex h-[60vh] items-center justify-center px-4">
        <p className="text-sm text-[var(--text-xsoft)]">Loading your health report…</p>
      </main>
    );
  }

  return (
    <main className="page-wrap px-4 pb-12 pt-6">
      {/* ── Page header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Cycle Summary{report ? ` – ${report.monthYear}` : ''}
          </h1>
          {report && (
            <div className="mt-3 flex flex-wrap gap-2">
              <StatPill icon="🔄" label="Cycle Length" value={`${String(report.averageCycleLength)} Days`} color="#EC4899"/>
              {report.mostFrequentSymptom && (
                <StatPill icon="💊" label="Top Symptom" value={report.mostFrequentSymptom} color="#8B5CF6"/>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => void handleGenerate()}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl border border-[var(--border-mid)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-soft)] transition hover:border-pink-300 hover:text-[var(--pink)] disabled:opacity-50"
        >
          {isGenerating ? '⏳ Generating…' : '↻ Refresh'}
        </button>
      </div>

      {/* ── Top two-column ── */}
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        {/* Period Length chart */}
        <div className="card p-5">
          <h2 className="mb-1 text-sm font-bold text-[var(--text)]">Period Length</h2>
          <p className="mb-4 text-xs text-[var(--text-xsoft)]">Monthly period pattern (0–7 days) and flow intensity</p>
          <PeriodLengthChart data={trends} />
        </div>

        {/* Flow & Symptom Summary */}
        <div className="card p-5">
          <h2 className="mb-1 text-sm font-bold text-[var(--text)]">Flow & Symptom Summary</h2>
          <p className="mb-3 text-xs text-[var(--text-xsoft)]">Understand your symptoms linked to sleep & activity</p>
          {report ? (
            <>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                Your average cycle length is {report.averageCycleLength} days.
                {report.mostFrequentSymptom
                  ? ` PMS symptoms were more frequent this month. Flow pattern remains within a typical range.`
                  : ' Continue tracking to see personalized insights.'}
              </p>
              <div className="mt-4">
                <p className="text-xs font-bold text-[var(--pink)] mb-2">Tips To Adhere To:</p>
                <ul className="space-y-1 text-xs text-[var(--text-soft)]">
                  <li>• Low sleep nights → higher cramp scores</li>
                  <li>• Low hydration → increased bloating</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--text-xsoft)]">
              Generate your first report to see a personalized summary.
            </p>
          )}
        </div>
      </div>

      {/* ── Symptom Frequency ── */}
      <div className="card mb-5 p-5">
        <h2 className="mb-1 text-sm font-bold text-[var(--text)]">Symptom Frequency</h2>
        <p className="mb-5 text-xs text-[var(--text-xsoft)]">Study your body system & understand your wellbeing</p>
        <SymptomDonut breakdown={report?.symptomFrequencyBreakdown ?? {}} />
      </div>

      {/* ── Historical Cycle Data ── */}
      {history.length > 0 && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text)]">Historical Cycle Data</h2>
              {report && (
                <p className="text-xs text-[var(--text-xsoft)] flex items-center gap-1 mt-0.5">
                  {report.monthYear} <span>▾</span>
                </p>
              )}
            </div>
            <button className="flex items-center gap-2 rounded-full bg-[var(--pink)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--pink-dark)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-mid)] text-left text-xs text-[var(--text-xsoft)]">
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Top Symptom</th>
                  <th className="pb-3 pr-4 font-semibold">Total Symptoms</th>
                  <th className="pb-3 pr-4 font-semibold">Note</th>
                  <th className="pb-3 font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {history.map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--bg)] transition">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-[var(--text)]">{formatDate(row.date)}</span>
                    </td>
                    <td className="py-3 pr-4 text-[var(--text-soft)]">
                      {row.topSymptom ?? '—'}
                    </td>
                    <td className="py-3 pr-4 text-[var(--text-soft)]">
                      {String(row.totalSymptoms)}/10
                    </td>
                    <td className="max-w-[160px] truncate py-3 pr-4 text-[var(--text-xsoft)]">
                      {row.notes ?? '—'}
                    </td>
                    <td className="py-3">
                      <button className="text-[var(--text-xsoft)] hover:text-[var(--pink)] transition">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--text-xsoft)]">
            VivaFemini Menstrual health report • Generated from your tracked data
          </p>
        </div>
      )}

      {/* Empty state for top symptoms */}
      {symptoms.length > 0 && (
        <div className="card mt-5 p-5">
          <h2 className="mb-4 text-sm font-bold text-[var(--text)]">Most Frequent Symptoms</h2>
          <div className="space-y-3">
            {symptoms.slice(0, 8).map((s) => (
              <div key={s.symptomName} className="flex items-center gap-3">
                <span className="w-40 truncate text-sm text-[var(--text)]">{s.symptomName}</span>
                <div className="flex-1 rounded-full bg-[var(--border)] h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-[var(--pink)] transition-all"
                    style={{ width: `${String(s.percentage)}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-[var(--text-soft)]">
                  {String(s.percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
