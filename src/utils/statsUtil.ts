/**
 * Statistics utility - All stats-related calculations
 * Uses shared moment data calculation for efficiency
 */
import { MOODS } from "../constants/moods";
import { Moment, MomentStats, MoodDistributionItem } from "../types";
import { calculateMomentData, type MomentData } from "./momentDataUtil";

// Create mood lookup map once (MOODS is constant)
const MOOD_MAP = new Map(MOODS.map(m => [m.value, m]));

/**
 * Calculates statistics efficiently using shared moment data
 * Can accept pre-calculated momentData to avoid redundant calculation
 */
export function calculateStats(moments: Moment[], momentData?: MomentData): MomentStats {
  // Use provided momentData or calculate it if not provided
  const data = momentData || calculateMomentData(moments);

  // Build top 5 mood distribution from shared moodCounts
  // Step 1: Convert mood counts object to array of mood items
  const moodDistribution: MoodDistributionItem[] = Object.entries(data.moodCounts)
    .map(([value, count]) => {
      // Look up mood details (emoji, label) from MOOD_MAP
      const mood = MOOD_MAP.get(value);
      if (!mood) return null; // Skip if mood not found
      // Calculate percentage
      const percentage = data.total ? Math.round((count / data.total) * 100) : 0;
      return {
        emoji: mood.emoji,
        label: mood.label,
        value: mood.value,
        count,
        percentage,
      };
    })
    .filter((m): m is MoodDistributionItem => m !== null) // Remove nulls
    .sort((a, b) => b.count - a.count) // Sort by count (highest first)
    .slice(0, 5); // Take top 5

  return {
    total: data.total,
    thisMonth: data.thisMonth,
    withPhotos: data.withPhotos,
    withNotes: data.withNotes,
    favorites: data.favorites,
    streak: data.currentStreak,
    moodDistribution,
  };
}
