import { type JSX } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps): JSX.Element {
  return (
    <div
      className={`island-shell rounded-2xl p-5 ${className}`}
    >
      {title && (
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
