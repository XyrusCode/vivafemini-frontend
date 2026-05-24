import { createFileRoute } from '@tanstack/react-router';

import { CycleCalendar } from '#/components/calendar/CycleCalendar';
import { Card } from '#/components/ui/Card';
import { useCycle } from '#/hooks/useCycle';
import { formatDate, formatShortDate } from '#/utils/date';

export const Route = createFileRoute('/')({ component: HomePage });

function HomePage() {
  const { cycle, isLoading, prediction } = useCycle();

  return (
    <main className="page-wrap px-4 pb-10 pt-6">
      {/* Greeting */}
      <section className="mb-6">
        <p className="island-kicker mb-1 text-xs">Good morning 👋</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--sea-ink)]">
          How are you feeling today?
        </h1>
      </section>

      {/* Calendar */}
      <div className="mb-6">
        {isLoading ? (
          <div className="island-shell flex h-64 items-center justify-center rounded-2xl">
            <span className="text-sm text-[var(--sea-ink-soft)]">Loading…</span>
          </div>
        ) : (
          <CycleCalendar cycle={cycle} prediction={prediction} />
        )}
      </div>

      {/* Cycle highlights */}
      {prediction && (
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
            Cycle Highlights
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="flex flex-col gap-1">
              <span className="text-xl">🥚</span>
              <p className="text-xs text-[var(--sea-ink-soft)]">Ovulation window</p>
              <p className="text-sm font-semibold text-[var(--sea-ink)]">
                {formatShortDate(prediction.ovulationStart)} –{' '}
                {formatShortDate(prediction.ovulationEnd)}
              </p>
            </Card>
            <Card className="flex flex-col gap-1">
              <span className="text-xl">💧</span>
              <p className="text-xs text-[var(--sea-ink-soft)]">Next period</p>
              <p className="text-sm font-semibold text-[var(--sea-ink)]">
                {formatDate(prediction.estimatedNextPeriod)}
              </p>
            </Card>
            <Card className="flex flex-col gap-1">
              <span className="text-xl">📊</span>
              <p className="text-xs text-[var(--sea-ink-soft)]">Avg cycle</p>
              <p className="text-sm font-semibold text-[var(--sea-ink)]">
                {prediction.averageCycleLength} days
              </p>
            </Card>
          </div>
        </section>
      )}

      {/* Daily check-in CTA */}
      {!cycle && !isLoading && (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-4xl">🌸</span>
          <h3 className="font-semibold text-[var(--sea-ink)]">
            Start tracking your cycle
          </h3>
          <p className="max-w-xs text-sm text-[var(--sea-ink-soft)]">
            Log your first period to unlock predictions, insights, and health
            reports.
          </p>
          <a
            href="/tracking"
            className="mt-2 rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
          >
            Log today
          </a>
        </Card>
      )}
    </main>
  );
}
