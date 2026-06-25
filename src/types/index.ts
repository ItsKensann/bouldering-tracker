/**
 * Core domain types for the bouldering tracker.
 *
 * Design notes:
 * - Grades are a fixed, small V-scale set for the MVP. "V7+" is a single bucket
 *   for everything V7 and harder so logging stays fast and the UI stays simple.
 * - Climbs are embedded inside their session (denormalized). This is the
 *   simplest shape for local JSON storage and makes per-session stats trivial.
 *   It also leaves a clean path to add `projectId` / `tags` later without a
 *   migration.
 * - Timestamps are stored as ISO strings so the whole model is plain
 *   JSON-serializable (what AsyncStorage needs).
 */

/** Bouldering V-scale grade. `V7+` is the "V7 and above" bucket. */
export type Grade = 'V0' | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7+';

/** Ordered easiest -> hardest. Index doubles as the difficulty ordering. */
export const GRADES: readonly Grade[] = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7+',
] as const;

/** Outcome of a single logged climb. */
export type ClimbResult = 'attempt' | 'send' | 'flash';

/** Ordered for the result selector (left -> right). */
export const CLIMB_RESULTS: readonly ClimbResult[] = [
  'attempt',
  'send',
  'flash',
] as const;

/** A single logged climb within a session. */
export interface ClimbLog {
  id: string;
  grade: Grade;
  result: ClimbResult;
  /** Optional free-text note. Empty notes are not stored. */
  notes?: string;
  /** ISO timestamp of when the climb was logged. */
  createdAt: string;
  // tags?: string[];   // reserved: future style tags (overhang, slab, crimp...)
}

/** A climbing session: a single visit to the wall. */
export interface ClimbingSession {
  id: string;
  /** ISO timestamp of when the session started. */
  startedAt: string;
  /** ISO timestamp of when the session ended. Undefined while still active. */
  endedAt?: string;
  climbs: ClimbLog[];
  // projectId?: string; // reserved: future "projects" feature
}

/** Shape used by the UI to log a new climb. */
export interface NewClimbInput {
  grade: Grade;
  result: ClimbResult;
  notes?: string;
}
