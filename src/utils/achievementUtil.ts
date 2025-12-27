/**
 * Achievement calculation utility
 */
import { ALL_ACHIEVEMENT_DEFINITIONS, CATEGORY_LABELS, CATEGORY_ORDER, type AchievementDefinition } from "../constants/achievements";
import { MOODS } from "../constants/moods";
import { Achievement, Moment } from "../types";
import { calculateMomentData, type MomentData } from "./momentDataUtil";

// Helper to extract target number from description (e.g., "Capture 25 moments" → 25)
function extractTarget(description: string): number | undefined {
  const match = description.match(/\b(\d+)\b/);
  return match ? parseInt(match[1], 10) : undefined;
}

// Helper to calculate unlocked + progress
const checkProgress = (current: number, target: number) => ({
  unlocked: current >= target,
  progress: current >= target ? undefined : { current, target },
});

// ------------------------------
// Achievement evaluation
// ------------------------------
// Takes an achievement definition and checks if it's unlocked based on moment data
function evaluateAchievement(def: AchievementDefinition, data: MomentData): Achievement {
  const { id } = def;

  // Streak achievements (extract target from ID)
  if (id.startsWith("streak-")) {
    const target = parseInt(id.slice(7), 10); // "streak-".length = 7
    return { ...def, ...checkProgress(data.longestStreak, target) };
  }

  // Milestone achievements (extract target from ID)
  if (id.startsWith("milestone-")) {
    const target = parseInt(id.slice(10), 10); // "milestone-".length = 10
    const sortedMoments = data.getSortedMoments();
    return { 
      ...def, 
      ...checkProgress(data.total, target),
      unlockedAt: sortedMoments[target - 1]?.createdAt,
    };
  }

  // Holiday achievements - isHoliday() now returns achievement ID directly
  if (id.startsWith("holiday-")) {
    const moment = data.holidayMoments[id];
    return { ...def, unlocked: !!moment, unlockedAt: moment?.createdAt };
  }

  // Time achievements - IDs now match data keys directly (e.g., "time-earlyBird")
  if (id.startsWith("time-")) {
    // Remove "time-" prefix to get the key (e.g., "time-earlyBird" → "earlyBird")
    const timeKey = id.slice(5);
    const moment = data.timeMoments[timeKey];
    return { ...def, unlocked: !!moment, unlockedAt: moment?.createdAt };
  }

  // Content achievements - check counts like photos, favorites, notes, etc.
  if (id.startsWith("content-")) {
    // Special case: first moment achievement
    if (id === "content-first") {
      const sortedMoments = data.getSortedMoments();
      return { ...def, unlocked: data.total >= 1, unlockedAt: sortedMoments[0]?.createdAt };
    }
    // Extract data property name from ID (e.g., "content-withPhotos" → "withPhotos")
    const valueKey = id.slice(8); // Remove "content-" prefix
    // Extract target number from description (e.g., "Capture 25 moments" → 25)
    const target = extractTarget(def.description);
    // Check if the property exists in data and get its current value
    if (target !== undefined && valueKey in data) {
      const current = (data as any)[valueKey] as number;
      return { ...def, ...checkProgress(current, target) };
    }
  }

  // Mood achievements
  if (id.startsWith("mood-")) {
    switch (id) {
      case "mood-explorer":
        return { ...def, ...checkProgress(data.uniqueMoods, 5) };
      case "mood-master":
        return { ...def, ...checkProgress(data.uniqueMoods, MOODS.length) };
      case "mood-balance":
        return { ...def, unlocked: data.moodBalance };
      case "mood-positive":
        return { ...def, ...checkProgress(data.positiveStreak, 5) };
      case "mood-calm":
        return { ...def, ...checkProgress(data.calmCount, 5) };
    }
  }

  return { ...def, unlocked: false };
}

// ------------------------------
// Exports
// ------------------------------
export function calculateAchievements(
  moments: Moment[],
  unlockedIds?: Set<string>,
  unlockedDates?: Map<string, Date>,
  momentData?: MomentData
): Achievement[] {
  // Use provided momentData or calculate it if not provided
  const data = momentData || calculateMomentData(moments);
  
  // Return achievements in the order they're defined (which follows category order)
  // CRITICAL: Once an achievement is unlocked, it stays unlocked forever
  // Even if the user no longer meets requirements or deletes photos
  return ALL_ACHIEVEMENT_DEFINITIONS.map(def => {
    // If already unlocked, ALWAYS preserve it - never re-evaluate
    // This ensures achievements persist even when moments are deleted
    // This check MUST happen before evaluateAchievement to prevent re-locking
    if (unlockedIds && unlockedIds.has(def.id)) {
      const unlockedAt = unlockedDates?.get(def.id);
      // Double-check: ensure we always return unlocked: true for achievements in the Set
      return { ...def, unlocked: true, unlockedAt };
    }
    // Otherwise, check if it should be unlocked now
    const evaluated = evaluateAchievement(def, data);
    // Safety check: if somehow an achievement was unlocked but not in the Set,
    // we still mark it as unlocked (defensive programming)
    // But this shouldn't happen if the Set is properly maintained
    return evaluated;
  });
}

export const getUnlockedCount = (achievements: Achievement[]) => achievements.filter(a => a.unlocked).length;

// ------------------------------
// Achievement filtering and grouping
// ------------------------------
export type AchievementFilter = "all" | "unlocked" | "locked";

export interface GroupedAchievements {
  [category: string]: Achievement[];
}

/**
 * Filter and group achievements by category
 * Categories are sorted by CATEGORY_ORDER, achievements within each category are sorted by unlocked status
 */
export function groupAchievementsByCategory(
  achievements: Achievement[],
  filter: AchievementFilter = "all"
): GroupedAchievements {
  // Filter achievements
  const filtered = filter === "all" 
    ? achievements 
    : achievements.filter(a => filter === "unlocked" ? a.unlocked : !a.unlocked);

  // Group by category
  const grouped: GroupedAchievements = {};
  for (const achievement of filtered) {
    (grouped[achievement.category] ??= []).push(achievement);
  }

  // Sort achievements within each category (unlocked first)
  for (const list of Object.values(grouped)) {
    list.sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  }

  // Sort categories by CATEGORY_ORDER
  return Object.fromEntries(
    Object.entries(grouped).sort(
      ([catA], [catB]) => (CATEGORY_ORDER[catA as keyof typeof CATEGORY_ORDER] ?? 999) - (CATEGORY_ORDER[catB as keyof typeof CATEGORY_ORDER] ?? 999)
    )
  );
}

/**
 * Get category label with fallback
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] 
    || category.charAt(0).toUpperCase() + category.slice(1);
}
