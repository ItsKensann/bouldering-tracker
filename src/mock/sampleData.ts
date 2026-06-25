/**
 * Sample data for development only. Exposed behind a `__DEV__` button on the
 * Home screen — never auto-seeded, so real users start with a clean slate.
 */
import { generateId } from '@/lib/id';
import type { ClimbLog, ClimbResult, ClimbingSession, Grade } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

function makeClimb(
  grade: Grade,
  result: ClimbResult,
  baseTime: number,
  offsetMin: number,
  notes?: string,
): ClimbLog {
  return {
    id: generateId(),
    grade,
    result,
    ...(notes ? { notes } : {}),
    createdAt: new Date(baseTime + offsetMin * 60_000).toISOString(),
  };
}

/**
 * Builds a few completed sessions over the past couple of weeks so History and
 * Stats have something to show during development.
 */
export function buildSampleSessions(): ClimbingSession[] {
  const now = Date.now();

  const session = (
    daysAgo: number,
    durationMin: number,
    climbs: [Grade, ClimbResult, number, string?][],
  ): ClimbingSession => {
    const startedAt = now - daysAgo * DAY_MS;
    return {
      id: generateId(),
      startedAt: new Date(startedAt).toISOString(),
      endedAt: new Date(startedAt + durationMin * 60_000).toISOString(),
      climbs: climbs.map(([g, r, off, note]) =>
        makeClimb(g, r, startedAt, off, note),
      ),
    };
  };

  return [
    session(2, 75, [
      ['V2', 'flash', 5],
      ['V3', 'send', 15, 'Took a few tries on the crux'],
      ['V4', 'attempt', 30],
      ['V4', 'send', 45, 'Finally stuck the dyno'],
      ['V3', 'send', 60],
    ]),
    session(5, 50, [
      ['V1', 'flash', 4],
      ['V2', 'send', 12],
      ['V3', 'attempt', 25],
      ['V2', 'flash', 40],
    ]),
    session(9, 90, [
      ['V3', 'send', 6],
      ['V4', 'attempt', 20],
      ['V4', 'attempt', 35],
      ['V5', 'attempt', 55, 'Project — getting closer'],
      ['V2', 'flash', 70],
      ['V5', 'send', 85, 'Sent it! New PR'],
    ]),
  ];
}
