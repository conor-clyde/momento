// =============================================================================
// MOODS - Warm, Reflective Mood Definitions for Capturing Little Moments
// =============================================================================

export type Mood = {
  emoji: string;
  value: string;       // unique identifier for stats
  label: string;       // display name
  type: "positive" | "neutral" | "negative";
};

export const MOODS: Mood[] = [
  // Positive moods - Joyful, warm, uplifting moments
  { emoji: "😊", value: "happy", label: "Happy", type: "positive" },
  { emoji: "🥰", value: "loved", label: "Loved", type: "positive" },
  { emoji: "✨", value: "grateful", label: "Grateful", type: "positive" },
  { emoji: "😌", value: "peaceful", label: "Peaceful", type: "positive" },
  { emoji: "🤗", value: "warm", label: "Warm", type: "positive" },
  { emoji: "🌙", value: "content", label: "Content", type: "positive" },
  { emoji: "💫", value: "inspired", label: "Inspired", type: "positive" },

  // Neutral moods - Reflective, contemplative, balanced moments
  { emoji: "🤔", value: "thoughtful", label: "Thoughtful", type: "neutral" },
  { emoji: "🧘", value: "calm", label: "Calm", type: "neutral" },
  { emoji: "☕", value: "cozy", label: "Cozy", type: "neutral" },
  { emoji: "📖", value: "reflective", label: "Reflective", type: "neutral" },
  { emoji: "🌿", value: "grounded", label: "Grounded", type: "neutral" },
  { emoji: "🌅", value: "hopeful", label: "Hopeful", type: "neutral" },

  // Negative moods - Difficult but important moments to capture
  { emoji: "😔", value: "sad", label: "Sad", type: "negative" },
  { emoji: "😴", value: "tired", label: "Tired", type: "negative" },
  { emoji: "😟", value: "worried", label: "Worried", type: "negative" },
  { emoji: "😤", value: "frustrated", label: "Frustrated", type: "negative" },
  { emoji: "🌧️", value: "melancholy", label: "Melancholy", type: "negative" },
];

// Export mood value type
export type MoodValue = typeof MOODS[number]["value"];

// Helper function to get mood by value
export function getMoodByValue(value: string): Mood | undefined {
  return MOODS.find(mood => mood.value === value);
}