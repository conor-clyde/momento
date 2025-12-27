/**
 * Moment-related utility functions (non-stats)
 */

import { Moment, MonthGroup } from "../types";
import { formatMonthYear } from "./dateUtils";

/**
 * Groups moments by month
 */
export function groupMomentsByMonth(moments: Moment[]): MonthGroup[] {
  const groups: Record<string, Moment[]> = {};

  // Sort moments by date descending
  const sorted = [...moments].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  sorted.forEach((moment) => {
    const monthName = formatMonthYear(moment.createdAt);
    if (!groups[monthName]) {
      groups[monthName] = [];
    }
    groups[monthName].push(moment);
  });

  return Object.entries(groups).map(([monthName, moments]) => ({
    monthName,
    moments,
  }));
}

