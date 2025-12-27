// src/components/forms/MoodSelector.tsx
// ============================================================================
// MOOD SELECTOR - Select mood with emoji buttons
// ============================================================================

import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { MOODS, MoodValue } from "../../constants/moods";
import { colors, spacing, typography } from "../../constants/theme";
import { Text } from "../ui/Text";

interface MoodSelectorProps {
  value: MoodValue | null;
  onChange: (mood: MoodValue | null) => void;
  showNoneOption?: boolean;
  compact?: boolean;
}

export function MoodSelector({
  value,
  onChange,
  showNoneOption = false,
  compact = false,
}: MoodSelectorProps) {
  const handleSelect = (moodValue: MoodValue | null) => {
    // Toggle off if already selected
    onChange(value === moodValue ? null : moodValue);
  };

  // For compact mode, use vertical scrollable layout with labels (for side-by-side with image)
  // For full mode, use vertical grid layout (better for accessibility)
  if (compact) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.compactScrollContent}
        style={styles.compactScrollView}
        nestedScrollEnabled={true}
        bounces={true}
      >
        {showNoneOption && (
          <MoodButton
            emoji="😶"
            label="None"
            isSelected={!value}
            onPress={() => handleSelect(null)}
            compact={true}
          />
        )}
        {MOODS.map((mood) => (
          <MoodButton
            key={mood.value}
            emoji={mood.emoji}
            label={mood.label}
            isSelected={value === mood.value}
            onPress={() => handleSelect(mood.value)}
            compact={true}
          />
        ))}
      </ScrollView>
    );
  }

  // Full mode: Vertical grid layout for better accessibility
  return (
    <View style={styles.gridContainer}>
      {showNoneOption && (
        <MoodButton
          emoji="✨"
          label="None"
          isSelected={!value}
          onPress={() => handleSelect(null)}
          compact={false}
        />
      )}
      {MOODS.map((mood) => (
        <MoodButton
          key={mood.value}
          emoji={mood.emoji}
          label={mood.label}
          isSelected={value === mood.value}
          onPress={() => handleSelect(mood.value)}
          compact={false}
        />
      ))}
    </View>
  );
}

interface MoodButtonProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  compact?: boolean;
}

function MoodButton({ emoji, label, isSelected, onPress, compact = false }: MoodButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.moodButton,
        compact && styles.moodButtonCompact,
        isSelected && styles.moodSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.emoji, compact && styles.emojiCompact]}>{emoji}</Text>
      <Text style={[styles.label, compact && styles.labelCompact, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactScrollView: {
    flex: 1,
    maxHeight: 180,
  },
  compactScrollContent: {
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.border.light,
    gap: spacing.sm,
    minWidth: 100,
    minHeight: 56,
  },
  moodButtonCompact: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background.card,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    gap: spacing.xs,
    minHeight: 36,
  },
  moodSelected: {
    backgroundColor: colors.primary.muted,
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  emoji: {
    fontSize: typography.size.xl,
  },
  emojiCompact: {
    fontSize: typography.size.base,
  },
  label: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  labelCompact: {
    fontSize: typography.size.sm,
  },
  labelSelected: {
    color: colors.primary.dark,
    fontWeight: typography.weight.semibold,
  },
});
