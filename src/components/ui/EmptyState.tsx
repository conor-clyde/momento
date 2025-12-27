// src/components/ui/EmptyState.tsx
import { StyleSheet, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";
import { Icon, IconName } from "./Icon";
import { Text } from "./Text";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
}

export function EmptyState({
  icon = "images-outline",
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name={icon} size={36} color={colors.primary.main} />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.muted,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: typography.size.base * 1.5,
  },
});
