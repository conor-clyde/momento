// src/components/ui/Button.tsx
import { ActivityIndicator, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { colors, shadows, spacing, typography } from "../../constants/theme";
import { Icon, IconName } from "./Icon";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  text?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
  iconOnly?: boolean;
}

interface VariantConfig {
  button: ViewStyle;
  text: TextStyle;
  iconColor: string;
  iconSize?: number;
}

// =====================
// Variant definitions
// =====================
const variants: Record<ButtonVariant, VariantConfig> = {
  primary: {
    button: {
      backgroundColor: colors.primary.main,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xxxl,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      minHeight: 48,
      ...shadows.small,
    },
    text: {
      color: colors.text.white,
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
    },
    iconColor: colors.text.white,
    iconSize: 20,
  },
  secondary: {
    button: {
      backgroundColor: "transparent",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "nowrap",
      gap: spacing.xs,
      borderWidth: 1.5,
      borderColor: colors.primary.main,
      minHeight: 44,
    },
    text: {
      color: colors.primary.main,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
      lineHeight: typography.size.sm + 2,
      includeFontPadding: false,
      flexShrink: 0,
    },
    iconColor: colors.primary.main,
    iconSize: 20,
  },
  ghost: {
    button: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      backgroundColor: "transparent",
      minHeight: 36,
    },
    text: {
      color: colors.primary.main,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
    },
    iconColor: colors.primary.main,
    iconSize: 18,
  },
};

// =====================
// Button component
// =====================
export function Button({
  text,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
  fullWidth = false,
  style,
  isLoading = false,
  size = "medium",
  iconOnly = false
}: ButtonProps) {
  const config = variants[variant];
  const isDisabled = disabled || isLoading;
  
  // Size adjustments
  const sizeMultipliers = {
    small: 0.85,
    medium: 1,
    large: 1.15,
  };
  const multiplier = sizeMultipliers[size];
  
  const buttonStyle: ViewStyle = {
    ...config.button,
    paddingVertical: config.button.paddingVertical ? (config.button.paddingVertical as number) * multiplier : undefined,
    paddingHorizontal: config.button.paddingHorizontal ? (config.button.paddingHorizontal as number) * multiplier : undefined,
    minHeight: config.button.minHeight ? (config.button.minHeight as number) * multiplier : undefined,
  };

  const textStyle: TextStyle = {
    ...config.text,
    fontSize: (config.text.fontSize as number) * multiplier,
    lineHeight: config.text.lineHeight ? (config.text.lineHeight as number) * multiplier : undefined,
  };

  const iconSize = (config.iconSize || 20) * multiplier;
  const showText = !iconOnly && text && !isLoading;
  const showIcon = icon && !isLoading;

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        fullWidth && { width: "100%" },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={text || (icon ? `${icon} button` : "Button")}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={config.iconColor} />
      ) : (
        <>
          {showIcon && <Icon name={icon} size={iconSize} color={config.iconColor} />}
          {showText && <Text style={textStyle} numberOfLines={1}>{text}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}
