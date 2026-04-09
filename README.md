# DCD Fitness -- Hybrid Performance System

A training and nutrition tracking web application built for the hybrid athlete. DCD (Discipline, Commitment, Dedication) provides a high-utility, zero-friction platform to log workouts, track nutrition, monitor progress, and visualize training consistency -- all through a clean, modern interface.

**Live Demo:** [https://dcd-lab.web.app](https://dcd-lab.web.app/)

> **Boilerplate Disclosure:** This project was bootstrapped using the [Hytel](https://github.com/user/hytel) monorepo boilerplate, which provides the foundational monorepo structure, CI/CD pipelines, shared configuration packages, and development tooling. Application-specific features, pages, components, and business logic were built on top of that foundation.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Architecture](#architecture)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Frontend         | React 18, Vite, TypeScript          |
| Styling          | Tailwind CSS                        |
| UI Components    | Shadcn UI, Custom Lab components    |
| Animations       | Framer Motion                       |
| Charts           | Recharts                            |
| Routing          | React Router v7                     |
| API Layer        | tRPC (end-to-end type safety)       |
| Data Fetching    | TanStack Query                      |
| Validation       | Zod                                 |
| Authentication   | Firebase Auth                       |
| Database         | Cloud Firestore                     |
| Backend          | Firebase Admin SDK, tRPC Server     |
| Build System     | Turborepo                           |
| Package Manager  | pnpm (workspaces)                   |
| Testing          | Vitest, Testing Library             |
| Linting          | ESLint, Prettier                    |
| Versioning       | Changesets                          |
| CI/CD            | GitHub Actions, Workload Identity Federation |

---

## Project Structure

```
DCD/
|-- .changeset/                         # Changeset config for versioning
|-- .github/
|   |-- ISSUE_TEMPLATE/
|   |   |-- bug_report.md
|   |   +-- feature_request.md
|   |-- workflows/
|   |   |-- ci.yml                      # Lint, typecheck, build, test
|   |   |-- deploy-dev.yml              # Auto-deploy on push to dev
|   |   |-- deploy-stage.yml            # Auto-deploy on push to stage
|   |   |-- deploy-main.yml             # Manual production deploy
|   |   |-- release.yml                 # Automated versioning
|   |   +-- dependency-review.yml       # Vulnerability scanning on PRs
|   |-- CODEOWNERS
|   |-- PULL_REQUEST_TEMPLATE.md
|   +-- SECURITY.md
|-- .husky/
|   +-- pre-commit                      # Lint-staged hook
|-- apps/
|   |-- web/                            # React frontend (Vite)
|   |   |-- public/
|   |   |-- src/
|   |   |   |-- components/
|   |   |   |   |-- charts/
|   |   |   |   |   |-- DrillPerformanceChart.tsx
|   |   |   |   |   |-- MacroAdherenceChart.tsx
|   |   |   |   |   +-- WorkoutConsistencyChart.tsx
|   |   |   |   |-- About.tsx
|   |   |   |   |-- BodyHeatmap.tsx
|   |   |   |   |-- Calendar.tsx
|   |   |   |   |-- Features.tsx
|   |   |   |   |-- FoodModal.tsx
|   |   |   |   |-- Footer.tsx
|   |   |   |   |-- Hero.tsx
|   |   |   |   |-- LabButton.tsx
|   |   |   |   |-- LabCard.tsx
|   |   |   |   |-- LabInput.tsx
|   |   |   |   |-- Layout.tsx
|   |   |   |   |-- MacrosCard.tsx
|   |   |   |   |-- NavBar.tsx
|   |   |   |   |-- PreFooter.tsx
|   |   |   |   |-- ProtectedRoute.tsx
|   |   |   |   +-- WorkoutModal.tsx
|   |   |   |-- contexts/
|   |   |   |   +-- AuthContext.tsx
|   |   |   |-- hooks/
|   |   |   |   +-- useUsers.ts
|   |   |   |-- lib/
|   |   |   |   |-- firebase.ts
|   |   |   |   |-- queryClient.ts
|   |   |   |   +-- trpc.ts
|   |   |   |-- pages/
|   |   |   |   |-- DashboardPage.tsx
|   |   |   |   |-- DiaryPage.tsx
|   |   |   |   |-- LandingPage.tsx
|   |   |   |   |-- OnboardingPage.tsx
|   |   |   |   |-- ProfilePage.tsx
|   |   |   |   |-- ProgressPage.tsx
|   |   |   |   |-- SignInPage.tsx
|   |   |   |   +-- SignUpPage.tsx
|   |   |   |-- providers/
|   |   |   |   +-- QueryProvider.tsx
|   |   |   |-- test/
|   |   |   |   +-- setup.ts
|   |   |   |-- App.tsx
|   |   |   |-- main.tsx
|   |   |   +-- style.css
|   |   |-- index.html
|   |   |-- postcss.config.js
|   |   |-- tailwind.config.js
|   |   +-- vite.config.ts
|   +-- functions/                      # tRPC backend
|       |-- scripts/
|       |   +-- seed-system.ts          # Seed system exercises
|       |-- src/
|       |   |-- trpc/
|       |   |   |-- routers/
|       |   |   |   |-- exercise.ts
|       |   |   |   |-- log.ts
|       |   |   |   |-- user.ts
|       |   |   |   +-- index.ts
|       |   |   |-- context.ts
|       |   |   |-- router.ts
|       |   |   +-- trpc.ts
|       |   +-- index.ts
|       +-- tsconfig.json
|-- packages/
|   |-- config/                         # Shared runtime config
|   |   +-- tsconfig.json
|   |-- eslint-config/                  # Shared ESLint rules
|   |   +-- index.js
|   |-- shared/                         # Shared schemas, constants, utilities
|   |   +-- src/
|   |       |-- constants/
|   |       |   |-- muscles.ts
|   |       |   |-- programs.ts
|   |       |   +-- recipes.ts
|   |       |-- schemas/
|   |       |   |-- activity-log.ts
|   |       |   |-- exercise.ts
|   |       |   |-- muscle-state.ts
|   |       |   +-- user.ts
|   |       |-- utils/
|   |       |   |-- bmr.ts
|   |       |   |-- date.ts
|   |       |   |-- food-macros.ts
|   |       |   |-- heatmap.ts
|   |       |   |-- macros.ts
|   |       |   +-- tdee.ts
|   |       +-- index.ts
|   |-- typescript-config/              # Shared TypeScript configs
|   |   |-- base.json
|   |   +-- vite.json
|   +-- ui/                             # Shared React component library
|       |-- components/
|       |   |-- ui/
|       |   |   |-- button.tsx
|       |   |   +-- card.tsx
|       |   |-- Counter.tsx
|       |   +-- Header.tsx
|       |-- lib/
|       |   +-- utils.ts
|       |-- test/
|       |   +-- setup.ts
|       +-- index.ts
|-- docs/
|   |-- ci-cd/
|   |   |-- CI-CD-Pipeline-Guide.md
|   |   |-- CI.md
|   |   |-- Deploy-Dev.md
|   |   |-- Deploy-Main.md
|   |   +-- Deploy-Stage.md
|   +-- project-definition/
|       |-- backend-doc
|       |-- frontend-doc
|       |-- landing-page
|       |-- pdd
|       |-- tdd
|       |-- todo
|       +-- todoFinal
|-- scripts/
|   +-- setup-wif.sh                    # Workload Identity Federation setup
|-- .env.example
|-- .eslintrc.cjs
|-- .firebaserc
|-- .gitignore
|-- .npmrc
|-- .prettierignore
|-- .prettierrc
|-- .syncpackrc.json
|-- CONTRIBUTING.md
|-- firebase.json
|-- firestore.indexes.json
|-- firestore.rules
|-- package.json
|-- pnpm-lock.yaml
|-- pnpm-workspace.yaml
+-- turbo.json
```

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 8 or higher
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd DCD

# Install dependencies
pnpm install

# Copy the environment template and fill in your Firebase credentials
cp .env.example .env
```

### Development

```bash
# Start all dev servers
pnpm dev

# The web app will open at http://localhost:5173
```

---

## Available Scripts

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `pnpm dev`           | Start all development servers                        |
| `pnpm build`         | Build all packages for production                    |
| `pnpm test`          | Run all tests across the monorepo                    |
| `pnpm test:coverage` | Run tests with coverage report                       |
| `pnpm lint`          | Lint all packages                                    |
| `pnpm lint:fix`      | Auto-fix lint issues                                 |
| `pnpm format`        | Format code with Prettier                            |
| `pnpm format:check`  | Check code formatting without writing                |
| `pnpm typecheck`     | Run TypeScript type checking across all packages     |
| `pnpm precheck`      | Run full quality gate (lint, typecheck, build, test)  |
| `pnpm changeset`     | Create a changeset entry for versioning              |
| `pnpm sync:lint`     | Check dependency version consistency via Syncpack    |
| `pnpm sync:fix`      | Auto-fix dependency version mismatches               |

---

## Features

### Landing Page
- Animated typewriter hero with rotating keywords (Discipline, Commitment, Dedication)
- Dynamic background image carousel with Framer Motion transitions
- Feature showcase and about sections

### Authentication
- Email/password sign-up and sign-in via Firebase Auth
- Persistent sessions across browser refreshes
- Protected routes that redirect unauthenticated users

### Onboarding
- First-time user profile setup (display name, sport, physical stats)
- Used to personalize the dashboard and calculate nutritional baselines

### Dashboard
- Central hub summarizing daily activity at a glance
- Quick-access navigation to Diary, Progress, and Profile

### Diary (Daily Log)
- Unified daily view of all training and nutrition entries
- Strength logging with sets, reps, and weight for progressive overload tracking
- Skill/drill logging with attempts vs. makes for accuracy tracking
- Food logging organized by meal category (Breakfast, Lunch, Dinner)
- Date picker navigation to browse historical entries
- Body heatmap showing which muscle groups were trained

### Progress and Analytics
- Workout consistency chart
- Drill performance chart (accuracy trends over time)
- Macro adherence chart
- Activity heatmap calendar color-coded by training type

### Profile
- View and edit personal information
- Manage account settings

---

## Architecture

The application follows a monorepo architecture powered by Turborepo and pnpm workspaces.

### Apps

- **web** -- The React frontend built with Vite. Contains all pages, components, routing, and client-side state management.
- **functions** -- The tRPC backend providing type-safe API procedures. Connects to Firestore via Firebase Admin SDK.

### Packages (Shared Libraries)

- **@repo/shared** -- Zod schemas, constants (muscle groups, programs, recipes), and utility functions (BMR, TDEE, macros, heatmap logic) used by both frontend and backend.
- **@repo/ui** -- Reusable React components including Shadcn UI primitives (Button, Card) and custom components (Header, Counter).
- **@repo/config** -- Shared runtime configuration.
- **@repo/eslint-config** -- Centralized ESLint rules for consistent code style.
- **@repo/typescript-config** -- Shared TypeScript compiler options (base and Vite variants).

### Data Flow

```
React (web) --> tRPC Client --> tRPC Server (functions) --> Firestore
                   |                                            |
            TanStack Query                             Firebase Admin SDK
            (caching layer)                            (server-side access)
```

### Security

- Firestore Security Rules enforce per-user data isolation (`request.auth.uid == userId`)
- Exercise library supports a hybrid model: system-wide exercises readable by all, user-created exercises private to the owner
- tRPC middleware verifies Firebase ID tokens before processing writes

---

## CI/CD Pipeline

Fully configured GitHub Actions workflows with Workload Identity Federation for keyless GCP authentication.

### Branch Strategy

| Branch  | Environment | Deployment                 |
| ------- | ----------- | -------------------------- |
| `dev`   | Development | Automatic on push          |
| `stage` | Staging     | Automatic on push          |
| `main`  | Production  | Manual trigger with confirmation |

### Workflows

| Workflow                 | Trigger         | Purpose                              |
| ------------------------ | --------------- | ------------------------------------ |
| `ci.yml`                 | PR and push     | Lint, typecheck, build, test         |
| `deploy-dev.yml`         | Push to `dev`   | Deploy to development environment    |
| `deploy-stage.yml`       | Push to `stage` | Deploy to staging environment        |
| `deploy-main.yml`        | Manual          | Deploy to production                 |
| `release.yml`            | Push to `main`  | Automated versioning with Changesets |
| `dependency-review.yml`  | PR              | Scan for vulnerable dependencies     |

### Required GitHub Secrets

| Secret                           | Description                 |
| -------------------------------- | --------------------------- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | WIF provider resource path  |
| `GCP_SA_EMAIL`                   | Service account email       |

See [CI/CD Pipeline Guide](docs/ci-cd/CI-CD-Pipeline-Guide.md) for full setup instructions.

---

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

| Variable                            | Description                        |
| ----------------------------------- | ---------------------------------- |
| `NODE_ENV`                          | Runtime environment                |
| `VITE_API_URL`                      | Backend API endpoint               |
| `VITE_FIREBASE_API_KEY`             | Firebase client API key            |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase Auth domain               |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID                |
| `VITE_FIREBASE_STORAGE_BUCKET`     | Firebase Storage bucket            |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID`             | Firebase app ID                    |

---

## Testing

Tests are co-located with source files and run via Vitest.

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter web test
pnpm --filter @repo/functions test
pnpm --filter @repo/ui test
pnpm --filter @repo/shared test

# Run with coverage
pnpm test:coverage
```

---

## Version Requirements

| Tool         | Minimum Version |
| ------------ | --------------- |
| Node.js      | 20.x            |
| pnpm         | 8.x             |
| Turbo        | 2.x             |
| TypeScript   | 5.x             |
| Vitest       | 2.x             |
| ESLint       | 8.x             |
| Prettier     | 3.x             |
| Firebase CLI | 13.x            |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, branching strategy, and code review guidelines.

---

Built with Turborepo. Boilerplate by Hytel.
