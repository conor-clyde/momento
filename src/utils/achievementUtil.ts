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

  // Holiday achievements 
  if (id.startsWith("holiday-")) {
    const unlockDate = data.holidayMoments[id];
    return { ...def, unlocked: !!unlockDate, unlockedAt: unlockDate };
  }

  // Time achievements 
  if (id.startsWith("time-")) {
    // Remove "time-" prefix to get the key (e.g., "time-earlyBird" → "earlyBird")
    const timeKey = id.slice(5);
    const unlockDate = data.timeMoments[timeKey];
    return { ...def, unlocked: !!unlockDate, unlockedAt: unlockDate };
  }

  // Content achievements 
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
  momentData?: MomentData
): Achievement[] {
  // Use provided momentData or calculate it if not provided
  const data = momentData || calculateMomentData(moments);

  // Return achievements in the order they're defined (which follows category order)
  // CRITICAL: Once an achievement is unlocked, it stays unlocked forever
  // Even if the user no longer meets requirements or deletes photos
  return ALL_ACHIEVEMENT_DEFINITIONS.map(def => {
    // Check persistence first - if already unlocked, return unlocked status only
    if (unlockedIds?.has(def.id)) {
      return { ...def, unlocked: true };
    }
    // Only evaluate if not previously unlocked
    return evaluateAchievement(def, data);
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
