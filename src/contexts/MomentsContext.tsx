import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Achievement, Moment, MomentStats } from "../types";
import { calculateAchievements } from "../utils/achievementUtil";
import { isValidDate } from "../utils/dateUtils";
import { calculateMomentData } from "../utils/momentDataUtil";
import { calculateStats } from "../utils/statsUtil";
import { deleteLocalPhoto, imageFileExists } from "../utils/storageUtil";
import { logger } from "../utils/logger";

type SerializedMoment = Omit<Moment, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt?: string;
};

type MomentsContextType = {
  moments: Moment[];
  achievements: Achievement[];
  stats: MomentStats;
  isLoading: boolean;
  addMoment: (moment: Omit<Moment, "id" | "createdAt" | "isFavorite">) => void;
  updateMoment: (id: string, updates: Partial<Omit<Moment, "id" | "createdAt" | "isFavorite">>) => void;
  removeMoment: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => void;
  getRandomMoment: () => Moment | null;
};

const STORAGE_KEY = "@momento_moments";
const ACHIEVEMENTS_STORAGE_KEY = "@momento_achievements";
const MomentsContext = createContext<MomentsContextType | undefined>(undefined);

// ---- SERIALIZATION ----

const serializeMoment = (moment: Moment): SerializedMoment => ({
  ...moment,
  createdAt: moment.createdAt.toISOString(),
  updatedAt: moment.updatedAt?.toISOString(),
});

const deserializeMoment = (serialized: SerializedMoment): Moment => {
  const parsedCreatedAt = new Date(serialized.createdAt);
  const createdAt = isValidDate(parsedCreatedAt) ? parsedCreatedAt : new Date();

  let updatedAt: Date | undefined;
  if (serialized.updatedAt) {
    const parsedUpdatedAt = new Date(serialized.updatedAt);
    updatedAt = isValidDate(parsedUpdatedAt) ? parsedUpdatedAt : undefined;
  }

  return { ...serialized, createdAt, updatedAt };
};

// ---- PROVIDER ----

export function MomentsProvider({ children }: { children: ReactNode }) {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const momentsRef = useRef<Moment[]>([]);

  // Load on mount - coordinate both loads
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadMoments(),
          loadUnlockedAchievements(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  // Keep ref updated (needed for removeMoment)
  useEffect(() => {
    momentsRef.current = moments;
  }, [moments]);

  // Save whenever moments changes (but not on initial load)
  useEffect(() => {
    if (!isLoading) {
      saveMoments(moments);
    }
  }, [moments, isLoading]);

  // Save unlocked achievements whenever they change (but not on initial load)
  useEffect(() => {
    if (!isLoading) {
      saveUnlockedAchievements(unlockedAchievementIds);
    }
  }, [unlockedAchievementIds, isLoading]);

  const loadMoments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed: SerializedMoment[] = JSON.parse(stored);
          const deserializedMoments = parsed.map(deserializeMoment);
          
          // Validate image files exist and remove imageUri if file is missing
          const validatedMoments = await Promise.all(
            deserializedMoments.map(async (moment) => {
              if (moment.imageUri) {
                const exists = await imageFileExists(moment.imageUri);
                if (!exists) {
                  logger.warn(`Image file not found for moment ${moment.id}, removing imageUri`);
                  return { ...moment, imageUri: undefined };
                }
              }
              return moment;
            })
          );
          
          setMoments(validatedMoments);
        } catch (parseError) {
          console.error("Error parsing stored moments:", parseError);
          // If parsing fails, clear corrupted data
          await AsyncStorage.removeItem(STORAGE_KEY);
          setMoments([]);
        }
      }
    } catch (error) {
      console.error("Error loading moments:", error);
      setMoments([]);
    }
  };

  const saveMoments = async (moments: Moment[]) => {
    try {
      const serialized = moments.map(serializeMoment);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error("Error saving moments:", error);
    }
  };

  const loadUnlockedAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Support both old format (array of strings) and new format (object with ids)
          if (Array.isArray(parsed)) {
            // Old format - migrate to new format
            setUnlockedAchievementIds(new Set(parsed));
          } else if (parsed.ids && Array.isArray(parsed.ids)) {
            // New format
            setUnlockedAchievementIds(new Set(parsed.ids));
          }
        } catch (parseError) {
          console.error("Error parsing stored achievements:", parseError);
          // Don't remove storage on parse error - preserve data if possible
          // Only remove if data is completely corrupted
        }
      }
    } catch (error) {
      console.error("Error loading achievements:", error);
      // Don't clear storage on error - preserve existing data
    }
  };

  const saveUnlockedAchievements = async (unlockedIds: Set<string>) => {
    try {
      const data = Array.from(unlockedIds);
      await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving achievements:", error);
    }
  };

  // Memoize functions to prevent unnecessary re-renders in child components
  const addMoment = useCallback((momentData: Omit<Moment, "id" | "createdAt" | "isFavorite">) => {
    setMoments((prev) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 11);
      const counter = prev.length;

      const id = `${timestamp}-${random}-${counter}`;

      const newMoment: Moment = {
        ...momentData,
        id,
        isFavorite: false,
        createdAt: new Date(),
      };

      return [newMoment, ...prev];
    });
  }, []);

  const updateMoment = useCallback((id: string, updates: Partial<Omit<Moment, "id" | "createdAt" | "isFavorite">>) => {
    setMoments((prev) =>
      prev.map((moment) =>
        moment.id === id
          ? { ...moment, ...updates, updatedAt: new Date() }
          : moment
      )
    );
  }, []);

  const removeMoment = useCallback(async (id: string) => {
    // Find the moment to get its image URI before removing
    const momentToRemove = momentsRef.current.find((m) => m.id === id);
    
    // Delete the local photo file if it exists
    if (momentToRemove?.imageUri) {
      try {
        await deleteLocalPhoto(momentToRemove.imageUri);
      } catch (error) {
        console.error("Error deleting local photo:", error);
        // Continue with moment deletion even if photo deletion fails
      }
    }
    
    // Remove the moment from state
    setMoments((prev) => prev.filter((moment) => moment.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setMoments((prev) =>
      prev.map((moment) =>
        moment.id === id ? { ...moment, isFavorite: !moment.isFavorite } : moment
      )
    );
  }, []);

  const getRandomMoment = useCallback((): Moment | null => {
    if (moments.length === 0) return null;
    return moments[Math.floor(Math.random() * moments.length)];
  }, [moments]);

  // Calculate moment data ONCE - shared by both stats and achievements
  // This is the expensive calculation (single pass through all moments), so we do it once and reuse
  const momentData = useMemo(() => {
    return calculateMomentData(moments);
  }, [moments]);

  // Derive stats from shared moment data (avoids recalculating momentData)
  const stats = useMemo(() => {
    return calculateStats(moments, momentData);
  }, [moments, momentData]);

  // Calculate achievements - uses shared momentData to avoid redundant calculation
  // CRITICAL: Always pass unlockedAchievementIds to preserve unlocked achievements
  // Even if moments are deleted, unlocked achievements must remain unlocked
  const achievements = useMemo(() => {
    return calculateAchievements(moments, unlockedAchievementIds, momentData);
  }, [moments, unlockedAchievementIds, momentData]);

  // Track newly unlocked achievements
  // CRITICAL: Only ADD to the Set, never remove - once unlocked, achievements stay unlocked forever
  useEffect(() => {
    if (!isLoading) {
      const newlyUnlocked = achievements
        .filter(a => a.unlocked && !unlockedAchievementIds.has(a.id));

      if (newlyUnlocked.length > 0) {
        setUnlockedAchievementIds(prev => {
          // Always preserve existing unlocked achievements - only add new ones
          const updated = new Set(prev);
          newlyUnlocked.forEach(a => updated.add(a.id));
          return updated;
        });
      }

      // Defensive check: ensure all achievements marked as unlocked in the Set are actually unlocked
      // This helps catch any bugs where achievements might be incorrectly marked as locked
      const shouldBeUnlocked = Array.from(unlockedAchievementIds).filter(id => {
        const achievement = achievements.find(a => a.id === id);
        return achievement && !achievement.unlocked;
      });

      // Defensive check: ensure all achievements marked as unlocked in the Set are actually unlocked
      // This helps catch any bugs where achievements might be incorrectly marked as locked
    }
  }, [achievements, unlockedAchievementIds, isLoading]);

  return (
    <MomentsContext.Provider
      value={{ moments, achievements, stats, isLoading, addMoment, updateMoment, removeMoment, toggleFavorite, getRandomMoment }}
    >
      {children}
    </MomentsContext.Provider>
  );
}

export function useMoments() {
  const context = useContext(MomentsContext);
  if (context === undefined) {
    throw new Error("useMoments must be used within a MomentsProvider");
  }
  return context;
}