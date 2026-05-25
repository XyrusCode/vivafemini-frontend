# VivaFemini — Frontend

A modern menstrual health tracking app built with **TanStack Start**, **React 19**, and **Tailwind CSS v4**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) + React 19 |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Package Manager | pnpm |
| Build | Vite 8 |
| Linting | ESLint + typescript-eslint |
| Git Hooks | Husky + lint-staged |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home dashboard — cycle calendar, highlights, predictions |
| `/tracking` | Daily symptom logger — flow slider, symptom picker, notes |
| `/health-report` | Analytics — period trend chart, symptom breakdown, history table |

## Project Structure

```
src/
├── components/
│   ├── calendar/        # CycleCalendar
│   ├── health-report/   # PeriodLengthChart, SymptomDonut
│   ├── tracking/        # SymptomPicker, FlowSlider
│   └── ui/              # Badge, Button, Card
├── hooks/               # useAuth, useCycle, useTracking, useSymptoms
├── routes/              # TanStack file-based routes
├── services/            # API client + per-resource service files
├── types/               # Shared TypeScript interfaces
└── utils/               # date.ts helpers
```

## Getting Started

```bash
pnpm install
cp .env.local.example .env.local   # set VITE_API_URL
pnpm dev                           # http://localhost:3000
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000` |
| `VITE_SENTRY_DSN` | Sentry DSN (optional) | — |

## Scripts

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm lint         # Lint + auto-fix
pnpm lint:check   # Lint check (CI)
pnpm test         # Unit tests
```

## Code Quality

- **ESLint** — import ordering (grouped + alphabetised), TypeScript strict, React hooks
- **Husky** — `lint-staged` on pre-commit (ESLint + `tsc --noEmit`)
- **Conventional commits** enforced: `feat|fix|chore|docs|refactor|test|ci|perf(scope): desc`

## Deployment

Deployed on **Vercel** (TanStack Start + Cloudflare adapter). See `vercel.json`.
