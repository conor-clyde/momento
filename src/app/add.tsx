// ============================================================================
// ADD MOMENT SCREEN - Create a new moment
// ============================================================================

import { Screen } from "@/src/components";
import { MomentForm } from "@/src/components/forms";
import { MoodValue } from "@/src/constants/moods";
import { useMoments } from "@/src/contexts/MomentsContext";
import { deleteTempFile, hasImage, logger, savePhotoToLocal } from "@/src/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export default function AddMomentScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const { addMoment } = useMoments();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter a name for this moment.");
      return;
    }

    setIsSaving(true);
    try {
      // Save image to permanent storage if provided
      let permanentImageUri: string | undefined;
      if (imageUri && hasImage(imageUri)) {
        try {
          permanentImageUri = await savePhotoToLocal(imageUri);

          // Clean up temporary camera file after successful save
          try {
            await deleteTempFile(imageUri);
          } catch (cleanupError) {
            logger.warn("Failed to cleanup temporary file:", cleanupError);
            // Don't fail the save if cleanup fails
          }
        } catch (error: any) {
          console.error("Error saving image to local storage:", error);
          Alert.alert(
            "Image Save Warning",
            "Failed to save image permanently. The moment will be saved without the image.",
            [{ text: "OK" }]
          );
          // Continue without image (permanentImageUri remains undefined)
        }
      }

      addMoment({
        title: name.trim(),
        notes: description.trim() || undefined,
        imageUri: permanentImageUri,
        mood: mood || undefined,
      });

      router.replace("/");
    } catch (error) {
      console.error("Error saving moment:", error);
      Alert.alert("Error", "Failed to save moment. Please try again.");
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Screen>
      <MomentForm
        title={name}
        description={description}
        mood={mood}
        imageUri={imageUri}
        onTitleChange={setName}
        onDescriptionChange={setDescription}
        onMoodChange={setMood}
        onSubmit={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSaving}
        submitButtonText="Save Moment"
      />
    </Screen>
  );
}
