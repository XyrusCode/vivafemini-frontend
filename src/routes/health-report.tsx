import { useEffect, useState, type JSX } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { PeriodLengthChart } from '#/components/health-report/PeriodLengthChart';
import { SymptomDonut } from '#/components/health-report/SymptomDonut';
import { Card } from '#/components/ui/Card';
import { healthReportsService } from '#/services/health-reports.service';
import type {
  HealthReport,
  HistoricalEntry,
  PeriodLengthPoint,
  SymptomFrequency,
} from '#/types';
import { formatDate } from '#/utils/date';

export const Route = createFileRoute('/health-report')({ component: HealthReportPage });

function HealthReportPage(): JSX.Element {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [trends, setTrends] = useState<PeriodLengthPoint[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomFrequency[]>([]);
  const [history, setHistory] = useState<HistoricalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
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
    setIsGenerating(true);
    const newReport = await healthReportsService.generate().catch(() => null);
    if (newReport) setReport(newReport);
    setIsGenerating(false);
  }

  if (isLoading) {
    return (
      <main className="page-wrap flex h-[60vh] items-center justify-center px-4">
        <p className="text-sm text-[var(--sea-ink-soft)]">Loading your health report…</p>
      </main>
    );
  }

  return (
    <main className="page-wrap px-4 pb-10 pt-6">
      <section className="mb-6 flex items-start justify-between">
        <div>
          <p className="island-kicker mb-1 text-xs">Analytics</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--sea-ink)]">
            Health Report
          </h1>
          {report && (
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
              {report.monthYear} · Generated {formatDate(report.generatedAt)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void handleGenerate()}
            disabled={isGenerating}
            className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)] disabled:opacity-50 dark:bg-white/5"
          >
            {isGenerating ? 'Generating…' : '↻ Refresh'}
          </button>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Cycle Summary */}
        {report && (
          <Card title="Cycle Summary">
            <dl className="space-y-3">
              {[
                ['Avg Cycle Length', `${report.averageCycleLength} days`],
                ['Most frequent symptom', report.mostFrequentSymptom ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-sm text-[var(--sea-ink-soft)]">{label}</dt>
                  <dd className="text-sm font-semibold text-[var(--sea-ink)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        )}

        {/* Symptom breakdown donut */}
        <Card title="Symptom Breakdown">
          <SymptomDonut breakdown={report?.symptomFrequencyBreakdown ?? {}} />
        </Card>

        {/* Period length chart */}
        <Card title="Period Length Trend" className="lg:col-span-2">
          <PeriodLengthChart data={trends} />
        </Card>

        {/* Top symptoms */}
        {symptoms.length > 0 && (
          <Card title="Most Frequent Symptoms" className="lg:col-span-2">
            <div className="space-y-2">
              {symptoms.slice(0, 8).map((s) => (
                <div key={s.symptomName} className="flex items-center gap-3">
                  <span className="w-36 truncate text-sm text-[var(--sea-ink)]">
                    {s.symptomName}
                  </span>
                  <div className="flex-1 rounded-full bg-[var(--line)] h-2">
                    <div
                      className="h-2 rounded-full bg-pink-400 transition-all"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-[var(--sea-ink-soft)]">
                    {s.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* History table */}
        {history.length > 0 && (
          <Card title="Log History" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-left text-xs text-[var(--sea-ink-soft)]">
                    <th className="pb-2 pr-4 font-medium">Date</th>
                    <th className="pb-2 pr-4 font-medium">Top Symptom</th>
                    <th className="pb-2 pr-4 font-medium">Total</th>
                    <th className="pb-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {history.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 text-[var(--sea-ink)]">
                        {formatDate(row.date)}
                      </td>
                      <td className="py-2 pr-4 text-[var(--sea-ink-soft)]">
                        {row.topSymptom ?? '—'}
                      </td>
                      <td className="py-2 pr-4 text-[var(--sea-ink-soft)]">
                        {row.totalSymptoms}
                      </td>
                      <td className="max-w-xs truncate py-2 text-[var(--sea-ink-soft)]">
                        {row.notes ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
