import { EmptyState, Screen, Text } from "@/src/components";
import { colors, shadows, spacing, typography } from "@/src/constants/theme";
import { useMoments } from "@/src/contexts/MomentsContext";
import { Achievement } from "@/src/types";
import { getCategoryLabel, getUnlockedCount, groupAchievementsByCategory, type AchievementFilter } from "@/src/utils";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function AchievementsScreen() {
  const { achievements } = useMoments();
  const unlockedCount = useMemo(() => getUnlockedCount(achievements), [achievements]);
  const [filter, setFilter] = useState<AchievementFilter>("all");

  const filteredByCategory = useMemo(() => {
    return groupAchievementsByCategory(achievements, filter);
  }, [achievements, filter]);

  if (achievements.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="trophy-outline"
          title="No achievements yet"
          subtitle="Start capturing moments to unlock your first achievement! 🎯"
        />
      </Screen>
    );
  }

  return (
    <Screen scrollable edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.filtersRow}>
          {(["all", "unlocked", "locked"] as AchievementFilter[]).map((filterType) => (
            <Pressable
              key={filterType}
              style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[styles.filterButtonText, filter === filterType && styles.filterButtonTextActive]}>
                {filterType === "all"
                  ? "All"
                  : filterType === "unlocked"
                    ? `Unlocked (${unlockedCount})`
                    : `Locked (${achievements.length - unlockedCount})`}
              </Text>
            </Pressable>
          ))}
        </View>

        {Object.entries(filteredByCategory).map(([category, categoryAchievements]) => {
          const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;

          return (
            <View key={category} style={styles.achievementCategory}>
              <View style={styles.achievementCategoryHeader}>
                <Text style={styles.achievementCategoryTitle}>
                  {getCategoryLabel(category)}
                </Text>
                <Text style={styles.achievementCategoryCount}>
                  {categoryUnlocked}/{categoryAchievements.length}
                </Text>
              </View>
              <View style={styles.achievementsList}>
                {categoryAchievements.map((achievement) => (
                  <AchievementRow key={achievement.id} achievement={achievement} />
                ))}
              </View>
            </View>
          );
        })}
      </View>

    </Screen>
  );
}

function AchievementRow({ achievement }: { achievement: Achievement }) {
  const isUnlocked = achievement.unlocked;
  const progressPercentage = achievement.progress
    ? Math.min((achievement.progress.current / achievement.progress.target) * 100, 100)
    : 0;

  return (
    <View style={[styles.achievementRow, isUnlocked && styles.achievementRowUnlocked]}>
      <View style={[styles.achievementRowIcon, isUnlocked ? styles.achievementRowIconUnlocked : styles.achievementRowIconLocked]}>
        <Text style={styles.achievementRowEmoji}>{achievement.emoji}</Text>
      </View>
      <View style={styles.achievementRowContent}>
        <Text style={[styles.achievementRowTitle, isUnlocked && styles.achievementRowTitleUnlocked]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementRowDescription, !isUnlocked && styles.achievementRowDescriptionLocked]}>
          {achievement.description}
        </Text>
        {achievement.progress && !isUnlocked && (
          <View style={styles.achievementRowProgress}>
            <View style={styles.achievementRowProgressBar}>
              <View style={[styles.achievementRowProgressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.achievementRowProgressText}>
              {achievement.progress.current} / {achievement.progress.target}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  filterButtonTextActive: {
    color: colors.background.white,
  },
  achievementsContainer: {
    gap: spacing.xl,
  },
  achievementCategory: {
    marginBottom: spacing.xl,
  },
  achievementCategoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  achievementCategoryTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  achievementCategoryCount: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    backgroundColor: colors.background.light,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  achievementsList: {
    gap: spacing.md,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.background.white,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    gap: spacing.md,
    ...shadows.small,
  },
  achievementRowUnlocked: {
    borderColor: colors.primary.light,
    backgroundColor: colors.primary.muted,
  },
  achievementRowIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary.muted,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  achievementRowIconUnlocked: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  achievementRowIconLocked: {
    backgroundColor: colors.background.light,
    borderColor: colors.border.light,
    opacity: 0.6,
  },
  achievementRowEmoji: {
    fontSize: 28,
    lineHeight: 34
  },
  achievementRowIconBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.state.success,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  achievementRowIconBadgeText: {
    color: colors.background.white,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  achievementRowContent: {
    flex: 1,
  },
  achievementRowTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: -0.2,
    marginBottom: spacing.xs,
  },
  achievementRowTitleUnlocked: {
    color: colors.primary.dark,
  },
  achievementRowDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.size.sm * 1.5,
    marginBottom: spacing.xs,
  },
  achievementRowDescriptionLocked: {
    color: colors.text.tertiary,
  },
  achievementRowProgress: {
    width: "100%",
    marginTop: spacing.sm,
  },
  achievementRowProgressBar: {
    height: 8,
    backgroundColor: colors.background.light,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  achievementRowProgressFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  achievementRowProgressText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
});
