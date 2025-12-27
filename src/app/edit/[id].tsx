// ============================================================================
// EDIT MOMENT SCREEN - Edit an existing moment
// ============================================================================

import { EmptyState, MomentForm, Screen } from "@/src/components";
import { MoodValue } from "@/src/constants/moods";
import { useMoments } from "@/src/contexts/MomentsContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function EditMomentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { moments, updateMoment } = useMoments();
  const moment = moments.find((m) => m.id === id);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load moment data when component mounts
  useEffect(() => {
    if (moment) {
      setTitle(moment.title);
      setNotes(moment.notes || "");
      setMood(moment.mood || null);
    }
  }, [moment]);

  if (!moment) {
    return (
      <Screen>
        <EmptyState icon="alert-circle-outline" title="Moment not found" />
      </Screen>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Required Field", "Please enter a title for this moment.");
      return;
    }

    setIsSaving(true);
    try {
      updateMoment(moment.id, {
        title: title.trim(),
        notes: notes.trim() || undefined,
        mood: mood || undefined,
      });

      router.back();
    } catch (error) {
      console.error("Error updating moment:", error);
      Alert.alert("Error", "Failed to update moment. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Screen>
      <MomentForm
        title={title}
        description={notes}
        mood={mood}
        imageUri={moment.imageUri}
        onTitleChange={setTitle}
        onDescriptionChange={setNotes}
        onMoodChange={setMood}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSaving}
        submitButtonText="Save Changes"
      />
    </Screen>
  );
}

