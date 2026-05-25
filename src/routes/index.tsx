import { createFileRoute, Link } from '@tanstack/react-router';


import { CycleCalendar } from '#/components/calendar/CycleCalendar';
import { useAuthContext } from '#/context/AuthContext';
import { useCycle } from '#/hooks/useCycle';
import { formatShortDate } from '#/utils/date';

import type { JSX } from 'react';

export const Route = createFileRoute('/')({ component: HomePage });

/* ── Static wellness tips ─────────────────────────────────────────────────── */
const TIPS = [
  {
    title: 'Be Comfortable',
    body: 'On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for abdominal relief.',
    bg: 'from-teal-400 to-teal-500',
    icon: '💧',
  },
  {
    title: 'Stay Comfortable',
    body: 'On heavy flow days, prioritize comfort. Stay hydrated and use heating pads for abdominal relief.',
    bg: 'from-pink-400 to-pink-500',
    icon: '🌸',
  },
  {
    title: 'Gentle Movement',
    body: 'Light yoga or walking can ease cramps and boost your mood during your cycle.',
    bg: 'from-violet-400 to-violet-500',
    icon: '🧘',
  },
] as const;

/* ── Quick actions ────────────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Log symptoms', icon: '🩺', to: '/tracking' },
  { label: 'Log period', icon: '📅', to: '/tracking' },
  { label: 'Health Report', icon: '📊', to: '/health-report' },
] as const;

/* ── Static trend topics ─────────────────────────────────────────────────── */
const TREND_TOPICS = [
  { label: 'Bloating', kind: 'Bloating' },
  { label: 'Mid-Morning, Cramps', kind: 'Physical' },
  { label: 'Symptom Intensity', kind: 'Change' },
] as const;

/* ── Static recommended articles ─────────────────────────────────────────── */
const ARTICLES = [
  {
    title: '5 Ways to Reduce Stress During Your Cycle',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    readTime: 'Read more →',
  },
  {
    title: 'Best Nutrition Tips for Better Energy',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    readTime: 'Read more →',
  },
  {
    title: 'How Sleep Affects Hormonal Balance',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80',
    readTime: 'Read more →',
  },
] as const;

function HomePage(): JSX.Element {
  const { isAuthenticated, openAuthModal } = useAuthContext();
  const { cycle, isLoading, prediction } = useCycle();

  return (
    <main className="page-wrap px-4 pb-12 pt-6">
      <div className="flex gap-6 lg:items-start">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="w-full space-y-4 lg:w-[380px] lg:flex-shrink-0">

          {/* Calendar */}
          {isLoading ? (
            <div className="cal-card flex h-64 items-center justify-center">
              <p className="text-sm text-white/70">Loading…</p>
            </div>
          ) : (
            <CycleCalendar cycle={cycle} prediction={prediction} />
          )}

          {/* Referral banner */}
          <div
            className="relative overflow-hidden rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg,#f472b6,#fb923c)' }}
          >
            <p className="text-sm font-bold text-white">
              Refer your friends to VivaFemini 🌸
            </p>
            <p className="mt-0.5 text-xs text-white/80">
              Share the love — earn free premium months
            </p>
            <button className="mt-3 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/30">
              Share link
            </button>
          </div>

          {/* Pregnancy test card */}
          <div className="card p-4">
            <p className="text-sm font-bold text-[var(--text)]">
              Did you take your pregnancy test? 🤰
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Don't take", 'Positive', 'Took it today', 'Negative'].map((opt) => (
                <button
                  key={opt}
                  className="rounded-full border border-[var(--border-mid)] px-3 py-1.5 text-xs font-medium text-[var(--text-soft)] transition hover:border-pink-300 hover:text-[var(--pink)]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--text-xsoft)]">
              Quick Action
            </p>
            <div className="grid grid-cols-3 gap-3">
              {QUICK_ACTIONS.map(({ label, icon, to }) => (
                <Link key={label} to={to} className="quick-action">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-semibold text-[var(--text-soft)] leading-tight text-center">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div className="hidden flex-1 space-y-5 lg:block">

          {/* Cycle Highlight */}
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-xsoft)]">Cycle Highlight</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--text)]">
              Understand your cycle and take care during peak days
            </h2>

            {prediction ? (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[var(--pink-xlight)] p-3 text-center">
                  <p className="text-xs text-[var(--text-xsoft)]">Ovulation window</p>
                  <p className="mt-1 text-sm font-bold text-[var(--pink)]">
                    {formatShortDate(prediction.ovulationStart)} – {formatShortDate(prediction.ovulationEnd)}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--pink-xlight)] p-3 text-center">
                  <p className="text-xs text-[var(--text-xsoft)]">Next period</p>
                  <p className="mt-1 text-sm font-bold text-[var(--pink)]">
                    {formatShortDate(prediction.estimatedNextPeriod)}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--pink-xlight)] p-3 text-center">
                  <p className="text-xs text-[var(--text-xsoft)]">Avg cycle</p>
                  <p className="mt-1 text-sm font-bold text-[var(--pink)]">
                    {prediction.averageCycleLength} days
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/tracking"
                    className="rounded-full bg-[var(--pink)] px-5 py-2 text-sm font-bold text-white transition hover:bg-[var(--pink-dark)]"
                  >
                    See Tips
                  </Link>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="rounded-full bg-[var(--pink)] px-5 py-2 text-sm font-bold text-white transition hover:bg-[var(--pink-dark)]"
                  >
                    Sign in to see tips
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Wellness tips */}
          <div className="grid grid-cols-3 gap-4">
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                className={`rounded-2xl bg-gradient-to-br ${tip.bg} p-4 text-white shadow-md`}
              >
                <span className="text-2xl">{tip.icon}</span>
                <h3 className="mt-2 text-sm font-bold">{tip.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/80">{tip.body}</p>
                <button className="mt-3 text-xs font-semibold text-white/90 underline-offset-2 hover:underline">
                  Listen to your body →
                </button>
              </div>
            ))}
          </div>

          {/* Daily check-ins */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text)]">Daily Check-Ins</h2>
              <Link to="/tracking" className="text-xs font-semibold text-[var(--pink)] hover:underline">
                Log today →
              </Link>
            </div>
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-[var(--bg)] px-3 py-2.5 text-xs">
                  <span className="font-medium text-[var(--text-soft)]">Symptoms</span>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-600 font-semibold">Mid-Morning, Cramps ›</span>
                  <span className="text-[var(--text-xsoft)]">Physical</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[var(--bg)] px-3 py-2.5 text-xs">
                  <span className="font-medium text-[var(--text-soft)]">Health Report</span>
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-pink-600 font-semibold">Phobia Logged ›</span>
                  <span className="text-[var(--text-xsoft)]">Symptom Intensity Change</span>
                </div>
              </div>
            ) : (
              <p className="py-3 text-center text-xs text-[var(--text-xsoft)]">
                <button onClick={openAuthModal} className="text-[var(--pink)] font-semibold hover:underline">Sign in</button> to see your daily logs
              </p>
            )}
          </div>

          {/* Trend Watch */}
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-bold text-[var(--text)]">Trend Watch</h2>
            <p className="mb-3 text-xs text-[var(--text-xsoft)]">Next Cramp Symptom</p>
            <div className="flex flex-wrap gap-2">
              {TREND_TOPICS.map(({ label }) => (
                <span
                  key={label}
                  className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-soft)] border border-[var(--border-mid)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div>
            <h2 className="mb-3 text-sm font-bold text-[var(--text)]">Recommended for You</h2>
            <div className="grid grid-cols-3 gap-4">
              {ARTICLES.map((a) => (
                <div key={a.title} className="card overflow-hidden">
                  <img
                    src={a.img}
                    alt={a.title}
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="text-xs font-semibold leading-snug text-[var(--text)]">{a.title}</p>
                    <button className="mt-2 text-xs font-bold text-[var(--pink)] hover:underline">
                      {a.readTime}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile: no cycle data = CTA */}
        {!isAuthenticated && (
          <div className="mt-4 block w-full rounded-2xl border border-[var(--border-mid)] bg-[var(--surface)] p-6 text-center lg:hidden">
            <span className="text-3xl">🌸</span>
            <h3 className="mt-2 font-bold text-[var(--text)]">Start tracking your cycle</h3>
            <p className="mt-1 text-xs text-[var(--text-xsoft)]">
              Log your first period to unlock predictions, insights, and health reports.
            </p>
            <button
              onClick={openAuthModal}
              className="mt-4 rounded-full bg-[var(--pink)] px-6 py-2.5 text-sm font-bold text-white"
            >
              Sign in to start
            </button>
          </div>
        )}

        {isAuthenticated && !cycle && !isLoading && (
          <div className="mt-4 block w-full rounded-2xl border border-[var(--border-mid)] bg-[var(--surface)] p-6 text-center lg:hidden">
            <span className="text-3xl">🌸</span>
            <h3 className="mt-2 font-bold text-[var(--text)]">Start tracking your cycle</h3>
            <p className="mt-1 text-xs text-[var(--text-xsoft)]">
              Log your first period to unlock predictions, insights, and health reports.
            </p>
            <Link
              to="/tracking"
              className="mt-4 inline-block rounded-full bg-[var(--pink)] px-6 py-2.5 text-sm font-bold text-white"
            >
              Log today
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
