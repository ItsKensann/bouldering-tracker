/**
 * Pure stat computations over sessions. Kept dependency-free and side-effect
 * free so they're trivial to test and reuse anywhere in the UI.
 *
 * Result semantics:
 * - A "send" counts both `send` and `flash` (a flash is a clean first-try send).
 * - "attempts" counts only `attempt` (climbs that weren't completed).
 */
import { GRADES, type ClimbResult, type ClimbingSession, type Grade } from '@/types';
import { highestGrade } from './grades';

const isSend = (result: ClimbResult): boolean =>
  result === 'send' || result === 'flash';

export interface GradeCount {
  grade: Grade;
  count: number;
}

export interface Stats {
  totalSessions: number;
  totalClimbs: number;
  /** sends + flashes */
  totalSends: number;
  highestSent: Grade | null;
  highestFlashed: Grade | null;
  /** one entry per grade in difficulty order (sends include flashes) */
  sendsByGrade: GradeCount[];
  /** one entry per grade in difficulty order */
  attemptsByGrade: GradeCount[];
}

export function computeStats(sessions: ClimbingSession[]): Stats {
  const climbs = sessions.flatMap((s) => s.climbs);

  const sentGrades = climbs.filter((c) => isSend(c.result)).map((c) => c.grade);
  const flashedGrades = climbs
    .filter((c) => c.result === 'flash')
    .map((c) => c.grade);

  const sendsByGrade: GradeCount[] = GRADES.map((grade) => ({
    grade,
    count: climbs.filter((c) => c.grade === grade && isSend(c.result)).length,
  }));

  const attemptsByGrade: GradeCount[] = GRADES.map((grade) => ({
    grade,
    count: climbs.filter((c) => c.grade === grade && c.result === 'attempt').length,
  }));

  return {
    totalSessions: sessions.length,
    totalClimbs: climbs.length,
    totalSends: sentGrades.length,
    highestSent: highestGrade(sentGrades),
    highestFlashed: highestGrade(flashedGrades),
    sendsByGrade,
    attemptsByGrade,
  };
}

/** Lightweight per-session summary used in lists/cards. */
export function summarizeSession(session: ClimbingSession) {
  const sentGrades = session.climbs
    .filter((c) => isSend(c.result))
    .map((c) => c.grade);
  return {
    climbCount: session.climbs.length,
    sendCount: sentGrades.length,
    topGrade: highestGrade(sentGrades),
    isActive: !session.endedAt,
  };
}
