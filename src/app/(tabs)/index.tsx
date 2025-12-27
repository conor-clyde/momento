
import { Button, EmptyState, PhotoRow, Screen, StatCard, Text } from "@/src/components";
import { Icon } from "@/src/components/ui/Icon";
import { colors, spacing, typography } from "@/src/constants/theme";
import { useMoments } from "@/src/contexts/MomentsContext";
import { formatLastCaptureDate, getQuoteOfDay, getUnlockedCount } from "@/src/utils";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";


function HomeHeader({ onAchievementsPress }: { onAchievementsPress: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.titleRow}>
          <Text style={styles.appTitle}>Momento</Text>
          <View style={styles.titleBadge}>
            <Icon name="camera" size={24} color={colors.primary.main} />
          </View>
        </View>
        <Pressable
          onPress={onAchievementsPress}
          style={({ pressed }) => [
            styles.achievementsButton,
            pressed && styles.achievementsButtonPressed
          ]}
        >
          <Icon name="trophy-outline" size={20} color={colors.primary.main} />
        </Pressable>
      </View>
      <Text style={styles.subtitle}>A place for your little moments</Text>
    </View>
  );
}


function QuickStats({ count, streak, achievementsUnlocked, achievementsTotal, onAchievementsPress, onMemoriesPress }: {
  count: number;
  streak: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  onAchievementsPress: () => void;
  onMemoriesPress: () => void;
}) {

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <Pressable
          onPress={onMemoriesPress}
          style={({ pressed }) => [
            styles.statPressable,
            pressed && styles.statPressablePressed
          ]}
        >
          <StatCard emoji="📸" value={count} label="Moments" variant="inline" valueStyle={styles.statValue} />
        </Pressable>

        {streak > 1 && (
          <>
            <View style={styles.statsDivider} />
            <StatCard emoji="🔥" value={streak} label="Day Streak" variant="inline" valueStyle={styles.statValue} />
          </>
        )}

        <>
          <View style={styles.statsDivider} />
          <Pressable
            onPress={onAchievementsPress}
            style={({ pressed }) => [
              styles.statPressable,
              pressed && styles.statPressablePressed
            ]}
          >
            <StatCard emoji="🏆" value={`${achievementsUnlocked}/${achievementsTotal}`} label="Achievements" variant="inline" valueStyle={styles.statValue} />
          </Pressable>
        </>


      </View>
    </View>
  );
}


function DailyQuote() {
  const quote = getQuoteOfDay();

  return (
    <View style={styles.quoteCard}>
      <View style={styles.quoteHeader}>
        <Icon name="bookmark-outline" size={20} color={colors.primary.main} />
        <Text style={styles.quoteLabel}>Daily Reflection</Text>
      </View>
      <Text style={styles.quoteText}>{quote}</Text>
    </View>
  );
}


function RecentMoments({ moments, onRandom }: { moments: any[]; onRandom: () => void }) {
  const lastCaptureDate = useMemo(
    () => moments.length ? formatLastCaptureDate(moments[0].createdAt) : "",
    [moments]
  );

  if (!moments.length) return null;

  return (
    <>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text style={styles.sectionTitle}>Recent Captures</Text>
          <Text style={styles.lastCaptureText}>Last capture: {lastCaptureDate}</Text>
        </View>
        <Button variant="ghost" text="Surprise me ✨" onPress={onRandom} />
      </View>

      <PhotoRow moments={moments.slice(0, 4)} />
    </>
  );
}


export default function HomeScreen() {
  const router = useRouter();
  const { moments, achievements, stats, getRandomMoment, isLoading } = useMoments();
  const hasMoments = moments.length > 0;
  const streak = stats.streak;
  const unlockedCount = useMemo(() => getUnlockedCount(achievements), [achievements]);

  const handleRandomMoment = () => {
    const random = getRandomMoment();
    if (random) router.push(`/moment/${random.id}`);
  };

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading your moments…</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topSection}>
        <HomeHeader onAchievementsPress={() => router.push("/achievements")} />

        {hasMoments && (
          <>
            <QuickStats
              count={moments.length}
              streak={streak}
              achievementsUnlocked={unlockedCount}
              achievementsTotal={achievements.length}
              onMemoriesPress={() => router.replace("/gallery")}
              onAchievementsPress={() => router.push("/achievements")}
            />
            <DailyQuote />
          </>
        )}
      </View>

      <View style={styles.mainContent}>
        {hasMoments ? (
          <RecentMoments moments={moments} onRandom={handleRandomMoment} />
        ) : (
          <EmptyState
            icon="camera-outline"
            title="Your gallery is empty"
            subtitle="Capture a moment to start building your collection"
          />
        )}
      </View>

      <View style={styles.floatingButtonContainer}>
        <Button
          variant="primary"
          text="Capture a moment"
          icon="camera"
          onPress={() => router.push("/camera")}
        />
      </View>
    </Screen>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
  },
  topSection: {
    paddingTop: spacing.sm,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  appTitle: {
    fontSize: typography.size.xxxl + 8,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    letterSpacing: -0.5,
    lineHeight: typography.size.xxxl + 8 * typography.lineHeight.relaxed,
  },
  titleBadge: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  achievementsButton: {
    position: "absolute",
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementsButtonPressed: {
    opacity: 0.6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.secondary,
    marginTop: spacing.xs / 2,
  },
  statsContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 24,
    margin: spacing.lg,
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: spacing.md,
  },
  statPressable: {
    flex: 1,
    alignItems: "center",
  },
  statPressablePressed: {
    opacity: 0.6,
  },
  statValue: {
    fontSize: typography.size.xxl,
  },
  statsDivider: {
    width: 1,
    backgroundColor: colors.border.light,
  },
  quoteCard: {
    backgroundColor: colors.background.card,
    borderRadius: 20,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  quoteLabel: {
    fontSize: typography.size.xs,
    textTransform: "uppercase",
    color: colors.primary.main,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
  quoteText: {
    fontSize: typography.size.md,
    fontStyle: "italic",
    textAlign: "center",
    color: colors.text.primary,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 2,
  },
  lastCaptureText: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: spacing.huge + spacing.xl,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  mainContent: {
    marginTop: spacing.lg,
  },
});
