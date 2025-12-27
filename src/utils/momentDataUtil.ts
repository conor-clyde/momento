/**
 * Moment data calculation utility
 * Shared calculation for stats and achievements - single pass through moments
 */
import { isHoliday } from "../constants/achievements";
import { MOODS } from "../constants/moods";
import { Moment } from "../types";
import { calculateCurrentStreakFromDays, calculateLongestStreakFromDays, getUniqueDayTimestamps } from "./streakUtil";

// Pre-compute mood type sets once (MOODS is constant)
const POSITIVE_MOODS = new Set(MOODS.filter(m => m.type === "positive").map(m => m.value));
const NEUTRAL_MOODS = new Set(MOODS.filter(m => m.type === "neutral").map(m => m.value));
const NEGATIVE_MOODS = new Set(MOODS.filter(m => m.type === "negative").map(m => m.value));

export interface MomentData {
  total: number;
  thisMonth: number;
  withPhotos: number;
  favorites: number;
  withNotes: number;
  perfectMoments: number;
  calmCount: number;
  uniqueMoods: number;
  moodBalance: boolean;
  longestStreak: number;
  currentStreak: number;
  positiveStreak: number;
  moodCounts: Record<string, number>;
  uniqueMoodsSet: Set<string>;
  positiveMoodMoments: Moment[];
  holidayMoments: Record<string, Moment>;
  timeMoments: Record<string, Moment>;
  getSortedMoments: () => Moment[];
}

/**
 * Unified data calculation (for both achievements and stats)
 * Single pass through moments - calculates everything at once
 */
export function calculateMomentData(moments: Moment[]): MomentData {
  const total = moments.length;
  if (total === 0) {
    return {
      total: 0,
      thisMonth: 0,
      withPhotos: 0,
      favorites: 0,
      withNotes: 0,
      perfectMoments: 0,
      calmCount: 0,
      uniqueMoods: 0,
      moodBalance: false,
      longestStreak: 0,
      currentStreak: 0,
      positiveStreak: 0,
      moodCounts: {},
      uniqueMoodsSet: new Set<string>(),
      positiveMoodMoments: [],
      holidayMoments: {},
      timeMoments: {},
      getSortedMoments: () => [],
    };
  }

  // Lazy sorting: only sort moments when needed (for milestone achievements)
  // This saves time if there are no milestone achievements to check
  let sortedMomentsCache: Moment[] | null = null;
  const getSortedMoments = () => {
    if (!sortedMomentsCache) {
      // Sort by creation date (oldest first)
      sortedMomentsCache = [...moments].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    return sortedMomentsCache;
  };

  // Initialize counters
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let thisMonth = 0;
  let withPhotos = 0, favorites = 0, withNotes = 0, perfect = 0, calmCount = 0;
  const uniqueMoods = new Set<string>();
  const moodCounts: Record<string, number> = {};
  const positiveMoodMoments: Moment[] = [];
  const holidayMoments: Record<string, Moment> = {};
  const timeMoments: Record<string, Moment> = {};
  let hasPositive = false, hasNeutral = false, hasNegative = false;

  // Single pass through moments - calculate everything at once
  for (const m of moments) {
    // Stats: this month count
    if (m.createdAt.getMonth() === currentMonth && m.createdAt.getFullYear() === currentYear) {
      thisMonth++;
    }

    // Common counts (used by both stats and achievements)
    if (m.imageUri) withPhotos++;
    if (m.isFavorite) favorites++;
    if (m.notes?.trim()) withNotes++;
    if (m.imageUri && m.notes?.trim() && m.mood) perfect++;

    // Mood tracking
    if (m.mood) {
      uniqueMoods.add(m.mood);
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      if (m.mood === "calm") calmCount++;
      if (POSITIVE_MOODS.has(m.mood)) { 
        hasPositive = true; 
        positiveMoodMoments.push(m); 
      }
      if (NEUTRAL_MOODS.has(m.mood)) hasNeutral = true;
      if (NEGATIVE_MOODS.has(m.mood)) hasNegative = true;
    }

    // Holiday tracking
    const holiday = isHoliday(m.createdAt);
    if (holiday && !holidayMoments[holiday]) holidayMoments[holiday] = m;

    // Time-based tracking
    const h = m.createdAt.getHours();
    const day = m.createdAt.getDay();
    const min = m.createdAt.getMinutes();
    if (!timeMoments.earlyBird && h >= 5 && h < 9) timeMoments.earlyBird = m;
    if (!timeMoments.nightOwl && (h >= 22 || h < 2)) timeMoments.nightOwl = m;
    if (!timeMoments.weekend && (day === 0 || day === 6)) timeMoments.weekend = m;
    if (!timeMoments.midnight && h === 0 && min === 0) timeMoments.midnight = m;
    if (!timeMoments.noon && h === 12 && min === 0) timeMoments.noon = m;
  }

  // Calculate streaks efficiently - single calculation, reused
  const allDays = getUniqueDayTimestamps(moments);
  const longestStreak = calculateLongestStreakFromDays(allDays);
  const currentStreak = calculateCurrentStreakFromDays(allDays);
  
  // Calculate positive streak only if needed
  const positiveStreak = positiveMoodMoments.length > 0 
    ? calculateLongestStreakFromDays(getUniqueDayTimestamps(positiveMoodMoments))
    : 0;

  return {
    total,
    thisMonth,
    withPhotos,
    favorites,
    withNotes,
    perfectMoments: perfect,
    calmCount,
    uniqueMoods: uniqueMoods.size,
    moodBalance: hasPositive && hasNeutral && hasNegative,
    longestStreak,
    currentStreak,
    positiveStreak,
    moodCounts,
    uniqueMoodsSet: uniqueMoods,
    positiveMoodMoments,
    holidayMoments,
    timeMoments,
    getSortedMoments,
  };
}

