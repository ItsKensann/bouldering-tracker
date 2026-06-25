/**
 * Persistence boundary for climbing sessions.
 *
 * All session data lives as a single JSON blob under one key. Persisted values
 * are validated here before they enter the store so corrupt data cannot break
 * the app or get silently overwritten.
 */
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

import {
  CLIMB_RESULTS,
  GRADES,
  type ClimbingSession,
  type ClimbLog,
} from '@/types';

import { deviceStorage } from './storage';

export const SESSIONS_STORAGE_KEY = '@bouldering/sessions';
export const SESSIONS_STORAGE_VERSION = 1;

export interface PersistedSessionState {
  sessions: ClimbingSession[];
  activeSessionId: string | null;
}

let writesEnabled = false;

/**
 * Do not write until hydration succeeds. If stored JSON is corrupt, updating
 * the in-memory recovery state must not overwrite the user's saved data.
 */
const guardedDeviceStorage: StateStorage = {
  getItem: (name) => deviceStorage.getItem(name),
  setItem: (name, value) =>
    writesEnabled ? deviceStorage.setItem(name, value) : Promise.resolve(),
  removeItem: (name) => deviceStorage.removeItem(name),
};

/** JSON storage adapter used by the session store's persist middleware. */
export const sessionStorage = createJSONStorage<PersistedSessionState>(
  () => guardedDeviceStorage,
);

export function setSessionWritesEnabled(enabled: boolean): void {
  writesEnabled = enabled;
}

export async function resetSessionsStorage(): Promise<void> {
  const emptyState = JSON.stringify({
    state: { sessions: [], activeSessionId: null },
    version: SESSIONS_STORAGE_VERSION,
  });
  await deviceStorage.setItem(SESSIONS_STORAGE_KEY, emptyState);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function parseClimb(value: unknown): ClimbLog {
  if (!isRecord(value)) {
    throw new Error('A saved climb is not an object.');
  }

  if (
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    typeof value.grade !== 'string' ||
    !GRADES.includes(value.grade as (typeof GRADES)[number]) ||
    typeof value.result !== 'string' ||
    !CLIMB_RESULTS.includes(value.result as (typeof CLIMB_RESULTS)[number]) ||
    !isTimestamp(value.createdAt) ||
    (value.notes !== undefined && typeof value.notes !== 'string')
  ) {
    throw new Error('A saved climb has invalid fields.');
  }

  return {
    id: value.id,
    grade: value.grade as ClimbLog['grade'],
    result: value.result as ClimbLog['result'],
    ...(value.notes?.trim() ? { notes: value.notes.trim() } : {}),
    createdAt: value.createdAt,
  };
}

function parseSession(value: unknown): ClimbingSession {
  if (!isRecord(value) || !Array.isArray(value.climbs)) {
    throw new Error('A saved session is not valid.');
  }

  if (
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    !isTimestamp(value.startedAt) ||
    (value.endedAt !== undefined && !isTimestamp(value.endedAt))
  ) {
    throw new Error('A saved session has invalid fields.');
  }

  const climbs = value.climbs
    .map(parseClimb)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const climbIds = new Set(climbs.map((climb) => climb.id));

  if (climbIds.size !== climbs.length) {
    throw new Error('A saved session contains duplicate climbs.');
  }

  return {
    id: value.id,
    startedAt: value.startedAt,
    ...(value.endedAt ? { endedAt: value.endedAt } : {}),
    climbs,
  };
}

/**
 * Validate persisted data and normalize the ordering expected throughout the
 * app: sessions newest-first and climbs oldest-first.
 */
export function normalizePersistedSessionState(
  value: unknown,
): PersistedSessionState {
  if (!isRecord(value) || !Array.isArray(value.sessions)) {
    throw new Error('Saved session data is not valid.');
  }

  const sessions = value.sessions
    .map(parseSession)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const sessionIds = new Set(sessions.map((session) => session.id));

  if (sessionIds.size !== sessions.length) {
    throw new Error('Saved data contains duplicate sessions.');
  }

  const requestedActiveId =
    value.activeSessionId === null || typeof value.activeSessionId === 'string'
      ? value.activeSessionId
      : null;
  const requestedActive = sessions.find(
    (session) => session.id === requestedActiveId && !session.endedAt,
  );
  const activeSessionId =
    requestedActive?.id ?? sessions.find((session) => !session.endedAt)?.id ?? null;

  return { sessions, activeSessionId };
}
