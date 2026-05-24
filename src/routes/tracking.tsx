import { useState, type JSX } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { FlowSlider } from '#/components/tracking/FlowSlider';
import { SymptomPicker } from '#/components/tracking/SymptomPicker';
import { Button } from '#/components/ui/Button';
import { Card } from '#/components/ui/Card';
import { useSymptoms } from '#/hooks/useSymptoms';
import { useTracking } from '#/hooks/useTracking';
import { todayIso } from '#/utils/date';

export const Route = createFileRoute('/tracking')({ component: TrackingPage });

function TrackingPage(): JSX.Element {
  const today = todayIso();
  const { grouped, categoryLabels, isLoading: symptomsLoading } = useSymptoms();
  const { save, isSaving } = useTracking(today);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [flowIntensity, setFlowIntensity] = useState(0);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await save({
      date: today,
      flowIntensity,
      notes: notes.trim() || undefined,
      symptomIds: selectedSymptoms,
    });
    setSaved(true);
    setSelectedSymptoms([]);
    setFlowIntensity(0);
    setNotes('');
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <main className="page-wrap px-4 pb-10 pt-6">
      <section className="mb-6">
        <p className="island-kicker mb-1 text-xs">Daily Log</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--sea-ink)]">
          How are you feeling?
        </h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Track your symptoms for {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>
      </section>

      <div className="space-y-5">
        {/* Flow slider */}
        <Card title="Period Flow">
          <FlowSlider value={flowIntensity} onChange={setFlowIntensity} />
        </Card>

        {/* Symptom picker */}
        <Card title="Symptoms">
          {symptomsLoading ? (
            <p className="text-sm text-[var(--sea-ink-soft)]">Loading symptoms…</p>
          ) : (
            <SymptomPicker
              grouped={grouped}
              categoryLabels={categoryLabels}
              selected={selectedSymptoms}
              onChange={setSelectedSymptoms}
            />
          )}
        </Card>

        {/* Notes */}
        <Card title="Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about how you're feeling…"
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--line)] bg-transparent p-3 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </Card>

        {/* Save */}
        {saved && (
          <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            ✅ Entry saved!
          </div>
        )}

        <Button
          onClick={() => void handleSave()}
          isLoading={isSaving}
          disabled={selectedSymptoms.length === 0 && flowIntensity === 0}
          className="w-full"
          size="lg"
        >
          Save Today's Log
        </Button>
      </div>
    </main>
  );
}
