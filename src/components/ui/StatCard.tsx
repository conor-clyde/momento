// src/components/ui/StatCard.tsx
import { colors, spacing, typography } from "@/src/constants/theme";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "./Text";

export type StatCardVariant = "stacked" | "inline";

export interface StatCardProps {
  emoji?: string;
  value: string | number;
  label: string;
  variant?: StatCardVariant;
  style?: ViewStyle;
  valueStyle?: TextStyle;
  labelStyle?: TextStyle;
  showDivider?: boolean; // For stacked variant - show divider on the right
}

export function StatCard({
  emoji,
  value,
  label,
  variant = "stacked",
  style,
  valueStyle,
  labelStyle,
  showDivider = false,
}: StatCardProps) {
  const isStacked = variant === "stacked";
  const isInline = variant === "inline";

  return (
    <View style={[styles.container, isStacked && styles.stackedContainer, isInline && styles.inlineContainer, style]}>
      {isStacked ? (
        // Stacked variant: vertical stack (emoji, value, label)
        <>
          {emoji && <Text style={styles.stackedEmoji}>{emoji}</Text>}
          <Text style={[styles.stackedValue, valueStyle]}>{value}</Text>
          <Text style={[styles.stackedLabel, labelStyle]}>{label}</Text>
          {showDivider && <View style={styles.divider} />}
        </>
      ) : (
        // Inline variant: horizontal row with emoji+value, then label below
        <>
          <View style={styles.inlineValueRow}>
            {emoji && <Text style={styles.inlineEmoji}>{emoji}</Text>}
            <Text style={[styles.inlineValue, valueStyle]}>{value}</Text>
          </View>
          <Text style={[styles.inlineLabel, labelStyle]}>{label}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Stacked variant styles (vertical layout)
  stackedContainer: {
    flex: 1,
    paddingVertical: spacing.md,
    position: "relative",
  },
  stackedEmoji: {
    fontSize: typography.size.xxl,
    marginBottom: spacing.sm,
    includeFontPadding: false,
    textAlignVertical: "center",
    minHeight: typography.size.xxl + 4,
  },
  stackedValue: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  stackedLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
  },
  divider: {
    position: "absolute",
    right: -spacing.md / 2, // Center divider in the gap between cards
    top: spacing.md,
    bottom: spacing.md,
    width: 1,
    backgroundColor: colors.border.light,
  },
  // Inline variant styles (horizontal layout)
  inlineContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  inlineValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  inlineEmoji: {
    fontSize: typography.size.lg,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  inlineValue: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    lineHeight: typography.size.xxxl * 1.1,
    letterSpacing: 0.3,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  inlineLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.xs / 2,
  },
});

