/**
 * Small date/time formatting helpers built on the platform `Intl` APIs — no
 * date library needed for the MVP's modest formatting needs.
 */

/** e.g. "Wed, Jun 4" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** e.g. "6:30 PM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Human-readable session length. If `endIso` is omitted, measures up to now
 * (used for an in-progress session). e.g. "45m", "1h 20m".
 */
export function formatDuration(startIso: string, endIso?: string): string {
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const ms = Math.max(0, end - new Date(startIso).getTime());
  const mins = Math.round(ms / 60000);
  if (mins < 1) return '<1m';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins ? `${hours}h ${remMins}m` : `${hours}h`;
}
