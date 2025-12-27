// src/components/forms/TextInput.tsx
// ============================================================================
// TEXT INPUT - Unified input component for all forms
// ============================================================================

import { TextInput as RNTextInput, StyleSheet, TextInputProps, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";
import { Text } from "../ui/Text";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

export function TextInput({
  label,
  error,
  maxLength,
  showCount = false,
  value,
  multiline,
  style,
  ...props
}: CustomTextInputProps) {
  const showCharCount = showCount && maxLength && value;

  return (
    <View style={styles.container}>
      {(label || showCharCount) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showCharCount && (
            <Text style={styles.charCount}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
      <RNTextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.error,
          style,
        ]}
        value={value}
        maxLength={maxLength}
        multiline={multiline}
        scrollEnabled={multiline}
        placeholderTextColor={colors.text.tertiary}
        textAlignVertical={multiline ? "top" : "center"}
        blurOnSubmit={!multiline}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.size.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  multiline: {
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  error: {
    borderColor: colors.state.error,
  },
  charCount: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  errorText: {
    fontSize: typography.size.xs,
    color: colors.state.error,
    marginTop: spacing.xs,
  },
});
