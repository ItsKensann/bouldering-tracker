/**
 * Single source of truth for sessions and climbs.
 *
 * Screens read slices and call actions here. Persistence is validated through
 * the repository before data enters the store.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  normalizePersistedSessionState,
  resetSessionsStorage,
  SESSIONS_STORAGE_KEY,
  SESSIONS_STORAGE_VERSION,
  sessionStorage,
  setSessionWritesEnabled,
} from '@/data/sessionRepository';
import { generateId } from '@/lib/id';
import type { ClimbLog, ClimbingSession, NewClimbInput } from '@/types';

type HydrationStatus = 'pending' | 'ready' | 'error';

interface SessionState {
  sessions: ClimbingSession[];
  /** id of the session currently being logged, or null if none is active */
  activeSessionId: string | null;
  /** lifecycle state for loading and validating persisted data */
  hydrationStatus: HydrationStatus;

  /** Reuse an unfinished session or start a new one, then return its id. */
  startSession: () => string;
  /** Mark a session ended (no-op if missing or already ended). */
  endSession: (sessionId: string) => void;
  /** Append a climb to an active session. Empty notes are dropped. */
  addClimb: (sessionId: string, input: NewClimbInput) => void;
  /** Remove a single climb from an active session. */
  removeClimb: (sessionId: string, climbId: string) => void;
  /** Delete a whole session. */
  deleteSession: (sessionId: string) => void;
  /** Prepend sessions (used by the dev sample-data loader). */
  importSessions: (sessions: ClimbingSession[]) => void;
  /** Wipe all loaded data. */
  clearAll: () => Promise<void>;
  /** Retry loading persisted data after a storage failure. */
  retryHydration: () => void;
  /** Explicitly discard unreadable persisted data and start empty. */
  resetPersistedData: () => Promise<void>;
  setHydrationStatus: (status: HydrationStatus) => void;
}

let triggerRehydration: (() => Promise<void> | void) | null = null;

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      hydrationStatus: 'pending',

      startSession: () => {
        const state = get();
        const existing =
          state.sessions.find(
            (session) =>
              session.id === state.activeSessionId && !session.endedAt,
          ) ?? state.sessions.find((session) => !session.endedAt);

        if (existing) {
          if (state.activeSessionId !== existing.id) {
            set({ activeSessionId: existing.id });
          }
          return existing.id;
        }

        if (state.hydrationStatus !== 'ready') {
          return '';
        }

        const session: ClimbingSession = {
          id: generateId(),
          startedAt: new Date().toISOString(),
          climbs: [],
        };
        set((current) => ({
          sessions: [session, ...current.sessions],
          activeSessionId: session.id,
        }));
        return session.id;
      },

      endSession: (sessionId) => {
        const state = get();
        const session = state.sessions.find((item) => item.id === sessionId);

        if (state.hydrationStatus !== 'ready' || !session || session.endedAt) {
          return;
        }

        set((current) => ({
          activeSessionId:
            current.activeSessionId === sessionId
              ? null
              : current.activeSessionId,
          sessions: current.sessions.map((item) =>
            item.id === sessionId
              ? { ...item, endedAt: new Date().toISOString() }
              : item,
          ),
        }));
      },

      addClimb: (sessionId, input) => {
        const state = get();
        const session = state.sessions.find((item) => item.id === sessionId);

        if (state.hydrationStatus !== 'ready' || !session || session.endedAt) {
          return;
        }

        const trimmed = input.notes?.trim();
        const climb: ClimbLog = {
          id: generateId(),
          grade: input.grade,
          result: input.result,
          ...(trimmed ? { notes: trimmed } : {}),
          createdAt: new Date().toISOString(),
        };
        set((current) => ({
          sessions: current.sessions.map((item) =>
            item.id === sessionId
              ? { ...item, climbs: [...item.climbs, climb] }
              : item,
          ),
        }));
      },

      removeClimb: (sessionId, climbId) => {
        const state = get();
        const session = state.sessions.find((item) => item.id === sessionId);

        if (
          state.hydrationStatus !== 'ready' ||
          !session ||
          session.endedAt ||
          !session.climbs.some((climb) => climb.id === climbId)
        ) {
          return;
        }

        set((current) => ({
          sessions: current.sessions.map((item) =>
            item.id === sessionId
              ? {
                  ...item,
                  climbs: item.climbs.filter((climb) => climb.id !== climbId),
                }
              : item,
          ),
        }));
      },

      deleteSession: (sessionId) => {
        const state = get();
        if (
          state.hydrationStatus !== 'ready' ||
          !state.sessions.some((session) => session.id === sessionId)
        ) {
          return;
        }

        set((current) => ({
          activeSessionId:
            current.activeSessionId === sessionId
              ? null
              : current.activeSessionId,
          sessions: current.sessions.filter(
            (session) => session.id !== sessionId,
          ),
        }));
      },

      importSessions: (incoming) => {
        if (get().hydrationStatus !== 'ready') {
          return;
        }

        set((state) => {
          const existingIds = new Set(state.sessions.map((session) => session.id));
          const uniqueIncoming = incoming.filter(
            (session) => !existingIds.has(session.id),
          );
          return {
            sessions: [...uniqueIncoming, ...state.sessions].sort((a, b) =>
              b.startedAt.localeCompare(a.startedAt),
            ),
          };
        });
      },

      clearAll: async () => {
        if (get().hydrationStatus !== 'ready') {
          return;
        }

        try {
          await resetSessionsStorage();
          setSessionWritesEnabled(true);
          set({
            sessions: [],
            activeSessionId: null,
            hydrationStatus: 'ready',
          });
        } catch {
          setSessionWritesEnabled(false);
          set({ hydrationStatus: 'error' });
        }
      },

      retryHydration: () => {
        setSessionWritesEnabled(false);
        set({ hydrationStatus: 'pending' });
        void triggerRehydration?.();
      },

      resetPersistedData: async () => {
        setSessionWritesEnabled(false);
        set({ hydrationStatus: 'pending' });

        try {
          await resetSessionsStorage();
          setSessionWritesEnabled(true);
          set({
            sessions: [],
            activeSessionId: null,
            hydrationStatus: 'ready',
          });
        } catch {
          setSessionWritesEnabled(false);
          set({ hydrationStatus: 'error' });
        }
      },

      setHydrationStatus: (status) => set({ hydrationStatus: status }),
    }),
    {
      name: SESSIONS_STORAGE_KEY,
      storage: sessionStorage,
      version: SESSIONS_STORAGE_VERSION,
      migrate: (persistedState) =>
        normalizePersistedSessionState(persistedState),
      merge: (persistedState, currentState) =>
        persistedState === undefined
          ? currentState
          : {
              ...currentState,
              ...normalizePersistedSessionState(persistedState),
            },
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
      onRehydrateStorage: (state) => {
        setSessionWritesEnabled(false);
        state.setHydrationStatus('pending');

        return (hydratedState, error) => {
          if (error || !hydratedState) {
            setSessionWritesEnabled(false);
            state.setHydrationStatus('error');
            return;
          }

          setSessionWritesEnabled(true);
          hydratedState.setHydrationStatus('ready');
        };
      },
    },
  ),
);

triggerRehydration = () => useSessionStore.persist.rehydrate();

/** Selector: the active session object (or null). */
export const selectActiveSession = (state: SessionState): ClimbingSession | null =>
  state.sessions.find((session) => session.id === state.activeSessionId) ?? null;
