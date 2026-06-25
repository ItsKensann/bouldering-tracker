/**
 * Tiny local id generator. We don't need globally-unique UUIDs for an
 * offline, single-device app — a timestamp + random suffix is plenty and
 * avoids pulling in a uuid dependency.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
