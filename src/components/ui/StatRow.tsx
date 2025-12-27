// src/components/ui/StatRow.tsx
import { colors, spacing, typography } from "@/src/constants/theme";
import { StyleSheet, View } from "react-native";
import { Icon } from "./Icon";
import { Text } from "./Text";

export interface StatRowProps {
  emoji: string;
  label: string;
  value: string | number;
  trend?: number; // percentage change
  showTrend?: boolean;
  isLast?: boolean; // Remove border if last item
}

export function StatRow({ emoji, label, value, trend, showTrend, isLast }: StatRowProps) {
  const trendColor = trend !== undefined && trend > 0 
    ? colors.state.success 
    : trend !== undefined && trend < 0 
    ? colors.state.error 
    : colors.text.secondary;
  
  const trendIcon = trend !== undefined && trend > 0 
    ? "trending-up" 
    : trend !== undefined && trend < 0 
    ? "trending-down" 
    : null;

  return (
    <View style={[styles.statRow, isLast && styles.statRowLast]}>
      <View style={styles.statRowLeft}>
        <Text style={styles.statEmoji}>{emoji}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <View style={styles.statRowRight}>
        <Text style={styles.statValue}>{value}</Text>
        {showTrend && trend !== undefined && trendIcon && (
          <View style={styles.trendContainer}>
            <Icon name={trendIcon} size={14} color={trendColor} />
            <Text style={[styles.trendText, { color: trendColor }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  statEmoji: {
    fontSize: typography.size.lg,
    includeFontPadding: false,
    textAlignVertical: "center",
    minWidth: typography.size.lg + 4,
  },
  statLabel: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
  statRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
    textAlign: "right",
    minWidth: 60,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  trendText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
});

