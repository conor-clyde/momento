// ============================================================================
// MOMENT FORM - Shared form component for adding and editing moments
// ============================================================================

import { Button, MomentImage, TextInput } from "@/src/components";
import { MoodSelector } from "@/src/components/forms/MoodSelector";
import { MoodValue } from "@/src/constants/moods";
import { colors, spacing } from "@/src/constants/theme";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";

interface MomentFormProps {
  title: string;
  description: string;
  mood: MoodValue | null;
  imageUri?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onMoodChange: (mood: MoodValue | null) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function MomentForm({
  title,
  description,
  mood,
  imageUri,
  onTitleChange,
  onDescriptionChange,
  onMoodChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = "Save Moment",
}: MomentFormProps) {
  const handleNotesChange = (text: string) => {
    // Prevent more than one consecutive blank line (more than 2 newlines in a row)
    // Replace 3+ consecutive newlines with just 2 newlines (one blank line)
    const filteredText = text.replace(/\n{3,}/g, "\n\n");
    onDescriptionChange(filteredText);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Image and Mood Side by Side - Always show */}
        <View style={styles.imageMoodRow}>
          <View style={styles.imageContainer}>
            <MomentImage imageUri={imageUri} size={180} />
          </View>
          <View style={styles.moodContainer}>
            <MoodSelector value={mood} onChange={onMoodChange} showNoneOption compact />
          </View>
        </View>

        {/* Form Fields - Main Focus */}
        <View style={styles.formFields}>
          <TextInput
            label="Title"
            placeholder="What's this moment about?"
            value={title}
            onChangeText={onTitleChange}
            maxLength={50}
            showCount
            autoFocus
          />

          <TextInput
            label="Notes"
            placeholder="Add any details or thoughts..."
            value={description}
            onChangeText={handleNotesChange}
            multiline
            maxLength={500}
            showCount
          />
        </View>

        {/* Action Buttons - Back and Save */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            {onCancel && (
              <Button
                variant="secondary"
                text=""
                icon="chevron-back"
                onPress={onCancel}
                disabled={isSubmitting}
                style={styles.backButton}
              />
            )}
            <Button
              variant="primary"
              text={submitButtonText}
              icon="save"
              onPress={onSubmit}
              disabled={isSubmitting || !title.trim()}
              style={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageMoodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    flex: 0,
  },
  moodContainer: {
    flex: 1,
    height: 180, // Match image height
    overflow: "hidden",
  },
  formFields: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,

    borderTopColor: colors.border.light,
    marginTop: spacing.md,
    backgroundColor: colors.background.main,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    width: "100%",
  },
  backButton: {
    flex: 0,
    width: 56,
    minWidth: 56,
    maxWidth: 56,
  },
  saveButton: {
    flex: 1,
    minWidth: 0,
  },
});

