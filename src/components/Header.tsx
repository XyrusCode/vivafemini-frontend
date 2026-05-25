import { Link, useRouterState } from '@tanstack/react-router';

import { useAuthContext } from '#/context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning ☀️';
  if (h < 17) return 'Good Afternoon 🌤️';
  return 'Good Evening 🌙';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const NAV_ITEMS = [
  {
    to: '/',
    exact: true,
    label: 'Home',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    to: '/tracking',
    exact: false,
    label: 'Tracking',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
      </svg>
    ),
  },
  {
    to: '/health-report',
    exact: false,
    label: 'Health Report',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
] as const;

export default function Header() {
  const { isAuthenticated, isLoading, user, logout, openAuthModal } = useAuthContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="page-wrap flex items-center gap-4 py-3 sm:py-3.5">

        {/* Left — Avatar + greeting */}
        <div className="flex flex-shrink-0 items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-sm font-bold text-white shadow-sm">
                {getInitials(user.fullName)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-[var(--text-soft)]">{greeting()}</p>
                <p className="text-sm font-bold text-[var(--text)] leading-tight">{user.fullName}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[var(--text)]">VivaFemini</span>
            </div>
          )}
        </div>

        {/* Center — pill navigation */}
        <div className="flex flex-1 justify-center">
          <nav className="pill-nav">
            {NAV_ITEMS.map(({ to, exact, label, icon }) => {
              const isActive = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`pill-nav-item${isActive ? ' active' : ''}`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right — auth controls */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {!isLoading && (
            isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-full border border-[var(--border-mid)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)] transition hover:border-pink-300 hover:text-[var(--pink)]"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="rounded-full bg-[var(--pink)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--pink-dark)]"
              >
                Sign in
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
