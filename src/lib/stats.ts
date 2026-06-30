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

/** One month's send rate for the trend sparkline. */
export interface SendRatePoint {
  /** Short month label, e.g. "MAR". */
  label: string;
  /** Sends ÷ climbs for the month, 0..1. Zero when the month has no climbs. */
  rate: number;
  /** False when no climbs were logged that month (so the UI can skip it). */
  hasData: boolean;
}

/**
 * Send rate per calendar month for the last `months` months (oldest -> newest).
 * Derived purely from each climb's `createdAt` — no new stored fields. A flash
 * counts as a send (see `isSend`).
 */
export function computeSendRateTrend(
  sessions: ClimbingSession[],
  months = 6,
): SendRatePoint[] {
  const climbs = sessions.flatMap((s) => s.climbs);
  const now = new Date();

  return Array.from({ length: months }, (_, i) => {
    // i = 0 -> oldest month in the window, i = months - 1 -> current month.
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1 - i),
      1,
    );
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();

    const inMonth = climbs.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const sends = inMonth.filter((c) => isSend(c.result)).length;

    return {
      label: monthStart
        .toLocaleDateString(undefined, { month: 'short' })
        .toUpperCase(),
      rate: inMonth.length > 0 ? sends / inMonth.length : 0,
      hasData: inMonth.length > 0,
    };
  });
}

/**
 * Number of consecutive weeks (Monday-anchored) ending at the current week that
 * contain at least one session. A week with no session breaks the run.
 *
 * Grace for the in-progress week: if the current week has no session yet but the
 * previous one does, the count starts from the previous week — so opening the app
 * early in a fresh week doesn't read as a broken streak. Returns 0 when neither
 * this week nor last week has a session.
 *
 * Pure / side-effect free, derived only from each session's `startedAt`.
 */
export function computeWeekStreak(sessions: ClimbingSession[]): number {
  // Whole weeks since the Unix epoch. The epoch (1970-01-01) was a Thursday, so
  // shift by 4 days to anchor week boundaries to Monday.
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const MONDAY_OFFSET_MS = 4 * 24 * 60 * 60 * 1000;
  const weekIndex = (ms: number): number =>
    Math.floor((ms + MONDAY_OFFSET_MS) / MS_PER_WEEK);

  const activeWeeks = new Set<number>();
  for (const session of sessions) {
    const ms = new Date(session.startedAt).getTime();
    if (Number.isFinite(ms)) {
      activeWeeks.add(weekIndex(ms));
    }
  }
  if (activeWeeks.size === 0) return 0;

  const currentWeek = weekIndex(Date.now());
  // Anchor on the current week, or the previous one during the grace window.
  let week = activeWeeks.has(currentWeek) ? currentWeek : currentWeek - 1;
  if (!activeWeeks.has(week)) return 0;

  let streak = 0;
  while (activeWeeks.has(week)) {
    streak += 1;
    week -= 1;
  }
  return streak;
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
