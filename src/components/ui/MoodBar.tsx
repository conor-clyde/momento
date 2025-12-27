// src/components/ui/MoodBar.tsx
import { colors, spacing, typography } from "@/src/constants/theme";
import { MoodDistributionItem } from "@/src/types";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";

export interface MoodBarProps {
  mood: MoodDistributionItem;
  maxCount: number;
}

export function MoodBar({ mood, maxCount }: MoodBarProps) {
  const barWidth = maxCount > 0 ? (mood.count / maxCount) * 100 : 0;
  
  return (
    <View style={styles.moodBarContainer}>
      <View style={styles.moodBarHeader}>
        <View style={styles.moodBarLabelContainer}>
          <Text style={styles.moodBarEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodBarLabel}>{mood.label}</Text>
        </View>
        <View style={styles.moodBarValueContainer}>
          <Text style={styles.moodBarCount}>{mood.count}</Text>
          <Text style={styles.moodBarPercentage}>{mood.percentage}%</Text>
        </View>
      </View>
      <View style={styles.moodBarTrack}>
        <View 
          style={[
            styles.moodBarFill, 
            { width: `${barWidth}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moodBarContainer: {
    gap: spacing.xs,
  },
  moodBarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  moodBarLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  moodBarEmoji: {
    fontSize: typography.size.lg,
    includeFontPadding: false,
    textAlignVertical: "center",
    minWidth: typography.size.lg + 4,
  },
  moodBarLabel: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
  },
  moodBarValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  moodBarCount: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
    minWidth: 24,
    textAlign: "right",
  },
  moodBarPercentage: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    minWidth: 40,
    textAlign: "right",
  },
  moodBarTrack: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    overflow: "hidden",
  },
  moodBarFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: 4,
    minWidth: 2,
  },
});

