import { useState, useRef, useEffect, type JSX, type SyntheticEvent } from 'react';

import { Button } from '#/components/ui/Button';

import type { LoginDto, RegisterDto } from '#/types';

type Tab = 'login' | 'register';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
}

export function AuthModal({
  onClose,
  onSuccess,
  login,
  register,
}: AuthModalProps): JSX.Element {
  const [tab, setTab] = useState<Tab>('login');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => {
    firstInputRef.current?.focus();
  }, [tab]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); };
  }, [onClose]);

  async function handleLogin(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    setIsSubmitting(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-[var(--border-mid)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-xsoft)] focus:outline-none focus:ring-2 focus:ring-[var(--pink)] focus:border-[var(--pink)] transition';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Card */}
      <div
        className="card w-full max-w-sm rounded-2xl bg-[var(--surface)] p-6"
        role="dialog"
        aria-modal="true"
        aria-label={tab === 'login' ? 'Sign in' : 'Create account'}
      >
        {/* Brand */}
        <div className="mb-5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--pink)]" />
          <span className="text-sm font-bold tracking-tight text-[var(--text)]">VivaFemini</span>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl border border-[var(--border-mid)] bg-[var(--bg)] p-0.5">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={[
                'flex-1 rounded-[10px] py-2 text-sm font-semibold transition',
                tab === t
                  ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                  : 'text-[var(--text-soft)] hover:text-[var(--text)]',
              ].join(' ')}
            >
              {t === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login form */}
        {tab === 'login' && (
          <form onSubmit={(e) => void handleLogin(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-soft)]" htmlFor="login-email">
                Email
              </label>
              <input
                ref={firstInputRef}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-soft)]" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full rounded-full bg-[var(--pink)] hover:bg-[var(--pink-dark)] focus-visible:ring-[var(--pink)]">
              Sign in
            </Button>
            <p className="text-center text-xs text-[var(--text-soft)]">
              No account?{' '}
              <button
                type="button"
                onClick={() => { setTab('register'); setError(null); }}
                className="font-semibold text-[var(--pink)] underline-offset-2 hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form onSubmit={(e) => void handleRegister(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-soft)]" htmlFor="reg-name">
                Full name
              </label>
              <input
                ref={firstInputRef}
                id="reg-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                placeholder="Your name"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-soft)]" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-soft)]" htmlFor="reg-password">
                Password <span className="font-normal opacity-70">(min 8 chars)</span>
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>
            <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full rounded-full bg-[var(--pink)] hover:bg-[var(--pink-dark)] focus-visible:ring-[var(--pink)]">
              Create account
            </Button>
            <p className="text-center text-xs text-[var(--text-soft)]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setTab('login'); setError(null); }}
                className="font-semibold text-[var(--pink)] underline-offset-2 hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
