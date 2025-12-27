// src/components/layout/ScreenHeader.tsx
// ============================================================================
// SCREEN HEADER - Consistent header for all screens
// ============================================================================

import { StyleSheet, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";
import { Text } from "../ui/Text";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  rightElement,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
    lineHeight: 32
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: spacing.md,
    marginTop: spacing.xs / 2,
  },
});
