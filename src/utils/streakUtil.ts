/**
 * Streak calculation utility - Efficient streak calculations
 * Handles both current streak and longest streak calculations
 */
import { Moment } from "../types";

const ONE_DAY_MS = 86400000;

/**
 * Gets unique day timestamps (normalized to midnight) from moments
 * Returns sorted array of timestamps (oldest first)
 */
export function getUniqueDayTimestamps(moments: Moment[]): number[] {
  const dayTimestamps = new Set<number>();
  
  for (const moment of moments) {
    const date = new Date(moment.createdAt);
    date.setHours(0, 0, 0, 0);
    dayTimestamps.add(date.getTime());
  }
  
  return Array.from(dayTimestamps).sort((a, b) => a - b);
}

/**
 * Calculates the longest consecutive streak from sorted day timestamps
 */
export function calculateLongestStreakFromDays(days: number[]): number {
  if (days.length === 0) return 0;
  if (days.length === 1) return 1;
  
  let longest = 1;
  let current = 1;
  
  for (let i = 1; i < days.length; i++) {
    const diff = days[i] - days[i - 1];
    if (diff === ONE_DAY_MS) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  
  return longest;
}

/**
 * Calculates the current streak (consecutive days ending today/yesterday)
 */
export function calculateCurrentStreakFromDays(days: number[]): number {
  if (days.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  
  const yesterdayTs = todayTs - ONE_DAY_MS;
  
  // Check if most recent day is today or yesterday
  const mostRecent = days[days.length - 1];
  if (mostRecent !== todayTs && mostRecent !== yesterdayTs) {
    return 0;
  }
  
  // Count backwards from most recent
  let streak = 1;
  let expectedDay = mostRecent;
  
  for (let i = days.length - 2; i >= 0; i--) {
    expectedDay -= ONE_DAY_MS;
    if (days[i] === expectedDay) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculates the longest consecutive streak of days with moments
 * This is used for achievements (longest streak ever achieved)
 */
export function calculateLongestStreak(moments: Moment[]): number {
  const days = getUniqueDayTimestamps(moments);
  return calculateLongestStreakFromDays(days);
}

/**
 * Calculates the current streak of consecutive days ending today/yesterday
 * This is used for stats display (active streak)
 */
export function calculateCurrentStreak(moments: Moment[]): number {
  const days = getUniqueDayTimestamps(moments);
  return calculateCurrentStreakFromDays(days);
}

/**
 * Calculates both streaks efficiently in a single pass
 * Returns { current, longest }
 */
export function calculateStreaks(moments: Moment[]): { current: number; longest: number } {
  const days = getUniqueDayTimestamps(moments);
  return {
    current: calculateCurrentStreakFromDays(days),
    longest: calculateLongestStreakFromDays(days),
  };
}

