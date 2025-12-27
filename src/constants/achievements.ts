
export type AchievementCategory = "streak" | "holiday" | "milestone" | "time" | "content" | "mood";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
}

export const STREAK_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "streak-3",
    title: "Getting Started",
    description: "3 day streak",
    emoji: "🔥",
    category: "streak",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "7 day streak",
    emoji: "💪",
    category: "streak",
  },
  {
    id: "streak-14",
    title: "Two Weeks",
    description: "14 day streak",
    emoji: "🎯",
    category: "streak",
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "30 day streak",
    emoji: "⭐",
    category: "streak",
  },
  {
    id: "streak-60",
    title: "Two Month Legend",
    description: "60 day streak",
    emoji: "🌟",
    category: "streak",
  },
];

export const MILESTONE_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "milestone-5",
    title: "Getting Started",
    description: "Capture 5 moments",
    emoji: "🌱",
    category: "milestone",
  },
  {
    id: "milestone-10",
    title: "First Ten",
    description: "Capture 10 moments",
    emoji: "✨",
    category: "milestone",
  },
  {
    id: "milestone-25",
    title: "Quarter Century",
    description: "Capture 25 moments",
    emoji: "🎊",
    category: "milestone",
  },
  {
    id: "milestone-50",
    title: "Half Century",
    description: "Capture 50 moments",
    emoji: "🌟",
    category: "milestone",
  },
  {
    id: "milestone-100",
    title: "Centurion",
    description: "Capture 100 moments",
    emoji: "💯",
    category: "milestone",
  },
];

export const HOLIDAY_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "holiday-newyear",
    title: "New Year's Day",
    description: "Capture a moment on New Year's Day",
    emoji: "🎉",
    category: "holiday",
  },
  {
    id: "holiday-valentine",
    title: "Valentine's Day",
    description: "Capture a moment on Valentine's Day",
    emoji: "💝",
    category: "holiday",
  },
  {
    id: "holiday-stpatrick",
    title: "St. Patrick's Day",
    description: "Capture a moment on St. Patrick's Day",
    emoji: "🍀",
    category: "holiday",
  },
  {
    id: "holiday-halloween",
    title: "Halloween",
    description: "Capture a moment on Halloween",
    emoji: "🎃",
    category: "holiday",
  },
  {
    id: "holiday-christmas",
    title: "Christmas",
    description: "Capture a moment on Christmas",
    emoji: "🎄",
    category: "holiday",
  },
];

export const TIME_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "time-earlyBird",
    title: "Early Bird",
    description: "Capture a moment between 5-9 AM",
    emoji: "🌅",
    category: "time",
  },
  {
    id: "time-nightOwl",
    title: "Night Owl",
    description: "Capture a moment between 10 PM-2 AM",
    emoji: "🦉",
    category: "time",
  },
  {
    id: "time-weekend",
    title: "Weekend Warrior",
    description: "Capture a moment on the weekend",
    emoji: "🎉",
    category: "time",
  },
  {
    id: "time-midnight",
    title: "Midnight Magic",
    description: "Capture a moment at midnight",
    emoji: "🕛",
    category: "time",
  },
  {
    id: "time-noon",
    title: "High Noon",
    description: "Capture a moment at noon",
    emoji: "☀️",
    category: "time",
  },
];

export const CONTENT_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "content-first",
    title: "First Memory",
    description: "Capture your first moment",
    emoji: "🎬",
    category: "content",
  },
  {
    id: "content-withPhotos",
    title: "Photo Lover",
    description: "Capture 25 moments with photos",
    emoji: "📸",
    category: "content",
  },
  {
    id: "content-favorites",
    title: "Selective",
    description: "Mark 10 moments as favorites",
    emoji: "⭐",
    category: "content",
  },
  {
    id: "content-withNotes",
    title: "Storyteller",
    description: "Add notes to 15 moments",
    emoji: "📝",
    category: "content",
  },
  {
    id: "content-perfectMoments",
    title: "Perfect Moment",
    description: "Create 5 perfect moments (photo + note + mood)",
    emoji: "💎",
    category: "content",
  },
];

export const MOOD_ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "mood-explorer",
    title: "Mood Explorer",
    description: "Use 5 different moods",
    emoji: "🌈",
    category: "mood",
  },
  {
    id: "mood-master",
    title: "Mood Master",
    description: "Use all moods",
    emoji: "🎭",
    category: "mood",
  },
  {
    id: "mood-balance",
    title: "Mood Balance",
    description: "Use positive, neutral, and negative moods",
    emoji: "⚖️",
    category: "mood",
  },
  {
    id: "mood-positive",
    title: "Positive Streak",
    description: "Use positive moods for 5 days in a row",
    emoji: "☀️",
    category: "mood",
  },
  {
    id: "mood-calm",
    title: "Zen Master",
    description: "Use 'calm' mood 5 times",
    emoji: "🧘",
    category: "mood",
  },
];

export const ALL_ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  ...STREAK_ACHIEVEMENTS,
  ...MILESTONE_ACHIEVEMENTS,
  ...HOLIDAY_ACHIEVEMENTS,
  ...TIME_ACHIEVEMENTS,
  ...CONTENT_ACHIEVEMENTS,
  ...MOOD_ACHIEVEMENTS,
];

// Logical UX order for categories (most important/accessible first)
export const CATEGORY_ORDER: Record<AchievementCategory, number> = {
  milestone: 1,  // Easy to understand - total count achievements
  streak: 2,     // Important for engagement - consistency
  content: 3,     // Encourages quality moments
  mood: 4,        // Fun exploration
  time: 5,        // Special time-based moments
  holiday: 6,     // Special occasions
};

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  milestone: "Milestones",
  streak: "Streaks",
  content: "Content",
  mood: "Moods",
  time: "Time-Based",
  holiday: "Holidays",
};

// Returns achievement ID directly (e.g., "holiday-christmas") for efficient lookup
export function isHoliday(date: Date): string | null {
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 0 && day === 1) return "holiday-newyear";
  if (month === 1 && day === 14) return "holiday-valentine";
  if (month === 2 && day === 17) return "holiday-stpatrick";
  if (month === 9 && day === 31) return "holiday-halloween";
  if (month === 11 && day === 25) return "holiday-christmas";

  return null;
}

