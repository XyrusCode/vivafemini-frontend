import { createFileRoute } from '@tanstack/react-router';
import { useState, type JSX } from 'react';

import { FlowSlider } from '#/components/tracking/FlowSlider';
import { SymptomPicker } from '#/components/tracking/SymptomPicker';
import { useAuthContext } from '#/context/AuthContext';
import { useSymptoms } from '#/hooks/useSymptoms';
import { useTracking } from '#/hooks/useTracking';
import { todayIso } from '#/utils/date';

export const Route = createFileRoute('/tracking')({
  component: TrackingPage,
  head: () => ({
    meta: [
      { title: 'Log Symptoms — VivaFemini' },
      {
        name: 'description',
        content:
          'Log your daily symptoms, flow intensity, and notes to track your menstrual health over time.',
      },
      { property: 'og:title', content: 'Log Symptoms — VivaFemini' },
      {
        property: 'og:description',
        content: 'Log daily symptoms, flow intensity, and notes to understand your cycle patterns.',
      },
      { property: 'og:url', content: 'https://vivafemini-frontend.vercel.app/tracking' },
    ],
  }),
});

/* Illustration made from Lucide-style paths */
function TrackingIllustration(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      {/* SVG illustration — abstract health/phone composition */}
      <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Phone body */}
        <rect x="55" y="30" width="70" height="110" rx="12" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="2"/>
        <rect x="63" y="44" width="54" height="70" rx="6" fill="#FFF5FB"/>
        {/* Heart on screen */}
        <path d="M90 79c-1-3-5-7-9-5s-5 7-2 10l11 11 11-11c3-3 2-8-2-10s-8 2-9 5z" fill="#EC4899" opacity="0.85"/>
        {/* Wave / heartbeat on screen */}
        <polyline points="64,98 72,98 76,88 82,108 88,94 94,94 98,98 108,98 112,94 116,98" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Home button */}
        <rect x="78" y="128" width="24" height="4" rx="2" fill="#F9A8D4"/>
        {/* Floating pill capsule */}
        <rect x="18" y="48" width="28" height="14" rx="7" fill="#F472B6" opacity="0.7"/>
        <circle cx="32" cy="55" r="4" fill="white" opacity="0.6"/>
        {/* Flower / petal top-right */}
        <circle cx="148" cy="42" r="8" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="1.5"/>
        <circle cx="156" cy="34" r="6" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="1.5"/>
        <circle cx="148" cy="34" r="5" fill="#EC4899" opacity="0.3"/>
        {/* Small dots */}
        <circle cx="25" cy="100" r="4" fill="#F472B6" opacity="0.5"/>
        <circle cx="152" cy="100" r="5" fill="#FCE7F3" stroke="#F9A8D4" strokeWidth="1.5"/>
        <circle cx="160" cy="72" r="3" fill="#F9A8D4" opacity="0.7"/>
        {/* Calendar icon bottom-left */}
        <rect x="20" y="118" width="22" height="18" rx="4" fill="white" stroke="#F9A8D4" strokeWidth="1.5"/>
        <line x1="20" y1="125" x2="42" y2="125" stroke="#F9A8D4" strokeWidth="1.5"/>
        <circle cx="27" cy="116" r="2" fill="#EC4899"/>
        <circle cx="35" cy="116" r="2" fill="#EC4899"/>
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-xsoft)]">Log Menstrual Symptoms</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--text)]">Welcome,</h2>
        <h3 className="text-lg font-semibold text-[var(--text-soft)]">How are you doing today?</h3>
        <p className="mx-auto mt-2 max-w-[220px] text-xs text-[var(--text-xsoft)] leading-relaxed">
          Get to track your symptoms daily, to know your state of wellbeing
        </p>
      </div>
    </div>
  );
}

function TrackingPage(): JSX.Element {
  const { isAuthenticated, openAuthModal } = useAuthContext();
  const today = todayIso();
  const { grouped, categoryLabels, isLoading: symptomsLoading, error: symptomsError } = useSymptoms();
  const { save, isSaving } = useTracking(today);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flowIntensity, setFlowIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!isAuthenticated) { openAuthModal(); return; }
    await save({ date: today, flowIntensity, notes: notes.trim() || undefined, symptomIds: selectedSymptoms });
    setSaved(true);
    setSelectedSymptoms([]);
    setFlowIntensity(3);
    setNotes('');
    setTimeout(() => { setSaved(false); }, 3000);
  }

  /* Categories to show on the LEFT panel (period + sexual health) */
  const LEFT_CATS = new Set(['period_indicators', 'sexual_health']);
  const leftGrouped = Object.fromEntries(
    Object.entries(grouped).filter(([cat]) => LEFT_CATS.has(cat)),
  ) as typeof grouped;

  /* Categories to show on the RIGHT panel (everything else) */
  const rightGrouped = Object.fromEntries(
    Object.entries(grouped).filter(([cat]) => !LEFT_CATS.has(cat)),
  ) as typeof grouped;

  return (
    <main className="page-wrap px-4 pb-12 pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div className="hidden w-[340px] flex-shrink-0 space-y-4 lg:block">
          {/* Illustration card */}
          <div className="card">
            <TrackingIllustration />
          </div>

          {/* Left-side symptom categories */}
          {!symptomsLoading && Object.keys(leftGrouped).length > 0 && (
            <div className="card p-5">
              <SymptomPicker
                grouped={leftGrouped}
                categoryLabels={categoryLabels}
                selected={selectedSymptoms}
                onChange={setSelectedSymptoms}
              />
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-4">
          {/* Mobile illustration */}
          <div className="card lg:hidden">
            <TrackingIllustration />
          </div>

          {symptomsLoading ? (
            <div className="card flex h-32 items-center justify-center">
              <p className="text-sm text-[var(--text-soft)]">Loading symptoms…</p>
            </div>
          ) : symptomsError ? (
            <div className="card flex h-32 items-center justify-center px-5 text-center">
              <p className="text-sm text-red-500">Could not load symptoms. Please refresh.</p>
            </div>
          ) : (
            <>
              {/* Right symptom categories (main ones) */}
              {Object.keys(rightGrouped).length > 0 && (
                <div className="card p-5">
                  <SymptomPicker
                    grouped={rightGrouped}
                    categoryLabels={categoryLabels}
                    selected={selectedSymptoms}
                    onChange={setSelectedSymptoms}
                  />
                </div>
              )}

              {/* Mobile: left categories too */}
              {Object.keys(leftGrouped).length > 0 && (
                <div className="card p-5 lg:hidden">
                  <SymptomPicker
                    grouped={leftGrouped}
                    categoryLabels={categoryLabels}
                    selected={selectedSymptoms}
                    onChange={setSelectedSymptoms}
                  />
                </div>
              )}
            </>
          )}

          {/* Flow Intensity */}
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-bold text-[var(--text)]">Flow Intensity</h3>
            <FlowSlider value={flowIntensity} onChange={setFlowIntensity} />
          </div>

          {/* Notes */}
          <div className="card p-5">
            <div className="mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-soft)]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <h3 className="text-sm font-bold text-[var(--text)]">Notes</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); }}
              placeholder="Leave A Note"
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--border-mid)] bg-transparent p-3 text-sm text-[var(--text)] placeholder:text-[var(--text-xsoft)] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          {/* Success banner */}
          {saved && (
            <div className="rounded-2xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-600 border border-emerald-200">
              ✅ Entry saved successfully!
            </div>
          )}

          {/* Save button */}
          <button
            onClick={() => void handleSave()}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--pink)] py-4 text-base font-bold text-white shadow-lg transition hover:bg-[var(--pink-dark)] disabled:opacity-60"
            style={{ boxShadow: '0 4px 20px rgba(236,72,153,0.35)' }}
          >
            {isSaving ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : '✓'}
            {isSaving ? 'Saving…' : 'Save ✓'}
          </button>
        </div>
      </div>
    </main>
  );
}
