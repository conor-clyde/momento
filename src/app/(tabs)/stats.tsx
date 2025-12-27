// ============================================================================
// STATS SCREEN - A gentle reflection of your little moments
// ============================================================================

import { EmptyState, Screen, ScreenHeader, Text } from "@/src/components";
import { MoodBar, StatCard, StatRow } from "@/src/components/ui";
import { colors, spacing, typography } from "@/src/constants/theme";
import { useMoments } from "@/src/contexts/MomentsContext";
import { StyleSheet, View } from "react-native";

// -----------------------------------------------------------------------------
// Screen
// -----------------------------------------------------------------------------

export default function StatsScreen() {
  const { moments, stats } = useMoments();

  // Get top mood from distribution (first item if exists)
  const topMood = stats.moodDistribution.length > 0 ? stats.moodDistribution[0] : null;

  if (moments.length === 0) {
    return (
      <Screen scrollable>
        <ScreenHeader title="Stats" subtitle="Your journey in numbers" />
        <EmptyState
          icon="heart-outline"
          title="No moments yet"
          subtitle="Start capturing your little moments to see your story unfold"
        />
      </Screen>
    );
  }

  return (
    <Screen scrollable edges={["top"]}>
      <ScreenHeader title="Stats" subtitle="Your journey in numbers" />

      {/* Progress */}
      <View style={[styles.section, styles.firstSection]}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressContainer}>
          <StatCard
            emoji="🔥"
            value={stats.streak}
            label="Day Streak"
            showDivider
          />
          <StatCard
            emoji="📸"
            value={stats.total}
            label={stats.total === 1 ? "Total Moment" : "Total Moments"}
            showDivider
          />
          <StatCard
            emoji="📆"
            value={stats.thisMonth}
            label="This Month"
          />
        </View>
      </View>

      {/* Feelings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How You&apos;ve Been Feeling</Text>

        {/* Top Mood */}
        {topMood ? (
          <View style={styles.topMoodContainer}>
            <View style={styles.topMoodContent}>
              <Text style={styles.topMoodEmoji}>{topMood.emoji}</Text>
              <View style={styles.topMoodInfo}>
                <Text style={styles.topMoodLabel}>Most common mood</Text>
                <Text style={styles.topMoodValue}>{topMood.label}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.topMoodContainer}>
            <View style={styles.topMoodContent}>
              <Text style={styles.topMoodEmoji}>😊</Text>
              <View style={styles.topMoodInfo}>
                <Text style={styles.topMoodLabel}>Most common mood</Text>
                <Text style={styles.topMoodValue}>No moods yet</Text>
              </View>
            </View>
          </View>
        )}

        {/* Mood Distribution - Top 5 */}
        {stats.moodDistribution.length > 0 && (
          <View style={styles.moodChartContainer}>
            {stats.moodDistribution.map((mood) => {
              const maxCount = stats.moodDistribution[0]?.count || 1;
              return (
                <MoodBar
                  key={mood.value}
                  mood={mood}
                  maxCount={maxCount}
                />
              );
            })}
          </View>
        )}
      </View>

      {/* Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Moments</Text>
        <View style={styles.statsList}>
          <StatRow
            emoji="❤️"
            label="Favorites"
            value={stats.favorites}
          />
          <StatRow
            emoji="📷"
            label="Moments with photos"
            value={stats.withPhotos}
          />
          <StatRow
            emoji="📝"
            label="Moments with notes"
            value={stats.withNotes}
            isLast
          />
        </View>
      </View>
    </Screen>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  firstSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    letterSpacing: -0.4,
  },
  // Progress Section
  progressContainer: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  // Top Mood
  topMoodContainer: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  topMoodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  topMoodEmoji: {
    fontSize: typography.size.xxxl,
    includeFontPadding: false,
    textAlignVertical: "center",
    minWidth: typography.size.xxxl + 8,
    lineHeight: typography.size.xxxl + 16,
  },
  topMoodInfo: {
    flex: 1,
  },
  topMoodLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  topMoodValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  // Mood Chart
  moodChartContainer: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  emptyMoodText: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  // Stats List
  statsList: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: "hidden",
  },
});
