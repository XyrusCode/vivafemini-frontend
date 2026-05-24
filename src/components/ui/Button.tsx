import { type ButtonHTMLAttributes, type JSX } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
  ghost:
    'bg-transparent text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]',
  primary:
    'bg-[var(--lagoon-deep)] text-white hover:bg-[var(--lagoon-deep)]/90 focus-visible:ring-[var(--lagoon-deep)]',
  secondary:
    'border border-[var(--line)] bg-white/60 text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)] dark:bg-white/5',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  lg: 'px-6 py-3 text-base',
  md: 'px-4 py-2.5 text-sm',
  sm: 'px-3 py-1.5 text-xs',
};

export function Button({
  children,
  className = '',
  disabled,
  isLoading = false,
  size = 'md',
  variant = 'primary',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      disabled={disabled ?? isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
