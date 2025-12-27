// src/types/index.ts

import { AchievementCategory } from "../constants/achievements";
import { MoodValue } from "../constants/moods";


export interface Moment {
  id: string;
  title: string;
  notes?: string;
  imageUri?: string;
  mood?: MoodValue;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt?: Date;
}


export interface MonthGroup {
  monthName: string;
  moments: Moment[];
}


export interface MoodDistributionItem {
  emoji: string;
  label: string;
  value: string;
  count: number;
  percentage: number;
}

export interface MomentStats {
  total: number;
  thisMonth: number;
  withPhotos: number;
  withNotes: number;
  favorites: number;
  streak: number;
  moodDistribution: MoodDistributionItem[];
}


export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: { current: number; target: number };
}
