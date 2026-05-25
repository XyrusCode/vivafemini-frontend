/**
 * lint-staged config using functions so that tsc is called WITHOUT staged
 * filenames appended — when tsc receives file arguments it ignores tsconfig.json.
 * Scoped to src/ to avoid running ESLint on root config files (vite.config.ts, etc.)
 * which use plugin APIs removed in ESLint v10.
 */
export default {
  'src/**/*.{ts,tsx}': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    'tsc --noEmit --skipLibCheck',
  ],
};
