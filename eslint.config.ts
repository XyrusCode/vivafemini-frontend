import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', '.vercel', '.output', 'node_modules', '**/*.gen.ts'] },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended (strict) + type-checked rules
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // ── TypeScript + import ordering — all .ts / .tsx files ──────────────────
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      import: importPlugin,
    },

    rules: {
      // ── Import ordering ─────────────────────────────────────────────────
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            { group: 'internal', pattern: '#/**', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'always',
          alphabetize: { caseInsensitive: true, order: 'asc' },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'warn',

      // ── TypeScript ───────────────────────────────────────────────────────
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },

    settings: {
      'import/resolver': { typescript: true },
    },
  },

  // ── React rules — scoped to src/ only to avoid eslint-plugin-react v7 ──
  // incompatibility with ESLint v10 (context.getFilename removed) on config files
  {
    files: ['src/**/*.{ts,tsx}'],

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },

    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'react/prop-types': 'off',         // TypeScript handles prop types
    },

    settings: {
      react: { version: '19' }, // hardcoded to avoid getFilename detection crash
    },
  },
);
