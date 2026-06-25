# Bouldering Tracker 🧗

A simple, fast bouldering progress tracker. It's meant to feel like a
lightweight workout journal — not a social climbing app. The whole point is
**fast session logging, simple progress tracking, and a few useful climbing
insights**. It works fully offline with local data.

## Product goal

Climbers should actually *use* this. So convenience and simplicity beat feature
completeness. You open the app, start a session, tap a grade + result a few
times while you climb, and end the session. Stats and history come for free.

## MVP scope

What the app does today:

- **Start / end a climbing session.**
- **Quickly log a climb** with:
  - grade: `V0`–`V6`, plus a `V7+` bucket
  - result: `attempt`, `send`, or `flash`
  - optional notes
- **View session history** (each session with date, duration, climb count, top
  grade).
- **See basic stats:** total sessions, total climbs, highest grade sent,
  highest grade flashed, total sends, send rate, and sends/attempts broken down
  by grade.

Deliberately **not** built (see [CLAUDE.md](./CLAUDE.md) for the full list):
no social features, no gym/route databases, no auth, no payments, no cloud
sync. Style tags and "projects" are intentionally left out but the data model
leaves room for them.

## How to run

Requires Node.js (LTS) and the [Expo Go](https://expo.dev/go) app on your phone
(or an Android/iOS simulator).

```bash
npm install        # first time only
npx expo start     # then scan the QR with Expo Go, or press a / i / w
```

- `npm run android` / `npm run ios` — open directly in a simulator
- `npm run web` — run in the browser
- `npm run typecheck` — TypeScript check (no emit)
- `npm run lint` — lint

In development there are **Developer tools** at the bottom of the Home screen
(only visible in dev builds) to load sample data or clear all data.

## Architecture

Expo SDK 56 · React Native · TypeScript · Expo Router · Zustand · AsyncStorage.

### Data flow

```
Screens (src/app/**)
   │  read slices / call actions
   ▼
Zustand store (src/store/useSessionStore.ts)
   │  persist middleware (auto save + rehydrate)
   ▼
Repository (src/data/sessionRepository.ts)  ← the storage "seam"
   │
   ▼
AsyncStorage wrapper (src/data/storage.ts)  ← only module touching the device store
```

- **Local-first storage.** All sessions live as a single JSON blob under one
  AsyncStorage key (`@bouldering/sessions`). The Zustand `persist` middleware
  saves on every change and rehydrates on launch; the splash screen stays up
  until rehydration finishes so we never flash empty data.
- **Why AsyncStorage (not SQLite)?** It's the simplest thing that fully
  supports the MVP — a personal climbing journal holds very little data, so
  loading it all into memory is fine. The tradeoff is that it doesn't scale to
  huge datasets or complex queries. Because *all* persistence goes through the
  repository + storage modules, migrating to `expo-sqlite` later means changing
  those two files, not the store or the screens.
- **Embedded climbs.** Climbs are stored inside their session
  (`ClimbingSession.climbs`). This keeps the model dead-simple and per-session
  stats trivial, and leaves a clean path to add `projectId` / `tags` fields
  without a migration.
- **Pure stats.** All computations live in `src/lib/stats.ts` as pure
  functions — easy to reason about and reuse.

### Folder structure

```
src/
  app/                     # Expo Router routes (file = screen)
    _layout.tsx            # root Stack + splash/hydration gate
    (tabs)/
      _layout.tsx          # bottom tabs: Home / History / Stats
      index.tsx            # Home
      history.tsx          # Session history
      stats.tsx            # Stats
    session/[id].tsx       # active-logging screen (read-only once ended)
  components/              # reusable UI (Button, Card, GradeSelector, ...)
  constants/               # theme tokens + result metadata
  data/                    # storage wrapper + session repository (the seam)
  store/                   # Zustand store (single source of truth)
  lib/                     # pure helpers: stats, grades, dates, id
  types/                   # core domain types
  mock/                    # dev-only sample data
```

### Core types (`src/types/index.ts`)

- `Grade` — `'V0' | … | 'V6' | 'V7+'` with an ordered `GRADES` array.
- `ClimbResult` — `'attempt' | 'send' | 'flash'`.
- `ClimbLog` — one logged climb (grade, result, optional notes, timestamp).
- `ClimbingSession` — `startedAt`, optional `endedAt`, and embedded `climbs`.

## Next recommended steps

In rough priority order:

1. **Projects** — add a `Project` type and `projectId` on climbs to track
   long-term boulders across sessions.
2. **Style tags** — the `tags` field is already reserved on `ClimbLog`
   (overhang, slab, crimp, dyno…); add a tag selector and filter stats by tag.
3. **Richer insights** — sessions-per-week, send pyramids, progress over time.
   This is where a charts library or migrating to `expo-sqlite` starts to pay
   off.
4. **Data export / backup** — export sessions to JSON/CSV so users never fear
   losing their log.
5. **Dark mode** — currently forced light for simplicity; the theme is already
   centralized in `src/constants/theme.ts`.
6. **Auth + cloud sync** — only once there's a reason to leave local-first.
