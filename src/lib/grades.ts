/**
 * Grade ordering helpers. Difficulty order is just the index in `GRADES`.
 */
import { GRADES, type Grade } from '@/types';

/** Difficulty rank (0 = easiest). Returns -1 for an unknown grade. */
export function gradeIndex(grade: Grade): number {
  return GRADES.indexOf(grade);
}

/** The hardest grade in a list, or null if the list is empty. */
export function highestGrade(grades: Grade[]): Grade | null {
  if (grades.length === 0) return null;
  return grades.reduce((max, g) => (gradeIndex(g) > gradeIndex(max) ? g : max));
}
