# Bouldering Tracker — agent context

> Project context for AI coding agents. `CLAUDE.md` imports this file.

## Expo version note

This project is on **Expo SDK 56**. Expo's APIs change between SDKs — when in
doubt, read the exact versioned docs at
<https://docs.expo.dev/versions/v56.0.0/> before writing code.

## What this is

A **bouldering progress tracker** mobile app. Think lightweight workout
journal/tracker for climbing — **not** a social app. The product bet is that
climbers will only use it if logging is fast and the app stays simple.

Primary value: **fast session logging, simple progress tracking, useful
climbing insights.** Works fully offline with local data.

## Product constraints (do not violate without being asked)

- **Simplicity and convenience > feature completeness.** When in doubt, pick the
  simpler option.
- **Do not over-engineer.** Prefer the simplest thing that supports the MVP.
- Fully **offline / local-first**. No backend.
- **Do NOT build:** social features, gym/route databases, authentication,
  subscriptions/payments.
- **Not yet (but keep the architecture friendly to them):** "projects" (tracking
  a boulder across sessions) and style tags. Reserved hooks already exist in the
  types (`ClimbingSession.projectId`, `ClimbLog.tags`) — don't build the
  features until asked, but don't design them out either.

## Tech stack

- **Expo SDK 56**, React Native, **TypeScript** (strict).
- **Expo Router** (file-based routing, typed routes enabled). React Compiler is
  on (`app.json` → `experiments.reactCompiler`).
- **Zustand** for state, with the `persist` middleware.
- **AsyncStorage** for local persistence.
- `@expo/vector-icons` (Ionicons) for icons.
- Single forced **light** theme (`app.json` → `userInterfaceStyle: "light"`).

## Architecture & data flow

`Screens → Zustand store → repository → AsyncStorage`. Screens never touch
storage directly.

- `src/store/useSessionStore.ts` — **single source of truth.** All session/climb
  mutations are actions here. `persist` saves on every change and rehydrates on
  launch. `_hasHydrated` gates the splash screen in `src/app/_layout.tsx`.
- `src/data/sessionRepository.ts` + `src/data/storage.ts` — **the persistence
  seam.** Everything touching the device store funnels through these two files.
  To migrate to `expo-sqlite`/MMKV later, change *only* these — not the store or
  screens. Storage key: `@bouldering/sessions`.
- `src/lib/stats.ts` — **pure** stat functions (`computeStats`,
  `summarizeSession`). Keep them pure and side-effect free.
- Sessions are kept **newest-first** in the array; climbs are stored
  **oldest-first** inside a session.
- Result semantics: a **flash counts as a send**; "attempts" means
  `result === 'attempt'` only.

## Folder structure

```
src/app/        routes only (screens + layouts)
src/components/  reusable UI primitives
src/constants/   theme tokens (theme.ts) + result labels/colors (results.ts)
src/data/        storage wrapper + repository (the persistence seam)
src/store/       zustand store
src/lib/         pure helpers (stats, grades, date, id)
src/types/       domain types (Grade, ClimbResult, ClimbLog, ClimbingSession)
src/mock/        dev-only sample data
```

## Coding conventions

- **File names: kebab-case** (`grade-selector.tsx`). Components/types:
  PascalCase. Functions/vars: camelCase.
- **Imports use the `@/` alias** → `./src/*` (configured in `tsconfig.json`).
- **Functional components only**, typed props via a local `interface`.
- **Styling:** `StyleSheet.create` at the bottom of each file, using tokens from
  `@/constants/theme` (`colors`, `spacing`, `radius`, `fontSize`, `fontWeight`).
  Don't hardcode colors or magic numbers — add/extend tokens instead.
- **No new heavy dependencies** without a clear reason. The MVP intentionally
  avoids a date library, a UUID library, and a charts library.
- Keep persistence behind the repository seam; keep stat logic pure in
  `src/lib/stats.ts`.
- Reuse the existing primitives (`Button`, `Card`, `Screen`, `EmptyState`,
  `GradeSelector`, `ResultSelector`, `GradeBadge`, `ResultBadge`, `ClimbRow`,
  `SessionCard`, `StatTile`, `BarRow`) before writing new UI.

## Commands

- `npx expo start` — dev server (then Expo Go / simulator)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `expo lint`
- Verify a bundle builds without a device: `npx expo export --platform android`

## Verifying changes

No automated tests yet. After a change: run `npm run typecheck`, then exercise
the core loop in the app — Home → Start session → log climbs at a few
grades/results → End → confirm it appears in History and is reflected in Stats →
fully close and reopen the app to confirm data persisted. The Home screen's
`__DEV__` "Load sample data" / "Clear all data" buttons help here.
